import mongoose from "mongoose";

const ResumeSchema = new mongoose.Schema(
  {
    fileName: {
      type: String,
      required: true,
    },

    rawText: {
      type: String,
      required: true,
    },

    extractedSkills: {
      type: [String],
      default: [],
    },

    embedding: {
      type: [Number], // optional for vector search
      default: [],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Resume", ResumeSchema);
