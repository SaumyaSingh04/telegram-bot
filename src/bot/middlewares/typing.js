/**
 * Sends a "typing..." action before the handler runs.
 * Only applies to message updates.
 */
const typingMiddleware = async (ctx, next) => {
  if (ctx.message) {
    await ctx.sendChatAction('typing').catch(() => {});
  }
  return next();
};

export default typingMiddleware;
