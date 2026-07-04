import botService from '../../services/botService.js';
import logger from '../../logger/index.js';
import { BOT_MESSAGES } from '../../constants/index.js';
import { safeMarkdownReply } from '../../helpers/formatMessage.js';

const messageHandler = async (ctx) => {
  const userId = ctx.from?.id;
  const text = ctx.message?.text?.trim();

  if (!text) return;

  try {
    const { reply } = await botService.handleMessage(userId, text);
    await safeMarkdownReply(ctx, reply);
  } catch (err) {
    logger.error('Message handler error', { userId, error: err.message, code: err.code });

    if (err.code === 'RATE_LIMITED') {
      await ctx.reply(BOT_MESSAGES.RATE_LIMITED);
    } else if (err.code === 'TIMEOUT') {
      await ctx.reply(BOT_MESSAGES.TIMEOUT);
    } else {
      await ctx.reply(BOT_MESSAGES.ERROR);
    }
  }
};

export default messageHandler;
