import MentorshipRequest from '../models/MentorshipRequest.js';
import User from '../models/User.js';
import Notification from '../models/Notification.js';

export const createRequest = async (req, res, next) => {
  try {
    const { alumniId, topic, message, preferredMode, preferredTime } = req.body;
    const studentId = req.user.id;

    if (!alumniId || !topic || !message) {
      return res.status(400).json({
        success: false,
        error: 'Alumni ID, mentorship topic, and message are required.'
      });
    }

    if (studentId === alumniId) {
      return res.status(400).json({
        success: false,
        error: 'You cannot request mentorship from yourself.'
      });
    }

    // Verify alumni exists and is open for mentorship
    const alumnus = await User.findById(alumniId);
    if (!alumnus || alumnus.role !== 'ALUMNI') {
      return res.status(404).json({
        success: false,
        error: 'Selected alumni profile does not exist.'
      });
    }

    if (!alumnus.mentorshipAvailable) {
      return res.status(400).json({
        success: false,
        error: 'This alumnus is currently not accepting new mentorship requests.'
      });
    }

    // Check for existing pending request to this alumnus
    const existing = await MentorshipRequest.findOne({
      studentId,
      alumniId,
      status: 'PENDING'
    });

    if (existing) {
      return res.status(409).json({
        success: false,
        error: 'You already have an active pending mentorship request with this alumnus. Please wait for their response.'
      });
    }

    const request = await MentorshipRequest.create({
      studentId,
      alumniId,
      topic,
      message,
      preferredMode: preferredMode || 'Online',
      preferredTime: preferredTime || 'Weekends / Evenings',
      status: 'PENDING'
    });

    // Create in-app notification for the alumnus
    await Notification.create({
      userId: alumnus._id,
      title: 'New Mentorship Request',
      message: `${req.user.name} sent you a mentorship request for "${topic}".`,
      type: 'MENTORSHIP_RECEIVED',
      link: '/mentorship'
    });

    res.status(201).json({
      success: true,
      message: 'Mentorship request sent successfully!',
      data: { request }
    });
  } catch (error) {
    next(error);
  }
};

export const getSentRequests = async (req, res, next) => {
  try {
    const requests = await MentorshipRequest.find({ studentId: req.user.id })
      .populate('alumniId', 'name email company jobTitle department graduationYear profileImage linkedInUrl city')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: requests.length,
      data: requests
    });
  } catch (error) {
    next(error);
  }
};

export const getReceivedRequests = async (req, res, next) => {
  try {
    const requests = await MentorshipRequest.find({ alumniId: req.user.id })
      .populate('studentId', 'name email college department degree graduationYear academicYear skills interests profileImage')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: requests.length,
      data: requests
    });
  } catch (error) {
    next(error);
  }
};

export const updateRequestStatus = async (req, res, next) => {
  try {
    const { status, responseNote } = req.body;
    const { id } = req.params;

    if (!['ACCEPTED', 'REJECTED', 'COMPLETED'].includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Status must be ACCEPTED, REJECTED, or COMPLETED.'
      });
    }

    const request = await MentorshipRequest.findById(id);
    if (!request) {
      return res.status(404).json({
        success: false,
        error: 'Mentorship request not found'
      });
    }

    // Verify ownership: only the targeted alumnus can respond
    if (request.alumniId.toString() !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        error: 'You are not authorized to respond to this request.'
      });
    }

    request.status = status;
    if (responseNote !== undefined) request.responseNote = responseNote;
    await request.save();

    // Notify the student
    const notifType = status === 'ACCEPTED' ? 'MENTORSHIP_ACCEPTED' : 'MENTORSHIP_REJECTED';
    await Notification.create({
      userId: request.studentId,
      title: `Mentorship Request ${status === 'ACCEPTED' ? 'Accepted' : 'Updated'}`,
      message: `${req.user.name} has ${status.toLowerCase()} your request for "${request.topic}".`,
      type: notifType,
      link: '/mentorship'
    });

    res.status(200).json({
      success: true,
      message: `Request status updated to ${status}.`,
      data: { request }
    });
  } catch (error) {
    next(error);
  }
};

export const cancelRequest = async (req, res, next) => {
  try {
    const { id } = req.params;
    const request = await MentorshipRequest.findById(id);

    if (!request) {
      return res.status(404).json({
        success: false,
        error: 'Request not found'
      });
    }

    // Only student who sent it or Admin can cancel
    if (request.studentId.toString() !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        error: 'You are not authorized to cancel this request.'
      });
    }

    if (request.status !== 'PENDING') {
      return res.status(400).json({
        success: false,
        error: `Cannot cancel request with status ${request.status}. Only PENDING requests can be cancelled.`
      });
    }

    request.status = 'CANCELLED';
    await request.save();

    res.status(200).json({
      success: true,
      message: 'Mentorship request cancelled successfully.',
      data: { request }
    });
  } catch (error) {
    next(error);
  }
};
