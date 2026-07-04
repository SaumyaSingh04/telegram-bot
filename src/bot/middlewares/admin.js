import config from '../../config/index.js';

const adminMiddleware = (ctx, next) => {
  const userId = ctx.from?.id;
  if (!config.admin.ids.includes(userId)) {
    return ctx.reply('⛔ Admin only.');
  }
  return next();
};

export default adminMiddleware;
