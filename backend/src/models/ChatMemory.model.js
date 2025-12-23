import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: ["user", "assistant"],
      required: true,
    },

    content: {
      type: String,
      required: true,
    },
  },
  { _id: false }
);

const ChatMemorySchema = new mongoose.Schema(
  {
    resumeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Resume",
      required: true,
      unique: true,
    },

    messages: {
      type: [MessageSchema],
      default: [],
    },
  },
  { timestamps: true }
);

export default mongoose.model("ChatMemory", ChatMemorySchema);
