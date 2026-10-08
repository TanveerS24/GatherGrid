import { request } from './client';
import type { Activity, ActivityFilterParams } from '../schemas';
import type { PaginatedResponse } from '../types';

export const activitiesApi = {
  list: (params: Partial<ActivityFilterParams> = {}) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') query.append(k, String(v));
    });
    return request<PaginatedResponse<Activity>>('/api/v1/activities?' + query.toString());
  },

  getById: (id: string) =>
    request<Activity>('/api/v1/activities/' + id),

  create: (data: Partial<Activity>) =>
    request<Activity>('/api/v1/activities', { method: 'POST', body: JSON.stringify(data) }),

  update: (id: string, data: Partial<Activity>) =>
    request<Activity>('/api/v1/activities/' + id, { method: 'PATCH', body: JSON.stringify(data) }),

  cancel: (id: string, reason: string) =>
    request<Activity>('/api/v1/activities/' + id + '/cancel', { method: 'POST', body: JSON.stringify({ reason }) }),

  postpone: (id: string, newStartDateTime: string, newEndDateTime: string) =>
    request<Activity>('/api/v1/activities/' + id + '/postpone', {
      method: 'POST',
      body: JSON.stringify({ newStartDateTime, newEndDateTime }),
    }),

  repost: (id: string, data: { newStartDateTime: string; newEndDateTime: string; notifyPreviousParticipants: boolean }) =>
    request<Activity>('/api/v1/activities/' + id + '/repost', { method: 'POST', body: JSON.stringify(data) }),
};
