import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import request from 'supertest';
import { UserRole, ActivityFormat, JoinMode } from '@gathergrid/shared';
import { createApp } from '../../../app.js';
import { connectTestDatabase, clearTestDatabase, disconnectTestDatabase } from '../../helpers/dbHelper.js';
import { createTestUser, getAuthHeader } from '../../helpers/authHelper.js';
import { createTestActivity } from '../../helpers/factories.js';

describe('Activities CRUD & Management (Integration)', () => {
  const app = createApp();

  beforeAll(async () => {
    await connectTestDatabase();
  });

  beforeEach(async () => {
    await clearTestDatabase();
  });

  afterAll(async () => {
    await disconnectTestDatabase();
  });

  it('creates a new activity successfully with organizer credentials', async () => {
    const organizer = await createTestUser({ role: UserRole.ORGANIZER, name: 'Coach Carter' });
    const headers = getAuthHeader(organizer._id.toString(), UserRole.ORGANIZER);

    const payload = {
      title: 'Sunset Beach Volleyball',
      categorySlug: 'sports',
      categoryLabel: 'Sports & Fitness',
      shortDescription: 'Intermediate pickup volleyball.',
      fullDescription: 'Bring water and sunscreen.',
      format: ActivityFormat.IN_PERSON,
      locationName: 'Santa Monica Beach Pier',
      lat: 34.01,
      lng: -118.49,
      startDateTime: '2026-10-20T17:00:00Z',
      endDateTime: '2026-10-20T19:00:00Z',
      capacity: 12,
      joinMode: JoinMode.INSTANT,
      waitlistEnabled: true,
      costInfo: 'Free',
    };

    const res = await request(app).post('/api/v1/activities').set(headers).send(payload);

    expect(res.status).toBe(201);
    expect(res.body.data.title).toBe('Sunset Beach Volleyball');
    expect(res.body.data.id).toMatch(/^act-/);
    expect(res.body.data.registeredCount).toBe(0);
    expect(res.body.data.organizerName).toBeDefined();
  });

  it('retrieves an existing activity by ID', async () => {
    const user = await createTestUser();
    const headers = getAuthHeader(user._id.toString());
    const activity = await createTestActivity({ title: 'Urban Photography Walk' });

    const res = await request(app).get(`/api/v1/activities/${activity.id}`).set(headers);

    expect(res.status).toBe(200);
    expect(res.body.data.title).toBe('Urban Photography Walk');
    expect(res.body.data.id).toBe(activity.id);
  });

  it('returns 404 Not Found for non-existent activity ID', async () => {
    const user = await createTestUser();
    const headers = getAuthHeader(user._id.toString());

    const res = await request(app).get('/api/v1/activities/act-nonexistent').set(headers);
    expect(res.status).toBe(404);
  });
});
