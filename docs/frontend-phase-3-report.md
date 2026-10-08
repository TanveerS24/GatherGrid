# Phase 3 Report: API Client, Mock Mode & Mandatory Authentication

## What was built

### Shared Domain Schemas (`packages/shared/src/schemas`)
- `auth.schema.ts`: login, register, forgot-password, reset-password, and `AuthUser` profile schemas.
- `activities.schema.ts`: `activityFilterSchema` (radius, date picks, formats, join modes) and full `activitySchema`.
- `registrations.schema.ts`: applicant tracking, status lifecycle, waitlist offer expiration windows.
- `teams.schema.ts`: team entity, join codes, members list, solo pool participant schema.
- `notifications.schema.ts`: typed user notifications with action links.
- `reviews.schema.ts`: 1-5 star ratings, comments, and organizer references.
- `reports.schema.ts`: moderation reports against activities, users, reviews, or organizers.
- `organizers.schema.ts`: host profiles with badge tiers (New, Bronze, Silver, Gold) and aggregate statistics.
- `admin.schema.ts`: audit logs, category management, and user suspension.
- `geo.schema.ts`: geocoded suggestions and reverse geocoding structures.

### Typed API Client (`packages/shared/src/api-client`)
- `client.ts`: Central fetch wrapper handling base URL configuration, `credentials: 'include'` for secure cookie sessions, automatic request ID injection, centralized error normalization into `ApiError`, and automatic 401 token refresh queue.
- Resource modules: `authApi`, `activitiesApi`, `registrationsApi`, `teamsApi`, `notificationsApi`, `reviewsApi`, `reportsApi`, `organizersApi`, `adminApi`, and `geoApi`.

### Mock System & MSW Handlers (`mocks/`)
- Seeded realistic fixtures for users (participant, organizer, admin), organizers with Bronze/Silver/Gold tiers, activities with instant/approval joining, teams, waitlists, reviews, and notifications.
- Complete MSW v2 handler suite with browser worker (`mocks/browser.ts`) and Node test server (`mocks/server.ts`).
- Copied `mockServiceWorker.js` to `public/` directories in `apps/participant-web`, `apps/organizer-web`, and `apps/admin-web`.

### Mandatory Authentication Enforcement (ADR 007)
- Per the user's explicit requirement ("every type of user should be logged in mandatory to continue and browse"):
  - Recorded ADR 007 in `docs/decisions.md`.
  - Enforced in MSW handlers: unauthenticated requests to `/api/v1/activities` return `401 UNAUTHORIZED`.
  - Documented in `docs/api-contract.md`.
  - Verified via integration unit test in `packages/shared/src/api-client/client.test.ts`.

## Verified

| Check | Result |
|---|---|
| `packages/shared` typecheck | ✅ 0 errors |
| API Client & MSW tests (`client.test.ts`) | ✅ 4/4 passed |
| Mandatory Auth check (unauthenticated browse rejection) | ✅ Tested & verified |
| Full monorepo typecheck & build | ✅ Clean build |
