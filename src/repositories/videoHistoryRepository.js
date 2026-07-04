import VideoHistory from '../models/VideoHistory.js';

class VideoHistoryRepository {
  create(data) {
    return VideoHistory.create(data);
  }

  findById(id) {
    return VideoHistory.findById(id);
  }

  findByTelegramId(telegramId, limit = 10) {
    return VideoHistory.find({ telegramId }).sort({ createdAt: -1 }).limit(limit);
  }

  update(id, data) {
    return VideoHistory.findByIdAndUpdate(id, { $set: data }, { new: true });
  }

  delete(id) {
    return VideoHistory.findByIdAndDelete(id);
  }

  deleteByTelegramId(telegramId) {
    return VideoHistory.deleteMany({ telegramId });
  }
}

export default new VideoHistoryRepository();
