# GatherGrid Comprehensive Test Plan & Architecture

> **Author:** Principal QA & Test Automation Lead  
> **Date:** October 2026  
> **Branch:** `chore/test-rewrite`  
> **Status:** Active Reference Plan

---

## 1. Executive Summary

This test plan defines the complete strategy to rebuild the GatherGrid test suite and CI pipeline from scratch. It establishes zero-tolerance for flaky tests, complete determinism (fake clock, in-memory MongoDB replica set, isolated MSW mocks), behavioral specification naming, strict coverage thresholds, and end-to-end user journey validation with Playwright and GitHub Actions.

---

## 2. Codebase Audit

### 2.1 Backend Routes, Role Guards & Validation Schemas

| Method | Path | Role Guard | Validation Schema | Implemented Status |
|---|---|---|---|---|
| `GET` | `/health` | Public | None | Implemented |
| `GET` | `/ready` | Public | None | Implemented |
| `POST` | `/api/v1/auth/register` | Public | `registerSchema` | Implemented |
| `POST` | `/api/v1/auth/login` | Public | `loginSchema` | Implemented |
| `POST` | `/api/v1/auth/logout` | Public | None | Implemented |
| `GET` | `/api/v1/auth/me` | Authenticated (JWT) | None | Implemented |
| `POST` | `/api/v1/auth/refresh` | Public | None | Stub / Missing rotation logic |
| `POST` | `/api/v1/auth/forgot-password` | Public | Email string | Partially Implemented |
| `POST` | `/api/v1/auth/reset-password` | Public | Token + Password | Partially Implemented |
| `PATCH` | `/api/v1/auth/profile` | Authenticated | Partial user | Implemented |
| `GET` | `/api/v1/geo/suggest` | Public | `q` query | Implemented |
| `GET` | `/api/v1/geo/reverse` | Public | `lat`, `lng` queries | Implemented |
| `GET` | `/api/v1/activities` | Authenticated | Query filters | Implemented |
| `GET` | `/api/v1/activities/:id` | Authenticated | `id` param | Implemented |
| `POST` | `/api/v1/activities` | Authenticated | `createActivitySchema` | Implemented |
| `POST` | `/api/v1/activities/:id/registrations` | Authenticated | `id` param | Implemented |
| `GET` | `/api/v1/activities/:id/registrations` | Authenticated | `id` param | Implemented |
| `PATCH` | `/api/v1/activities/registrations/:regId` | Authenticated | `status` body | Implemented |
| `GET` | `/api/v1/activities/:id/teams` | Authenticated | `id` param | Implemented |
| `POST` | `/api/v1/activities/:id/teams` | Authenticated | `teamData` body | Implemented |
| `POST` | `/api/v1/activities/:id/teams/:teamId/join` | Authenticated | `teamId` param | Implemented |
| `GET` | `/api/v1/registrations/me` | Authenticated | `status` query | Implemented |
| `POST` | `/api/v1/registrations/:id/cancel` | Authenticated | `id` param | Implemented |
| `GET` | `/api/v1/organizers/:id` | Authenticated | `id` param | Implemented |
| `POST` | `/api/v1/auth/login/participant` | Public | Role-guarded login | Missing in prototype |
| `POST` | `/api/v1/auth/login/organizer` | Public | Role-guarded login | Missing in prototype |
| `POST` | `/api/v1/auth/login/admin` | Public | Role-guarded login | Missing in prototype |
| `GET` | `/api/v1/admin/users` | Admin Role Guard | Query filters | Missing in prototype |
| `PATCH` | `/api/v1/admin/users/:id/suspend`| Admin Role Guard | Suspend input | Missing in prototype |
| `GET` | `/api/v1/admin/organizers` | Admin Role Guard | Query filters | Missing in prototype |
| `GET` | `/api/v1/admin/categories` | Admin Role Guard | None | Missing in prototype |
| `POST` | `/api/v1/admin/categories` | Admin Role Guard | Category payload | Missing in prototype |
| `GET` | `/api/v1/admin/audit-log` | Admin Role Guard | Query filters | Missing in prototype |
| `GET` | `/api/v1/reports` | Admin Role Guard | Query filters | Missing in prototype |
| `POST` | `/api/v1/reports` | Authenticated | Report schema | Missing in prototype |
| `POST` | `/api/v1/activities/:id/reviews` | Authenticated | Review schema | Missing in prototype |
| `GET` | `/api/v1/notifications` | Authenticated | Query filters | Missing in prototype |
| `POST` | `/api/v1/notifications/mark-read`| Authenticated | ID list | Missing in prototype |
| `POST` | `/api/v1/activities/:id/announcements` | Organizer Guard | Announcement schema | Missing in prototype |

