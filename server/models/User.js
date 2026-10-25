import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide your full name'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters']
    },
    email: {
      type: String,
      required: [true, 'Please provide an email address'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email address'
      ]
    },
    passwordHash: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false
    },
    role: {
      type: String,
      enum: {
        values: ['STUDENT', 'ALUMNI', 'ADMIN'],
        message: '{VALUE} is not a valid role'
      },
      default: 'STUDENT',
      required: true
    },
    // Academic fields
    college: {
      type: String,
      required: [true, 'Please provide your college or university name'],
      trim: true,
      default: ''
    },
    department: {
      type: String,
      required: [true, 'Please provide your department or branch'],
      trim: true
    },
    degree: {
      type: String,
      required: [true, 'Please provide your degree program'],
      trim: true,
      default: 'B.Tech'
    },
    graduationYear: {
      type: Number,
      required: [true, 'Please provide graduation/passing year'],
      min: [1970, 'Invalid graduation year'],
      max: [2035, 'Invalid graduation year']
    },
    academicYear: {
      type: String,
      trim: true,
      default: '' // e.g. "3rd Year", "Final Year" for students
    },
    // Skills & Interests
    skills: {
      type: [String],
      default: []
    },
    interests: {
      type: [String],
      default: [] // Career interests (e.g., AI/ML, Cloud, Placement, Core Engg)
    },
    // Alumni professional details
    company: {
      type: String,
      trim: true,
      default: ''
    },
    jobTitle: {
      type: String,
      trim: true,
      default: ''
    },
    industry: {
      type: String,
      trim: true,
      default: ''
    },
    experience: {
      type: Number,
      default: 0 // Years of experience
    },
    city: {
      type: String,
      trim: true,
      default: 'Bengaluru'
    },
    profileImage: {
      type: String,
      default: ''
    },
    bio: {
      type: String,
      maxlength: [1000, 'Bio cannot exceed 1000 characters'],
      default: ''
    },
    linkedInUrl: {
      type: String,
      trim: true,
      default: ''
    },
    // Mentorship fields
    mentorshipAvailable: {
      type: Boolean,
      default: true
    },
    mentorshipTopics: {
      type: [String],
      default: [
        'Placement Preparation',
        'Resume Review',
        'DSA & Coding Interviews',
        'Career Guidance'
      ]
    },
    // Verification & Moderation
    verificationStatus: {
      type: String,
      enum: ['PENDING', 'VERIFIED', 'REJECTED'],
      default: 'PENDING'
    },
    isActive: {
      type: Boolean,
      default: true
    },
    profileViews: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        delete ret.passwordHash;
        delete ret.__v;
        return ret;
      }
    }
  }
);

// Indexes for high performance directory search and filtering
userSchema.index({ role: 1, verificationStatus: 1, isActive: 1 });
userSchema.index({ department: 1, graduationYear: 1 });
userSchema.index({ company: 1, industry: 1 });
userSchema.index({ city: 1 });
userSchema.index({ skills: 1 });
userSchema.index({ name: 'text', company: 'text', jobTitle: 'text', skills: 'text' });

// Password hashing pre-save middleware
userSchema.pre('save', async function () {
  if (!this.isModified('passwordHash')) return;
  const salt = await bcrypt.genSalt(10);
  this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
});

// Instance method to compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.passwordHash);
};

const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User;
