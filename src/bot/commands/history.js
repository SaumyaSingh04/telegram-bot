import chatHistoryRepository from '../../repositories/chatHistoryRepository.js';
import imageHistoryRepository from '../../repositories/imageHistoryRepository.js';
import videoHistoryRepository from '../../repositories/videoHistoryRepository.js';
import { safeMarkdownReply } from '../../helpers/formatMessage.js';

const historyCommand = async (ctx) => {
  const userId = ctx.from?.id;

  const [chats, images, videos] = await Promise.all([
    chatHistoryRepository.findByTelegramId(userId, 5),
    imageHistoryRepository.findByTelegramId(userId, 5),
    videoHistoryRepository.findByTelegramId(userId, 5),
  ]);

  const lines = ['📜 *Recent History*\n'];

  if (chats.length) {
    lines.push('💬 *Chat Sessions*');
    for (const c of chats) {
      const date = new Date(c.createdAt).toLocaleDateString();
      lines.push(`• ${date} — ${c.messages.length} messages`);
    }
  }

  if (images.length) {
    lines.push('\n🎨 *Image Generations*');
    for (const img of images) {
      const date = new Date(img.createdAt).toLocaleDateString();
      lines.push(`• ${date} — ${img.prompt.slice(0, 40)}…`);
    }
  }

  if (videos.length) {
    lines.push('\n🎬 *Video Generations*');
    for (const vid of videos) {
      const date = new Date(vid.createdAt).toLocaleDateString();
      lines.push(`• ${date} — ${vid.prompt.slice(0, 40)}…`);
    }
  }

  if (!chats.length && !images.length && !videos.length) {
    lines.push('No history found yet. Start chatting!');
  }

  await safeMarkdownReply(ctx, lines.join('\n'));
};

export default historyCommand;