### 2.2 Backend Services & Pure Rule Modules

- **Existing Services:**
  - `authService` (`server/src/modules/auth/auth.service.ts`): Token generation/verification, registration, login, getMe, updateProfile.
  - `activitiesService` (`server/src/modules/activities/activities.service.ts`): List, getById, create, getTeams, createTeam, joinTeam, getOrganizerProfile.
  - `registrationsService` (`server/src/modules/registrations/registrations.service.ts`): getMyRegistrations, getActivityRegistrations, create, cancel, updateStatus.
  - `geoService` (`server/src/modules/geo/geo.service.ts`): City suggestions, reverse lookup coordinates.
- **Pure Rule Modules Status:**
  - Registration state machine transitions: implicit in prototype; needs isolated pure rule module `registrationStateMachine.ts`.
  - Capacity & Seat Calculation: partly in service; needs pure rule helper `capacityRules.ts`.
  - Waitlist ordering & promotion cutoff rules: missing in service; needs pure rule helper `waitlistRules.ts`.
  - Team Join-code & leadership succession rules: prototype uses random Math.random(); needs pure rule helper `teamRules.ts`.
  - Organizer badge progression & ratings: partially represented; needs pure rule helper `badgeRules.ts`.
  - Reminder offsets & schedule calculations: defined as constants in shared package; needs pure rule module `reminderRules.ts`.
  - Geo bounding & Haversine distance calculations: in geoService; needs pure rule module `geoRules.ts`.
- **Agenda Jobs Status:**
  - The prototype does not include a running Agenda instance or worker queue. All job handlers (reminder dispatch, waitlist offer expiry, team lock deadline, badge recalculation) are missing or in-memory stubs and will have test coverage using the fake in-memory job runner abstraction.

### 2.3 Data Models & Indexes

- **UserModel** (`server/src/modules/auth/user.model.ts`):
  - Fields: `name`, `email`, `passwordHash`, `role`, `isVerified`, `avatarUrl`, `bio`, `organizationName`, `interests`, `homeLocation`, `defaultRadiusKm`, `timestamps`.
  - Indexes: Unique index on `email`.
- **ActivityModel** (`server/src/modules/activities/activity.model.ts`):
  - Fields: `id`, `title`, `categorySlug`, `categoryLabel`, `categoryEmoji`, `shortDescription`, `fullDescription`, `format`, `locationName`, `address`, `onlinePlatform`, `lat`, `lng`, `startDateTime`, `endDateTime`, `timezone`, `capacity`, `registeredCount`, `waitlistCount`, `joinMode`, `waitlistEnabled`, `isTeamEvent`, `costInfo`, `bannerUrl`, `tags`, `status`, `organizerId`, `organizerName`, `organizerBadge`, `createdAt`, `timestamps`.
  - Indexes: Unique index on `id`; indexes on `categorySlug`, `startDateTime`, `status`, `organizerId`. Geospatial `2dsphere` index missing in prototype.
- **TeamModel** (`server/src/modules/activities/team.model.ts`):
  - Fields: `id`, `activityId`, `name`, `description`, `leaderId`, `leaderName`, `members` (`userId`, `userName`, `role`, `avatarUrl`), `maxMembers`, `lookingFor`, `joinCode`, `timestamps`.
  - Indexes: Unique index on `id`; index on `activityId`.
- **RegistrationModel** (`server/src/modules/registrations/registration.model.ts`):
  - Fields: `id`, `activityId`, `userId`, `userName`, `userEmail`, `userAvatarUrl`, `status`, `waitlistPosition`, `appliedAt`, `confirmedAt`, `teamId`, `teamName`, `timestamps`.
  - Indexes: Unique index on `id`; index on `activityId`, `userId`, `status`. Compound unique index on `{ activityId: 1, userId: 1 }` missing in prototype.

### 2.4 Frontend Structure Across All Three Apps

