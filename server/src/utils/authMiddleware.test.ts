import { describe, it, expect, vi } from 'vitest';
import { authenticateJWT, type AuthRequest } from './authMiddleware.js';
import type { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Set env variable for JWT_SECRET
process.env.JWT_SECRET = 'test_secret';

describe('authMiddleware', () => {
  it('should call next() if valid token is provided', () => {
    const payload = { id: '123', role: 'PATIENT' };
    const token = jwt.sign(payload, 'test_secret');

    const req = {
      headers: {
        authorization: `Bearer ${token}`
      }
    } as AuthRequest;

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn()
    } as unknown as Response;

    const next: NextFunction = vi.fn();

    authenticateJWT(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(req.user).toBeDefined();
    expect(req.user?.id).toBe('123');
    expect(req.user?.role).toBe('PATIENT');
  });

  it('should return 401 if no authorization header is present', () => {
    const req = {
      headers: {}
    } as AuthRequest;

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn()
    } as unknown as Response;

    const next: NextFunction = vi.fn();

    authenticateJWT(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ success: false, error: 'Unauthorized: No token provided' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 401 if authorization header is malformed (no token)', () => {
    const req = {
      headers: {
        authorization: 'Bearer'
      }
    } as AuthRequest;

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn()
    } as unknown as Response;

    const next: NextFunction = vi.fn();

    authenticateJWT(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ success: false, error: 'Unauthorized: No token provided' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 403 if token is invalid or tampered with', () => {
    const req = {
      headers: {
        authorization: 'Bearer invalid_token.here.now'
      }
    } as AuthRequest;

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn()
    } as unknown as Response;

    const next: NextFunction = vi.fn();

    authenticateJWT(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ success: false, error: 'Forbidden: Invalid token' });
    expect(next).not.toHaveBeenCalled();
  });
});
