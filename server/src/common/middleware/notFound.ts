import type { Request, Response } from 'express';
import type { ApiErrorResponse } from '@gathergrid/shared';

/**
 * Catch-all handler for routes that don't exist.
 * Returns a 404 in the standard error format.
 */
export function notFoundHandler(req: Request, res: Response): void {
  const response: ApiErrorResponse = {
    status: 'error',
    message: `Route not found: ${req.method} ${req.originalUrl}`,
    code: 'NOT_FOUND',
    requestId: String(req.id),
  };
  res.status(404).json(response);
}
