import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import pinoHttp from 'pino-http';
import mongoSanitize from 'express-mongo-sanitize';
import cookieParser from 'cookie-parser';
import { env } from './config/env.js';
import { logger } from './common/logger.js';
import { requestIdMiddleware, errorHandler, notFoundHandler } from './common/middleware/index.js';
import { healthRoutes } from './modules/health/health.routes.js';
import { authRoutes } from './modules/auth/auth.routes.js';

/**
 * Create and configure the Express application.
 * Separated from server.ts so it can be imported by tests without starting a listener.
 */
export function createApp(): express.Application {
  const app = express();

  // ── Security ──────────────────────────────────────────
  app.use(helmet());
  app.use(
    cors({
      origin: env.CORS_ORIGINS.split(',').map((s) => s.trim()),
      credentials: true,
    }),
  );
  app.use(mongoSanitize());

  // ── Parsing ───────────────────────────────────────────
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true, limit: '1mb' }));
  app.use(cookieParser());

  // ── Request ID ────────────────────────────────────────
  app.use(requestIdMiddleware);

  // ── HTTP Logging ──────────────────────────────────────
  app.use(
    pinoHttp({
      logger,
      autoLogging: {
        ignore: (req) => {
          // Don't log health check requests to reduce noise
          const url = (req as express.Request).originalUrl;
          return url === '/health' || url === '/ready';
        },
      },
      customProps: (req) => ({
        requestId: (req as express.Request).id,
      }),
    }),
  );

  // ── Routes ────────────────────────────────────────────
  app.use(healthRoutes);
  app.use('/api/v1/auth', authRoutes);

  // ── 404 + Error Handler ───────────────────────────────
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
