import { http, HttpResponse } from 'msw';
import { currentSession } from './auth.handlers';
import type { Review } from '@gathergrid/shared';

let reviewsStore: Review[] = [
  {
    id: 'rev-1',
    activityId: 'act-1',
    activityTitle: 'Sunset Beach Volleyball',
    organizerId: 'org-1',
    userId: 'user-2',
    userName: 'Daniel Craig',
    rating: 5,
    comment: 'Super well organized, friendly crowd and amazing sunset!',
    createdAt: '2026-10-02T20:00:00Z',
    updatedAt: '2026-10-02T20:00:00Z',
  },
];

export const reviewsHandlers = [
  http.get('*/api/v1/activities/:id/reviews', ({ params }) => {
    const list = reviewsStore.filter((r) => r.activityId === params.id);
    return HttpResponse.json({ status: 'ok', data: list });
  }),

  http.get('*/api/v1/organizers/:id/reviews', ({ params }) => {
    const list = reviewsStore.filter((r) => r.organizerId === params.id);
    return HttpResponse.json({ status: 'ok', data: list });
  }),

  http.post('*/api/v1/activities/:id/reviews', async ({ params, request }) => {
    if (!currentSession) return HttpResponse.json({ status: 'error', code: 'UNAUTHORIZED' }, { status: 401 });
    const body = (await request.json()) as any;
    const newRev: Review = {
      id: 'rev-' + Math.random().toString(36).slice(2, 8),
      activityId: params.id as string,
      activityTitle: 'Activity Review',
      organizerId: 'org-1',
      userId: currentSession.id,
      userName: currentSession.name,
      rating: body.rating,
      comment: body.comment,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    reviewsStore.unshift(newRev);
    return HttpResponse.json({ status: 'ok', data: newRev }, { status: 201 });
  }),
];

