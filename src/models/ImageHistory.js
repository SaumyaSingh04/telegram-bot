import mongoose from 'mongoose';

const imageHistorySchema = new mongoose.Schema(
  {
    telegramId: { type: Number, required: true, index: true },
    prompt: { type: String, required: true },
    provider: { type: String },
    model: { type: String },
    imageUrl: { type: String },
    status: { type: String, enum: ['success', 'failed'], default: 'success' },
    error: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model('ImageHistory', imageHistorySchema);
