import mongoose from 'mongoose';

const resumeSchema = new mongoose.Schema({
  candidateName: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  email: {
    type: String,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    trim: true
  },
  filePath: {
    type: String,
    required: true
  },
  originalFileName: {
    type: String,
    required: true
  },
  extractedText: {
    type: String,
    required: true
  },
  extractedSkills: [{
    type: String,
    trim: true
  }],
  experience: {
    totalYears: Number,
    details: String
  },
  education: [{
    degree: String,
    institution: String,
    year: String
  }],
  embedding: {
    type: [Number],
    required: true
  },
  summary: String
}, {
  timestamps: true
});


resumeSchema.index({ candidateName: 'text', extractedText: 'text' });

export default mongoose.model('Resume', resumeSchema);