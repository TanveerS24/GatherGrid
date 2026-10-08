import { REVIEW_EDIT_WINDOW_DAYS } from '../constants/index.js';

export function calculateAverageRating(ratings: number[]): {
  average: number;
  count: number;
} {
  if (ratings.length === 0) {
    return { average: 0, count: 0 };
  }
  const sum = ratings.reduce((acc, r) => acc + r, 0);
  const rawAvg = sum / ratings.length;
  // Round to 1 decimal place
  const average = Math.round(rawAvg * 10) / 10;
  return { average, count: ratings.length };
}

export function isReviewEditable(
  createdAt: string | Date,
  currentTime: string | Date = new Date(),
  editWindowDays: number = REVIEW_EDIT_WINDOW_DAYS
): boolean {
  const created = new Date(createdAt).getTime();
  const current = new Date(currentTime).getTime();
  const windowMs = editWindowDays * 24 * 60 * 60 * 1000;
  return current - created <= windowMs;
}
