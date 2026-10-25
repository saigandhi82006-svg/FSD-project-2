import User from '../models/User.js';
import Job from '../models/Job.js';

export const getAlumniDirectory = async (req, res, next) => {
  try {
    const {
      search,
      college,
      department,
      degree,
      graduationYear,
      company,
      industry,
      city,
      mentorshipAvailable,
      skill,
      sort = 'newest',
      page = 1,
      limit = 12
    } = req.query;

    const query = {
      role: 'ALUMNI',
      isActive: true
    };

    // Free text search
    if (search && search.trim()) {
      const regex = new RegExp(search.trim(), 'i');
      query.$or = [
        { name: regex },
        { company: regex },
        { jobTitle: regex },
        { department: regex },
        { skills: { $in: [regex] } }
      ];
    }

    // Filters
    if (college) query.college = new RegExp(college, 'i');
    if (department) query.department = new RegExp(department, 'i');
    if (degree) query.degree = degree;
    if (graduationYear) query.graduationYear = Number(graduationYear);
    if (company) query.company = new RegExp(company, 'i');
    if (industry) query.industry = new RegExp(industry, 'i');
    if (city) query.city = new RegExp(city, 'i');
    if (mentorshipAvailable !== undefined && mentorshipAvailable !== '') {
      query.mentorshipAvailable = mentorshipAvailable === 'true' || mentorshipAvailable === true;
    }
    if (skill) {
      query.skills = { $in: [new RegExp(skill, 'i')] };
    }

    // Sorting
    let sortOptions = { createdAt: -1 };
    if (sort === 'name_asc') sortOptions = { name: 1 };
    else if (sort === 'name_desc') sortOptions = { name: -1 };
    else if (sort === 'year_desc') sortOptions = { graduationYear: -1 };
    else if (sort === 'year_asc') sortOptions = { graduationYear: 1 };
    else if (sort === 'experience_desc') sortOptions = { experience: -1 };

    const pageNum = Math.max(1, parseInt(page) || 1);
    const limitNum = Math.max(1, Math.min(50, parseInt(limit) || 12));
    const skip = (pageNum - 1) * limitNum;

    const [total, alumni] = await Promise.all([
      User.countDocuments(query),
      User.find(query)
        .sort(sortOptions)
        .skip(skip)
        .limit(limitNum)
    ]);

    // Metadata stats for filter options
    const [departments, companies, cities, industries] = await Promise.all([
      User.distinct('department', { role: 'ALUMNI', isActive: true }),
      User.distinct('company', { role: 'ALUMNI', isActive: true, company: { $ne: '' } }),
      User.distinct('city', { role: 'ALUMNI', isActive: true, city: { $ne: '' } }),
      User.distinct('industry', { role: 'ALUMNI', isActive: true, industry: { $ne: '' } })
    ]);

    res.status(200).json({
      success: true,
      data: alumni,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum)
      },
      filters: {
        departments: departments.filter(Boolean).sort(),
        companies: companies.filter(Boolean).sort(),
        cities: cities.filter(Boolean).sort(),
        industries: industries.filter(Boolean).sort()
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getAlumniById = async (req, res, next) => {
  try {
    const alumnus = await User.findOne({
      _id: req.params.id,
      role: 'ALUMNI',
      isActive: true
    });

    if (!alumnus) {
      return res.status(404).json({
        success: false,
        error: 'Alumni member not found'
      });
    }

    // Increment profile views
    if (req.user && req.user.id !== alumnus._id.toString()) {
      await User.findByIdAndUpdate(alumnus._id, { $inc: { profileViews: 1 } });
      alumnus.profileViews += 1;
    }

    // Also get active jobs posted by this alumnus
    const jobs = await Job.find({
      postedBy: alumnus._id,
      approvalStatus: 'APPROVED'
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: {
        alumnus,
        jobs
      }
    });
  } catch (error) {
    next(error);
  }
};
