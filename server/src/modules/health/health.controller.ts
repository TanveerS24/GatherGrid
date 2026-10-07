import type { Request, Response } from 'express';
import type { HealthResponse, ReadinessResponse } from '@gathergrid/shared';
import { isDatabaseReady } from '../../config/db.js';

/**
 * GET /health — basic liveness check.
 */
export function getHealth(_req: Request, res: Response): void {
  const response: HealthResponse = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  };
  res.json(response);
}

/**
 * GET /ready — readiness check including database connectivity.
 */
export function getReadiness(_req: Request, res: Response): void {
  const dbReady = isDatabaseReady();
  const response: ReadinessResponse = {
    status: dbReady ? 'ok' : 'error',
    db: dbReady ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString(),
  };
  res.status(dbReady ? 200 : 503).json(response);
}
