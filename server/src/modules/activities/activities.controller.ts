import type { Request, Response } from 'express';
import { activitiesService } from './activities.service.js';
import { AppError } from '../../common/errors/index.js';

export async function handleListActivities(req: Request, res: Response): Promise<void> {
  const result = activitiesService.list({
    query: req.query.query ? String(req.query.query) : undefined,
    category: req.query.category ? String(req.query.category) : undefined,
    format: req.query.format ? String(req.query.format) : undefined,
    isFree: req.query.isFree ? String(req.query.isFree) : undefined,
    page: req.query.page ? Number(req.query.page) : 1,
    limit: req.query.limit ? Number(req.query.limit) : 20,
  });
  res.status(200).json({ status: 'ok', data: result });
}

export async function handleGetActivity(req: Request, res: Response): Promise<void> {
  const id = String(req.params.id || '');
  const activity = activitiesService.getById(id);
  if (!activity) {
    throw AppError.notFound('Activity not found');
  }
  res.status(200).json({ status: 'ok', data: activity });
}

export async function handleCreateActivity(req: Request, res: Response): Promise<void> {
  if (!req.user) throw AppError.unauthorized();
  const created = activitiesService.create(req.body, req.user.userId, 'Host Organizer');
  res.status(201).json({ status: 'ok', data: created });
}
