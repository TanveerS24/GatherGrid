import mongoose from 'mongoose';
import { logger } from '../common/logger.js';
import { env } from './env.js';

/**
 * Connect to MongoDB. Logs connection events. Called once at boot.
 */
export async function connectDatabase(): Promise<void> {
  mongoose.connection.on('connected', () => {
    logger.info('MongoDB connected');
  });

  mongoose.connection.on('disconnected', () => {
    logger.warn('MongoDB disconnected');
  });

  mongoose.connection.on('error', (err) => {
    logger.error({ err }, 'MongoDB connection error');
  });

  await mongoose.connect(env.MONGODB_URI);
}

/**
 * Gracefully close the MongoDB connection.
 */
export async function disconnectDatabase(): Promise<void> {
  await mongoose.disconnect();
  logger.info('MongoDB disconnected gracefully');
}

/**
 * Check if the database connection is ready.
 */
export function isDatabaseReady(): boolean {
  return mongoose.connection.readyState === 1;
}
