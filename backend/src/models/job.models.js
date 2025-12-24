import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
  jobTitle: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  jobDescription: {
    type: String,
    required: true
  },
  extractedSkills: [{
    type: String,
    trim: true
  }],
  company: {
    type: String,
    trim: true
  },
  location: {
    type: String,
    trim: true
  },
  experienceLevel: {
    type: String,
    enum: ['Entry', 'Mid', 'Senior', 'Lead'],
    default: 'Mid'
  },
  scrapedFrom: {
    type: String,
    trim: true
  },
  sourceUrl: String,
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes
jobSchema.index({ jobTitle: 'text', jobDescription: 'text' });
jobSchema.index({ createdAt: -1 });

export default mongoose.model('Job', jobSchema);