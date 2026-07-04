import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import { config } from '../config/index.js';

const { combine, timestamp, printf, colorize, errors, json } = winston.format;

const consoleFormat = combine(
  colorize({ all: true }),
  timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  errors({ stack: true }),
  printf(({ timestamp, level, message, stack, ...meta }) => {
    const metaStr = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
    return `[${timestamp}] ${level}: ${stack || message}${metaStr}`;
  })
);

const fileFormat = combine(timestamp(), errors({ stack: true }), json());

const transports = [
  new winston.transports.Console({ format: consoleFormat }),
  new DailyRotateFile({
    dirname: config.logging.dir,
    filename: 'app-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    maxFiles: '14d',
    maxSize: '20m',
    format: fileFormat,
    level: 'info',
  }),
  new DailyRotateFile({
    dirname: config.logging.dir,
    filename: 'error-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    maxFiles: '30d',
    maxSize: '20m',
    format: fileFormat,
    level: 'error',
  }),
];

export const logger = winston.createLogger({
  level: config.logging.level,
  transports,
  exitOnError: false,
});
