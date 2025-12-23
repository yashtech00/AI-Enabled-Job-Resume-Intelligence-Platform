import mongoose from "mongoose";

const JobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    extractedSkills: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Job", JobSchema);
