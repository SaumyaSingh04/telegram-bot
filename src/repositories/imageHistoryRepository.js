import ImageHistory from '../models/ImageHistory.js';

class ImageHistoryRepository {
  create(data) {
    return ImageHistory.create(data);
  }

  findById(id) {
    return ImageHistory.findById(id);
  }

  findByTelegramId(telegramId, limit = 10) {
    return ImageHistory.find({ telegramId }).sort({ createdAt: -1 }).limit(limit);
  }

  update(id, data) {
    return ImageHistory.findByIdAndUpdate(id, { $set: data }, { new: true });
  }

  delete(id) {
    return ImageHistory.findByIdAndDelete(id);
  }

  deleteByTelegramId(telegramId) {
    return ImageHistory.deleteMany({ telegramId });
  }
}

export default new ImageHistoryRepository();
