import { safeMarkdownReply } from '../../helpers/formatMessage.js';
import { BOT_MESSAGES } from '../../constants/index.js';

const helpCommand = async (ctx) => {
  await safeMarkdownReply(ctx, BOT_MESSAGES.HELP, 'MarkdownV2');
};

export default helpCommand;
