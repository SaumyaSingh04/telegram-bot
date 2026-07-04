import logger from '../logger/index.js';
import { AppError } from '../utils/AppError.js';

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const isOperational = err instanceof AppError && err.isOperational;

  if (!isOperational) {
    logger.error('Unhandled error', { message: err.message, stack: err.stack });
  }

  res.status(statusCode).json({
    success: false,
    message: isOperational ? err.message : 'Internal Server Error',
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  });
};

export default errorHandler;
