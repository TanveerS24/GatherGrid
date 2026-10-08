import { http, HttpResponse } from 'msw';
import { currentSession } from './auth.handlers';
import { RegistrationStatus } from '@gathergrid/shared';
import type { Registration } from '@gathergrid/shared';

let registrationsStore: Registration[] = [
  {
    id: 'reg-1',
    activityId: 'act-1',
    userId: 'user-part-1',
    userName: 'Maya Lin',
    status: RegistrationStatus.CONFIRMED,
    appliedAt: '2026-10-05T14:00:00Z',
    confirmedAt: '2026-10-05T14:00:00Z',
  },
  {
    id: 'reg-2',
    activityId: 'act-3',
    userId: 'user-part-1',
    userName: 'Maya Lin',
    status: RegistrationStatus.WAITLISTED,
    waitlistPosition: 1,
    appliedAt: '2026-10-06T10:00:00Z',
  },
];

export const registrationsHandlers = [
  http.get('*/api/v1/registrations/me', ({ request }) => {
    if (!currentSession) {
      return HttpResponse.json({ status: 'error', code: 'UNAUTHORIZED' }, { status: 401 });
    }
    const url = new URL(request.url);
    const status = url.searchParams.get('status');
    let list = registrationsStore.filter((r) => r.userId === currentSession!.id);
    if (status) {
      list = list.filter((r) => r.status === status);
    }
    return HttpResponse.json({ status: 'ok', data: list });
  }),

  http.post('*/api/v1/activities/:id/registrations', async ({ params, request }) => {
    if (!currentSession) {
      return HttpResponse.json({ status: 'error', code: 'UNAUTHORIZED' }, { status: 401 });
    }
    const body = (await request.json().catch(() => ({}))) as any;
    const newReg: Registration = {
      id: 'reg-' + Math.random().toString(36).slice(2, 8),
      activityId: params.id as string,
      userId: currentSession.id,
      userName: currentSession.name,
      userAvatar: currentSession.avatarUrl,
      status: RegistrationStatus.CONFIRMED,
      teamId: body?.teamId,
      appliedAt: new Date().toISOString(),
      confirmedAt: new Date().toISOString(),
    };
    registrationsStore.unshift(newReg);
    return HttpResponse.json({ status: 'ok', data: newReg }, { status: 201 });
  }),

  http.post('*/api/v1/registrations/:id/cancel', ({ params }) => {
    const reg = registrationsStore.find((r) => r.id === params.id);
    if (reg) reg.status = RegistrationStatus.CANCELLED;
    return HttpResponse.json({ status: 'ok', data: { success: true } });
  }),

  http.post('*/api/v1/registrations/:id/confirm-offer', ({ params }) => {
    const reg = registrationsStore.find((r) => r.id === params.id);
    if (reg) {
      reg.status = RegistrationStatus.CONFIRMED;
      reg.confirmedAt = new Date().toISOString();
    }
    return HttpResponse.json({ status: 'ok', data: reg });
  }),

  http.get('*/api/v1/activities/:id/applicants', ({ params, request }) => {
    const list = registrationsStore.filter((r) => r.activityId === params.id);
    return HttpResponse.json({ status: 'ok', data: list });
  }),

  http.patch('*/api/v1/registrations/:id/status', async ({ params, request }) => {
    const body = (await request.json()) as any;
    const reg = registrationsStore.find((r) => r.id === params.id);
    if (reg) reg.status = body.status;
    return HttpResponse.json({ status: 'ok', data: reg });
  }),

  http.post('*/api/v1/activities/:id/attendance', async ({ request }) => {
    const body = (await request.json()) as any;
    return HttpResponse.json({ status: 'ok', data: { updated: body?.records?.length || 0 } });
  }),
];

