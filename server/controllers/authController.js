import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const JWT_SECRET = process.env.JWT_SECRET || 'alumni_network_jwt_secret_dev_key_2026';
const JWT_EXPIRES_IN = '7d';

const createSendToken = (user, statusCode, res, message = 'Success') => {
  const token = jwt.sign(
    { id: user._id, role: user.role, email: user.email },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );

  const cookieOptions = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
  };

  res.cookie('token', token, cookieOptions);

  res.status(statusCode).json({
    success: true,
    message,
    token,
    data: {
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        college: user.college,
        department: user.department,
        degree: user.degree,
        graduationYear: user.graduationYear,
        academicYear: user.academicYear,
        skills: user.skills,
        interests: user.interests,
        company: user.company,
        jobTitle: user.jobTitle,
        industry: user.industry,
        experience: user.experience,
        city: user.city,
        profileImage: user.profileImage,
        bio: user.bio,
        linkedInUrl: user.linkedInUrl,
        mentorshipAvailable: user.mentorshipAvailable,
        mentorshipTopics: user.mentorshipTopics,
        verificationStatus: user.verificationStatus,
        createdAt: user.createdAt
      }
    }
  });
};

export const register = async (req, res, next) => {
  try {
    const {
      name,
      email,
      password,
      confirmPassword,
      role,
      college,
      department,
      degree,
      graduationYear,
      academicYear,
      skills,
      interests,
      company,
      jobTitle,
      industry,
      experience,
      city,
      linkedInUrl,
      mentorshipAvailable,
      mentorshipTopics,
      profileImage
    } = req.body;

    // Strict validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Name, email, and password are required fields.'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        error: 'Password must be at least 6 characters long.'
      });
    }

    if (confirmPassword && password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        error: 'Passwords do not match.'
      });
    }

    // Role protection: Public registration cannot create ADMIN accounts
    const requestedRole = (role || 'STUDENT').toUpperCase();
    if (requestedRole === 'ADMIN') {
      return res.status(403).json({
        success: false,
        error: 'Administrator accounts cannot be created through public registration. Contact college administrator or use deployment seed.'
      });
    }

    if (!['STUDENT', 'ALUMNI'].includes(requestedRole)) {
      return res.status(400).json({
        success: false,
        error: 'Role must be either STUDENT or ALUMNI.'
      });
    }

    // Check existing email
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({
        success: false,
        error: 'An account with this email address already exists. Please log in instead.'
      });
    }

    // Sanitize skills and interests
    const parsedSkills = Array.isArray(skills)
      ? skills
      : typeof skills === 'string'
      ? skills.split(',').map(s => s.trim()).filter(Boolean)
      : [];

    const parsedInterests = Array.isArray(interests)
      ? interests
      : typeof interests === 'string'
      ? interests.split(',').map(s => s.trim()).filter(Boolean)
      : [];

    // Format and sanitize LinkedIn URL
    let formattedLinkedIn = (linkedInUrl || '').trim();
    if (formattedLinkedIn && !/^https?:\/\//i.test(formattedLinkedIn)) {
      formattedLinkedIn = `https://${formattedLinkedIn}`;
    }

    const newUser = await User.create({
      name,
      email: email.toLowerCase(),
      passwordHash: password,
      role: requestedRole,
      college: college ? college.trim() : '',
      department: department || 'Computer Science & Engineering',
      degree: degree || 'B.Tech',
      graduationYear: graduationYear ? Number(graduationYear) : (requestedRole === 'STUDENT' ? 2026 : 2022),
      academicYear: academicYear || (requestedRole === 'STUDENT' ? '3rd Year' : ''),
      skills: parsedSkills,
      interests: parsedInterests,
      company: company ? company.trim() : '',
      jobTitle: jobTitle ? jobTitle.trim() : '',
      industry: industry || '',
      experience: experience ? Number(experience) : 0,
      city: city ? city.trim() : '',
      linkedInUrl: formattedLinkedIn,
      profileImage: profileImage || '',
      mentorshipAvailable: mentorshipAvailable !== undefined ? Boolean(mentorshipAvailable) : true,
      mentorshipTopics: Array.isArray(mentorshipTopics) ? mentorshipTopics : ['Placement Preparation', 'Resume Review', 'Career Guidance'],
      verificationStatus: 'VERIFIED'
    });

    createSendToken(newUser, 201, res, 'Account created successfully!');
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Please provide both email and password.'
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+passwordHash');
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password.'
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password.'
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        error: 'Your account has been deactivated. Please contact the administrator.'
      });
    }

    createSendToken(user, 200, res, 'Logged in successfully!');
  } catch (error) {
    next(error);
  }
};

export const logout = (req, res) => {
  res.cookie('token', 'loggedout', {
    expires: new Date(Date.now() + 5 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
  });
  res.status(200).json({
    success: true,
    message: 'Logged out successfully.'
  });
};

export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({
      success: true,
      data: { user }
    });
  } catch (error) {
    next(error);
  }
};

export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        error: 'Please provide both current and new password.'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        error: 'New password must be at least 6 characters long.'
      });
    }

    const user = await User.findById(req.user.id).select('+passwordHash');
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: 'Current password does not match.'
      });
    }

    user.passwordHash = newPassword;
    await user.save();

    createSendToken(user, 200, res, 'Password changed successfully!');
  } catch (error) {
    next(error);
  }
};
