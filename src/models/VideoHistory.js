import mongoose from 'mongoose';

const videoHistorySchema = new mongoose.Schema(
  {
    telegramId: { type: Number, required: true, index: true },
    prompt: { type: String, required: true },
    provider: { type: String },
    model: { type: String },
    videoUrl: { type: String },
    status: { type: String, enum: ['success', 'failed'], default: 'success' },
    error: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model('VideoHistory', videoHistorySchema);
