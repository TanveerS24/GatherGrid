import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import request from 'supertest';
import { ActivityFormat } from '@gathergrid/shared';
import { createApp } from '../../../app.js';
import { connectTestDatabase, clearTestDatabase, disconnectTestDatabase } from '../../helpers/dbHelper.js';
import { createTestUser, getAuthHeader } from '../../helpers/authHelper.js';
import { createTestActivity } from '../../helpers/factories.js';

describe('Activity Privacy & Online Meeting Link Gating (Integration)', () => {
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

  it('provides public activity overview without sensitive unconfirmed meeting credentials', async () => {
    const user = await createTestUser();
    const headers = getAuthHeader(user._id.toString());

    const onlineAct = await createTestActivity({
      id: 'act-zoom',
      format: ActivityFormat.ONLINE,
      title: 'Online Creative Writing',
      onlinePlatform: 'Zoom Meeting',
    });

    const res = await request(app).get(`/api/v1/activities/${onlineAct.id}`).set(headers);

    expect(res.status).toBe(200);
    expect(res.body.data.format).toBe(ActivityFormat.ONLINE);
    expect(res.body.data.onlinePlatform).toBe('Zoom Meeting');
  });
});
