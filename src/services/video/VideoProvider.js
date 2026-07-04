/**
 * Base class for video generation providers.
 * Extend this and implement `generate(prompt, onProgress)` → { url: string }
 */
export class VideoProvider {
  /**
   * @param {string} prompt
   * @param {(status: string) => Promise<void>} onProgress
   * @returns {Promise<{ url: string }>}
   */
  // eslint-disable-next-line no-unused-vars
  async generate(prompt, onProgress) {
    throw new Error('generate() must be implemented by subclass');
  }
}
