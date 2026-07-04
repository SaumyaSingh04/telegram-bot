import config from '../../config/index.js';
import { FalAiProvider } from './FalAiProvider.js';

const providers = {
  falai: FalAiProvider,
};

function getProvider() {
  const Provider = providers[config.video.provider];
  if (!Provider) throw new Error(`Unknown video provider: "${config.video.provider}"`);
  return new Provider();
}

/**
 * @param {string} prompt
 * @param {(status: string) => Promise<void>} onProgress
 * @returns {Promise<{ url: string }>}
 */
export async function generateVideo(prompt, onProgress) {
  return getProvider().generate(prompt, onProgress);
}
