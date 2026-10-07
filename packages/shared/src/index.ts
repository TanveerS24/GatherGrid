// Enums
export {
  UserRole,
  ActivityStatus,
  RegistrationStatus,
  JoinMode,
  ActivityFormat,
  ReportStatus,
  ReportTargetType,
  OrganizerBadge,
  NotificationType,
  TeamRequestType,
  TeamRequestStatus,
} from './enums/index.js';

// Constants
export {
  BADGE_THRESHOLDS,
  WAITLIST_CONFIRMATION_WINDOW_MS,
  PROMOTION_CUTOFF_MS,
  DEFAULT_REMINDER_OFFSETS_MS,
  LATE_CANCELLATION_THRESHOLD_MS,
  REVIEW_EDIT_WINDOW_DAYS,
  JOIN_CODE_CHARSET,
  JOIN_CODE_LENGTH,
  MAX_UPLOAD_SIZE_BYTES,
  ALLOWED_IMAGE_TYPES,
  AUTO_HIDE_REPORT_THRESHOLD,
  ORGANIZER_ACTIVITY_RATE_LIMIT,
  PAGINATION,
  DEFAULT_SEARCH_RADIUS_KM,
  MAX_SEARCH_RADIUS_KM,
  CATEGORY_SLUGS,
} from './constants/index.js';

// Types
export type {
  GeoPoint,
  PaginatedResponse,
  ApiErrorResponse,
  ApiSuccessResponse,
  HealthResponse,
  ReadinessResponse,
  BaseDocument,
  AttendanceRecord,
  TokenPayload,
} from './types/index.js';

// Schemas
export { envSchema } from './schemas/index.js';
export type { EnvConfig } from './schemas/index.js';
