import { request } from './client';
import type { Team, SoloPoolParticipant } from '../schemas';

export const teamsApi = {
  listByActivity: (activityId: string) =>
    request<Team[]>('/api/v1/activities/' + activityId + '/teams'),

  create: (activityId: string, data: { name: string; description?: string }) =>
    request<Team>('/api/v1/activities/' + activityId + '/teams', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  joinWithCode: (code: string) =>
    request<Team>('/api/v1/teams/join-code', { method: 'POST', body: JSON.stringify({ code }) }),

  leave: (teamId: string) =>
    request<{ success: boolean }>('/api/v1/teams/' + teamId + '/leave', { method: 'POST' }),

  disband: (teamId: string) =>
    request<{ success: boolean }>('/api/v1/teams/' + teamId, { method: 'DELETE' }),

  transferLeadership: (teamId: string, newLeaderId: string) =>
    request<Team>('/api/v1/teams/' + teamId + '/transfer-leadership', {
      method: 'POST',
      body: JSON.stringify({ newLeaderId }),
    }),

  getSoloPool: (activityId: string) =>
    request<SoloPoolParticipant[]>('/api/v1/activities/' + activityId + '/solo-pool'),

  toggleSoloPool: (activityId: string, optIn: boolean) =>
    request<{ optedIn: boolean }>('/api/v1/activities/' + activityId + '/solo-pool', {
      method: 'POST',
      body: JSON.stringify({ optIn }),
    }),
};
