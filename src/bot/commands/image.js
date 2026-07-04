import { generateImage } from '../../services/image/imageService.js';
import imageHistoryRepository from '../../repositories/imageHistoryRepository.js';
import config from '../../config/index.js';
import logger from '../../logger/index.js';

const imageCommand = async (ctx) => {
  const userId = ctx.from?.id;
  const prompt = ctx.message?.text?.replace(/^\/image\s*/i, '').trim();

  if (!prompt) {
    return ctx.reply('🎨 Please provide a prompt. Usage: /image <description>');
  }

  const loadingMsg = await ctx.reply('🎨 Generating image, please wait...');

  try {
    await ctx.sendChatAction('upload_photo');
    const imageBuffer = await generateImage(prompt);

    await ctx.replyWithPhoto({ source: imageBuffer }, { caption: `🎨 ${prompt}` });

    await imageHistoryRepository.create({
      telegramId: userId,
      prompt,
      provider: config.image.provider,
      model: config.image.huggingFace.model,
      status: 'success',
    });
  } catch (err) {
    logger.error('Image generation failed', { userId, prompt, error: err.message });

    await imageHistoryRepository.create({
      telegramId: userId,
      prompt,
      provider: config.image.provider,
      status: 'failed',
      error: err.message,
    }).catch(() => {});

    await ctx.reply('❌ Failed to generate image. Please try again or refine your prompt.');
  } finally {
    await ctx.deleteMessage(loadingMsg.message_id).catch(() => {});
  }
};

export default imageCommand;
