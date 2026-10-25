import Event from '../models/Event.js';
import EventRegistration from '../models/EventRegistration.js';
import Notification from '../models/Notification.js';

export const getEvents = async (req, res, next) => {
  try {
    const { timeFilter = 'upcoming', eventMode, page = 1, limit = 10 } = req.query;
    const now = new Date();

    const query = { approvalStatus: 'APPROVED' };

    if (timeFilter === 'upcoming') {
      query.date = { $gte: new Date(now.setHours(0, 0, 0, 0)) };
    } else if (timeFilter === 'past') {
      query.date = { $lt: new Date(now.setHours(0, 0, 0, 0)) };
    }

    if (eventMode) query.eventMode = eventMode;

    const pageNum = Math.max(1, parseInt(page) || 1);
    const limitNum = Math.max(1, Math.min(50, parseInt(limit) || 10));
    const skip = (pageNum - 1) * limitNum;

    const [total, events] = await Promise.all([
      Event.countDocuments(query),
      Event.find(query)
        .sort({ date: timeFilter === 'past' ? -1 : 1 })
        .skip(skip)
        .limit(limitNum)
    ]);

    // Check user registrations and attendee counts
    const eventIds = events.map(e => e._id);
    const [attendeeCounts, userRegistrations] = await Promise.all([
      EventRegistration.aggregate([
        { $match: { eventId: { $in: eventIds }, status: 'REGISTERED' } },
        { $group: { _id: '$eventId', count: { $sum: 1 } } }
      ]),
      req.user
        ? EventRegistration.find({
            eventId: { $in: eventIds },
            userId: req.user.id,
            status: 'REGISTERED'
          })
        : []
    ]);

    const countMap = {};
    attendeeCounts.forEach(c => {
      countMap[c._id.toString()] = c.count;
    });

    const userRegSet = new Set(userRegistrations.map(r => r.eventId.toString()));

    const transformedEvents = events.map(event => {
      const isRegistered = userRegSet.has(event._id.toString());
      const eventObj = event.toObject();

      // Mask meeting URL if online and user is not registered or admin
      if (
        eventObj.eventMode === 'Online' &&
        !isRegistered &&
        (!req.user || req.user.role !== 'ADMIN')
      ) {
        eventObj.meetingUrl = ''; // Hidden until registration
      }

      return {
        ...eventObj,
        attendeeCount: countMap[event._id.toString()] || 0,
        isRegistered
      };
    });

    res.status(200).json({
      success: true,
      data: transformedEvents,
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

export const getEventById = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id).populate('createdBy', 'name email');
    if (!event) {
      return res.status(404).json({
        success: false,
        error: 'Event not found'
      });
    }

    const attendeeCount = await EventRegistration.countDocuments({
      eventId: event._id,
      status: 'REGISTERED'
    });

    let isRegistered = false;
    if (req.user) {
      const reg = await EventRegistration.findOne({
        eventId: event._id,
        userId: req.user.id,
        status: 'REGISTERED'
      });
      isRegistered = !!reg;
    }

    const eventObj = event.toObject();
    // Mask meeting URL if not registered and not admin
    if (
      eventObj.eventMode === 'Online' &&
      !isRegistered &&
      (!req.user || req.user.role !== 'ADMIN')
    ) {
      eventObj.meetingUrl = '';
    }

    res.status(200).json({
      success: true,
      data: {
        ...eventObj,
        attendeeCount,
        isRegistered
      }
    });
  } catch (error) {
    next(error);
  }
};

export const createEvent = async (req, res, next) => {
  try {
    const {
      title,
      description,
      date,
      startTime,
      endTime,
      location,
      eventMode,
      meetingUrl,
      organizer,
      registrationDeadline,
      capacity,
      bannerImage
    } = req.body;

    if (!title || !description || !date || !startTime || !endTime || !registrationDeadline) {
      return res.status(400).json({
        success: false,
        error: 'Title, description, date, start time, end time, and registration deadline are required.'
      });
    }

    const event = await Event.create({
      title,
      description,
      date: new Date(date),
      startTime,
      endTime,
      location: location || 'College Auditorium',
      eventMode: eventMode || 'Online',
      meetingUrl: meetingUrl || '',
      organizer: organizer || 'College Alumni Network',
      registrationDeadline: new Date(registrationDeadline),
      capacity: capacity ? Number(capacity) : 0,
      bannerImage: bannerImage || '',
      createdBy: req.user.id,
      approvalStatus: 'APPROVED'
    });

    res.status(201).json({
      success: true,
      message: 'Event created successfully!',
      data: { event }
    });
  } catch (error) {
    next(error);
  }
};

export const updateEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({
        success: false,
        error: 'Event not found'
      });
    }

    if (event.createdBy?.toString() !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        error: 'You are not authorized to update this event.'
      });
    }

    Object.assign(event, req.body);
    await event.save();

    res.status(200).json({
      success: true,
      message: 'Event updated successfully.',
      data: { event }
    });
  } catch (error) {
    next(error);
  }
};