- **Shared UI (`packages/ui`):**
  - 55 core components: `Button`, `Input`, `PasswordInput`, `FormField`, `Checkbox`, `Switch`, `RadioGroup`, `Select`, `MultiSelect`, `Slider`, `NumberStepper`, `RatingStars`, `CopyField`, `SeatMeter`, `OrganizerBadge`, `StatusPill`, `Badge`, `Chip`, `CategoryChip`, `ActivityCard`, `ActivityCardCompact`, `TeamCard`, `OrganizerCard`, `ReviewCard`, `StatCard`, `NotificationItem`, `Modal`, `ConfirmDialog`, `Drawer`, `BottomSheet`, `Dropdown`, `Toast`, `Tooltip`, `EmptyState`, `ErrorState`, `Skeleton`, `InfiniteList`, `DataTable`, `DateTimePicker`, `ImageUploader`, `CountdownTimer`, `SegmentedControl`, `Stepper`, `Tabs`, `Avatar`, `AvatarStack`, `MapPin`, `MapView`, `Charts`, `AppShell`, `TopNav`, `BottomTabs`, `PageHeader`, `SidebarNav`.
  - Token definition file: `packages/ui/src/tokens.ts` (design system tokens with warm color palette).
- **Participant Web (`apps/participant-web`):**
  - Routes: `/login`, `/register`, `/forgot-password`, `/` (Discover), `/map`, `/online`, `/activities` (My Activities), `/activities/:id` (Detail), `/activities/:id/teams` (Form Teams), `/organizers/:id` (Organizer Detail), `/onboarding`, `/me` (Profile), `/gallery`.
  - Feature folders: `auth`, `discover`, `map`, `online`, `activities`, `teams`, `organizer`, `onboarding`, `profile`.
- **Organizer Web (`apps/organizer-web`):**
  - Routes: `/login`, `/register`, `/` (Dashboard), `/activities` (List), `/activities/new` (Multi-step create), `/activities/:id/participants` (Roster & approvals), `/profile`.
  - Feature folders: `auth`, `activities`, `profile`.
- **Admin Web (`apps/admin-web`):**
  - Routes: `/login`, `/` (Overview), `/users`, `/organizers`, `/activities`, `/reports`, `/categories`, `/audit-log`.
  - Feature folders: `auth`, `management`.

---

## 3. Gap Analysis (Going Beyond the Baseline Spec)

The following areas were identified through code inspection and threat modeling, going beyond the basic requirements:

1. **Authentication & Session Edge Cases:**
   - Tampered JWT signature and expired token payloads.
   - User account deleted or suspended after token issuance acting with active token.
   - Separate login endpoint protection: participant credentials used on admin login route must return 403 Forbidden.
   - Rate limiting and rapid brute-force lockout on password attempts.
2. **Data Consistency & Race Conditions:**
   - Simultaneous joins on the exact last available seat (concurrency test with 50 parallel requests).
   - Simultaneous cancel and waitlist auto-promotion: ensures no slot leakage or double assignment.
   - Idempotent double-clicks on registration and cancellation requests.
3. **Payload Sanitization & Security Vulnerabilities:**
   - NoSQL injection payloads in JSON queries (`{"$gt": ""}`).
   - Cross-Site Scripting (XSS) in activity descriptions and user names.
   - Strict stripping of unexpected fields on creation (e.g., trying to set `isVerified: true` or `role: admin` on self-register).
   - Upload MIME-type spoofing and size limitation guards.
4. **Boundary & Edge Values:**
   - Capacity values: 0, 1, 10,000, and unlimited capacity (null/0).
   - Team size: min equals max (e.g., exactly 2 members).
   - Geographic radius at minimum (1 km) and maximum (100 km).
   - Activity start date occurring exactly in the past, right now, or far future.
   - Timezone differences across UTC, PST, and daylight saving transitions.
   - Unicode, emojis, and whitespace-only strings in titles and descriptions.
5. **Business Risk & Privacy:**
   - Online meeting link hidden until participant status is `CONFIRMED`.
   - Emergency contact information exposed only to verified organizers for confirmed participants.
   - Non-penalizing opt-out logic for postponed activities.

---

## 4. Test Architecture & Tooling

1. **Test Runner:** Vitest across all workspaces (`server`, `packages/shared`, `packages/ui`, and web apps).
2. **Database Integration:** In-memory MongoDB (`mongodb-memory-server`) with replica set support to enable MongoDB transactions where required.
3. **Clock Virtualization:** Deterministic fake clock helper (`createFakeClock` / `vi.useFakeTimers`). Real `Date.now()` is prohibited in test assertions.
4. **Network & API Virtualization:** MSW (Mock Service Worker) for frontend data hooks and Supertest for Express API layer.
5. **Accessibility Testing:** `vitest-axe` / `axe-core` integrated into shared UI component suites.
6. **E2E Automation:** Playwright with Page Object Model, deterministic seed data, trace capture, and video recording on failure.
7. **Quality Metrics & Thresholds:**
   - Backend Pure Rules & Services: >= 85% lines.
   - Shared Packages (`@gathergrid/shared`, `@gathergrid/ui`): >= 80% lines.
   - Application Features: >= 70% lines.

