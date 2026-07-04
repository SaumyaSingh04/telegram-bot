/**
 * Truncates text to Telegram's max message length (4096 chars).
 */
export const truncate = (text = '', maxLength = 4096) =>
  text.length <= maxLength ? text : text.slice(0, maxLength - 3) + '...';

/**
 * Escapes all MarkdownV2 special characters.
 */
export const escapeMarkdownV2 = (text = '') =>
  text.replace(/([_*[\]()~`>#+\-=|{}.!\\])/g, '\\$1');

/**
 * Sends a reply with the given parse_mode; falls back to plain text on failure.
 * @param {import('telegraf').Context} ctx
 * @param {string} text
 * @param {'Markdown'|'MarkdownV2'} [parseMode='Markdown']
 */
export const safeMarkdownReply = async (ctx, text, parseMode = 'Markdown') => {
  const safe = truncate(text);
  try {
    await ctx.reply(safe, { parse_mode: parseMode });
  } catch {
    await ctx.reply(safe.replace(/\\([_*[\]()~`>#+\-=|{}.!\\])/g, '$1'));
  }
};

/**
 * Formats a key-value object into a readable Markdown string.
 */
export const formatKeyValue = (data) =>
  Object.entries(data)
    .map(([k, v]) => `• *${k}:* ${v}`)
    .join('\n');
