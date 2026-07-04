import mongoose from 'mongoose';
import User from '../../models/User.js';
import sessionRepository from '../../repositories/sessionRepository.js';
import userRepository from '../../repositories/userRepository.js';
import config from '../../config/index.js';

const adminCommand = async (ctx) => {
  const args = ctx.message.text.split(/\s+/).slice(1);
  const sub = args[0];

  if (!sub || sub === 'help') {
    return ctx.reply(
      '🔧 *Admin Commands*\n\n' +
      '/admin stats — global usage stats\n' +
      '/admin broadcast <msg> — send message to all active users\n' +
      '/admin user <id> — lookup user info\n' +
      '/admin resetcredits <id> — reset user credits\n' +
      '/admin health — system health',
      { parse_mode: 'Markdown' }
    );
  }

  if (sub === 'stats') {
    const [dbStats] = await userRepository.globalStats();
    const dbState = ['disconnected', 'connected', 'connecting', 'disconnecting'];
    return ctx.reply(
      `📊 *Global Stats*\n\n` +
      `• Active sessions: ${sessionRepository.totalUsers()}\n` +
      `• Session messages: ${sessionRepository.globalMessageCount()}\n` +
      `• Session tokens: ${sessionRepository.globalTokenCount()}\n` +
      `• DB messages: ${dbStats?.totalMessages ?? 0}\n` +
      `• DB tokens: ${dbStats?.totalTokens ?? 0}\n` +
      `• DB: ${dbState[mongoose.connection.readyState]}\n` +
      `• Uptime: ${Math.floor(process.uptime())}s\n` +
      `• Memory: ${Math.round(process.memoryUsage().rss / 1024 / 1024)}MB`,
      { parse_mode: 'Markdown' }
    );
  }

  if (sub === 'health') {
    const mem = process.memoryUsage();
    return ctx.reply(
      `🏥 *Health*\n\n` +
      `• Uptime: ${Math.floor(process.uptime())}s\n` +
      `• RSS: ${Math.round(mem.rss / 1024 / 1024)}MB\n` +
      `• Heap: ${Math.round(mem.heapUsed / 1024 / 1024)}/${Math.round(mem.heapTotal / 1024 / 1024)}MB\n` +
      `• Env: ${config.env}\n` +
      `• Version: ${config.bot.version}`,
      { parse_mode: 'Markdown' }
    );
  }

  if (sub === 'user') {
    const targetId = parseInt(args[1], 10);
    if (!targetId) return ctx.reply('Usage: /admin user <telegram_id>');
    const user = await userRepository.findByTelegramId(targetId);
    if (!user) return ctx.reply('User not found.');
    return ctx.reply(
      `👤 *User ${targetId}*\n\n` +
      `• Name: ${user.firstName ?? ''} ${user.lastName ?? ''}\n` +
      `• Username: @${user.username ?? 'none'}\n` +
      `• Messages: ${user.stats.totalMessages}\n` +
      `• Tokens: ${user.stats.totalTokens}\n` +
      `• Credits: ${user.credits.remaining}\n` +
      `• Joined: ${user.createdAt.toLocaleDateString()}`,
      { parse_mode: 'Markdown' }
    );
  }

  if (sub === 'resetcredits') {
    const targetId = parseInt(args[1], 10);
    if (!targetId) return ctx.reply('Usage: /admin resetcredits <telegram_id>');
    await userRepository.findByTelegramId(targetId).then((u) => {
      if (!u) throw new Error('User not found');
      u.credits.remaining = config.credits.dailyFree;
      u.credits.lastResetAt = new Date();
      return u.save();
    });
    return ctx.reply(`✅ Credits reset for user ${targetId}`);
  }

  if (sub === 'broadcast') {
    const message = args.slice(1).join(' ');
    if (!message) return ctx.reply('Usage: /admin broadcast <message>');
    const users = await User.find({}, 'telegramId').lean();
    let sent = 0, failed = 0;
    for (const u of users) {
      try {
        await ctx.telegram.sendMessage(u.telegramId, `📢 ${message}`);
        sent++;
      } catch {
        failed++;
      }
    }
    return ctx.reply(`📢 Broadcast done: ${sent} sent, ${failed} failed`);
  }

  return ctx.reply('Unknown sub-command. Use /admin help');
};

export default adminCommand;
