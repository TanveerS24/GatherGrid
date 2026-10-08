import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import request from 'supertest';
import { RegistrationStatus } from '@gathergrid/shared';
import { createApp } from '../../../app.js';
import { connectTestDatabase, clearTestDatabase, disconnectTestDatabase } from '../../helpers/dbHelper.js';
import { createTestUser, getAuthHeader } from '../../helpers/authHelper.js';
import { createTestActivity } from '../../helpers/factories.js';
import { ActivityModel } from '../../../modules/activities/activity.model.js';
import { RegistrationModel } from '../../../modules/registrations/registration.model.js';

describe('Capacity Race Condition & Concurrency Guard (Integration)', () => {
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

  it('allows exactly 1 confirmed registration when 20 simultaneous joins compete for 1 remaining seat', async () => {
    const activity = await createTestActivity({
      id: 'act-race-1',
      capacity: 1,
      registeredCount: 0,
      waitlistEnabled: true,
      waitlistCount: 0,
    });

    const userCount = 20;
    const users = await Promise.all(
      Array.from({ length: userCount }).map((_, i) =>
        createTestUser({ email: `race-user-${i}-${Math.random()}@gathergrid.test` })
      )
    );

    // Fire 20 simultaneous requests
    const results = await Promise.all(
      users.map((user) =>
        request(app)
          .post(`/api/v1/activities/${activity.id}/registrations`)
          .set(getAuthHeader(user._id.toString()))
          .send({})
      )
    );

    // All requests should return 201 Created
    results.forEach((res) => {
      expect(res.status).toBe(201);
    });

    // Check confirmed registrations in database
    const confirmedCount = await RegistrationModel.countDocuments({
      activityId: activity.id,
      status: RegistrationStatus.CONFIRMED,
    });
    const waitlistedCount = await RegistrationModel.countDocuments({
      activityId: activity.id,
      status: RegistrationStatus.WAITLISTED,
    });

    expect(confirmedCount).toBe(1);
    expect(waitlistedCount).toBe(userCount - 1);

    const updatedActivity = await ActivityModel.findOne({ id: activity.id });
    expect(updatedActivity?.registeredCount).toBe(1);
    expect(updatedActivity?.waitlistCount).toBe(userCount - 1);
  });
});
