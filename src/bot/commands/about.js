import config from '../../config/index.js';
import { safeMarkdownReply } from '../../helpers/formatMessage.js';

const aboutCommand = async (ctx) => {
  const text =
    `🤖 *${config.bot.name}* v${config.bot.version}\n\n` +
    `Powered by *Groq API* with *Llama 3.3 70B Versatile*.\n\n` +
    `• Ultra-fast AI inference\n` +
    `• Conversation memory \\(last 20 messages\\)\n` +
    `• Markdown\\-formatted responses\n` +
    `• Built with Telegraf & Node\\.js`;

  await safeMarkdownReply(ctx, text, 'MarkdownV2');
};

export default aboutCommand;
