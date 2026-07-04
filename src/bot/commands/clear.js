import botService from '../../services/botService.js';
import { BOT_MESSAGES } from '../../constants/index.js';

const clearCommand = async (ctx) => {
  const userId = ctx.from?.id;
  botService.clearHistory(userId);
  await ctx.reply(BOT_MESSAGES.CLEAR);
};

export default clearCommand;
