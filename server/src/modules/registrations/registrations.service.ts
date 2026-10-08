import type { Registration } from '@gathergrid/shared';
import { RegistrationStatus } from '@gathergrid/shared';

const userRegistrations: Registration[] = [
  {
    id: 'reg-1',
    activityId: 'act-1',
    userId: 'user-demo',
    userName: 'Explorer',
    status: RegistrationStatus.CONFIRMED,
    appliedAt: '2026-10-05T14:00:00Z',
    confirmedAt: '2026-10-05T14:00:00Z',
  },
  {
    id: 'reg-2',
    activityId: 'act-3',
    userId: 'user-demo',
    userName: 'Explorer',
    status: RegistrationStatus.WAITLISTED,
    waitlistPosition: 1,
    appliedAt: '2026-10-06T10:00:00Z',
  },
];

export const registrationsService = {
  getMyRegistrations: (_userId: string, status?: string) => {
    let list = [...userRegistrations];
    if (status) list = list.filter((r) => r.status === status);
    return list;
  },

  create: (activityId: string, userId: string, userName?: string) => {
    const reg: Registration = {
      id: 'reg-' + Math.random().toString(36).slice(2, 9),
      activityId,
      userId,
      userName: userName || 'Participant',
      status: RegistrationStatus.CONFIRMED,
      appliedAt: new Date().toISOString(),
      confirmedAt: new Date().toISOString(),
    };
    userRegistrations.unshift(reg);
    return reg;
  },

  cancel: (regId: string) => {
    const found = userRegistrations.find((r) => r.id === regId);
    if (found) found.status = RegistrationStatus.CANCELLED;
    return true;
  },
};
