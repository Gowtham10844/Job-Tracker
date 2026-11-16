// models/Application.js
import mongoose from 'mongoose';

const ApplicationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required for application ownership'],
      index: true,
    },
    companyName: {
      type: String,
      required: [true, 'Please provide company name'],
      trim: true,
      maxlength: [120, 'Company name cannot exceed 120 characters'],
    },
    jobRole: {
      type: String,
      required: [true, 'Please provide job role'],
      trim: true,
      maxlength: [120, 'Job role cannot exceed 120 characters'],
    },
    jobType: {
      type: String,
      enum: ['Internship', 'Full-time', 'Part-time', 'Contract'],
      default: 'Internship',
    },
    location: {
      type: String,
      trim: true,
      default: 'Bangalore, India',
    },
    workMode: {
      type: String,
      enum: ['Remote', 'Hybrid', 'On-site'],
      default: 'On-site',
    },
    applicationDate: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: [
        'Applied',
        'Online Assessment',
        'Interview',
        'Offer Received',
        'Rejected',
        'Withdrawn',
      ],
      default: 'Applied',
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    jobLink: {
      type: String,
      trim: true,
      default: '',
    },
    notes: {
      type: String,
      trim: true,
      default: '',
    },
    interviewDate: {
      type: Date,
      default: null,
    },
    salary: {
      type: String,
      trim: true,
      default: '',
    },
  },
  { timestamps: true }
);

// Compound index for efficient user-based sorting and filtering
ApplicationSchema.index({ userId: 1, status: 1 });
ApplicationSchema.index({ userId: 1, applicationDate: -1 });
ApplicationSchema.index({ userId: 1, interviewDate: 1 });

export default mongoose.models.Application || mongoose.model('Application', ApplicationSchema);