export const deleteEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({
        success: false,
        error: 'Event not found'
      });
    }

    if (event.createdBy?.toString() !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        error: 'You are not authorized to delete this event.'
      });
    }

    await Event.findByIdAndDelete(event._id);
    await EventRegistration.deleteMany({ eventId: event._id });

    res.status(200).json({
      success: true,
      message: 'Event and associated registrations deleted successfully.'
    });
  } catch (error) {
    next(error);
  }
};

export const registerEvent = async (req, res, next) => {
  try {
    const eventId = req.params.id;
    const userId = req.user.id;

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({
        success: false,
        error: 'Event not found'
      });
    }

    // Check registration deadline
    if (new Date() > new Date(event.registrationDeadline)) {
      return res.status(400).json({
        success: false,
        error: 'Registration deadline for this event has passed.'
      });
    }

    // Check capacity if set
    if (event.capacity > 0) {
      const activeRegistrations = await EventRegistration.countDocuments({
        eventId,
        status: 'REGISTERED'
      });
      if (activeRegistrations >= event.capacity) {
        return res.status(400).json({
          success: false,
          error: 'This event has reached its maximum registration capacity.'
        });
      }
    }

    // Check duplicate or update cancelled
    let registration = await EventRegistration.findOne({ eventId, userId });
    if (registration) {
      if (registration.status === 'REGISTERED') {
        return res.status(409).json({
          success: false,
          error: 'You are already registered for this event.'
        });
      }
      registration.status = 'REGISTERED';
      registration.registeredAt = new Date();
      await registration.save();
    } else {
      registration = await EventRegistration.create({
        eventId,
        userId,
        status: 'REGISTERED'
      });
    }

    // Send confirmation notification
    await Notification.create({
      userId,
      title: 'Event Registration Confirmed',
      message: `You have successfully registered for "${event.title}". We look forward to your participation!`,
      type: 'EVENT_REGISTERED',
      link: '/events'
    });

    res.status(201).json({
      success: true,
      message: 'Successfully registered for event!',
      data: {
        registration,
        meetingUrl: event.meetingUrl
      }
    });
  } catch (error) {
    next(error);
  }
};

export const cancelEventRegistration = async (req, res, next) => {
  try {
    const eventId = req.params.id;
    const userId = req.user.id;

    const registration = await EventRegistration.findOne({
      eventId,
      userId,
      status: 'REGISTERED'
    });

    if (!registration) {
      return res.status(404).json({
        success: false,
        error: 'Active registration for this event not found.'
      });
    }

    registration.status = 'CANCELLED';
    await registration.save();

    res.status(200).json({
      success: true,
      message: 'Event registration cancelled successfully.'
    });
  } catch (error) {
    next(error);
  }
};

export const getMyRegistrations = async (req, res, next) => {
  try {
    const registrations = await EventRegistration.find({
      userId: req.user.id,
      status: 'REGISTERED'
    })
      .populate('eventId')
      .sort({ registeredAt: -1 });

    const events = registrations.map(r => r.eventId).filter(Boolean);

    res.status(200).json({
      success: true,
      count: events.length,
      data: events
    });
  } catch (error) {
    next(error);
  }
};
