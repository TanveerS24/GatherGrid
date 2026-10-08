import { request } from './client';
import type { Notification } from '../schemas';

export const notificationsApi = {
  list: () =>
    request<Notification[]>('/api/v1/notifications'),

  markRead: (id: string) =>
    request<{ success: boolean }>('/api/v1/notifications/' + id + '/read', { method: 'PATCH' }),

  markAllRead: () =>
    request<{ count: number }>('/api/v1/notifications/read-all', { method: 'POST' }),
};
