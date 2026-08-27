import { describe, it, expect, vi } from 'vitest';
import request from 'supertest';
import express from 'express';
import authRouter from './auth.js';

vi.mock('@prisma/client', () => {
  return {
    PrismaClient: class {
      user = {
        findUnique: vi.fn().mockImplementation(async ({ where }) => {
          if (where.email === 'test@example.com') {
            return {
              id: '123',
              name: 'Test User',
              role: 'PATIENT',
              patientProfile: { id: '456' }
            };
          }
          if (where.email === 'error@example.com') {
              throw new Error('Database error');
          }
          return null;
        })
      };
    }
  };
});

// Suppress console.error in tests to avoid noisy output for expected errors
vi.spyOn(console, 'error').mockImplementation(() => {});

const app = express();
app.use(express.json());
app.use('/api/auth', authRouter);

describe('auth routes', () => {
  it('should return 401 for an unknown user', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'unknown@example.com' });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toBe('User not found');
  });

  it('should return 200 and a token for a known user', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@example.com' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.id).toBe('123');
    expect(res.body.user.role).toBe('PATIENT');
  });

  it('should return 500 on database error', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'error@example.com' });

      expect(res.status).toBe(500);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toBe('Internal Server Error');
  });

  it('should return 500 if JWT_SECRET is missing', async () => {
      const originalSecret = process.env.JWT_SECRET;
      delete process.env.JWT_SECRET;

      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'test@example.com' });

      expect(res.status).toBe(500);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toBe('Internal Server Error');

      process.env.JWT_SECRET = originalSecret;
  });
});
