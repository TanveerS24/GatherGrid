import { describe, it, expect } from 'vitest';
import {
  sortWaitlistFIFO,
  calculateWaitlistPosition,
  isPastPromotionCutoff,
  hasOfferExpired,
  canPromoteFromWaitlist,
} from '../waitlistRules.js';
import {
  WAITLIST_CONFIRMATION_WINDOW_MS,
  PROMOTION_CUTOFF_MS,
} from '../../constants/index.js';

describe('Waitlist Ordering, Cutoffs & Expiry Rules', () => {
  const baseTime = new Date('2026-10-10T10:00:00Z').getTime();

  it('orders waitlist applicants in strict FIFO sequence by appliedAt', () => {
    const applicants = [
      { id: 'user-3', appliedAt: new Date(baseTime + 3000) },
      { id: 'user-1', appliedAt: new Date(baseTime + 1000) },
      { id: 'user-2', appliedAt: new Date(baseTime + 2000) },
    ];

    const sorted = sortWaitlistFIFO(applicants);
    expect(sorted.map((s) => s.id)).toEqual(['user-1', 'user-2', 'user-3']);
  });

  it('calculates 1-based waitlist position accurately', () => {
    const applicants = [
      { id: 'user-a', appliedAt: new Date(baseTime + 1000) },
      { id: 'user-b', appliedAt: new Date(baseTime + 2000) },
      { id: 'user-c', appliedAt: new Date(baseTime + 3000) },
    ];

    expect(calculateWaitlistPosition(applicants, 'user-a')).toBe(1);
    expect(calculateWaitlistPosition(applicants, 'user-b')).toBe(2);
    expect(calculateWaitlistPosition(applicants, 'user-c')).toBe(3);
    expect(calculateWaitlistPosition(applicants, 'unknown')).toBe(-1);
  });

  it('detects when an offer has expired beyond the 12-hour window', () => {
    const offerTime = new Date('2026-10-10T08:00:00Z');
    const withinWindow = new Date(offerTime.getTime() + WAITLIST_CONFIRMATION_WINDOW_MS - 60000);
    const expiredTime = new Date(offerTime.getTime() + WAITLIST_CONFIRMATION_WINDOW_MS + 1000);

    expect(hasOfferExpired(offerTime, withinWindow)).toBe(false);
    expect(hasOfferExpired(offerTime, expiredTime)).toBe(true);
  });

  it('enforces promotion cutoff 2 hours before activity start', () => {
    const startTime = new Date('2026-10-10T18:00:00Z');
    const beforeCutoff = new Date(startTime.getTime() - PROMOTION_CUTOFF_MS - 60000);
    const pastCutoff = new Date(startTime.getTime() - PROMOTION_CUTOFF_MS + 60000);

    expect(isPastPromotionCutoff(startTime, beforeCutoff)).toBe(false);
    expect(isPastPromotionCutoff(startTime, pastCutoff)).toBe(true);
  });

  it('prohibits promotion when waitlist is disabled, empty, or past cutoff', () => {
    const startTime = new Date('2026-10-10T18:00:00Z');
    const normalTime = new Date('2026-10-10T12:00:00Z');

    expect(canPromoteFromWaitlist(false, 5, startTime, normalTime)).toBe(false);
    expect(canPromoteFromWaitlist(true, 0, startTime, normalTime)).toBe(false);
    expect(canPromoteFromWaitlist(true, 3, startTime, new Date('2026-10-10T17:30:00Z'))).toBe(false);
    expect(canPromoteFromWaitlist(true, 3, startTime, normalTime)).toBe(true);
  });
});
