import ChatHistory from '../models/ChatHistory.js';
import { AI_DEFAULTS } from '../constants/index.js';

class ChatHistoryRepository {
  create(telegramId, data = {}) {
    return ChatHistory.create({ telegramId, ...data });
  }

  findById(id) {
    return ChatHistory.findById(id);
  }

  findByTelegramId(telegramId, limit = 10) {
    return ChatHistory.find({ telegramId }).sort({ createdAt: -1 }).limit(limit);
  }

  async addMessage(telegramId, role, content) {
    const cap = AI_DEFAULTS.MAX_HISTORY * 2;
    let doc = await ChatHistory.findOne({ telegramId }).sort({ createdAt: -1 });

    if (!doc) doc = await this.create(telegramId);

    doc.messages.push({ role, content });
    if (doc.messages.length > cap) doc.messages = doc.messages.slice(-cap);

    return doc.save();
  }

  clearMessages(telegramId) {
    return ChatHistory.findOneAndUpdate(
      { telegramId },
      { $set: { messages: [] } },
      { sort: { createdAt: -1 }, new: true }
    );
  }

  updateTokens(id, tokensUsed) {
    return ChatHistory.findByIdAndUpdate(id, { $inc: { tokensUsed } }, { new: true });
  }

  delete(id) {
    return ChatHistory.findByIdAndDelete(id);
  }

  deleteByTelegramId(telegramId) {
    return ChatHistory.deleteMany({ telegramId });
  }
}

export default new ChatHistoryRepository();
