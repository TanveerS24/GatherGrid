import type { Request, Response } from 'express';
import { registrationsService } from './registrations.service.js';
import { AppError } from '../../common/errors/index.js';

export async function handleGetMyRegistrations(req: Request, res: Response): Promise<void> {
  if (!req.user) throw AppError.unauthorized();
  const status = req.query.status ? String(req.query.status) : undefined;
  const list = await registrationsService.getMyRegistrations(req.user.userId, status);
  res.status(200).json({ status: 'ok', data: list });
}

export async function handleRegisterActivity(req: Request, res: Response): Promise<void> {
  if (!req.user) throw AppError.unauthorized();
  const activityId = String(req.params.id || '');
  const { teamId, teamName } = req.body || {};
  const reg = await registrationsService.create(
    activityId,
    req.user.userId,
    req.body?.userName || 'Participant',
    req.body?.userEmail,
    req.body?.userAvatarUrl,
    teamId,
    teamName
  );
  res.status(201).json({ status: 'ok', data: reg });
}

export async function handleCancelRegistration(req: Request, res: Response): Promise<void> {
  if (!req.user) throw AppError.unauthorized();
  const registrationId = String(req.params.id || '');
  await registrationsService.cancel(registrationId, req.user.userId);
  res.status(200).json({ status: 'ok', data: { success: true } });
}
