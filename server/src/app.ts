import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import cookieParser from 'cookie-parser';
import { env } from './config/env.js';
import { logger } from './common/logger.js';
import { requestIdMiddleware, errorHandler, notFoundHandler } from './common/middleware/index.js';
import { healthRoutes } from './modules/health/health.routes.js';
import { authRoutes } from './modules/auth/auth.routes.js';
import { geoRoutes } from './modules/geo/geo.routes.js';
import { activitiesRoutes } from './modules/activities/activities.routes.js';
import { registrationsRoutes } from './modules/registrations/registrations.routes.js';
import { organizersRoutes } from './modules/organizers/organizers.routes.js';

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

  // ── HTTP Endpoint Logging ─────────────────────────────
  app.use((req, _res, next) => {
    // Skip health checks to keep logs clean
    if (req.originalUrl === '/health' || req.originalUrl === '/ready') {
      return next();
    }
    logger.info(`${req.method} ${req.originalUrl}`);
    next();
  });

  // ── Routes ────────────────────────────────────────────
  app.use(healthRoutes);
  app.use('/api/v1/auth', authRoutes);
  app.use('/api/v1/geo', geoRoutes);
  app.use('/api/v1/activities', activitiesRoutes);
  app.use('/api/v1/registrations', registrationsRoutes);
  app.use('/api/v1/organizers', organizersRoutes);

  // ── 404 + Error Handler ───────────────────────────────
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
