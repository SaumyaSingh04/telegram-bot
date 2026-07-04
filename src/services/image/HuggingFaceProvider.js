import { HfInference } from '@huggingface/inference';
import { ImageProvider } from './ImageProvider.js';
import config from '../../config/index.js';
import logger from '../../logger/index.js';

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 2000;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export class HuggingFaceProvider extends ImageProvider {
  constructor() {
    super();
    this.model = config.image.huggingFace.model;
    this.hf = new HfInference(config.image.huggingFace.token);
  }

  async generate(prompt) {
    let lastError;

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        logger.info('HuggingFace image request', { attempt, model: this.model, prompt });

        const blob = await this.hf.textToImage(
          {
            model: this.model,
            inputs: prompt,
            parameters: { num_inference_steps: 4 },
          },
          { signal: AbortSignal.timeout(90_000), provider: 'hf-inference' },
        );

        if (!blob || blob.size === 0) {
          throw new Error('HuggingFace returned an empty response');
        }

        const arrayBuffer = await blob.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        logger.info('HuggingFace image generated', { bytes: buffer.length });
        return buffer;
      } catch (err) {
        lastError = err;

        const status = err?.response?.status ?? err?.statusCode ?? null;
        const body = err?.response?.data ?? err?.message ?? '';

        logger.error('HuggingFace image error', {
          attempt,
          status,
          error: err.message,
          body: typeof body === 'string' ? body.slice(0, 300) : JSON.stringify(body).slice(0, 300),
        });

        const retryable = !status || status === 503 || status === 429 || status === 500;
        if (!retryable || attempt === MAX_RETRIES) break;

        logger.warn(`Retrying in ${RETRY_DELAY_MS}ms...`, { attempt });
        await sleep(RETRY_DELAY_MS * attempt);
      }
    }

    const status = lastError?.response?.status ?? lastError?.statusCode;
    if (status === 401 || status === 403) throw new Error('HuggingFace authentication failed. Check HUGGINGFACE_TOKEN.');
    if (status === 503) throw new Error('HuggingFace model is loading. Please try again in a moment.');
    throw new Error(`Image generation failed: ${lastError?.message ?? 'Unknown error'}`);
  }
}
