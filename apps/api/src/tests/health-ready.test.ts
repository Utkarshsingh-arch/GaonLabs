import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { createApp } from '../app';
import { checkDatabaseConnection, disconnectDatabase } from '../shared/database/prisma';

describe('Health and Readiness Endpoints', () => {
  const app = createApp();

  afterAll(async () => {
    await disconnectDatabase();
  });

  it('GET /health should return 200 OK with liveness details', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.service).toBe('GaonLab Core API');
    expect(res.body.version).toBe('0.1.0');
    expect(typeof res.body.uptimeSeconds).toBe('number');
    expect(res.body.timestamp).toBeDefined();
  });

  it('GET /ready should verify database connectivity and return 200 OK', async () => {
    const res = await request(app).get('/ready');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ready');
    expect(res.body.database.isHealthy).toBe(true);
    expect(typeof res.body.database.latencyMs).toBe('number');
  });

  it('GET / should return service index metadata', async () => {
    const res = await request(app).get('/');
    expect(res.status).toBe(200);
    expect(res.body.name).toBe('GaonLab Core API');
    expect(res.body.ready).toBe('/ready');
  });

  it('GET /api/unknown-route should return structured 404 response', async () => {
    const res = await request(app).get('/api/unknown-route');
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('NotFoundError');
  });

  it('checkDatabaseConnection utility should report healthy status and latency', async () => {
    const status = await checkDatabaseConnection();
    expect(status.isHealthy).toBe(true);
    expect(status.latencyMs).toBeGreaterThanOrEqual(0);
  });
});
