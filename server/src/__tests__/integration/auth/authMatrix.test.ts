import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import request from 'supertest';
import { UserRole } from '@gathergrid/shared';
import { createApp } from '../../../app.js';
import { connectTestDatabase, clearTestDatabase, disconnectTestDatabase } from '../../helpers/dbHelper.js';
import { createTestUser, getAuthHeader } from '../../helpers/authHelper.js';

describe('Authorization Matrix (Integration)', () => {
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

  it('unauthenticated request to protected activity creation returns 401 Unauthorized', async () => {
    const res = await request(app).post('/api/v1/activities').send({ title: 'Rogue Event' });
    expect(res.status).toBe(401);
  });

  it('unauthenticated request to user registrations returns 401 Unauthorized', async () => {
    const res = await request(app).get('/api/v1/registrations/me');
    expect(res.status).toBe(401);
  });

  it('request with forged/tampered JWT returns 401 Unauthorized', async () => {
    const res = await request(app)
      .get('/api/v1/auth/me')
      .set('Authorization', 'Bearer forged.tampered.token');
    expect(res.status).toBe(401);
  });

  it('authenticated participant can query their registrations', async () => {
    const participant = await createTestUser({ role: UserRole.PARTICIPANT });
    const headers = getAuthHeader(participant._id.toString(), UserRole.PARTICIPANT);

    const res = await request(app).get('/api/v1/registrations/me').set(headers);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('authenticated organizer can query activities roster', async () => {
    const organizer = await createTestUser({ role: UserRole.ORGANIZER });
    const headers = getAuthHeader(organizer._id.toString(), UserRole.ORGANIZER);

    const res = await request(app).get('/api/v1/activities').set(headers);
    expect(res.status).toBe(200);
  });
});
