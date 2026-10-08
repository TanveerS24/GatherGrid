import { request } from './client';
import type { AuditLog, CategoryAdmin } from '../schemas';

export const adminApi = {
  getAuditLogs: () =>
    request<AuditLog[]>('/api/v1/admin/audit-logs'),

  getCategories: () =>
    request<CategoryAdmin[]>('/api/v1/admin/categories'),

  updateCategory: (id: string, data: Partial<CategoryAdmin>) =>
    request<CategoryAdmin>('/api/v1/admin/categories/' + id, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  toggleUserSuspension: (userId: string, suspend: boolean) =>
    request<{ suspended: boolean }>('/api/v1/admin/users/' + userId + '/suspend', {
      method: 'POST',
      body: JSON.stringify({ suspend }),
    }),

  moderateActivity: (activityId: string, action: 'hide' | 'remove', reason: string) =>
    request<{ success: boolean }>('/api/v1/admin/activities/' + activityId + '/moderate', {
      method: 'POST',
      body: JSON.stringify({ action, reason }),
    }),
};
