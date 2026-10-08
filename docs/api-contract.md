# GatherGrid API Contract

This document specifies the exact REST API contract agreed between the frontend and backend.
All endpoints use JSON payloads, consistent error wrapping, and `httpOnly` cookie session management.

## Base URL
`/api/v1`

## Mandatory Authentication (ADR 007)
All routes require a valid session cookie, except the unauthenticated authentication endpoints:
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/register`
- `POST /api/v1/auth/forgot-password`
- `POST /api/v1/auth/reset-password`

Any unauthenticated request to protected endpoints returns:
```json
{
  "status": "error",
  "code": "UNAUTHORIZED",
  "message": "Authentication is mandatory to browse or interact with the platform.",
  "requestId": "req-xyz"
}
```

---

## 1. Authentication (`/api/v1/auth`)

### `POST /api/v1/auth/login`
- **Request Body**: `{ "email": string, "password": string }`
- **Response (200)**: `{ "status": "ok", "data": AuthUser }`
- **Cookies set**: `session_token` (httpOnly, SameSite=Lax)

### `POST /api/v1/auth/register`
- **Request Body**: `{ "name": string, "email": string, "password": string, "role": "participant" | "organizer", "organizationName"?: string }`
- **Response (201)**: `{ "status": "ok", "data": AuthUser }`

### `POST /api/v1/auth/logout`
- **Response (200)**: `{ "status": "ok", "data": { "success": true } }`

### `GET /api/v1/auth/me`
- **Response (200)**: `{ "status": "ok", "data": AuthUser }`

### `POST /api/v1/auth/refresh`
- **Response (200)**: `{ "status": "ok", "data": { "refreshed": true } }`

---

## 2. Activities (`/api/v1/activities`)

### `GET /api/v1/activities`
- **Query Params**: `query`, `category`, `dateRange`, `isFree`, `format` (`in_person` | `online`), `isTeamEvent`, `openSeatsOnly`, `joinMode` (`instant` | `approval`), `radiusKm`, `lat`, `lng`, `sort` (`nearest` | `soonest` | `popular`), `page`, `limit`
- **Response (200)**:
```json
{
  "status": "ok",
  "data": {
    "data": Activity[],
    "pagination": { "page": 1, "limit": 20, "total": 100, "totalPages": 5, "hasNext": true, "hasPrev": false }
  }
}
```

### `GET /api/v1/activities/:id`
- **Response (200)**: `{ "status": "ok", "data": Activity }`
- *Note:* If `format === 'online'`, `meetingLink` is omitted or masked until the user's registration status is `confirmed`.

### `POST /api/v1/activities` (Organizer only)
- **Request Body**: `Partial<Activity>`
- **Response (201)**: `{ "status": "ok", "data": Activity }`

### `POST /api/v1/activities/:id/cancel` (Organizer only)
- **Request Body**: `{ "reason": string }`
- **Response (200)**: `{ "status": "ok", "data": Activity }`

### `POST /api/v1/activities/:id/postpone` (Organizer only)
- **Request Body**: `{ "newStartDateTime": string, "newEndDateTime": string }`
- **Response (200)**: `{ "status": "ok", "data": Activity }`

### `POST /api/v1/activities/:id/repost` (Organizer only)
- **Request Body**: `{ "newStartDateTime": string, "newEndDateTime": string, "notifyPreviousParticipants": boolean }`
- **Response (200)**: `{ "status": "ok", "data": Activity }`

---

## 3. Registrations (`/api/v1/registrations` & `/api/v1/activities/:id/registrations`)

### `POST /api/v1/activities/:id/registrations`
- **Request Body**: `{ "teamId"?: string }`
- **Response (201)**: `{ "status": "ok", "data": Registration }`
- *Rule:* If instant join & seats available -> `confirmed`. If instant join & full -> `waitlisted`. If approval required -> `pending`.

### `POST /api/v1/registrations/:id/cancel`
- **Response (200)**: `{ "status": "ok", "data": { "success": true } }`
- *Rule:* Cancelling promotes the #1 waitlisted participant to `offered` with a 12-hour countdown (`offerExpiresAt`).

### `POST /api/v1/registrations/:id/confirm-offer`
- **Response (200)**: `{ "status": "ok", "data": Registration }`

### `GET /api/v1/registrations/me`
- **Query Params**: `status`
- **Response (200)**: `{ "status": "ok", "data": Registration[] }`

### `GET /api/v1/activities/:id/applicants` (Organizer only)
- **Response (200)**: `{ "status": "ok", "data": Registration[] }`

### `PATCH /api/v1/registrations/:id/status` (Organizer only)
- **Request Body**: `{ "status": "confirmed" | "rejected", "message"?: string }`
- **Response (200)**: `{ "status": "ok", "data": Registration }`

### `POST /api/v1/activities/:id/attendance` (Organizer only)
- **Request Body**: `{ "records": [{ "userId": string, "attended": boolean }] }`
- **Response (200)**: `{ "status": "ok", "data": { "updated": number } }`

---

## 4. Teams (`/api/v1/teams` & `/api/v1/activities/:id/teams`)

### `GET /api/v1/activities/:id/teams`
- **Response (200)**: `{ "status": "ok", "data": Team[] }`

### `POST /api/v1/activities/:id/teams`
- **Request Body**: `{ "name": string, "description"?: string }`
- **Response (201)**: `{ "status": "ok", "data": Team }`

### `POST /api/v1/teams/join-code`
- **Request Body**: `{ "code": string }`
- **Response (200)**: `{ "status": "ok", "data": Team }`

### `POST /api/v1/teams/:id/leave`
- **Response (200)**: `{ "status": "ok", "data": { "success": true } }`
- *Rule:* If leader leaves, second member automatically inherits leadership.

### `GET /api/v1/activities/:id/solo-pool`
- **Response (200)**: `{ "status": "ok", "data": SoloPoolParticipant[] }`

### `POST /api/v1/activities/:id/solo-pool`
- **Request Body**: `{ "optIn": boolean }`
- **Response (200)**: `{ "status": "ok", "data": { "optedIn": boolean } }`

---

## 5. Notifications, Reviews, Reports, Organizers, Admin & Geo

- `GET /api/v1/notifications` — returns user notifications
- `PATCH /api/v1/notifications/:id/read` — marks individual notification read
- `POST /api/v1/notifications/read-all` — marks all notifications read
- `POST /api/v1/activities/:id/reviews` — create review (attended participants only)
- `GET /api/v1/activities/:id/reviews` — list reviews for activity
- `GET /api/v1/organizers/:id` — get public organizer profile & badge tier
- `GET /api/v1/organizers/:id/activities` — get activities hosted by organizer
- `POST /api/v1/reports` — report activity, user, organizer, or review
- `GET /api/v1/geo/suggest?q=...` — geocoded suggestions
- `GET /api/v1/geo/reverse?lat=...&lng=...` — reverse geocoding
