import { http, HttpResponse } from 'msw';
import { mockUsers } from '../fixtures/users';
import type { AuthUser } from '@gathergrid/shared';

// In-memory mock session state (default to demo participant logged in for instant preview, can be logged out)
export let currentSession: AuthUser | null = mockUsers.participant;

export function setMockSession(user: AuthUser | null) {
  currentSession = user;
}

export const authHandlers = [
  http.post('*/api/v1/auth/login', async ({ request }) => {
    const body = (await request.json()) as any;
    const email = body?.email || '';

    let user: AuthUser;
    if (email.includes('admin')) {
      user = mockUsers.admin;
    } else if (email.includes('organizer')) {
      user = mockUsers.organizer;
    } else {
      user = {
        ...mockUsers.participant,
        email,
        name: email.split('@')[0] || 'Participant',
      };
    }

    currentSession = user;
    return HttpResponse.json({ status: 'ok', data: user });
  }),

  http.post('*/api/v1/auth/register', async ({ request }) => {
    const body = (await request.json()) as any;
    const user: AuthUser = {
      id: 'user-' + Math.random().toString(36).slice(2, 9),
      name: body.name || 'New User',
      email: body.email,
      role: body.role || 'participant',
      isVerified: false,
      interests: [],
      defaultRadiusKm: 25,
    };
    currentSession = user;
    return HttpResponse.json({ status: 'ok', data: user });
  }),

  http.post('*/api/v1/auth/logout', () => {
    currentSession = null;
    return HttpResponse.json({ status: 'ok', data: { success: true } });
  }),

  http.get('*/api/v1/auth/me', () => {
    if (!currentSession) {
      return HttpResponse.json(
        { status: 'error', code: 'UNAUTHORIZED', message: 'Not authenticated' },
        { status: 401 }
      );
    }
    return HttpResponse.json({ status: 'ok', data: currentSession });
  }),

  http.post('*/api/v1/auth/refresh', () => {
    if (!currentSession) {
      return HttpResponse.json(
        { status: 'error', code: 'UNAUTHORIZED', message: 'No active session' },
        { status: 401 }
      );
    }
    return HttpResponse.json({ status: 'ok', data: { refreshed: true } });
  }),

  http.post('*/api/v1/auth/forgot-password', () => {
    return HttpResponse.json({ status: 'ok', data: { message: 'Password reset link sent.' } });
  }),

  http.post('*/api/v1/auth/reset-password', () => {
    return HttpResponse.json({ status: 'ok', data: { message: 'Password has been updated.' } });
  }),

  http.patch('*/api/v1/auth/profile', async ({ request }) => {
    if (!currentSession) {
      return HttpResponse.json({ status: 'error', code: 'UNAUTHORIZED' }, { status: 401 });
    }
    const body = (await request.json()) as any;
    currentSession = { ...currentSession, ...body };
    return HttpResponse.json({ status: 'ok', data: currentSession });
  }),
];

