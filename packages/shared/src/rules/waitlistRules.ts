import {
  WAITLIST_CONFIRMATION_WINDOW_MS,
  PROMOTION_CUTOFF_MS,
} from '../constants/index.js';

export interface WaitlistEntry {
  id: string;
  userId: string;
  appliedAt: string | Date;
}

export function sortWaitlistFIFO<T extends { appliedAt: string | Date }>(entries: T[]): T[] {
  return [...entries].sort((a, b) => {
    const timeA = new Date(a.appliedAt).getTime();
    const timeB = new Date(b.appliedAt).getTime();
    return timeA - timeB;
  });
}

export function calculateWaitlistPosition<T extends { id: string; appliedAt: string | Date }>(
  entries: T[],
  targetId: string
): number {
  const sorted = sortWaitlistFIFO(entries);
  const index = sorted.findIndex((e) => e.id === targetId);
  return index === -1 ? -1 : index + 1;
}

export function isPastPromotionCutoff(
  startDateTime: string | Date,
  currentTime: string | Date = new Date(),
  cutoffMs: number = PROMOTION_CUTOFF_MS
): boolean {
  const start = new Date(startDateTime).getTime();
  const current = new Date(currentTime).getTime();
  return start - current <= cutoffMs;
}

export function hasOfferExpired(
  offeredAt: string | Date,
  currentTime: string | Date = new Date(),
  windowMs: number = WAITLIST_CONFIRMATION_WINDOW_MS
): boolean {
  const offerTime = new Date(offeredAt).getTime();
  const current = new Date(currentTime).getTime();
  return current - offerTime > windowMs;
}

export function canPromoteFromWaitlist(
  waitlistEnabled: boolean,
  entriesCount: number,
  startDateTime: string | Date,
  currentTime: string | Date = new Date()
): boolean {
  if (!waitlistEnabled) return false;
  if (entriesCount <= 0) return false;
  if (isPastPromotionCutoff(startDateTime, currentTime)) return false;
  return true;
}
