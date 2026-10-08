import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import request from 'supertest';
import { RegistrationStatus } from '@gathergrid/shared';
import { createApp } from '../../../app.js';
import { connectTestDatabase, clearTestDatabase, disconnectTestDatabase } from '../../helpers/dbHelper.js';
import { createTestUser, getAuthHeader } from '../../helpers/authHelper.js';
import { createTestActivity } from '../../helpers/factories.js';
import { ActivityModel } from '../../../modules/activities/activity.model.js';

describe('Registration Flow & Capacity Tracking (Integration)', () => {
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

  it('registers participant for an open activity and increments registeredCount', async () => {
    const user = await createTestUser({ name: 'Alex' });
    const headers = getAuthHeader(user._id.toString());
    const activity = await createTestActivity({ id: 'act-flow-1', capacity: 10, registeredCount: 0 });

    const res = await request(app)
      .post(`/api/v1/activities/${activity.id}/registrations`)
      .set(headers);

    expect(res.status).toBe(201);
    expect(res.body.data.status).toBe(RegistrationStatus.CONFIRMED);
    expect(res.body.data.userId).toBe(user._id.toString());

    // Check activity counter incremented
    const updated = await ActivityModel.findOne({ id: activity.id });
    expect(updated?.registeredCount).toBe(1);
  });

  it('places participant on waitlist when activity is at full capacity', async () => {
    const user = await createTestUser({ name: 'Charlie' });
    const headers = getAuthHeader(user._id.toString());
    const activity = await createTestActivity({
      id: 'act-full',
      capacity: 1,
      registeredCount: 1,
      waitlistEnabled: true,
      waitlistCount: 0,
    });

    const res = await request(app)
      .post(`/api/v1/activities/${activity.id}/registrations`)
      .set(headers);

    expect(res.status).toBe(201);
    expect(res.body.data.status).toBe(RegistrationStatus.WAITLISTED);
    expect(res.body.data.waitlistPosition).toBe(1);

    const updated = await ActivityModel.findOne({ id: activity.id });
    expect(updated?.waitlistCount).toBe(1);
  });

  it('is idempotent on duplicate submission from the same user', async () => {
    const user = await createTestUser();
    const headers = getAuthHeader(user._id.toString());
    const activity = await createTestActivity({ id: 'act-idemp', capacity: 10 });

    const res1 = await request(app)
      .post(`/api/v1/activities/${activity.id}/registrations`)
      .set(headers);
    const res2 = await request(app)
      .post(`/api/v1/activities/${activity.id}/registrations`)
      .set(headers);

    expect(res1.body.data.id).toBe(res2.body.data.id);

    const updated = await ActivityModel.findOne({ id: activity.id });
    expect(updated?.registeredCount).toBe(1);
  });
});
