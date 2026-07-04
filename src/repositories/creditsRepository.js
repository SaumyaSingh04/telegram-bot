import User from '../models/User.js';
import config from '../config/index.js';

const isNewDay = (date) => {
  const now = new Date();
  return (
    now.getUTCFullYear() !== date.getUTCFullYear() ||
    now.getUTCMonth() !== date.getUTCMonth() ||
    now.getUTCDate() !== date.getUTCDate()
  );
};

class CreditsRepository {
  async getCredits(telegramId) {
    const user = await User.findOne({ telegramId }, 'credits');
    if (!user) return config.credits.dailyFree;

    if (isNewDay(user.credits.lastResetAt)) {
      const updated = await User.findOneAndUpdate(
        { telegramId },
        { $set: { 'credits.remaining': config.credits.dailyFree, 'credits.lastResetAt': new Date() } },
        { new: true }
      );
      return updated.credits.remaining;
    }

    return user.credits.remaining;
  }

  /**
   * Atomically resets credits if a new day has started, then deducts.
   * Returns true if deduction succeeded, false if insufficient credits.
   */
  async deduct(telegramId, amount = 1) {
    // First check if daily reset is needed
    const user = await User.findOne({ telegramId }, 'credits');
    if (user && isNewDay(user.credits.lastResetAt)) {
      await User.findOneAndUpdate(
        { telegramId },
        { $set: { 'credits.remaining': config.credits.dailyFree, 'credits.lastResetAt': new Date() } }
      );
    }

    // Atomic deduction — only succeeds if credits >= amount
    const updated = await User.findOneAndUpdate(
      { telegramId, 'credits.remaining': { $gte: amount } },
      { $inc: { 'credits.remaining': -amount } },
      { new: true }
    );
    return updated !== null;
  }
}

export default new CreditsRepository();
