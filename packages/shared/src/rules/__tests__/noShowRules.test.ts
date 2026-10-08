import { describe, it, expect } from 'vitest';
import { ActivityStatus } from '../../enums/index.js';
import {
  isLateCancellation,
  isCancellationPenalized,
  calculateAttendanceMetrics,
} from '../noShowRules.js';
import { LATE_CANCELLATION_THRESHOLD_MS } from '../../constants/index.js';

describe('No-Show & Late Cancellation Accounting Rules', () => {
  const startDateTime = new Date('2026-10-15T18:00:00Z');

  describe('isLateCancellation', () => {
    it('flags cancellation within 24 hours of start as late', () => {
      const cancelled12hBefore = new Date(
        startDateTime.getTime() - 12 * 60 * 60 * 1000
      );
      expect(isLateCancellation(startDateTime, cancelled12hBefore)).toBe(true);
    });

    it('does not flag cancellation made more than 24 hours prior', () => {
      const cancelled48hBefore = new Date(
        startDateTime.getTime() - 48 * 60 * 60 * 1000
      );
      expect(isLateCancellation(startDateTime, cancelled48hBefore)).toBe(false);
    });
  });

  describe('isCancellationPenalized', () => {
    it('never penalizes participants when organizer cancels the activity', () => {
      const lateTime = new Date(startDateTime.getTime() - 2 * 60 * 60 * 1000);
      expect(
        isCancellationPenalized({
          activityStatus: ActivityStatus.CANCELLED,
          startDateTime,
          cancelledAt: lateTime,
        })
      ).toBe(false);
    });

    it('never penalizes participants who opt out after postponement', () => {
      const lateTime = new Date(startDateTime.getTime() - 2 * 60 * 60 * 1000);
      expect(
        isCancellationPenalized({
          activityStatus: ActivityStatus.POSTPONED,
          startDateTime,
          cancelledAt: lateTime,
          optedOutAfterPostponement: true,
        })
      ).toBe(false);
    });
  });

  describe('calculateAttendanceMetrics', () => {
    it('computes accurate attendance percentages and counts', () => {
      const records = [
        { attended: true, noShow: false },
        { attended: true, noShow: false },
        { attended: false, noShow: true },
        { attended: true, noShow: false },
      ];
      const metrics = calculateAttendanceMetrics(records);
      expect(metrics.total).toBe(4);
      expect(metrics.attended).toBe(3);
      expect(metrics.noShows).toBe(1);
      expect(metrics.rate).toBe(75);
    });
  });
});
