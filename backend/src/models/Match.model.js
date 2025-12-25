import mongoose from 'mongoose';

const matchSchema = new mongoose.Schema({
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true,
    index: true
  },
  resumeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Resume',
    required: true,
    index: true
  },
  matchPercentage: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  matchedSkills: [{
    type: String
  }],
  missingSkills: [{
    type: String
  }],
  rankScore: {
    type: Number,
    required: true
  },
  semanticScore: Number,
  experienceScore: Number
}, {
  timestamps: true
});

matchSchema.index({ jobId: 1, rankScore: -1 });
matchSchema.index({ jobId: 1, resumeId: 1 }, { unique: true });

export default mongoose.model('Match', matchSchema);