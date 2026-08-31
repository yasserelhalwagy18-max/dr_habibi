import { describe, it, expect, vi } from 'vitest';
import request from 'supertest';
import express from 'express';

vi.mock('@prisma/client', () => {
  const mockPrismaClient = class {
    $queryRaw = vi.fn().mockResolvedValue([{ '?column?': 1 }]);
  };
  return {
    PrismaClient: mockPrismaClient,
  };
});

import healthRoutes from './health.js';

describe('Health Routes', () => {
  it('GET /api/health returns 200 and ok status', async () => {
    const app = express();
    app.use('/api/health', healthRoutes);

    const res = await request(app).get('/api/health');

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('status', 'ok');
    expect(res.body).toHaveProperty('uptime');
    expect(res.body).toHaveProperty('version');
    expect(res.body).toHaveProperty('database', 'connected');
  });
});
