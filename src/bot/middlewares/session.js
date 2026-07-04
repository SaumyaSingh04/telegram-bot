import sessionRepository from '../../repositories/sessionRepository.js';

/**
 * Attaches session data to ctx.session for every update.
 */
const sessionMiddleware = (ctx, next) => {
  const userId = ctx.from?.id;
  if (userId) {
    ctx.session = sessionRepository.getSession(userId);
  }
  return next();
};

export default sessionMiddleware;
