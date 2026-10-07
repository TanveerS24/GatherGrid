/** User roles across the platform */
export enum UserRole {
  PARTICIPANT = 'participant',
  ORGANIZER = 'organizer',
  ADMIN = 'admin',
}

/** Activity status lifecycle */
export enum ActivityStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  CANCELLED = 'cancelled',
  POSTPONED = 'postponed',
  COMPLETED = 'completed',
}

/** Registration status state machine states */
export enum RegistrationStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  REJECTED = 'rejected',
  WAITLISTED = 'waitlisted',
  OFFERED = 'offered',
  EXPIRED = 'expired',
  CANCELLED = 'cancelled',
  ATTENDED = 'attended',
  NO_SHOW = 'no_show',
}

/** Join mode for activities */
export enum JoinMode {
  INSTANT = 'instant',
  APPROVAL = 'approval',
}

/** Activity format */
export enum ActivityFormat {
  IN_PERSON = 'in_person',
  ONLINE = 'online',
}

/** Report status */
export enum ReportStatus {
  OPEN = 'open',
  REVIEWING = 'reviewing',
  RESOLVED = 'resolved',
  DISMISSED = 'dismissed',
}

/** Report target types */
export enum ReportTargetType {
  ACTIVITY = 'activity',
  USER = 'user',
  ORGANIZER = 'organizer',
  REVIEW = 'review',
}

/** Organizer badge tiers */
export enum OrganizerBadge {
  NEW = 'new',
  BRONZE = 'bronze',
  SILVER = 'silver',
  GOLD = 'gold',
}

/** Notification types */
export enum NotificationType {
  REGISTRATION_CONFIRMED = 'registration_confirmed',
  REGISTRATION_REJECTED = 'registration_rejected',
  WAITLIST_OFFERED = 'waitlist_offered',
  WAITLIST_EXPIRED = 'waitlist_expired',
  ACTIVITY_CANCELLED = 'activity_cancelled',
  ACTIVITY_POSTPONED = 'activity_postponed',
  ACTIVITY_REMINDER = 'activity_reminder',
  ACTIVITY_UPDATED = 'activity_updated',
  ANNOUNCEMENT = 'announcement',
  TEAM_REQUEST = 'team_request',
  TEAM_REQUEST_ACCEPTED = 'team_request_accepted',
  TEAM_REQUEST_DECLINED = 'team_request_declined',
  TEAM_LEADER_CHANGED = 'team_leader_changed',
  TEAM_DISBANDED = 'team_disbanded',
  REVIEW_RECEIVED = 'review_received',
  REPORT_RESOLVED = 'report_resolved',
  REPOST_NOTIFICATION = 'repost_notification',
}

/** Team request direction */
export enum TeamRequestType {
  JOIN_TEAM = 'join_team',
  INVITE_SOLO = 'invite_solo',
}

/** Team request status */
export enum TeamRequestStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  DECLINED = 'declined',
  EXPIRED = 'expired',
}
