import mongoose from 'mongoose';

const chatHistorySchema = new mongoose.Schema(
  {
    telegramId: { type: Number, required: true, index: true },
    messages: [
      {
        role: { type: String, enum: ['user', 'assistant', 'system'], required: true },
        content: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    model: { type: String },
    tokensUsed: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model('ChatHistory', chatHistorySchema);
