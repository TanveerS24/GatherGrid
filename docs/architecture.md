# GatherGrid System Architecture

## Overview
GatherGrid is a city-wide activity and event platform consisting of:
- **Participant Web App (`apps/participant-web`):** Discovers, filters, searches, and joins activities near the user.
- **Organizer Portal (`apps/organizer-web`):** Creates, schedules, monitors, and operates activities and attendances.
- **Admin Panel (`apps/admin-web`):** Oversees moderation, categories, reports, and platform health.
- **Backend API (`server`):** Single modular Express REST API backed by MongoDB with 2dsphere indexing and Agenda job queues.
- **Shared Packages (`packages/*`):**
  - `packages/shared`: Shared Zod validation schemas, TypeScript interfaces, enums, constants.
  - `packages/ui`: Accessible, token-driven component library.
  - `packages/config`: Common ESLint, TypeScript, and Prettier configurations.

## Layered Backend Architecture
Every domain module under `server/src/modules/` adheres to a strict 5-layer separation:
```
Routes ──> Controllers ──> Services ──> Repositories ──> Mongoose Models
                               │
                               └──> Rules (Pure functions, zero DB dependencies)
```
- **Routes:** Route definitions, URL parameters, and auth/role guards.
- **Controllers:** Request extraction, invocation of services, response status mapping.
- **Services:** Workflow orchestration, authorization checks, transaction handling.
- **Rules:** State machines, capacity calculations, badge qualifications, date heuristics.
- **Repositories:** Atomic data operations, MongoDB aggregation, indexing queries.
- **Models:** Mongoose schemas, schema validations, index specifications.

## Security & Reliability
- Strict input validation on all routes using Zod.
- Centralized `AppError` class and global error middleware preventing information leakage.
- Unique request tracing via `X-Request-Id` and structured Pino logs without PII.
- Graceful shutdown handlers for SIGINT/SIGTERM.
