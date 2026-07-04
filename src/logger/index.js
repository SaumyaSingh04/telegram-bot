import winston from 'winston';
import fs from 'fs';

const { combine, timestamp, errors, json, colorize, printf } = winston.format;

const isVercel = !!process.env.VERCEL;

const devFormat = combine(
  colorize(),
  timestamp({ format: 'HH:mm:ss' }),
  printf(({ level, message, timestamp: ts, ...meta }) => {
    const extra = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
    return `${ts} ${level}: ${message}${extra}`;
  })
);

const prodFormat = combine(timestamp(), errors({ stack: true }), json());

const levels = { error: 0, warn: 1, info: 2, http: 3, debug: 4 };

const transports = [];

if (!isVercel) {
  const logsDir = 'logs';
  fs.mkdirSync(logsDir, { recursive: true });
  transports.push(
    new winston.transports.File({ filename: 'logs/error.log', level: 'error', maxsize: 10_485_760, maxFiles: 5 }),
    new winston.transports.File({ filename: 'logs/combined.log', maxsize: 10_485_760, maxFiles: 10 })
  );
}

if (process.env.NODE_ENV !== 'production' || isVercel) {
  transports.push(new winston.transports.Console({ format: isVercel ? prodFormat : devFormat }));
}

const logger = winston.createLogger({
  levels,
  level: process.env.LOG_LEVEL || 'info',
  format: prodFormat,
  transports,
});

export default logger;
