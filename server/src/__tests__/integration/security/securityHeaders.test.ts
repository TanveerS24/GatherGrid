import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { createApp } from '../../../app.js';
import { connectTestDatabase, disconnectTestDatabase } from '../../helpers/dbHelper.js';

describe('Security Headers & Sanitization (Integration)', () => {
  const app = createApp();

  beforeAll(async () => {
    await connectTestDatabase();
  });

  afterAll(async () => {
    await disconnectTestDatabase();
  });

  it('includes standard Helmet security headers on responses', async () => {
    const res = await request(app).get('/health');

    expect(res.headers).toHaveProperty('x-dns-prefetch-control');
    expect(res.headers).toHaveProperty('x-frame-options');
    expect(res.headers).toHaveProperty('strict-transport-security');
    expect(res.headers['x-powered-by']).toBeUndefined();
  });

  it('handles and sanitizes potential NoSQL injection in request payloads', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: { $gt: '' }, password: 'somepassword' });

    // Should fail validation without crashing or exposing database internals
    expect(res.status).toBeGreaterThanOrEqual(400);
    expect(res.body).not.toHaveProperty('stack');
  });
});
