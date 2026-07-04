import groqService from './groqService.js';
import sessionRepository from '../repositories/sessionRepository.js';
import logger from '../logger/index.js';

class BotService {
  /**
   * Process a user message: fetch history, call AI, persist messages.
   * @param {number} userId
   * @param {string} text
   * @returns {Promise<{ reply: string, usage: object }>}
   */
  async handleMessage(userId, text) {
    const history = sessionRepository.getHistory(userId);
    const settings = sessionRepository.getSettings(userId);

    const { content, usage } = await groqService.chat({
      userMessage: text,
      history,
      model: settings.model ?? undefined,
      temperature: settings.temperature,
      maxTokens: settings.maxTokens,
    });

    sessionRepository.addMessage(userId, 'user', text);
    sessionRepository.addMessage(userId, 'assistant', content);
    sessionRepository.updateStats(userId, usage.total_tokens ?? 0);

    logger.info('Message processed', { userId, tokens: usage.total_tokens });

    return { reply: content, usage };
  }

  clearHistory(userId) {
    sessionRepository.clearHistory(userId);
  }

  getStats(userId) {
    return sessionRepository.getStats(userId);
  }

  getSettings(userId) {
    return sessionRepository.getSettings(userId);
  }

  updateSettings(userId, patch) {
    sessionRepository.updateSettings(userId, patch);
  }

  totalUsers() {
    return sessionRepository.totalUsers();
  }
}

export default new BotService();
