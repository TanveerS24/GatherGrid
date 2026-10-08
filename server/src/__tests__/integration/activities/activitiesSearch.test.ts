import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import request from 'supertest';
import { ActivityFormat } from '@gathergrid/shared';
import { createApp } from '../../../app.js';
import { connectTestDatabase, clearTestDatabase, disconnectTestDatabase } from '../../helpers/dbHelper.js';
import { createTestUser, getAuthHeader } from '../../helpers/authHelper.js';
import { createTestActivity } from '../../helpers/factories.js';

describe('Activities Search, Filtering & Pagination (Integration)', () => {
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

  it('filters activities by category slug', async () => {
    const user = await createTestUser();
    const headers = getAuthHeader(user._id.toString());

    await createTestActivity({ id: 'act-sports', categorySlug: 'sports', title: 'Soccer Pickup' });
    await createTestActivity({ id: 'act-workshops', categorySlug: 'workshops', title: 'Pottery Workshop' });

    const res = await request(app).get('/api/v1/activities?category=sports').set(headers);

    expect(res.status).toBe(200);
    expect(res.body.data.data.length).toBe(1);
    expect(res.body.data.data[0].id).toBe('act-sports');
  });

  it('filters activities by format (online vs in_person)', async () => {
    const user = await createTestUser();
    const headers = getAuthHeader(user._id.toString());

    await createTestActivity({ id: 'act-online', format: ActivityFormat.ONLINE, title: 'Virtual Chess Tournament' });
    await createTestActivity({ id: 'act-inperson', format: ActivityFormat.IN_PERSON, title: 'Park Chess Match' });

    const res = await request(app).get('/api/v1/activities?format=online').set(headers);

    expect(res.status).toBe(200);
    expect(res.body.data.data.length).toBe(1);
    expect(res.body.data.data[0].id).toBe('act-online');
  });

  it('paginates results accurately with page and limit parameters', async () => {
    const user = await createTestUser();
    const headers = getAuthHeader(user._id.toString());

    for (let i = 1; i <= 5; i++) {
      await createTestActivity({ id: `act-${i}`, title: `Event ${i}` });
    }

    const res = await request(app).get('/api/v1/activities?page=1&limit=2').set(headers);

    expect(res.status).toBe(200);
    expect(res.body.data.data.length).toBe(2);
    expect(res.body.data.pagination.total).toBe(5);
    expect(res.body.data.pagination.totalPages).toBe(3);
    expect(res.body.data.pagination.hasNext).toBe(true);
  });
});
