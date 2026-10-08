import { describe, it, expect } from 'vitest';
import {
  isUnlimitedCapacity,
  hasAvailableCapacity,
  calculateRemainingSlots,
  isCapacityExceeded,
  calculateTeamCapacity,
} from '../capacityRules.js';

describe('Capacity & Seat Rules', () => {
  describe('unlimited capacity', () => {
    it('treats 0, negative values, and null as unlimited', () => {
      expect(isUnlimitedCapacity(0)).toBe(true);
      expect(isUnlimitedCapacity(-5)).toBe(true);
      expect(isUnlimitedCapacity(null)).toBe(true);
      expect(isUnlimitedCapacity(undefined)).toBe(true);
      expect(isUnlimitedCapacity(25)).toBe(false);
    });

    it('always indicates available capacity when capacity is unlimited', () => {
      expect(hasAvailableCapacity(0, 1000)).toBe(true);
      expect(hasAvailableCapacity(null, 500)).toBe(true);
      expect(calculateRemainingSlots(0, 1000)).toBeNull();
      expect(isCapacityExceeded(0, 5000)).toBe(false);
    });
  });

  describe('bounded capacity and exact fit', () => {
    it('accurately calculates remaining slots for exact fit and under capacity', () => {
      expect(hasAvailableCapacity(10, 5)).toBe(true);
      expect(calculateRemainingSlots(10, 5)).toBe(5);

      // Exact fit
      expect(hasAvailableCapacity(10, 10)).toBe(false);
      expect(calculateRemainingSlots(10, 10)).toBe(0);
      expect(isCapacityExceeded(10, 10)).toBe(false);
    });

    it('detects over capacity condition when registrations exceed limit', () => {
      expect(hasAvailableCapacity(10, 11)).toBe(false);
      expect(calculateRemainingSlots(10, 15)).toBe(0);
      expect(isCapacityExceeded(10, 12)).toBe(true);
    });
  });

  describe('team capacity rules', () => {
    it('counts registered teams rather than individual people', () => {
      const cap = calculateTeamCapacity(4, 2);
      expect(cap.isFull).toBe(false);
      expect(cap.remainingSlots).toBe(2);

      const fullCap = calculateTeamCapacity(4, 4);
      expect(fullCap.isFull).toBe(true);
      expect(fullCap.remainingSlots).toBe(0);
    });
  });
});
