import mongoose from 'mongoose';

const mentorshipRequestSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Student reference is required']
    },
    alumniId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Alumni reference is required']
    },
    topic: {
      type: String,
      required: [true, 'Please select a mentorship topic'],
      enum: {
        values: [
          'Placement Preparation',
          'Resume Review',
          'DSA & Coding Interviews',
          'GATE Preparation',
          'Higher Studies',
          'Internship Search',
          'Career Guidance',
          'Startup Guidance',
          'Other'
        ],
        message: '{VALUE} is not a valid mentorship topic'
      }
    },
    message: {
      type: String,
      required: [true, 'Please provide a message explaining your mentorship request'],
      trim: true,
      maxlength: [2000, 'Message cannot exceed 2000 characters']
    },
    preferredMode: {
      type: String,
      enum: ['Online', 'In person'],
      default: 'Online'
    },
    preferredTime: {
      type: String,
      trim: true,
      default: 'Weekends / Evening IST'
    },
    status: {
      type: String,
      enum: ['PENDING', 'ACCEPTED', 'REJECTED', 'CANCELLED', 'COMPLETED'],
      default: 'PENDING'
    },
    responseNote: {
      type: String,
      trim: true,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

mentorshipRequestSchema.index({ studentId: 1, alumniId: 1, status: 1 });
mentorshipRequestSchema.index({ alumniId: 1, status: 1 });
mentorshipRequestSchema.index({ studentId: 1, createdAt: -1 });

const MentorshipRequest = mongoose.models.MentorshipRequest || mongoose.model('MentorshipRequest', mentorshipRequestSchema);
export default MentorshipRequest;
