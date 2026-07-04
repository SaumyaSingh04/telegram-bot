import Joi from 'joi';

const envSchema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
  PORT: Joi.number().default(3000),
  APP_NAME: Joi.string().default('TelegramAISuperBot'),

  TELEGRAM_BOT_TOKEN: Joi.string().required(),
  WEBHOOK_DOMAIN: Joi.string().uri().when('NODE_ENV', {
    is: 'production',
    then: Joi.required(),
    otherwise: Joi.optional(),
  }),
  WEBHOOK_PATH: Joi.string().default('/webhook/telegram'),

  MONGODB_URI: Joi.string().required(),

  GROQ_API_KEY: Joi.string().required(),
  GROQ_BASE_URL: Joi.string().uri().default('https://api.groq.com/openai/v1'),
  GROQ_CHAT_MODEL: Joi.string().default('llama3-70b-8192'),

  OPENAI_API_KEY: Joi.string().required(),
  OPENAI_IMAGE_MODEL: Joi.string().default('dall-e-3'),
  OPENAI_IMAGE_SIZE: Joi.string().default('1024x1024'),
  OPENAI_IMAGE_QUALITY: Joi.string().valid('standard', 'hd').default('standard'),

  RATE_LIMIT_WINDOW_MS: Joi.number().default(900000),
  RATE_LIMIT_MAX: Joi.number().default(100),

  LOG_LEVEL: Joi.string().valid('error', 'warn', 'info', 'debug').default('info'),
  LOG_DIR: Joi.string().default('logs'),

  ALLOWED_ORIGINS: Joi.string().default('http://localhost:3000'),
}).unknown(true);

export function validateEnv() {
  const { error, value } = envSchema.validate(process.env, { abortEarly: false });
  if (error) {
    const details = error.details.map((d) => d.message).join('\n  ');
    throw new Error(`Environment validation failed:\n  ${details}`);
  }
  return value;
}
