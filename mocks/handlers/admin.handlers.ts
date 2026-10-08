import { http, HttpResponse } from 'msw';

export const adminHandlers = [
  http.get('*/api/v1/admin/audit-logs', () => {
    return HttpResponse.json({
      status: 'ok',
      data: [
        {
          id: 'log-1',
          adminId: 'user-admin-1',
          adminName: 'Sarah Connor',
          action: 'activity_hidden',
          target: 'act-99',
          details: 'Report threshold exceeded',
          timestamp: '2026-10-06T11:00:00Z',
        },
      ],
    });
  }),

  http.get('*/api/v1/admin/categories', () => {
    return HttpResponse.json({
      status: 'ok',
      data: [
        { id: 'cat-1', slug: 'sports', label: 'Sports', emoji: '⚽', color: '#16A34A', enabled: true, order: 1 },
        { id: 'cat-2', slug: 'hackathons', label: 'Hackathons', emoji: '💻', color: '#FF6B4A', enabled: true, order: 2 },
        { id: 'cat-3', slug: 'workshops', label: 'Workshops', emoji: '🛠️', color: '#0284C7', enabled: true, order: 3 },
      ],
    });
  }),

  http.post('*/api/v1/admin/users/:id/suspend', async ({ request }) => {
    const body = (await request.json()) as any;
    return HttpResponse.json({ status: 'ok', data: { suspended: body.suspend } });
  }),

  http.post('*/api/v1/admin/activities/:id/moderate', () => {
    return HttpResponse.json({ status: 'ok', data: { success: true } });
  }),
];

