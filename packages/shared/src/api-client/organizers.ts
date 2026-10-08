import { request } from './client';
import type { OrganizerProfile, Activity } from '../schemas';

export const organizersApi = {
  getProfile: (id: string) =>
    request<OrganizerProfile>('/api/v1/organizers/' + id),

  getActivities: (id: string, status?: string) =>
    request<Activity[]>('/api/v1/organizers/' + id + '/activities' + (status ? '?status=' + status : '')),

  getStats: (activityId: string) =>
    request<{
      views: number;
      joins: number;
      confirmed: number;
      capacity: number;
      waitlistSize: number;
      cancellations: number;
      attendanceRate: number;
      averageRating: number;
    }>('/api/v1/activities/' + activityId + '/stats'),
};
