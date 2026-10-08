import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import request from 'supertest';
import { UserRole, ActivityStatus } from '@gathergrid/shared';
import { createApp } from '../../../app.js';
import { connectTestDatabase, clearTestDatabase, disconnectTestDatabase } from '../../helpers/dbHelper.js';
import { createTestUser, getAuthHeader } from '../../helpers/authHelper.js';
import { createTestActivity } from '../../helpers/factories.js';

describe('Organizer Public Profile & Event History (Integration)', () => {
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

  it('returns organizer profile along with upcoming and past activities', async () => {
    const organizer = await createTestUser({
      role: UserRole.ORGANIZER,
      name: 'Host Organization',
    });
    const viewer = await createTestUser();
    const headers = getAuthHeader(viewer._id.toString());

    await createTestActivity({
      organizerId: organizer._id.toString(),
      status: ActivityStatus.PUBLISHED,
      title: 'Upcoming Yoga Workshop',
    });
    await createTestActivity({
      organizerId: organizer._id.toString(),
      status: ActivityStatus.COMPLETED,
      title: 'Past Meditation Session',
    });

    const res = await request(app)
      .get(`/api/v1/organizers/${organizer._id.toString()}`)
      .set(headers);

    expect(res.status).toBe(200);
    expect(res.body.data.organizer.name).toBe('Host Organization');
    expect(res.body.data.upcomingActivities).toHaveLength(1);
    expect(res.body.data.pastActivities).toHaveLength(1);
  });
});
