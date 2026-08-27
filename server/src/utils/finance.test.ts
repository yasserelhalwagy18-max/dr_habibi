import { describe, it, expect } from 'vitest';
import { calculateCommission, calculateFinalAmount } from './finance.js';

describe('finance utilities', () => {
  describe('calculateCommission', () => {
    it('should calculate the correct commission for 60% rate', () => {
      // 12 sessions, package price 1,200,000, 60% commission -> 720,000 total -> 60,000 per session
      const perSessionCommission = calculateCommission(1200000, 12, 0.60);
      expect(perSessionCommission).toBe(60000);
    });

    it('should handle negative or zero total sessions by returning 0', () => {
      expect(calculateCommission(1000, 0, 0.60)).toBe(0);
      expect(calculateCommission(1000, -5, 0.60)).toBe(0);
    });

    it('should use the default 60% commission rate if not provided', () => {
      const perSessionCommission = calculateCommission(1200000, 12);
      expect(perSessionCommission).toBe(60000);
    });
  });

  describe('calculateFinalAmount', () => {
    it('should calculate the correct final amount for PERCENTAGE discount', () => {
      const finalAmount = calculateFinalAmount(1000, 'PERCENTAGE', 20);
      expect(finalAmount).toBe(800); // 20% off 1000
    });

    it('should calculate the correct final amount for FIXED discount', () => {
      const finalAmount = calculateFinalAmount(1000, 'FIXED', 250);
      expect(finalAmount).toBe(750); // 250 off 1000
    });

    it('should return 0 if FIXED discount is greater than base amount', () => {
      const finalAmount = calculateFinalAmount(1000, 'FIXED', 1500);
      expect(finalAmount).toBe(0);
    });

    it('should return base amount if negative base or discount is passed', () => {
       expect(calculateFinalAmount(-1000, 'FIXED', 100)).toBe(0);
       expect(calculateFinalAmount(1000, 'FIXED', -100)).toBe(1000);
    });

    it('should return base amount if invalid discount type is passed', () => {
       // @ts-ignore
       expect(calculateFinalAmount(1000, 'UNKNOWN', 100)).toBe(1000);
    });
  });
});
