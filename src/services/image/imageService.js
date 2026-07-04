import config from '../../config/index.js';
import { HuggingFaceProvider } from './HuggingFaceProvider.js';

const providers = {
  huggingface: HuggingFaceProvider,
};

function getProvider() {
  const Provider = providers[config.image.provider];
  if (!Provider) throw new Error(`Unknown image provider: "${config.image.provider}"`);
  return new Provider();
}

/** @param {string} prompt @returns {Promise<Buffer>} */
export async function generateImage(prompt) {
  return getProvider().generate(prompt);
}
