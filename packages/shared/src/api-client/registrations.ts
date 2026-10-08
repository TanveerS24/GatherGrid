import { request } from './client';
import type { Registration } from '../schemas';

export const registrationsApi = {
  join: (activityId: string, teamId?: string) =>
    request<Registration>('/api/v1/activities/' + activityId + '/registrations', {
      method: 'POST',
      body: JSON.stringify({ teamId }),
    }),

  cancel: (registrationId: string) =>
    request<{ success: boolean }>('/api/v1/registrations/' + registrationId + '/cancel', { method: 'POST' }),

  confirmOffer: (registrationId: string) =>
    request<Registration>('/api/v1/registrations/' + registrationId + '/confirm-offer', { method: 'POST' }),

  myRegistrations: (status?: string) =>
    request<Registration[]>('/api/v1/registrations/me' + (status ? '?status=' + status : '')),

  listByActivity: (activityId: string, status?: string) =>
    request<Registration[]>('/api/v1/activities/' + activityId + '/applicants' + (status ? '?status=' + status : '')),

  updateStatus: (registrationId: string, status: string, message?: string) =>
    request<Registration>('/api/v1/registrations/' + registrationId + '/status', {
      method: 'PATCH',
      body: JSON.stringify({ status, message }),
    }),

  recordAttendance: (activityId: string, records: { userId: string; attended: boolean }[]) =>
    request<{ updated: number }>('/api/v1/activities/' + activityId + '/attendance', {
      method: 'POST',
      body: JSON.stringify({ records }),
    }),
};
