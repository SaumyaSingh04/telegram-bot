import { safeMarkdownReply } from '../../helpers/formatMessage.js';
import sessionRepository from '../../repositories/sessionRepository.js';
import { BOT_MESSAGES } from '../../constants/index.js';

const startCommand = async (ctx) => {
  const userId = ctx.from?.id;
  const name = ctx.from?.first_name ?? 'there';

  sessionRepository.getSession(userId);

  await safeMarkdownReply(ctx, BOT_MESSAGES.WELCOME(name), 'MarkdownV2');
};

export default startCommand;
