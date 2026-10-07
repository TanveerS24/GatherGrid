# Phase 1: Foundation — Implementation Plan

## Goals

1. Set up an npm workspaces monorepo matching the required repo structure.
2. Configure TypeScript (strict), ESLint, Prettier, and Husky + lint-staged.
3. Create shared packages: `packages/shared` (Zod schemas, types, enums, constants), `packages/config` (shared tsconfig, eslint, prettier), and a stub `packages/ui`.
4. Build the Express backend skeleton in `server/` with:
   - Zod-validated environment configuration (fail fast on missing vars).
   - Pino structured logger with request-id support.
   - Centralized error handling (AppError class, async handler wrapper, global error middleware).
   - Health (`/health`) and readiness (`/ready`) endpoints.
   - Mongoose connection manager with graceful shutdown.
5. Scaffold the three Vite + React + TypeScript frontend apps (`apps/participant-web`, `apps/organizer-web`, `apps/admin-web`) with placeholder pages.
6. Create `docker-compose.yml` (MongoDB + app services).
7. Create CI skeleton (`.github/workflows/ci.yml`).
8. Create `.env.example`, `docs/decisions.md`, `docs/architecture.md`.
9. Verify: lint, type-check, tests, and build all pass.

## Files to Create

### Root
- `package.json` — workspace root with scripts
- `tsconfig.base.json` — base TS config
- `.prettierrc` — Prettier config
- `.prettierignore`
- `.env.example`
- `docker-compose.yml`

### `packages/config/`
- `package.json`
- `eslint.config.mjs` — shared ESLint flat config
- `tsconfig.base.json` — base TS config for packages
- `tsconfig.node.json` — Node-specific TS config
- `tsconfig.react.json` — React-specific TS config
- `prettier.config.mjs`

### `packages/shared/`
- `package.json`
- `tsconfig.json`
- `src/index.ts`
- `src/enums/index.ts` — role, status enums
- `src/constants/index.ts` — app-wide constants
- `src/types/index.ts` — shared TS types
- `src/schemas/env.schema.ts` — Zod env validation schema

### `packages/ui/`
- `package.json`
- `tsconfig.json`
- `src/index.ts` — stub export

### `server/`
- `package.json`
- `tsconfig.json`
- `src/config/env.ts` — env loader + validator
- `src/config/db.ts` — Mongoose connection
- `src/config/index.ts`
- `src/common/errors/AppError.ts`
- `src/common/errors/index.ts`
- `src/common/middleware/errorHandler.ts`
- `src/common/middleware/requestId.ts`
- `src/common/middleware/notFound.ts`
- `src/common/logger.ts` — Pino logger
- `src/common/asyncHandler.ts`
- `src/common/index.ts`
- `src/modules/health/health.routes.ts`
- `src/modules/health/health.controller.ts`
- `src/app.ts` — Express assembly
- `src/server.ts` — Bootstrap
- `tests/health.test.ts`

### `apps/participant-web/`, `apps/organizer-web/`, `apps/admin-web/`
- Each: `package.json`, `tsconfig.json`, `vite.config.ts`, `index.html`, `src/main.tsx`, `src/App.tsx`, `src/app/router.tsx`, `src/vite-env.d.ts`

### Docs
- `docs/decisions.md`
- `docs/architecture.md`

### CI
- `.github/workflows/ci.yml`

## Data Shapes (Phase 1)

### Environment Variables (validated via Zod)
```typescript
{
  NODE_ENV: 'development' | 'production' | 'test',
  PORT: number (default 4000),
  MONGODB_URI: string,
  JWT_ACCESS_SECRET: string,
  JWT_REFRESH_SECRET: string,
  JWT_ACCESS_EXPIRES_IN: string (default '15m'),
  JWT_REFRESH_EXPIRES_IN: string (default '7d'),
  CORS_ORIGINS: string (comma-separated),
  LOG_LEVEL: 'fatal' | 'error' | 'warn' | 'info' | 'debug' | 'trace' (default 'info'),
  SMTP_HOST: string (optional),
  SMTP_PORT: number (optional),
  SMTP_USER: string (optional),
  SMTP_PASS: string (optional),
  GEOCODE_USER_AGENT: string (default 'GatherGrid/1.0'),
}
```

### Health Response
```typescript
{ status: 'ok' | 'error', timestamp: string, uptime: number }
```

### Readiness Response
```typescript
{ status: 'ok' | 'error', db: 'connected' | 'disconnected', timestamp: string }
```

### Standard Error Response
```typescript
{ status: 'error', message: string, code: string, requestId: string, details?: unknown }
```

## Edge Cases
- Missing required env vars → app crashes at boot with a clear Zod error message.
- MongoDB not reachable → readiness returns `{ status: 'error', db: 'disconnected' }`.
- Unknown routes → 404 with standard error format.
- Unhandled errors → 500 with generic message (no leak), logged with full details.
- Graceful shutdown: SIGINT/SIGTERM → close Mongoose, stop HTTP server, exit.

## Tests
- `server/tests/health.test.ts`: GET /health returns 200, GET /ready returns 200 when DB is up, 404 for unknown routes returns standard error format.
- Verify env validation rejects missing required vars.

## Decisions
- Using npm workspaces (not pnpm/yarn) as specified.
- ESLint flat config (v9+) for modern setup.
- Pino (not Winston) as specified.
- MongoDB via Docker Compose; no replica set in dev for simplicity (transactions tested in later phases).
- Frontend apps start as minimal stubs; actual pages built in later phases.
