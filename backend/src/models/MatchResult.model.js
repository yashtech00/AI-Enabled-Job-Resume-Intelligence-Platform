import mongoose from "mongoose";

const MatchResultSchema = new mongoose.Schema(
  {
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },

    resumeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Resume",
      required: true,
    },

    matchPercentage: {
      type: Number,
      required: true,
    },

    matchedSkills: {
      type: [String],
      default: [],
    },

    missingSkills: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

MatchResultSchema.index({ jobId: 1, resumeId: 1 }, { unique: true });

export default mongoose.model("MatchResult", MatchResultSchema);
