import User from '../models/User.js';

export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Increment profile views if viewed by another authenticated user
    if (user.role === 'ALUMNI' && req.user && req.user.id !== user._id.toString()) {
      await User.findByIdAndUpdate(user._id, { $inc: { profileViews: 1 } });
      user.profileViews += 1;
    }

    res.status(200).json({
      success: true,
      data: { user }
    });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    // Whitelist only allowed fields to prevent privilege escalation
    const allowedFields = [
      'name',
      'college',
      'department',
      'degree',
      'graduationYear',
      'academicYear',
      'skills',
      'interests',
      'company',
      'jobTitle',
      'industry',
      'experience',
      'city',
      'bio',
      'linkedInUrl',
      'mentorshipAvailable',
      'mentorshipTopics',
      'profileImage'
    ];

    const updates = {};
    for (const key of allowedFields) {
      if (req.body[key] !== undefined) {
        if (key === 'skills' || key === 'interests' || key === 'mentorshipTopics') {
          updates[key] = Array.isArray(req.body[key])
            ? req.body[key]
            : typeof req.body[key] === 'string'
            ? req.body[key].split(',').map(s => s.trim()).filter(Boolean)
            : [];
        } else if (key === 'experience' || key === 'graduationYear') {
          updates[key] = Number(req.body[key]);
        } else if (key === 'linkedInUrl') {
          let url = (req.body[key] || '').trim();
          if (url && !/^https?:\/\//i.test(url)) {
            url = `https://${url}`;
          }
          updates[key] = url;
        } else {
          updates[key] = req.body[key];
        }
      }
    }

    // Allow user to switch between STUDENT and ALUMNI if requested
    if (req.body.role && ['STUDENT', 'ALUMNI'].includes(req.body.role)) {
      updates.role = req.body.role;
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully!',
      data: { user: updatedUser }
    });
  } catch (error) {
    next(error);
  }
};

export const uploadAvatar = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'Please select an image file to upload.'
      });
    }

    const relativeUrl = `/uploads/${req.file.filename}`;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { profileImage: relativeUrl },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: 'Profile picture updated successfully!',
      data: {
        profileImage: relativeUrl,
        user
      }
    });
  } catch (error) {
    next(error);
  }
};
