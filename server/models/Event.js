import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide an event title'],
      trim: true,
      maxlength: [150, 'Title cannot exceed 150 characters']
    },
    description: {
      type: String,
      required: [true, 'Please provide an event description'],
      trim: true
    },
    date: {
      type: Date,
      required: [true, 'Please specify the event date']
    },
    startTime: {
      type: String,
      required: [true, 'Please provide start time (e.g. 10:00 AM)'],
      trim: true
    },
    endTime: {
      type: String,
      required: [true, 'Please provide end time (e.g. 12:30 PM)'],
      trim: true
    },
    location: {
      type: String,
      required: [true, 'Please provide venue or location'],
      trim: true,
      default: 'College Main Auditorium'
    },
    eventMode: {
      type: String,
      enum: ['Online', 'In person', 'Hybrid'],
      default: 'Online'
    },
    meetingUrl: {
      type: String,
      trim: true,
      default: ''
    },
    organizer: {
      type: String,
      trim: true,
      default: 'College Alumni Association'
    },
    registrationDeadline: {
      type: Date,
      required: [true, 'Please specify registration deadline']
    },
    capacity: {
      type: Number,
      default: 0 // 0 means unlimited
    },
    approvalStatus: {
      type: String,
      enum: ['PENDING', 'APPROVED', 'REJECTED'],
      default: 'APPROVED'
    },
    bannerImage: {
      type: String,
      default: ''
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  {
    timestamps: true
  }
);

eventSchema.index({ date: 1, approvalStatus: 1 });
eventSchema.index({ eventMode: 1 });

const Event = mongoose.models.Event || mongoose.model('Event', eventSchema);
export default Event;
