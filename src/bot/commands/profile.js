import userRepository from '../../repositories/userRepository.js';
import creditsRepository from '../../repositories/creditsRepository.js';
import { safeMarkdownReply } from '../../helpers/formatMessage.js';

const profileCommand = async (ctx) => {
  const telegramId = ctx.from?.id;
  const name = ctx.from?.first_name ?? 'Unknown';

  const [user, credits] = await Promise.all([
    userRepository.findByTelegramId(telegramId),
    creditsRepository.getCredits(telegramId),
  ]);

  const joined = user ? new Date(user.createdAt).toLocaleDateString() : 'N/A';
  const messages = user?.stats?.totalMessages ?? 0;
  const tokens = user?.stats?.totalTokens ?? 0;

  const text =
    `👤 *Profile*\n\n` +
    `• Name: *${name}*\n` +
    `• ID: \`${telegramId}\`\n` +
    `• Joined: *${joined}*\n` +
    `• Messages sent: *${messages}*\n` +
    `• Tokens used: *${tokens}*\n` +
    `• Credits remaining: *${credits}*`;

  await safeMarkdownReply(ctx, text);
};

export default profileCommand;
