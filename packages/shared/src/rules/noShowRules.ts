import { ActivityStatus } from '../enums/index.js';
import { LATE_CANCELLATION_THRESHOLD_MS } from '../constants/index.js';

export function isLateCancellation(
  startDateTime: string | Date,
  cancelledAt: string | Date = new Date(),
  thresholdMs: number = LATE_CANCELLATION_THRESHOLD_MS
): boolean {
  const start = new Date(startDateTime).getTime();
  const cancelled = new Date(cancelledAt).getTime();
  const diff = start - cancelled;
  return diff <= thresholdMs && diff >= 0;
}

export function isCancellationPenalized(params: {
  activityStatus: ActivityStatus;
  startDateTime: string | Date;
  cancelledAt: string | Date;
  optedOutAfterPostponement?: boolean;
}): boolean {
  const { activityStatus, startDateTime, cancelledAt, optedOutAfterPostponement } = params;

  // Postponed activities or organizer-cancelled activities never penalize participants
  if (
    activityStatus === ActivityStatus.CANCELLED ||
    activityStatus === ActivityStatus.POSTPONED ||
    optedOutAfterPostponement
  ) {
    return false;
  }

  return isLateCancellation(startDateTime, cancelledAt);
}

export function calculateAttendanceMetrics(records: { attended: boolean; noShow: boolean }[]): {
  total: number;
  attended: number;
  noShows: number;
  rate: number;
} {
  const total = records.length;
  if (total === 0) {
    return { total: 0, attended: 0, noShows: 0, rate: 100 };
  }
  const attended = records.filter((r) => r.attended).length;
  const noShows = records.filter((r) => r.noShow).length;
  const rate = Math.round((attended / total) * 100);
  return { total, attended, noShows, rate };
}
