import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import request from 'supertest';
import { RegistrationStatus } from '@gathergrid/shared';
import { createApp } from '../../../app.js';
import { connectTestDatabase, clearTestDatabase, disconnectTestDatabase } from '../../helpers/dbHelper.js';
import { createTestUser, getAuthHeader } from '../../helpers/authHelper.js';
import { createTestActivity, createTestRegistration } from '../../helpers/factories.js';
import { ActivityModel } from '../../../modules/activities/activity.model.js';

describe('Registration Cancellation & Decrement (Integration)', () => {
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

  it('cancels an active registration and decrements registeredCount', async () => {
    const user = await createTestUser();
    const headers = getAuthHeader(user._id.toString());
    const activity = await createTestActivity({ id: 'act-canc', registeredCount: 5 });
    const reg = await createTestRegistration({
      id: 'reg-canc-1',
      activityId: activity.id,
      userId: user._id.toString(),
      status: RegistrationStatus.CONFIRMED,
    });

    const res = await request(app)
      .post(`/api/v1/registrations/${reg.id}/cancel`)
      .set(headers);

    expect(res.status).toBe(200);
    expect(res.body.data.success).toBe(true);

    const updated = await ActivityModel.findOne({ id: activity.id });
    expect(updated?.registeredCount).toBe(4);
  });
});
