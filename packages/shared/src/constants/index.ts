/** Organizer badge thresholds — edit this single file to change badge rules */
export const BADGE_THRESHOLDS = {
  bronze: { completedEvents: 3 },
  silver: { completedEvents: 10, minAverageRating: 4.0 },
  gold: { completedEvents: 25, minAverageRating: 4.3 },
} as const;

/** Default waitlist confirmation window in milliseconds (12 hours) */
export const WAITLIST_CONFIRMATION_WINDOW_MS = 12 * 60 * 60 * 1000;

/** Default promotion cutoff before event start in milliseconds (2 hours) */
export const PROMOTION_CUTOFF_MS = 2 * 60 * 60 * 1000;

/** Default reminder times before event start in milliseconds */
export const DEFAULT_REMINDER_OFFSETS_MS = [
  24 * 60 * 60 * 1000, // 24 hours
  1 * 60 * 60 * 1000, // 1 hour
] as const;

/** Late cancellation threshold in milliseconds (24 hours before start) */
export const LATE_CANCELLATION_THRESHOLD_MS = 24 * 60 * 60 * 1000;

/** Review edit window in days */
export const REVIEW_EDIT_WINDOW_DAYS = 7;

/** Join code character set (no ambiguous chars: 0/O/1/I removed) */
export const JOIN_CODE_CHARSET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

/** Default join code length */
export const JOIN_CODE_LENGTH = 6;

/** Maximum file upload size in bytes (5 MB) */
export const MAX_UPLOAD_SIZE_BYTES = 5 * 1024 * 1024;

/** Allowed image MIME types for uploads */
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'] as const;

/** Auto-hide activity after this many open reports */
export const AUTO_HIDE_REPORT_THRESHOLD = 5;

/** Per-organizer rate limit for creating activities (per day) */
export const ORGANIZER_ACTIVITY_RATE_LIMIT = 10;

/** Pagination defaults */
export const PAGINATION = {
  defaultPage: 1,
  defaultLimit: 20,
  maxLimit: 100,
} as const;

/** Default search radius in km */
export const DEFAULT_SEARCH_RADIUS_KM = 25;

/** Maximum search radius in km */
export const MAX_SEARCH_RADIUS_KM = 100;

/** Category IDs for seeding */
export const CATEGORY_SLUGS = [
  'sports',
  'hackathons',
  'workshops',
  'gaming',
  'study-groups',
  'cultural',
  'trips',
  'social',
  'career',
] as const;
