import creditsRepository from '../../repositories/creditsRepository.js';
import userRepository from '../../repositories/userRepository.js';
import { BOT_MESSAGES } from '../../constants/index.js';

const creditsMiddleware = async (ctx, next) => {
  const telegramId = ctx.from?.id;
  if (!telegramId) return next();

  // Ensure user exists in DB
  await userRepository.upsert(telegramId, {
    username: ctx.from.username,
    firstName: ctx.from.first_name,
    lastName: ctx.from.last_name,
  });

  // Atomically deduct — returns false if no credits remain
  const deducted = await creditsRepository.deduct(telegramId);

  if (!deducted) {
    return ctx.reply(BOT_MESSAGES.CREDITS_EXHAUSTED);
  }

  return next();
};

export default creditsMiddleware;
