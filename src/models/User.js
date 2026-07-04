import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    telegramId: { type: Number, required: true, unique: true, index: true },
    username: { type: String },
    firstName: { type: String },
    lastName: { type: String },
    settings: {
      model: { type: String, default: 'llama-3.3-70b-versatile' },
      temperature: { type: Number, default: 0.7 },
      maxTokens: { type: Number, default: 1024 },
    },
    stats: {
      totalMessages: { type: Number, default: 0 },
      totalTokens: { type: Number, default: 0 },
      lastActiveAt: { type: Date, default: Date.now },
    },
    credits: {
      remaining: { type: Number, default: 20 },
      lastResetAt: { type: Date, default: Date.now },
    },
  },
  { timestamps: true }
);

export default mongoose.model('User', userSchema);
