import type { Request, Response } from 'express';
import { geoService } from './geo.service.js';

export async function handleSuggest(req: Request, res: Response): Promise<void> {
  const q = String(req.query.q || '');
  const data = await geoService.suggest(q);
  res.status(200).json({ status: 'ok', data });
}

export async function handleReverse(req: Request, res: Response): Promise<void> {
  const lat = parseFloat(String(req.query.lat || '37.7749'));
  const lng = parseFloat(String(req.query.lng || '-122.4194'));
  const data = await geoService.reverse(lat, lng);
  res.status(200).json({ status: 'ok', data });
}
