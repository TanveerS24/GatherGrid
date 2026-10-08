import { http, HttpResponse } from 'msw';
import { currentSession } from './auth.handlers';
import { NotificationType } from '@gathergrid/shared';
import type { Notification } from '@gathergrid/shared';

let notificationsStore: Notification[] = [
  {
    id: 'notif-1',
    userId: 'user-part-1',
    type: NotificationType.REGISTRATION_CONFIRMED,
    title: 'Spot Confirmed! 🏐',
    message: 'Your registration for Sunset Beach Volleyball has been confirmed.',
    link: '/activity/act-1',
    isRead: false,
    createdAt: '2026-10-06T15:00:00Z',
  },
  {
    id: 'notif-2',
    userId: 'user-part-1',
    type: NotificationType.WAITLIST_OFFERED,
    title: 'A seat opened up! 🎟️',
    message: 'You have been offered a seat for Board Game Night. Confirm within 12 hours.',
    link: '/me/activities',
    isRead: false,
    createdAt: '2026-10-07T09:00:00Z',
  },
];

export const notificationsHandlers = [
  http.get('*/api/v1/notifications', () => {
    if (!currentSession) return HttpResponse.json({ status: 'error', code: 'UNAUTHORIZED' }, { status: 401 });
    return HttpResponse.json({ status: 'ok', data: notificationsStore });
  }),

  http.patch('*/api/v1/notifications/:id/read', ({ params }) => {
    const notif = notificationsStore.find((n) => n.id === params.id);
    if (notif) notif.isRead = true;
    return HttpResponse.json({ status: 'ok', data: { success: true } });
  }),

  http.post('*/api/v1/notifications/read-all', () => {
    notificationsStore.forEach((n) => { n.isRead = true; });
    return HttpResponse.json({ status: 'ok', data: { count: notificationsStore.length } });
  }),
];

