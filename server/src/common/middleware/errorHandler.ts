import type { Request, Response, NextFunction } from 'express';
import type { ApiErrorResponse } from '@gathergrid/shared';
import { AppError } from '../errors/index.js';
import { logger } from '../logger.js';
import { ZodError } from 'zod';

/**
 * Global error handling middleware.
 * Converts all errors into a consistent ApiErrorResponse format.
 * Logs the full error internally but only exposes safe messages to clients.
 */
export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction,
): void {
  // Handle Zod validation errors
  if (err instanceof ZodError) {
    const response: ApiErrorResponse = {
      status: 'error',
      message: 'Validation error',
      code: 'VALIDATION_ERROR',
      requestId: String(req.id),
      details: err.issues.map((issue) => ({
        path: issue.path.join('.'),
        message: issue.message,
      })),
    };
    res.status(400).json(response);
    return;
  }

  // Handle known operational errors
  if (err instanceof AppError) {
    if (!err.isOperational) {
      logger.error({ err, requestId: req.id }, 'Unexpected application error');
    }

    const response: ApiErrorResponse = {
      status: 'error',
      message: err.message,
      code: err.code,
      requestId: String(req.id),
      details: err.details,
    };
    res.status(err.statusCode).json(response);
    return;
  }

  // Unknown errors — log full details, return generic message
  logger.error({ err, requestId: req.id }, 'Unhandled error');

  const response: ApiErrorResponse = {
    status: 'error',
    message: 'Internal server error',
    code: 'INTERNAL_ERROR',
    requestId: String(req.id),
  };
  res.status(500).json(response);
}
