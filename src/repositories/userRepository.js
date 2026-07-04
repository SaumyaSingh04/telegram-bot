import User from '../models/User.js';

class UserRepository {
  findByTelegramId(telegramId) {
    return User.findOne({ telegramId });
  }

  upsert(telegramId, data) {
    return User.findOneAndUpdate({ telegramId }, { $set: data }, { upsert: true, new: true });
  }

  updateSettings(telegramId, settings) {
    return User.findOneAndUpdate({ telegramId }, { $set: { settings } }, { new: true });
  }

  incrementStats(telegramId, tokensUsed = 0) {
    return User.findOneAndUpdate(
      { telegramId },
      {
        $inc: { 'stats.totalMessages': 1, 'stats.totalTokens': tokensUsed },
        $set: { 'stats.lastActiveAt': new Date() },
      },
      { new: true }
    );
  }

  resetStats(telegramId) {
    return User.findOneAndUpdate(
      { telegramId },
      { $set: { 'stats.totalMessages': 0, 'stats.totalTokens': 0 } },
      { new: true }
    );
  }

  delete(telegramId) {
    return User.findOneAndDelete({ telegramId });
  }

  totalUsers() {
    return User.countDocuments();
  }

  globalStats() {
    return User.aggregate([
      {
        $group: {
          _id: null,
          totalMessages: { $sum: '$stats.totalMessages' },
          totalTokens: { $sum: '$stats.totalTokens' },
        },
      },
    ]);
  }
}

export default new UserRepository();
