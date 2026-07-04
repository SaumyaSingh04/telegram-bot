import mongoose from 'mongoose';
import { config } from '../config/index.js';
import { logger } from '../logger/index.js';

const MONGO_OPTIONS = {
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  maxPoolSize: 10,
};

export async function connectDB() {
  try {
    mongoose.connection.on('connected', () => logger.info('MongoDB connected'));
    mongoose.connection.on('disconnected', () => logger.warn('MongoDB disconnected'));
    mongoose.connection.on('error', (err) => logger.error('MongoDB error', { err }));

    await mongoose.connect(config.mongodb.uri, MONGO_OPTIONS);
  } catch (err) {
    logger.error('MongoDB initial connection failed', { err });
    throw err;
  }
}

export async function disconnectDB() {
  await mongoose.disconnect();
  logger.info('MongoDB disconnected gracefully');
}
