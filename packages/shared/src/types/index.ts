import type { UserRole } from '../enums';

/** GeoJSON Point for MongoDB 2dsphere */
export interface GeoPoint {
  type: 'Point';
  coordinates: [longitude: number, latitude: number];
}

/** Standard paginated API response */
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

/** Standard API error response */
export interface ApiErrorResponse {
  status: 'error';
  message: string;
  code: string;
  requestId: string;
  details?: unknown;
}

/** Standard API success response */
export interface ApiSuccessResponse<T = undefined> {
  status: 'ok';
  data: T;
  requestId: string;
}

/** Health check response */
export interface HealthResponse {
  status: 'ok' | 'error';
  timestamp: string;
  uptime: number;
}

/** Readiness check response */
export interface ReadinessResponse {
  status: 'ok' | 'error';
  db: 'connected' | 'disconnected';
  timestamp: string;
}

/** Base document fields for all Mongo documents */
export interface BaseDocument {
  _id: string;
  createdAt: string;
  updatedAt: string;
}

/** User attendance record (public info for organizers) */
export interface AttendanceRecord {
  joinedCount: number;
  attendedCount: number;
  noShowCount: number;
  lateCancelCount: number;
}

/** Token payload */
export interface TokenPayload {
  sub: string;
  role: UserRole;
  aud: string;
  iat: number;
  exp: number;
}
