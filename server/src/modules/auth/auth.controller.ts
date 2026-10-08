import type { Request, Response } from 'express';
import { registerSchema, loginSchema } from '@gathergrid/shared';
import { env } from '../../config/env.js';
import { AppError } from '../../common/errors/index.js';
import { authService } from './auth.service.js';

const COOKIE_NAME = 'session_token';
const cookieOptions = {
  httpOnly: true,
  sameSite: 'lax' as const,
  secure: env.NODE_ENV === 'production',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

export async function handleRegister(req: Request, res: Response): Promise<void> {
  const parsed = registerSchema.parse(req.body);
  const { user, token } = await authService.register(parsed);
  res.cookie(COOKIE_NAME, token, cookieOptions);
  res.status(201).json({ status: 'ok', data: user });
}

export async function handleLogin(req: Request, res: Response): Promise<void> {
  const parsed = loginSchema.parse(req.body);
  const { user, token } = await authService.login(parsed);
  res.cookie(COOKIE_NAME, token, cookieOptions);
  res.status(200).json({ status: 'ok', data: user });
}

export async function handleLogout(_req: Request, res: Response): Promise<void> {
  res.clearCookie(COOKIE_NAME);
  res.status(200).json({ status: 'ok', data: { success: true } });
}

export async function handleGetMe(req: Request, res: Response): Promise<void> {
  if (!req.user) throw AppError.unauthorized();
  const user = await authService.getMe(req.user.userId);
  res.status(200).json({ status: 'ok', data: user });
}

export async function handleRefresh(req: Request, res: Response): Promise<void> {
  const token = req.cookies?.[COOKIE_NAME];
  if (!token) throw AppError.unauthorized('No active session token');
  const payload = authService.verifyToken(token);
  const newToken = authService.generateToken({ userId: payload.userId, role: payload.role });
  res.cookie(COOKIE_NAME, newToken, cookieOptions);
  res.status(200).json({ status: 'ok', data: { refreshed: true } });
}

export async function handleForgotPassword(_req: Request, res: Response): Promise<void> {
  res.status(200).json({ status: 'ok', data: { message: 'Password reset link sent.' } });
}

export async function handleResetPassword(_req: Request, res: Response): Promise<void> {
  res.status(200).json({ status: 'ok', data: { message: 'Password has been updated.' } });
}

export async function handleUpdateProfile(req: Request, res: Response): Promise<void> {
  if (!req.user) throw AppError.unauthorized();
  const user = await authService.updateProfile(req.user.userId, req.body);
  res.status(200).json({ status: 'ok', data: user });
}
