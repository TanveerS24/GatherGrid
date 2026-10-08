import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest';
import { ApiError } from './client';
import { authApi } from './auth';
import { activitiesApi } from './activities';
import { server } from '../../../../mocks/server';
import { setMockSession } from '../../../../mocks/handlers/auth.handlers';
import { mockUsers } from '../../../../mocks/fixtures/users';

beforeAll(() => server.listen());
afterEach(() => {
  server.resetHandlers();
  setMockSession(mockUsers.participant);
});
afterAll(() => server.close());

describe('API Client & MSW Mock Enforcement', () => {
  it('instantiates ApiError with status and code', () => {
    const error = new ApiError({
      status: 401,
      code: 'UNAUTHORIZED',
      message: 'You must be logged in',
      requestId: 'test-req',
    });

    expect(error.status).toBe(401);
    expect(error.code).toBe('UNAUTHORIZED');
    expect(error.message).toBe('You must be logged in');
  });

  it('fetches current user profile when session is active', async () => {
    setMockSession(mockUsers.participant);
    const user = await authApi.me();
    expect(user.email).toBe('participant@gathergrid.com');
  });

  it('enforces mandatory authentication on activities browse (ADR 007)', async () => {
    // Clear session to simulate unauthenticated visitor
    setMockSession(null);

    await expect(activitiesApi.list()).rejects.toThrow();
  });

  it('allows browsing activities when authenticated', async () => {
    setMockSession(mockUsers.participant);
    const response = await activitiesApi.list();
    expect(response.data.length).toBeGreaterThan(0);
    expect(response.pagination.total).toBeGreaterThan(0);
  });
});
