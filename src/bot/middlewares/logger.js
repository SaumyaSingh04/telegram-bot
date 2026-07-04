import logger from '../../logger/index.js';

const loggerMiddleware = (ctx, next) => {
  const userId = ctx.from?.id;
  const username = ctx.from?.username ?? 'unknown';
  const type = ctx.updateType;
  const text = ctx.message?.text ?? ctx.callbackQuery?.data ?? '';

  logger.info('Telegram update', { userId, username, type, text: text.slice(0, 80) });
  return next();
};

export default loggerMiddleware;
