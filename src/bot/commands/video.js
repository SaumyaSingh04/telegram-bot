import { generateVideo } from '../../services/video/videoService.js';
import videoHistoryRepository from '../../repositories/videoHistoryRepository.js';
import config from '../../config/index.js';
import logger from '../../logger/index.js';

const PROGRESS_MESSAGES = ['⏳ In queue…', '🎬 Generating…', '🔄 Still working…', '🎞️ Almost there…'];

const videoCommand = async (ctx) => {
  const userId = ctx.from?.id;
  const prompt = ctx.message?.text?.replace(/^\/video\s*/i, '').trim();

  if (!prompt) {
    return ctx.reply('🎬 Please provide a prompt. Usage: /video <description>');
  }

  const statusMsg = await ctx.reply('🎬 Starting video generation…');
  let progressIndex = 0;

  const onProgress = async (detail) => {
    const text = `${PROGRESS_MESSAGES[progressIndex % PROGRESS_MESSAGES.length]} ${detail}`;
    progressIndex++;
    await ctx.telegram
      .editMessageText(ctx.chat.id, statusMsg.message_id, undefined, text)
      .catch(() => {});
  };

  try {
    await ctx.sendChatAction('upload_video');
    const { url } = await generateVideo(prompt, onProgress);

    await ctx.telegram
      .editMessageText(ctx.chat.id, statusMsg.message_id, undefined, '✅ Done! Sending video…')
      .catch(() => {});

    await ctx.replyWithVideo({ url }, { caption: `🎬 ${prompt}` });
    await ctx.deleteMessage(statusMsg.message_id).catch(() => {});

    await videoHistoryRepository.create({
      telegramId: userId,
      prompt,
      provider: config.video.provider,
      model: config.video.falAi.model,
      videoUrl: url,
      status: 'success',
    });
  } catch (err) {
    logger.error('Video generation failed', { userId, prompt, error: err.message });

    await videoHistoryRepository.create({
      telegramId: userId,
      prompt,
      provider: config.video.provider,
      status: 'failed',
      error: err.message,
    }).catch(() => {});

    await ctx.telegram
      .editMessageText(
        ctx.chat.id,
        statusMsg.message_id,
        undefined,
        '❌ Failed to generate video. Please try again or refine your prompt.'
      )
      .catch(() => ctx.reply('❌ Failed to generate video. Please try again or refine your prompt.'));
  }
};

export default videoCommand;
