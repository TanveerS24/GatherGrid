import { describe, it, expect } from 'vitest';
import { calculateAverageRating, isReviewEditable } from '../ratingRules.js';
import { REVIEW_EDIT_WINDOW_DAYS } from '../../constants/index.js';

describe('Ratings & Review Edit Window Rules', () => {
  describe('average rating recalculation', () => {
    it('returns 0 average for empty reviews list', () => {
      const res = calculateAverageRating([]);
      expect(res.average).toBe(0);
      expect(res.count).toBe(0);
    });

    it('calculates rounded average to 1 decimal place', () => {
      // 5 + 4 + 4 = 13 / 3 = 4.3333 -> 4.3
      const res = calculateAverageRating([5, 4, 4]);
      expect(res.average).toBe(4.3);
      expect(res.count).toBe(3);
    });
  });

  describe('review edit window (7 days)', () => {
    const createdTime = new Date('2026-10-01T12:00:00Z');

    it('permits editing within the 7-day window', () => {
      const day6 = new Date('2026-10-07T12:00:00Z');
      expect(isReviewEditable(createdTime, day6, REVIEW_EDIT_WINDOW_DAYS)).toBe(true);
    });

    it('prohibits editing after the 7-day window has expired', () => {
      const day8 = new Date('2026-10-09T12:00:00Z');
      expect(isReviewEditable(createdTime, day8, REVIEW_EDIT_WINDOW_DAYS)).toBe(false);
    });
  });
});
