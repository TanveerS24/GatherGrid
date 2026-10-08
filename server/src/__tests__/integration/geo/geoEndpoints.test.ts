import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { createApp } from '../../../app.js';
import { connectTestDatabase, disconnectTestDatabase } from '../../helpers/dbHelper.js';

describe('Geo Suggest & Reverse Geocoding Endpoints (Integration)', () => {
  const app = createApp();

  beforeAll(async () => {
    await connectTestDatabase();
  });

  afterAll(async () => {
    await disconnectTestDatabase();
  });

  it('GET /api/v1/geo/suggest returns matching location suggestions', async () => {
    const res = await request(app).get('/api/v1/geo/suggest?q=Los');

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(Array.isArray(res.body.data)).toBe(true);
    if (res.body.data.length > 0) {
      expect(res.body.data[0]).toHaveProperty('displayName');
      expect(res.body.data[0]).toHaveProperty('lat');
      expect(res.body.data[0]).toHaveProperty('lng');
    }
  });

  it('GET /api/v1/geo/reverse returns approximate address for coordinates', async () => {
    const res = await request(app).get('/api/v1/geo/reverse?lat=34.0522&lng=-118.2437');

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.data).toHaveProperty('displayName');
  });
});
