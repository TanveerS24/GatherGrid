import { http, HttpResponse } from 'msw';
import { mockActivities } from '../fixtures/activities';
import { currentSession } from './auth.handlers';
import type { Activity } from '@gathergrid/shared';

let activitiesStore: Activity[] = [...mockActivities];

export const activitiesHandlers = [
  // Mandatory login check on browsing activities (ADR 007)
  http.get('*/api/v1/activities', ({ request }) => {
    if (!currentSession) {
      return HttpResponse.json(
        {
          status: 'error',
          code: 'UNAUTHORIZED',
          message: 'Every user must be logged in to browse activities.',
        },
        { status: 401 }
      );
    }

    const url = new URL(request.url);
    const category = url.searchParams.get('category');
    const query = url.searchParams.get('query')?.toLowerCase();
    const isFree = url.searchParams.get('isFree');
    const format = url.searchParams.get('format');
    const page = Number(url.searchParams.get('page') || 1);
    const limit = Number(url.searchParams.get('limit') || 20);

    let filtered = [...activitiesStore];
    if (category) {
      filtered = filtered.filter((a) => a.categorySlug === category);
    }
    if (query) {
      filtered = filtered.filter(
        (a) => a.title.toLowerCase().includes(query) || a.shortDescription.toLowerCase().includes(query)
      );
    }
    if (isFree === 'true') {
      filtered = filtered.filter((a) => a.costInfo?.toLowerCase().includes('free'));
    }
    if (format) {
      filtered = filtered.filter((a) => a.format === format);
    }

    const start = (page - 1) * limit;
    const paginated = filtered.slice(start, start + limit);

    return HttpResponse.json({
      status: 'ok',
      data: {
        data: paginated,
        pagination: {
          page,
          limit,
          total: filtered.length,
          totalPages: Math.ceil(filtered.length / limit) || 1,
          hasNext: start + limit < filtered.length,
          hasPrev: page > 1,
        },
      },
    });
  }),

  http.get('*/api/v1/activities/:id', ({ params }) => {
    if (!currentSession) {
      return HttpResponse.json(
        { status: 'error', code: 'UNAUTHORIZED', message: 'Login mandatory to view activity details.' },
        { status: 401 }
      );
    }

    const activity = activitiesStore.find((a) => a.id === params.id);
    if (!activity) {
      return HttpResponse.json({ status: 'error', code: 'NOT_FOUND', message: 'Activity not found' }, { status: 404 });
    }
    return HttpResponse.json({ status: 'ok', data: activity });
  }),

  http.post('*/api/v1/activities', async ({ request }) => {
    if (!currentSession) {
      return HttpResponse.json({ status: 'error', code: 'UNAUTHORIZED' }, { status: 401 });
    }
    const body = (await request.json()) as any;
    const newAct: Activity = {
      ...body,
      id: 'act-' + Math.random().toString(36).slice(2, 8),
      registeredCount: 0,
      waitlistCount: 0,
      createdAt: new Date().toISOString(),
      organizerId: currentSession.id,
      organizerName: currentSession.name,
      organizerBadge: 'new',
    };
    activitiesStore.unshift(newAct);
    return HttpResponse.json({ status: 'ok', data: newAct }, { status: 201 });
  }),

  http.post('*/api/v1/activities/:id/cancel', async ({ params, request }) => {
    const act = activitiesStore.find((a) => a.id === params.id);
    if (!act) return HttpResponse.json({ status: 'error', code: 'NOT_FOUND' }, { status: 404 });
    (act as any).status = 'cancelled';
    return HttpResponse.json({ status: 'ok', data: act });
  }),

  http.post('*/api/v1/activities/:id/postpone', async ({ params, request }) => {
    const body = (await request.json()) as any;
    const act = activitiesStore.find((a) => a.id === params.id);
    if (!act) return HttpResponse.json({ status: 'error', code: 'NOT_FOUND' }, { status: 404 });
    (act as any).status = 'postponed';
    act.startDateTime = body.newStartDateTime;
    act.endDateTime = body.newEndDateTime;
    return HttpResponse.json({ status: 'ok', data: act });
  }),

  http.post('*/api/v1/activities/:id/repost', async ({ params, request }) => {
    const body = (await request.json()) as any;
    const act = activitiesStore.find((a) => a.id === params.id);
    if (!act) return HttpResponse.json({ status: 'error', code: 'NOT_FOUND' }, { status: 404 });
    const clone: Activity = {
      ...act,
      id: 'act-' + Math.random().toString(36).slice(2, 8),
      startDateTime: body.newStartDateTime,
      endDateTime: body.newEndDateTime,
      registeredCount: 0,
      waitlistCount: 0,
      status: 'published' as any,
    };
    activitiesStore.unshift(clone);
    return HttpResponse.json({ status: 'ok', data: clone });
  }),
];

