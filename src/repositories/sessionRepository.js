import { AI_DEFAULTS } from '../constants/index.js';

/**
 * In-memory session store. One entry per Telegram user ID.
 * Swap the Map for a Redis/DB adapter for multi-instance deployments.
 */
class SessionRepository {
  constructor() {
    /** @type {Map<number, SessionEntry>} */
    this._store = new Map();
  }

  /** @private */
  _init(userId) {
    if (!this._store.has(userId)) {
      this._store.set(userId, {
        history: [],
        settings: {
          model: AI_DEFAULTS.MODEL,
          temperature: AI_DEFAULTS.TEMPERATURE,
          maxTokens: AI_DEFAULTS.MAX_TOKENS,
        },
        stats: {
          totalMessages: 0,
          totalTokens: 0,
          joinedAt: new Date().toISOString(),
          lastActiveAt: new Date().toISOString(),
        },
      });
    }
    return this._store.get(userId);
  }

  getSession(userId) {
    return this._init(userId);
  }

  getHistory(userId) {
    return this._init(userId).history;
  }

  /**
   * Appends a message to history and enforces the MAX_HISTORY window.
   * Each exchange = 2 entries (user + assistant), so cap at MAX_HISTORY * 2.
   */
  addMessage(userId, role, content) {
    const session = this._init(userId);
    session.history.push({ role, content });

    const cap = AI_DEFAULTS.MAX_HISTORY * 2;
    if (session.history.length > cap) {
      session.history = session.history.slice(-cap);
    }

    session.stats.totalMessages += 1;
    session.stats.lastActiveAt = new Date().toISOString();
  }

  clearHistory(userId) {
    this._init(userId).history = [];
  }

  updateStats(userId, tokensUsed = 0) {
    const session = this._init(userId);
    session.stats.totalTokens += tokensUsed;
    session.stats.lastActiveAt = new Date().toISOString();
  }

  resetStats(userId) {
    const session = this._init(userId);
    session.stats.totalMessages = 0;
    session.stats.totalTokens = 0;
    session.stats.lastActiveAt = new Date().toISOString();
  }

  getSettings(userId) {
    return this._init(userId).settings;
  }

  updateSettings(userId, patch) {
    Object.assign(this._init(userId).settings, patch);
  }

  getStats(userId) {
    return this._init(userId).stats;
  }

  /** Total unique users who have interacted with the bot. */
  totalUsers() {
    return this._store.size;
  }

  /** Total messages across all users. */
  globalMessageCount() {
    let total = 0;
    for (const session of this._store.values()) {
      total += session.stats.totalMessages;
    }
    return total;
  }

  /** Total tokens consumed across all users. */
  globalTokenCount() {
    let total = 0;
    for (const session of this._store.values()) {
      total += session.stats.totalTokens;
    }
    return total;
  }
}

export default new SessionRepository();
