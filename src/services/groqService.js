import OpenAI from 'openai';
import config from '../config/index.js';
import logger from '../logger/index.js';
import { DEFAULT_SYSTEM_PROMPT } from '../prompts/system.js';
import { AI_DEFAULTS } from '../constants/index.js';

const RETRY_ATTEMPTS = 3;
const RETRY_DELAY_MS = 1000;
const REQUEST_TIMEOUT_MS = 30_000;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

class GroqService {
  constructor() {
    this._client = new OpenAI({
      apiKey: config.groq.apiKey,
      baseURL: config.groq.baseURL,
      timeout: REQUEST_TIMEOUT_MS,
      maxRetries: 0, // we handle retries manually for full control
    });
  }

  /**
   * Build the messages array for the API call.
   * @param {string} systemPrompt
   * @param {Array<{role:string,content:string}>} history
   * @param {string} userMessage
   */
  _buildMessages(systemPrompt, history, userMessage) {
    return [
      { role: 'system', content: systemPrompt },
      ...history,
      { role: 'user', content: userMessage },
    ];
  }

  /**
   * Send a chat completion request with retry + timeout handling.
   * @param {object} opts
   * @param {string} opts.userMessage
   * @param {Array}  opts.history
   * @param {string} [opts.systemPrompt]
   * @param {string} [opts.model]
   * @param {number} [opts.temperature]
   * @param {number} [opts.maxTokens]
   * @returns {Promise<{ content: string, usage: object }>}
   */
  async chat({ userMessage, history = [], systemPrompt, model, temperature, maxTokens }) {
    const messages = this._buildMessages(
      systemPrompt ?? DEFAULT_SYSTEM_PROMPT,
      history,
      userMessage
    );

    const params = {
      model: model ?? config.groq.model,
      messages,
      temperature: temperature ?? AI_DEFAULTS.TEMPERATURE,
      max_tokens: maxTokens ?? AI_DEFAULTS.MAX_TOKENS,
    };

    let lastError;

    for (let attempt = 1; attempt <= RETRY_ATTEMPTS; attempt++) {
      try {
        const completion = await this._client.chat.completions.create(params);
        const content = completion.choices[0]?.message?.content ?? '';
        const usage = completion.usage ?? {};
        return { content, usage };
      } catch (err) {
        lastError = err;
        const isRetryable = this._isRetryable(err);

        logger.warn('Groq API error', {
          attempt,
          retryable: isRetryable,
          message: err.message,
          status: err.status,
        });

        if (!isRetryable || attempt === RETRY_ATTEMPTS) break;
        await sleep(RETRY_DELAY_MS * attempt);
      }
    }

    throw this._normalizeError(lastError);
  }

  /**
   * Streaming-ready: returns an async iterable of content chunks.
   * @param {object} opts — same as chat()
   * @returns {AsyncIterable<string>}
   */
  async *stream({ userMessage, history = [], systemPrompt, model, temperature, maxTokens }) {
    const messages = this._buildMessages(
      systemPrompt ?? DEFAULT_SYSTEM_PROMPT,
      history,
      userMessage
    );

    const stream = await this._client.chat.completions.create({
      model: model ?? config.groq.model,
      messages,
      temperature: temperature ?? AI_DEFAULTS.TEMPERATURE,
      max_tokens: maxTokens ?? AI_DEFAULTS.MAX_TOKENS,
      stream: true,
    });

    for await (const chunk of stream) {
      const delta = chunk.choices[0]?.delta?.content;
      if (delta) yield delta;
    }
  }

  _isRetryable(err) {
    if (err.code === 'ECONNRESET' || err.code === 'ETIMEDOUT') return true;
    if (err.status === 429 || err.status >= 500) return true;
    return false;
  }

  _normalizeError(err) {
    if (err.status === 429) {
      const e = new Error('AI service is rate-limited. Please try again in a moment.');
      e.code = 'RATE_LIMITED';
      return e;
    }
    if (err.status === 401) {
      const e = new Error('AI service authentication failed.');
      e.code = 'AUTH_ERROR';
      return e;
    }
    if (err.code === 'ETIMEDOUT' || err.name === 'APIConnectionTimeoutError') {
      const e = new Error('AI service timed out. Please try again.');
      e.code = 'TIMEOUT';
      return e;
    }
    return err;
  }
}

export default new GroqService();
