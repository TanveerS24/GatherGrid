import { http, HttpResponse } from 'msw';
import { currentSession } from './auth.handlers';
import { ReportStatus, ReportTargetType } from '@gathergrid/shared';
import type { Report } from '@gathergrid/shared';

let reportsStore: Report[] = [];

export const reportsHandlers = [
  http.post('*/api/v1/reports', async ({ request }) => {
    if (!currentSession) return HttpResponse.json({ status: 'error', code: 'UNAUTHORIZED' }, { status: 401 });
    const body = (await request.json()) as any;
    const newReport: Report = {
      id: 'rep-' + Math.random().toString(36).slice(2, 8),
      targetType: body.targetType || ReportTargetType.ACTIVITY,
      targetId: body.targetId,
      reporterId: currentSession.id,
      reporterName: currentSession.name,
      reason: body.reason,
      status: ReportStatus.OPEN,
      createdAt: new Date().toISOString(),
    };
    reportsStore.unshift(newReport);
    return HttpResponse.json({ status: 'ok', data: newReport }, { status: 201 });
  }),

  http.get('*/api/v1/reports', () => {
    return HttpResponse.json({ status: 'ok', data: reportsStore });
  }),

  http.post('*/api/v1/reports/:id/resolve', async ({ params, request }) => {
    const body = (await request.json()) as any;
    const rep = reportsStore.find((r) => r.id === params.id);
    if (rep) {
      rep.status = body.resolution === 'dismissed' ? ReportStatus.DISMISSED : ReportStatus.RESOLVED;
      rep.adminNotes = body.notes;
    }
    return HttpResponse.json({ status: 'ok', data: rep });
  }),
];

