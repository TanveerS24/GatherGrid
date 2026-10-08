import { http, HttpResponse } from 'msw';
import { mockOrganizers } from '../fixtures/organizers';
import { mockActivities } from '../fixtures/activities';

export const organizersHandlers = [
  http.get('*/api/v1/organizers/:id', ({ params }) => {
    const org = mockOrganizers.find((o) => o.id === params.id) || mockOrganizers[0];
    return HttpResponse.json({ status: 'ok', data: org });
  }),

  http.get('*/api/v1/organizers/:id/activities', ({ params }) => {
    const list = mockActivities.filter((a) => a.organizerId === params.id);
    return HttpResponse.json({ status: 'ok', data: list });
  }),

  http.get('*/api/v1/activities/:id/stats', () => {
    return HttpResponse.json({
      status: 'ok',
      data: {
        views: 248,
        joins: 32,
        confirmed: 20,
        capacity: 20,
        waitlistSize: 6,
        cancellations: 2,
        attendanceRate: 92,
        averageRating: 4.8,
      },
    });
  }),
];

