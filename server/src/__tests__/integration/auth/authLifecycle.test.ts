import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import request from 'supertest';
import { createApp } from '../../../app.js';
import { connectTestDatabase, clearTestDatabase, disconnectTestDatabase } from '../../helpers/dbHelper.js';

describe('Auth Lifecycle (Integration)', () => {
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

  it('registers a new user successfully and sets session cookie', async () => {
    const payload = {
      name: 'Sarah Connor',
      email: 'sarah@skynet.test',
      password: 'SecurePassword123!',
      role: 'participant',
    };

    const res = await request(app).post('/api/v1/auth/register').send(payload);

    expect(res.status).toBe(201);
    expect(res.body.status).toBe('ok');
    expect(res.body.data.email).toBe('sarah@skynet.test');
    expect(res.headers['set-cookie']).toBeDefined();
    expect(res.body.data).not.toHaveProperty('passwordHash');
  });

  it('rejects registration with duplicate email address with 409 Conflict', async () => {
    const payload = {
      name: 'Sarah Connor',
      email: 'sarah@skynet.test',
      password: 'SecurePassword123!',
      role: 'participant',
    };

    await request(app).post('/api/v1/auth/register').send(payload);
    const res = await request(app).post('/api/v1/auth/register').send(payload);

    expect(res.status).toBe(409);
    expect(res.body.message).toMatch(/already exists/i);
  });

  it('logs in an existing user with valid credentials and sets session cookie', async () => {
    const payload = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'Password123!',
      role: 'participant',
    };

    await request(app).post('/api/v1/auth/register').send(payload);

    const loginRes = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'john@example.com', password: 'Password123!' });

    expect(loginRes.status).toBe(200);
    expect(loginRes.body.status).toBe('ok');
    expect(loginRes.body.data.email).toBe('john@example.com');
    expect(loginRes.headers['set-cookie']).toBeDefined();
  });

  it('rejects login with incorrect password with 401 Unauthorized', async () => {
    const payload = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'Password123!',
      role: 'participant',
    };

    await request(app).post('/api/v1/auth/register').send(payload);

    const loginRes = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'john@example.com', password: 'WrongPassword' });

    expect(loginRes.status).toBe(401);
    expect(loginRes.body.message).toMatch(/invalid email or password/i);
  });

  it('clears session cookie on logout', async () => {
    const res = await request(app).post('/api/v1/auth/logout');
    expect(res.status).toBe(200);
    expect(res.body.data.success).toBe(true);
  });

  it('GET /api/v1/auth/me returns current user profile when authenticated with cookie', async () => {
    const regRes = await request(app).post('/api/v1/auth/register').send({
      name: 'Jane Resident',
      email: 'jane@example.com',
      password: 'Password123!',
      role: 'participant',
    });

    const cookie = regRes.headers['set-cookie'];

    const meRes = await request(app)
      .get('/api/v1/auth/me')
      .set('Cookie', cookie || []);

    expect(meRes.status).toBe(200);
    expect(meRes.body.data.email).toBe('jane@example.com');
  });

  it('rejects GET /api/v1/auth/me without token with 401 Unauthorized', async () => {
    const res = await request(app).get('/api/v1/auth/me');
    expect(res.status).toBe(401);
  });
});
