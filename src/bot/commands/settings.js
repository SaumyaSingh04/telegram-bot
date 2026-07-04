import botService from '../../services/botService.js';
import { safeMarkdownReply } from '../../helpers/formatMessage.js';

const settingsCommand = async (ctx) => {
  const userId = ctx.from?.id;
  const settings = botService.getSettings(userId);

  const text =
    `⚙️ *Your Settings*\n\n` +
    `• Model: \`${settings.model}\`\n` +
    `• Temperature: \`${settings.temperature}\`\n` +
    `• Max Tokens: \`${settings.maxTokens}\``;

  await safeMarkdownReply(ctx, text);
};

export default settingsCommand;
