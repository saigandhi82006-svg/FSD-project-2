import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    message: {
      type: String,
      required: true,
      trim: true
    },
    type: {
      type: String,
      enum: [
        'MENTORSHIP_RECEIVED',
        'MENTORSHIP_ACCEPTED',
        'MENTORSHIP_REJECTED',
        'JOB_POSTED',
        'JOB_APPROVED',
        'EVENT_REGISTERED',
        'EVENT_UPDATE',
        'ACCOUNT_VERIFIED',
        'ANNOUNCEMENT',
        'SYSTEM'
      ],
      default: 'SYSTEM'
    },
    link: {
      type: String,
      default: ''
    },
    isRead: {
      type: Boolean,
      default: false,
      index: true
    }
  },
  {
    timestamps: true
  }
);

notificationSchema.index({ userId: 1, createdAt: -1 });

const Notification = mongoose.models.Notification || mongoose.model('Notification', notificationSchema);
export default Notification;
