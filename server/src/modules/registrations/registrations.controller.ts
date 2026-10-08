import type { Request, Response } from 'express';
import { registrationsService } from './registrations.service.js';
import { AppError } from '../../common/errors/index.js';

export async function handleGetMyRegistrations(req: Request, res: Response): Promise<void> {
  if (!req.user) throw AppError.unauthorized();
  const status = req.query.status ? String(req.query.status) : undefined;
  const list = registrationsService.getMyRegistrations(req.user.userId, status);
  res.status(200).json({ status: 'ok', data: list });
}

export async function handleRegisterActivity(req: Request, res: Response): Promise<void> {
  if (!req.user) throw AppError.unauthorized();
  const activityId = String(req.params.id || '');
  const reg = registrationsService.create(activityId, req.user.userId);
  res.status(201).json({ status: 'ok', data: reg });
}

export async function handleCancelRegistration(req: Request, res: Response): Promise<void> {
  if (!req.user) throw AppError.unauthorized();
  const registrationId = String(req.params.id || '');
  registrationsService.cancel(registrationId);
  res.status(200).json({ status: 'ok', data: { success: true } });
}
