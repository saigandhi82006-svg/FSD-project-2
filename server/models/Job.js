import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide the opportunity title'],
      trim: true,
      maxlength: [150, 'Title cannot exceed 150 characters']
    },
    company: {
      type: String,
      required: [true, 'Please provide the company/organization name'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Please provide a detailed description and requirements'],
      trim: true
    },
    opportunityType: {
      type: String,
      enum: ['Full-time', 'Internship', 'Part-time', 'Contract'],
      default: 'Full-time'
    },
    workMode: {
      type: String,
      enum: ['On-site', 'Hybrid', 'Remote'],
      default: 'On-site'
    },
    location: {
      type: String,
      required: [true, 'Please specify the job location (e.g., Bengaluru, Remote)'],
      trim: true
    },
    skillsRequired: {
      type: [String],
      default: []
    },
    experienceLevel: {
      type: String,
      default: 'Entry Level',
      trim: true
    },
    salaryRange: {
      type: String,
      trim: true,
      default: '' // e.g. "₹8 - 12 LPA" or "₹35,000 / month"
    },
    applicationUrl: {
      type: String,
      required: [true, 'Please provide an application URL or email'],
      trim: true
    },
    applicationDeadline: {
      type: Date,
      required: [true, 'Please specify the application deadline']
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    approvalStatus: {
      type: String,
      enum: ['PENDING', 'APPROVED', 'REJECTED'],
      default: 'PENDING'
    },
    moderationFeedback: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

jobSchema.index({ approvalStatus: 1, createdAt: -1 });
jobSchema.index({ opportunityType: 1, workMode: 1, location: 1 });
jobSchema.index({ postedBy: 1 });
jobSchema.index({ title: 'text', company: 'text', skillsRequired: 'text' });

const Job = mongoose.models.Job || mongoose.model('Job', jobSchema);
export default Job;