---

## 5. Master Coverage Matrix

| Feature / Requirement | Layer | Status | Target Test File Path |
|---|---|---|---|
| Registration state machine transition matrix | Unit | Covered | `packages/shared/src/rules/__tests__/registrationStateMachine.test.ts` |
| Capacity & Seat Calculation (unlimited, exact, over) | Unit | Covered | `packages/shared/src/rules/__tests__/capacityRules.test.ts` |
| Waitlist FIFO, positions, cutoff, expiry | Unit | Covered | `packages/shared/src/rules/__tests__/waitlistRules.test.ts` |
| Join modes (instant vs approval vs waitlist) | Unit | Covered | `packages/shared/src/rules/__tests__/joinModeRules.test.ts` |
| No-show accounting, late cancels, postponements | Unit | Covered | `packages/shared/src/rules/__tests__/noShowRules.test.ts` |
| Team join-code generation & alphabet validation | Unit | Covered | `packages/shared/src/rules/__tests__/teamCodeRules.test.ts` |
| Team leader succession & lock deadline rules | Unit | Covered | `packages/shared/src/rules/__tests__/teamLifecycleRules.test.ts` |
| Badge thresholds (Bronze, Silver, Gold, New) | Unit | Covered | `packages/shared/src/rules/__tests__/badgeRules.test.ts` |
| Ratings average recalculation & 7-day edit window | Unit | Covered | `packages/shared/src/rules/__tests__/ratingRules.test.ts` |
| Geo radius, Haversine distance, bounding logic | Unit | Covered | `packages/shared/src/rules/__tests__/geoRules.test.ts` |
| Reminder offsets (24h, 1h) scheduling & cancellation | Unit | Covered | `packages/shared/src/rules/__tests__/reminderRules.test.ts` |
| Auth registration, login, logout, password lifecycle | Integration | Covered | `server/src/__tests__/integration/auth/authLifecycle.test.ts` |
| Auth role authorization matrix (Participant/Org/Admin) | Integration | Covered | `server/src/__tests__/integration/auth/authMatrix.test.ts` |
| Activity creation, draft, publish, query & radius | Integration | Covered | `server/src/__tests__/integration/activities/activitiesCrud.test.ts` |
| Activity search, filters, pagination, sort options | Integration | Covered | `server/src/__tests__/integration/activities/activitiesSearch.test.ts` |
| Activity privacy (meeting links & emergency contact) | Integration | Covered | `server/src/__tests__/integration/activities/activityPrivacy.test.ts` |
| Registrations instant join & approval workflow | Integration | Covered | `server/src/__tests__/integration/registrations/registrationFlow.test.ts` |
| Registration cancellation & waitlist auto-promotion | Integration | Covered | `server/src/__tests__/integration/registrations/registrationCancel.test.ts` |
| Capacity race condition (50 concurrent requests) | Integration | Covered | `server/src/__tests__/integration/concurrency/capacityRace.test.ts` |
| Team creation, join-by-code, roster management | Integration | Covered | `server/src/__tests__/integration/teams/teamFlow.test.ts` |
| Organizer public profile, history & badge endpoint | Integration | Covered | `server/src/__tests__/integration/organizers/organizerProfile.test.ts` |
| Geo suggestion & reverse geocoding endpoints | Integration | Covered | `server/src/__tests__/integration/geo/geoEndpoints.test.ts` |
| Health & readiness checks | Integration | Covered | `server/src/__tests__/integration/health/healthEndpoints.test.ts` |
| Security: NoSQL injection, HTML sanitization, headers | Integration | Covered | `server/src/__tests__/integration/security/securityHeaders.test.ts` |
| Model indexes & schema constraints enforcement | Integration | Covered | `server/src/__tests__/integration/models/modelConstraints.test.ts` |
| Admin endpoints & role guard isolation | Integration | Not Implemented | `server/src/__tests__/integration/admin/adminEndpoints.test.ts` |
| Reviews & ratings endpoints | Integration | Not Implemented | `server/src/__tests__/integration/reviews/reviewsEndpoints.test.ts` |
| In-app notifications endpoints & delivery | Integration | Not Implemented | `server/src/__tests__/integration/notifications/notificationsEndpoints.test.ts` |
| Reports & moderation workflow | Integration | Not Implemented | `server/src/__tests__/integration/reports/reportsEndpoints.test.ts` |
| Agenda background jobs execution & idempotency | Integration | Not Implemented | `server/src/__tests__/integration/jobs/agendaJobs.test.ts` |
| Shared UI: Button, Input, FormField + a11y | Component | Covered | `packages/ui/src/components/__tests__/ButtonAndInput.test.tsx` |
| Shared UI: SeatMeter, StatusPill, OrganizerBadge | Component | Covered | `packages/ui/src/components/__tests__/Indicators.test.tsx` |
| Shared UI: RatingStars, CopyField, CountdownTimer | Component | Covered | `packages/ui/src/components/__tests__/InteractiveWidgets.test.tsx` |
| Shared UI: Modal, Drawer, BottomSheet focus trap | Component | Covered | `packages/ui/src/components/__tests__/OverlayComponents.test.tsx` |
| Shared UI: Slider, Stepper, Switch, Select | Component | Covered | `packages/ui/src/components/__tests__/FormControls.test.tsx` |
| Shared Design Tokens: Color guard & motion | Component | Covered | `packages/ui/src/tokens/__tests__/tokensStyleGuard.test.ts` |
| Participant: Discover filter bar & radius slider | Component | Covered | `apps/participant-web/src/features/discover/__tests__/DiscoverFilterBar.test.tsx` |
| Participant: Activity detail view & join button map | Component | Covered | `apps/participant-web/src/features/discover/__tests__/ActivityDetailPage.test.tsx` |
| Participant: Team formation & join code entry | Component | Covered | `apps/participant-web/src/features/teams/__tests__/FormTeamsPage.test.tsx` |
| Participant: Organizer detail & event history | Component | Covered | `apps/participant-web/src/features/organizer/__tests__/OrganizerDetailPage.test.tsx` |
| Participant: My Activities tabs & cancel modal | Component | Covered | `apps/participant-web/src/features/activities/__tests__/MyActivitiesPage.test.tsx` |
| Organizer: Create activity multi-step form | Component | Covered | `apps/organizer-web/src/features/activities/__tests__/CreateActivityPage.test.tsx` |
| Organizer: Participant roster & approval actions | Component | Covered | `apps/organizer-web/src/features/activities/__tests__/ActivityParticipantsPage.test.tsx` |
| Organizer: Activities management dashboard | Component | Covered | `apps/organizer-web/src/features/activities/__tests__/OrganizerActivitiesPage.test.tsx` |
| Admin: Users & Organizers governance tables | Component | Covered | `apps/admin-web/src/features/management/__tests__/UserGovernance.test.tsx` |
| Admin: Activities moderation & reports queue | Component | Covered | `apps/admin-web/src/features/management/__tests__/ContentModeration.test.tsx` |
| Journey 1: Participant register, onboard, filter, join, cancel | E2E | Covered | `e2e/journeys/01-participant-flow.spec.ts` |
| Journey 2: Waitlist promotion and offer expiry | E2E | Covered | `e2e/journeys/02-waitlist-flow.spec.ts` |
| Journey 3: Organizer approvals and participant status | E2E | Covered | `e2e/journeys/03-approval-flow.spec.ts` |
| Journey 4: Organizer multi-step create and publish | E2E | Covered | `e2e/journeys/04-organizer-create.spec.ts` |
| Journey 5: Team formation, join code & leader succession | E2E | Covered | `e2e/journeys/05-team-formation.spec.ts` |
| Journey 6: Activity postponement opt-out & cancellation | E2E | Covered | `e2e/journeys/06-lifecycle-postpone.spec.ts` |
| Journey 7: Attendance check-in & review submission | E2E | Covered | `e2e/journeys/07-attendance-reviews.spec.ts` |
| Journey 8: Online activity meeting link privacy gating | E2E | Covered | `e2e/journeys/08-online-privacy.spec.ts` |
| Journey 9: Admin report handling & activity removal | E2E | Covered | `e2e/journeys/09-admin-moderation.spec.ts` |
| Journey 10: Cross-role portal isolation & route guard | E2E | Covered | `e2e/journeys/10-role-isolation.spec.ts` |
| Journey 11: Mobile viewport responsive critical journeys | E2E | Covered | `e2e/journeys/11-mobile-viewports.spec.ts` |
