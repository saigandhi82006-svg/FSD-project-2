import Job from '../models/Job.js';
import Bookmark from '../models/Bookmark.js';
import Notification from '../models/Notification.js';

export const getJobs = async (req, res, next) => {
  try {
    const {
      search,
      opportunityType,
      workMode,
      location,
      page = 1,
      limit = 10,
      approvalStatus
    } = req.query;

    const query = {};

    // Standard users only see APPROVED jobs
    if (!req.user || req.user.role !== 'ADMIN') {
      query.approvalStatus = 'APPROVED';
    } else if (approvalStatus) {
      query.approvalStatus = approvalStatus;
    }

    if (search && search.trim()) {
      const regex = new RegExp(search.trim(), 'i');
      query.$or = [
        { title: regex },
        { company: regex },
        { location: regex },
        { skillsRequired: { $in: [regex] } }
      ];
    }

    if (opportunityType) query.opportunityType = opportunityType;
    if (workMode) query.workMode = workMode;
    if (location) query.location = new RegExp(location, 'i');

    const pageNum = Math.max(1, parseInt(page) || 1);
    const limitNum = Math.max(1, Math.min(50, parseInt(limit) || 10));
    const skip = (pageNum - 1) * limitNum;

    const [total, jobs] = await Promise.all([
      Job.countDocuments(query),
      Job.find(query)
        .populate('postedBy', 'name company jobTitle profileImage')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
    ]);

    // Check user bookmarks if logged in
    let bookmarkedJobIds = new Set();
    if (req.user) {
      const bookmarks = await Bookmark.find({ userId: req.user.id });
      bookmarkedJobIds = new Set(bookmarks.map(b => b.jobId.toString()));
    }

    const transformedJobs = jobs.map(j => ({
      ...j.toObject(),
      isBookmarked: bookmarkedJobIds.has(j._id.toString())
    }));

    res.status(200).json({
      success: true,
      data: transformedJobs,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getJobById = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id).populate(
      'postedBy',
      'name company jobTitle department graduationYear profileImage linkedInUrl email'
    );

    if (!job) {
      return res.status(404).json({
        success: false,
        error: 'Job opportunity not found'
      });
    }

    // Check if bookmarked
    let isBookmarked = false;
    if (req.user) {
      const bookmark = await Bookmark.findOne({
        userId: req.user.id,
        jobId: job._id
      });
      isBookmarked = !!bookmark;
    }

    res.status(200).json({
      success: true,
      data: {
        ...job.toObject(),
        isBookmarked
      }
    });
  } catch (error) {
    next(error);
  }
};

export const createJob = async (req, res, next) => {
  try {
    const {
      title,
      company,
      description,
      opportunityType,
      workMode,
      location,
      skillsRequired,
      experienceLevel,
      salaryRange,
      applicationUrl,
      applicationDeadline
    } = req.body;

    if (!title || !company || !description || !applicationUrl || !applicationDeadline) {
      return res.status(400).json({
        success: false,
        error: 'Title, company, description, application URL, and deadline are required.'
      });
    }

    const skills = Array.isArray(skillsRequired)
      ? skillsRequired
      : typeof skillsRequired === 'string'
      ? skillsRequired.split(',').map(s => s.trim()).filter(Boolean)
      : [];

    // Admins post directly as APPROVED, alumni post as PENDING for moderation
    const initialStatus = req.user.role === 'ADMIN' ? 'APPROVED' : 'PENDING';

    const newJob = await Job.create({
      title,
      company,
      description,
      opportunityType: opportunityType || 'Full-time',
      workMode: workMode || 'On-site',
      location: location || 'Bengaluru',
      skillsRequired: skills,
      experienceLevel: experienceLevel || 'Entry Level',
      salaryRange: salaryRange || '',
      applicationUrl,
      applicationDeadline: new Date(applicationDeadline),
      postedBy: req.user.id,
      approvalStatus: initialStatus
    });

    res.status(201).json({
      success: true,
      message: initialStatus === 'APPROVED'
        ? 'Job opportunity posted successfully!'
        : 'Job submitted for admin approval. Once approved, it will be visible in the directory.',
      data: { job: newJob }
    });
  } catch (error) {
    next(error);
  }
};

export const updateJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({
        success: false,
        error: 'Job not found'
      });
    }

    // Must be owner or admin
    if (job.postedBy.toString() !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        error: 'You do not have permission to edit this job.'
      });
    }

    const updatable = [
      'title',
      'company',
      'description',
      'opportunityType',
      'workMode',
      'location',
      'skillsRequired',
      'experienceLevel',
      'salaryRange',
      'applicationUrl',
      'applicationDeadline'
    ];

    updatable.forEach(field => {
      if (req.body[field] !== undefined) {
        if (field === 'skillsRequired') {
          job.skillsRequired = Array.isArray(req.body.skillsRequired)
            ? req.body.skillsRequired
            : req.body.skillsRequired.split(',').map(s => s.trim()).filter(Boolean);
        } else {
          job[field] = req.body[field];
        }
      }
    });

    await job.save();

    res.status(200).json({
      success: true,
      message: 'Job updated successfully.',
      data: { job }
    });
  } catch (error) {
    next(error);
  }
};

export const deleteJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({
        success: false,
        error: 'Job not found'
      });
    }

    if (job.postedBy.toString() !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        error: 'You do not have permission to delete this job.'
      });
    }

    await Job.findByIdAndDelete(job._id);
    await Bookmark.deleteMany({ jobId: job._id });

    res.status(200).json({
      success: true,
      message: 'Job deleted successfully.'
    });
  } catch (error) {
    next(error);
  }
};

export const getMyJobs = async (req, res, next) => {
  try {
    const jobs = await Job.find({ postedBy: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: jobs.length,
      data: jobs
    });
  } catch (error) {
    next(error);
  }
};

export const toggleBookmark = async (req, res, next) => {
  try {
    const jobId = req.params.id;
    const userId = req.user.id;

    const existing = await Bookmark.findOne({ userId, jobId });
    if (existing) {
      await Bookmark.findByIdAndDelete(existing._id);
      return res.status(200).json({
        success: true,
        bookmarked: false,
        message: 'Opportunity removed from bookmarks.'
      });
    } else {
      await Bookmark.create({ userId, jobId });
      return res.status(201).json({
        success: true,
        bookmarked: true,
        message: 'Opportunity saved to bookmarks!'
      });
    }
  } catch (error) {
    next(error);
  }
};

export const getSavedJobs = async (req, res, next) => {
  try {
    const bookmarks = await Bookmark.find({ userId: req.user.id })
      .populate({
        path: 'jobId',
        populate: { path: 'postedBy', select: 'name company jobTitle profileImage' }
      })
      .sort({ createdAt: -1 });

    const jobs = bookmarks.map(b => b.jobId).filter(Boolean);

    res.status(200).json({
      success: true,
      count: jobs.length,
      data: jobs
    });
  } catch (error) {
    next(error);
  }
};
