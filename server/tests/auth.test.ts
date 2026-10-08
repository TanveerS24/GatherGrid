import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import supertest from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { createApp } from '../src/app.js';

let mongod: MongoMemoryServer;
let app: ReturnType<typeof createApp>;

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  await mongoose.connect(uri);
  app = createApp();
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongod.stop();
});

describe('Auth Endpoints (/api/v1/auth)', () => {
  const testUser = {
    name: 'Maya Lin',
    email: 'maya@example.com',
    password: 'password123',
    role: 'participant',
  };

  it('POST /register should create a new user and set cookie', async () => {
    const res = await supertest(app)
      .post('/api/v1/auth/register')
      .send(testUser);

    expect(res.status).toBe(201);
    expect(res.body.status).toBe('ok');
    expect(res.body.data.email).toBe(testUser.email);
    expect(res.body.data.name).toBe(testUser.name);
    expect(res.headers['set-cookie']).toBeDefined();
    expect(res.headers['set-cookie'][0]).toContain('session_token');
  });

  it('POST /register should reject duplicate email with 409', async () => {
    const res = await supertest(app)
      .post('/api/v1/auth/register')
      .send(testUser);

    expect(res.status).toBe(409);
    expect(res.body.status).toBe('error');
    expect(res.body.code).toBe('CONFLICT');
  });

  it('POST /login should authenticate with valid credentials', async () => {
    const res = await supertest(app)
      .post('/api/v1/auth/login')
      .send({ email: testUser.email, password: testUser.password });

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.data.email).toBe(testUser.email);
    expect(res.headers['set-cookie']).toBeDefined();
  });

  it('POST /login should reject invalid credentials with 401', async () => {
    const res = await supertest(app)
      .post('/api/v1/auth/login')
      .send({ email: testUser.email, password: 'wrongpassword' });

    expect(res.status).toBe(401);
    expect(res.body.status).toBe('error');
    expect(res.body.code).toBe('UNAUTHORIZED');
  });

  it('GET /me should return current user when authenticated with cookie', async () => {
    const loginRes = await supertest(app)
      .post('/api/v1/auth/login')
      .send({ email: testUser.email, password: testUser.password });

    const cookie = loginRes.headers['set-cookie'];

    const meRes = await supertest(app)
      .get('/api/v1/auth/me')
      .set('Cookie', cookie);

    expect(meRes.status).toBe(200);
    expect(meRes.body.data.email).toBe(testUser.email);
  });

  it('POST /logout should clear session cookie', async () => {
    const res = await supertest(app).post('/api/v1/auth/logout');
    expect(res.status).toBe(200);
    expect(res.body.data.success).toBe(true);
  });
});
