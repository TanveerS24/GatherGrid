import { request } from './client';
import type { Report } from '../schemas';

export const reportsApi = {
  create: (data: { targetType: string; targetId: string; reason: string }) =>
    request<Report>('/api/v1/reports', { method: 'POST', body: JSON.stringify(data) }),

  list: (status?: string) =>
    request<Report[]>('/api/v1/reports' + (status ? '?status=' + status : '')),

  resolve: (id: string, resolution: 'resolved' | 'dismissed', notes?: string) =>
    request<Report>('/api/v1/reports/' + id + '/resolve', {
      method: 'POST',
      body: JSON.stringify({ resolution, notes }),
    }),
};
