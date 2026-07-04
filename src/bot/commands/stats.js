import botService from '../../services/botService.js';
import { safeMarkdownReply } from '../../helpers/formatMessage.js';

const statsCommand = async (ctx) => {
  const userId = ctx.from?.id;
  const stats = botService.getStats(userId);

  const joined = new Date(stats.joinedAt).toLocaleDateString();
  const lastActive = new Date(stats.lastActiveAt).toLocaleString();

  const text =
    `📊 *Your Statistics*\n\n` +
    `• Messages sent: *${stats.totalMessages}*\n` +
    `• Tokens used: *${stats.totalTokens}*\n` +
    `• Joined: *${joined}*\n` +
    `• Last active: *${lastActive}*`;

  await safeMarkdownReply(ctx, text);
};

export default statsCommand;
