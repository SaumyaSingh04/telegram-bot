import { validateEnv } from './env.validator.js';

const env = validateEnv();

export const config = {
  app: {
    name: env.APP_NAME,
    env: env.NODE_ENV,
    port: env.PORT,
    isDev: env.NODE_ENV === 'development',
    isProd: env.NODE_ENV === 'production',
  },
  telegram: {
    token: env.TELEGRAM_BOT_TOKEN,
    webhookDomain: env.WEBHOOK_DOMAIN,
    webhookPath: env.WEBHOOK_PATH,
  },
  mongodb: {
    uri: env.MONGODB_URI,
  },
  groq: {
    apiKey: env.GROQ_API_KEY,
    baseURL: env.GROQ_BASE_URL,
    chatModel: env.GROQ_CHAT_MODEL,
  },
  openai: {
    apiKey: env.OPENAI_API_KEY,
    imageModel: env.OPENAI_IMAGE_MODEL,
    imageSize: env.OPENAI_IMAGE_SIZE,
    imageQuality: env.OPENAI_IMAGE_QUALITY,
  },
  rateLimit: {
    windowMs: env.RATE_LIMIT_WINDOW_MS,
    max: env.RATE_LIMIT_MAX,
  },
  logging: {
    level: env.LOG_LEVEL,
    dir: env.LOG_DIR,
  },
  security: {
    allowedOrigins: env.ALLOWED_ORIGINS.split(',').map((o) => o.trim()),
  },
};
