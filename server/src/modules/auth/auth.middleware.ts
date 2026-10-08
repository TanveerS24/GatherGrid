import type { Request, Response, NextFunction } from 'express';
import { AppError } from '../../common/errors/index.js';
import { authService, type TokenPayload } from './auth.service.js';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}

export function authenticate(req: Request, _res: Response, next: NextFunction): void {
  const token =
    req.cookies?.session_token ||
    (req.headers.authorization?.startsWith('Bearer ')
      ? req.headers.authorization.slice(7)
      : null);

  if (!token) {
    throw AppError.unauthorized('Authentication is mandatory to continue');
  }

  const payload = authService.verifyToken(token);
  req.user = payload;
  next();
}
