# Phase 1 Report: Foundation

## What was built

### Monorepo structure
- npm workspaces monorepo at `gathergrid/` root
- Workspace layout: `packages/config`, `packages/shared`, `packages/ui`, `server`, `apps/participant-web`, `apps/organizer-web`, `apps/admin-web`
- Root `package.json` with aggregate scripts (`build`, `lint`, `typecheck`, `test`, `test:ci`)
- Husky + lint-staged pre-commit hooks wired up
- Prettier + `.prettierrc` + `.prettierignore` consistent across all workspaces

### `packages/config`
- Shared ESLint flat config (v9+) with TypeScript-ESLint rules
- Shared `tsconfig.base.json`, `tsconfig.node.json`, `tsconfig.react.json`
- Shared Prettier config as an ES module

### `packages/shared`
- All domain enums: `UserRole`, `ActivityStatus`, `RegistrationStatus`, `JoinMode`, `ActivityFormat`, `ReportStatus`, `ReportTargetType`, `OrganizerBadge`, `NotificationType`, `TeamRequestType`, `TeamRequestStatus`
- All business constants in one file: badge thresholds, waitlist windows, reminder offsets, pagination defaults, upload limits, join code charset, etc.
- Shared TypeScript interfaces: `GeoPoint`, `PaginatedResponse<T>`, `ApiErrorResponse`, `ApiSuccessResponse<T>`, `HealthResponse`, `ReadinessResponse`, `BaseDocument`, `AttendanceRecord`, `TokenPayload`
- `envSchema` Zod schema for environment variable validation

### `packages/ui`
- Design tokens (colors, fonts, spacing, radii, shadows, transitions) aligned to Section 5 spec
- `generateCSSVariables()` utility to produce `:root {}` CSS custom properties
- Stub index — components deferred to Phase 2

### `server` (Express API)
- Zod-validated environment loader — fails fast at boot with itemized error if any required var is missing
- MongoDB connection manager with connect/disconnect/readiness helpers
- Pino structured logger with pino-pretty in dev; LOG_LEVEL-controlled
- `AppError` class with static factory methods (badRequest, unauthorized, forbidden, notFound, conflict, tooManyRequests, internal)
- `asyncHandler` wrapper to remove try-catch boilerplate from controllers
- `requestIdMiddleware` — UUID per request, echoes incoming `X-Request-Id` header
- `errorHandler` — converts `ZodError`, `AppError`, and unknown errors into consistent `ApiErrorResponse` format without leaking internals
- `notFoundHandler` — 404 in standard format for unknown routes
- `GET /health` — liveness check with uptime
- `GET /ready` — readiness check with MongoDB state (503 if disconnected)
- Helmet, CORS (origin allowlist from env), express-mongo-sanitize, 1 MB body limit
- Graceful shutdown on SIGINT/SIGTERM with 10 s forced-exit fallback

### Frontend app stubs
- `apps/participant-web` (port 5173), `apps/organizer-web` (port 5174), `apps/admin-web` (port 5175)
- Each: Vite + React 18 + TypeScript, `/api` proxy to server, stub `App.tsx` + `main.tsx`

### Infrastructure
- `docker-compose.yml` — MongoDB 7.0 with named volume
- `.env.example` — all variables documented
- `.github/workflows/ci.yml` — Node 20/22 matrix, lint + typecheck + test + build
- `docs/plans/phase-1-foundation.md`, `docs/decisions.md`, `docs/architecture.md`

## Verified

| Check | Result |
|---|---|
| `npm install` | ✅ Exit 0 |
| `npm approve-scripts` for mongodb-memory-server & esbuild | ✅ Done |
| **5/5 integration tests** (`GET /health`, `GET /ready`, 404, request-id, echoed-id) | ✅ All pass |
| **TypeScript typecheck** — all 6 workspaces | ✅ Zero errors |
| **Build** — `server` (tsc), `participant-web`, `organizer-web`, `admin-web` (vite) | ✅ All succeed |

## Known limitations

- No lint script run yet (added in CI but ESLint package versions in individual workspace may need fixing in Phase 2 when we add react-specific rules).
- Husky `.husky/pre-commit` hook file not yet created (needs `husky init` or manual creation — no-op until a commit is attempted).
- MongoDB is not in replica set for dev; multi-document transactions needed in Phase 5 will be handled by enabling a replica set in docker-compose at that point (recorded in `docs/decisions.md` ADR 001).
