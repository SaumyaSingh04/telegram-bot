import botService from '../../services/botService.js';
import logger from '../../logger/index.js';
import { BOT_MESSAGES } from '../../constants/index.js';
import { safeMarkdownReply } from '../../helpers/formatMessage.js';

const chatCommand = async (ctx) => {
  const userId = ctx.from?.id;
  const prompt = ctx.message?.text?.replace(/^\/chat\s*/i, '').trim();

  if (!prompt) {
    await ctx.reply(BOT_MESSAGES.CHAT_NO_PROMPT);
    return;
  }

  try {
    const { reply } = await botService.handleMessage(userId, prompt);
    await safeMarkdownReply(ctx, reply);
  } catch (err) {
    logger.error('Chat command error', { userId, error: err.message, code: err.code });

    if (err.code === 'RATE_LIMITED') {
      await ctx.reply(BOT_MESSAGES.RATE_LIMITED);
    } else if (err.code === 'TIMEOUT') {
      await ctx.reply(BOT_MESSAGES.TIMEOUT);
    } else {
      await ctx.reply(BOT_MESSAGES.ERROR);
    }
  }
};

export default chatCommand;
