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

describe('GET /health', () => {
  it('should return 200 with status ok', async () => {
    const res = await supertest(app).get('/health');

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('status', 'ok');
    expect(res.body).toHaveProperty('timestamp');
    expect(res.body).toHaveProperty('uptime');
    expect(typeof res.body.uptime).toBe('number');
  });
});

describe('GET /ready', () => {
  it('should return 200 with db connected when MongoDB is up', async () => {
    const res = await supertest(app).get('/ready');

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('status', 'ok');
    expect(res.body).toHaveProperty('db', 'connected');
    expect(res.body).toHaveProperty('timestamp');
  });
});

describe('404 handling', () => {
  it('should return 404 with standard error format for unknown routes', async () => {
    const res = await supertest(app).get('/nonexistent-route');

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('status', 'error');
    expect(res.body).toHaveProperty('code', 'NOT_FOUND');
    expect(res.body).toHaveProperty('requestId');
    expect(res.body.message).toContain('/nonexistent-route');
  });
});

describe('Request ID', () => {
  it('should return X-Request-Id header', async () => {
    const res = await supertest(app).get('/health');

    expect(res.headers['x-request-id']).toBeDefined();
    expect(typeof res.headers['x-request-id']).toBe('string');
  });

  it('should echo the provided X-Request-Id header', async () => {
    const customId = 'test-request-id-12345';
    const res = await supertest(app).get('/health').set('X-Request-Id', customId);

    expect(res.headers['x-request-id']).toBe(customId);
  });
});
