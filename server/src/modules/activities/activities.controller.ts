import type { Request, Response } from 'express';
import { activitiesService } from './activities.service.js';
import { registrationsService } from '../registrations/registrations.service.js';
import { AppError } from '../../common/errors/index.js';
import type { RegistrationStatus } from '@gathergrid/shared';

export async function handleListActivities(req: Request, res: Response): Promise<void> {
  const result = await activitiesService.list({
    query: req.query.query ? String(req.query.query) : undefined,
    category: req.query.category ? String(req.query.category) : undefined,
    format: req.query.format ? String(req.query.format) : undefined,
    isFree: req.query.isFree ? String(req.query.isFree) : undefined,
    organizerId: req.query.organizerId ? String(req.query.organizerId) : undefined,
    status: req.query.status ? String(req.query.status) : undefined,
    page: req.query.page ? Number(req.query.page) : 1,
    limit: req.query.limit ? Number(req.query.limit) : 50,
  });
  res.status(200).json({ status: 'ok', data: result });
}

export async function handleGetActivity(req: Request, res: Response): Promise<void> {
  const id = String(req.params.id || '');
  const activity = await activitiesService.getById(id);
  if (!activity) {
    throw AppError.notFound('Activity not found');
  }
  res.status(200).json({ status: 'ok', data: activity });
}

export async function handleCreateActivity(req: Request, res: Response): Promise<void> {
  if (!req.user) throw AppError.unauthorized();
  const created = await activitiesService.create(req.body, req.user.userId, 'Host Organizer');
  res.status(201).json({ status: 'ok', data: created });
}

export async function handleGetActivityRegistrations(req: Request, res: Response): Promise<void> {
  const activityId = String(req.params.id || '');
  const registrations = await registrationsService.getActivityRegistrations(activityId);
  res.status(200).json({ status: 'ok', data: registrations });
}

export async function handleGetActivityTeams(req: Request, res: Response): Promise<void> {
  const activityId = String(req.params.id || '');
  const teams = await activitiesService.getTeams(activityId);
  res.status(200).json({ status: 'ok', data: teams });
}

export async function handleCreateActivityTeam(req: Request, res: Response): Promise<void> {
  if (!req.user) throw AppError.unauthorized();
  const activityId = String(req.params.id || '');
  const { name, description, lookingFor, maxMembers, avatarUrl } = req.body;
  if (!name) throw AppError.badRequest('Team name is required');
  const team = await activitiesService.createTeam(
    activityId,
    { name, description, lookingFor, maxMembers },
    req.user.userId,
    req.body.userName || 'Team Lead',
    avatarUrl
  );
  res.status(201).json({ status: 'ok', data: team });
}

export async function handleJoinActivityTeam(req: Request, res: Response): Promise<void> {
  if (!req.user) throw AppError.unauthorized();
  const teamId = String(req.params.teamId || '');
  const { role, avatarUrl, userName } = req.body;
  const team = await activitiesService.joinTeam(
    teamId,
    req.user.userId,
    userName || 'Team Member',
    role,
    avatarUrl
  );
  if (!team) throw AppError.notFound('Team not found');
  res.status(200).json({ status: 'ok', data: team });
}

export async function handleGetOrganizerProfile(req: Request, res: Response): Promise<void> {
  const id = String(req.params.id || '');
  const profile = await activitiesService.getOrganizerProfile(id);
  if (!profile) throw AppError.notFound('Organizer profile not found');
  res.status(200).json({ status: 'ok', data: profile });
}

export async function handleUpdateRegistrationStatus(req: Request, res: Response): Promise<void> {
  const regId = String(req.params.regId || '');
  const status = req.body.status as RegistrationStatus;
  const updated = await registrationsService.updateStatus(regId, status);
  if (!updated) throw AppError.notFound('Registration not found');
  res.status(200).json({ status: 'ok', data: updated });
}
