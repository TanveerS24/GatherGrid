# Bugs and Prototype Gaps Log

This document records all defects, specification mismatches, and unimplemented prototype capabilities uncovered during test design and execution. In accordance with the project ground rules, tests exposing these issues are tagged with `@known-bug` or `@not-implemented` and skipped/expected-fail so CI remains deterministic while defects stay transparent.

---

## 1. Summary of Identified Defects and Gaps

| Bug ID | Component | Severity | Description | Status |
|---|---|---|---|---|
| `BUG-001` | Server / Auth | High | Separate login routes (`/api/v1/auth/login/participant`, `/organizer`, `/admin`) rejecting opposing roles are missing. | Open (`@not-implemented`) |
| `BUG-002` | Server / Admin | High | Admin API route group (`/api/v1/admin/*`) not implemented in prototype. | Open (`@not-implemented`) |
| `BUG-003` | Server / Notifications | Medium | In-app and email notifications endpoints not mounted on API. | Open (`@not-implemented`) |
| `BUG-004` | Server / Reviews | Medium | Reviews and organizer rating recalculation endpoints missing. | Open (`@not-implemented`) |
| `BUG-005` | Server / Reports | Medium | User and activity reporting endpoints (`/api/v1/reports`) missing. | Open (`@not-implemented`) |
| `BUG-006` | Server / Agenda | High | Agenda background worker for waitlist expiry, reminders, and team lock missing. | Open (`@not-implemented`) |
| `BUG-007` | Database / Indexes | Medium | Registration unique compound index `{ activityId: 1, userId: 1 }` missing in model schema. | Fixed in model & documented in source changes |
| `BUG-008` | Server / Teams | Low | Join code generator was using raw `Math.random().toString(36)` instead of non-ambiguous `JOIN_CODE_CHARSET`. | Fixed via pure rule helper extraction |
| `BUG-009` | Server / Concurrency | High | Parallel registrations without atomic query/transaction can exceed activity capacity under load. | Documented & tested via atomic race test |
| `BUG-010` | Database / Indexes | Medium | Activity geospatial `2dsphere` index missing on location coordinates. | Documented / Fixed in model |

---

## 2. Detailed Bug Reports

### BUG-001: Separate Login Endpoints and Role Isolation Guard Missing
- **Where:** `server/src/modules/auth/auth.routes.ts`
- **Expected:** Specification mandates separate login endpoints per audience or a strict role filter that rejects participant credentials from logging in as organizer/admin and vice versa.
- **Actual:** Only a single unified `POST /api/v1/auth/login` exists which authenticates any valid email/password regardless of audience.
- **Severity:** High
- **Suggested Fix:** Add role-specific login controllers or validate incoming audience against the user's role on login.

### BUG-002: Admin Endpoints Not Implemented
- **Where:** `server/src/modules/admin/`
- **Expected:** Admin endpoints for user suspension, category CRUD, reports queue, and audit log.
- **Actual:** Admin web UI exists with mock state, but backend routes are unmounted.
- **Severity:** High
- **Suggested Fix:** Implement admin controller and route handlers mounted under `/api/v1/admin`.

### BUG-003: Notifications Route Group Missing
- **Where:** `server/src/modules/notifications/`
- **Expected:** Endpoints to list notifications, mark read, and broadcast announcements.
- **Actual:** Schemas exist in `@gathergrid/shared`, but server routes are not mounted.
- **Severity:** Medium
- **Suggested Fix:** Mount `notificationsRoutes` under `/api/v1/notifications`.

### BUG-004: Reviews Route Group Missing
- **Where:** `server/src/modules/reviews/`
- **Expected:** Endpoints to submit and query activity reviews with 7-day edit window enforcement.
- **Actual:** Service and routes are missing in the server.
- **Severity:** Medium
- **Suggested Fix:** Implement reviews service and route handlers.

### BUG-005: Reports Route Group Missing
- **Where:** `server/src/modules/reports/`
- **Expected:** Reporting endpoint with auto-hide threshold (5 reports).
- **Actual:** Route not mounted in Express application.
- **Severity:** Medium
- **Suggested Fix:** Implement reports controller and route handlers.

### BUG-006: Agenda Job Engine Missing
- **Where:** `server/src/jobs/`
- **Expected:** Scheduled background jobs for waitlist offer expiry, reminder dispatch (24h/1h), and team lock deadlines.
- **Actual:** No background job scheduler configured in prototype.
- **Severity:** High
- **Suggested Fix:** Wire Agenda instance with MongoDB connection and job definitions.
