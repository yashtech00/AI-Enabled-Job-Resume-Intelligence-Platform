import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ['user', 'assistant'],
    required: true
  },
  content: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const conversationSchema = new mongoose.Schema({
  resumeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Resume',
    required: true,
    index: true
  },
  userId: {
    type: String,
    required: true,
    index: true
  },
  messages: [messageSchema],
  memoryContext: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

conversationSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model('Conversation', conversationSchema);