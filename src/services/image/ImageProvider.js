/**
 * Base class for image generation providers.
 * Extend this and implement `generate(prompt)` → Buffer
 */
export class ImageProvider {
  /** @param {string} prompt @returns {Promise<Buffer>} */
  // eslint-disable-next-line no-unused-vars
  async generate(prompt) {
    throw new Error('generate() must be implemented by subclass');
  }
}
