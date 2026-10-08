import { request } from './client';
import type { Review } from '../schemas';

export const reviewsApi = {
  create: (activityId: string, data: { rating: number; comment?: string }) =>
    request<Review>('/api/v1/activities/' + activityId + '/reviews', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  listByActivity: (activityId: string) =>
    request<Review[]>('/api/v1/activities/' + activityId + '/reviews'),

  listByOrganizer: (organizerId: string) =>
    request<Review[]>('/api/v1/organizers/' + organizerId + '/reviews'),
};
