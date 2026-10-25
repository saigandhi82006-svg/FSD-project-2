import User from '../models/User.js';
import Job from '../models/Job.js';
import Event from '../models/Event.js';
import MentorshipRequest from '../models/MentorshipRequest.js';
import Notification from '../models/Notification.js';
import ContactMessage from '../models/ContactMessage.js';

export const getDashboardStats = async (req, res, next) => {
  try {
    const [
      totalUsers,
      totalStudents,
      totalAlumni,
      verifiedAlumni,
      pendingAlumni,
      pendingJobs,
      totalJobs,
      upcomingEvents,
      totalMentorships,
      recentUsers,
      deptBreakdown,
      yearBreakdown
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: 'STUDENT' }),
      User.countDocuments({ role: 'ALUMNI' }),
      User.countDocuments({ role: 'ALUMNI', verificationStatus: 'VERIFIED' }),
      User.countDocuments({ role: 'ALUMNI', verificationStatus: 'PENDING' }),
      Job.countDocuments({ approvalStatus: 'PENDING' }),
      Job.countDocuments({ approvalStatus: 'APPROVED' }),
      Event.countDocuments({ date: { $gte: new Date() } }),
      MentorshipRequest.countDocuments(),
      User.find().sort({ createdAt: -1 }).limit(6).select('-passwordHash'),
      User.aggregate([
        { $match: { role: 'ALUMNI' } },
        { $group: { _id: '$department', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]),
      User.aggregate([
        { $match: { role: 'ALUMNI' } },
        { $group: { _id: '$graduationYear', count: { $sum: 1 } } },
        { $sort: { _id: 1 } }
      ])
    ]);

    res.status(200).json({
      success: true,
      data: {
        counts: {
          totalUsers,
          totalStudents,
          totalAlumni,
          verifiedAlumni,
          pendingAlumni,
          pendingJobs,
          totalJobs,
          upcomingEvents,
          totalMentorships
        },
        recentUsers,
        charts: {
          departments: deptBreakdown.map(d => ({ name: d._id || 'Other', count: d.count })),
          graduationYears: yearBreakdown.map(y => ({ year: String(y._id), count: y.count }))
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getUsers = async (req, res, next) => {
  try {
    const { role, verificationStatus, search, page = 1, limit = 15 } = req.query;
    const query = {};

    if (role) query.role = role;
    if (verificationStatus) query.verificationStatus = verificationStatus;
    if (search && search.trim()) {
      const regex = new RegExp(search.trim(), 'i');
      query.$or = [{ name: regex }, { email: regex }, { company: regex }, { department: regex }];
    }

    const pageNum = Math.max(1, parseInt(page) || 1);
    const limitNum = Math.max(1, Math.min(100, parseInt(limit) || 15));
    const skip = (pageNum - 1) * limitNum;

    const [total, users] = await Promise.all([
      User.countDocuments(query),
      User.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
    ]);

    res.status(200).json({
      success: true,
      data: users,
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

export const toggleUserStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    if (user.role === 'ADMIN' && req.user.id === user._id.toString()) {
      return res.status(400).json({
        success: false,
        error: 'You cannot deactivate your own admin account.'
      });
    }

    user.isActive = !user.isActive;
    await user.save();

    res.status(200).json({
      success: true,
      message: `User account has been ${user.isActive ? 'activated' : 'deactivated'}.`,
      data: { user }
    });
  } catch (error) {
    next(error);
  }
};

export const verifyAlumni = async (req, res, next) => {
  try {
    const { status } = req.body; // 'VERIFIED' or 'REJECTED'
    if (!['VERIFIED', 'REJECTED', 'PENDING'].includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Status must be VERIFIED, REJECTED, or PENDING.'
      });
    }

    const user = await User.findById(req.params.id);
    if (!user || user.role !== 'ALUMNI') {
      return res.status(404).json({
        success: false,
        error: 'Alumni account not found'
      });
    }

    user.verificationStatus = status;
    await user.save();

    // Send notification
    await Notification.create({
      userId: user._id,
      title: 'Alumni Profile Verification Status',
      message: status === 'VERIFIED'
        ? 'Congratulations! Your alumni profile has been verified by the college administrator.'
        : `Your alumni verification status was updated to: ${status}.`,
      type: 'ACCOUNT_VERIFIED',
      link: '/profile'
    });

    res.status(200).json({
      success: true,
      message: `Alumni verification status updated to ${status}.`,
      data: { user }
    });
  } catch (error) {
    next(error);
  }
};

export const moderateJob = async (req, res, next) => {
  try {
    const { status, feedback } = req.body;
    if (!['APPROVED', 'REJECTED', 'PENDING'].includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Status must be APPROVED, REJECTED, or PENDING.'
      });
    }

    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({
        success: false,
        error: 'Job not found'
      });
    }

    job.approvalStatus = status;
    if (feedback !== undefined) job.moderationFeedback = feedback;
    await job.save();

    // Notify job owner
    await Notification.create({
      userId: job.postedBy,
      title: `Job Opportunity Moderation: ${status}`,
      message: `Your job posting "${job.title}" at ${job.company} was ${status.toLowerCase()} by an administrator.`,
      type: 'JOB_APPROVED',
      link: '/jobs'
    });

    res.status(200).json({
      success: true,
      message: `Job moderation status set to ${status}.`,
      data: { job }
    });
  } catch (error) {
    next(error);
  }
};

export const getContactMessages = async (req, res, next) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: messages.length,
      data: messages
    });
  } catch (error) {
    next(error);
  }
};

export const updateContactStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const message = await ContactMessage.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!message) {
      return res.status(404).json({
        success: false,
        error: 'Contact message not found'
      });
    }

    res.status(200).json({
      success: true,
      data: { message }
    });
  } catch (error) {
    next(error);
  }
};
