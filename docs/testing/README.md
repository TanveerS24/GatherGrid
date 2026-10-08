# GatherGrid Quality & Automated Testing Guide

This document outlines the testing architecture, execution commands, conventions, debugging workflows, and branch protection requirements for **GatherGrid**.

---

## 1. Architecture Overview

GatherGrid enforces a strict multi-tier testing strategy:

1. **Pure Business Rule Unit Tests (`packages/shared/src/rules/__tests__`)**
   - 100% deterministic pure functions.
   - Zero database or network dependencies.
   - Covers: Registration state machine, capacity calculations, FIFO waitlist promotion, join modes, no-show/attendance accounting, team mechanics & succession, badge tier thresholds, rating averages, haversine geo boundaries, and 24h/1h reminder scheduling.

2. **Backend Integration & Concurrency Tests (`server/src/__tests__/integration`)**
   - High-fidelity integration tests using in-memory MongoDB replica sets (`MongoMemoryServer`) allowing transaction support (`session.withTransaction`).
   - Atomic concurrency checks (e.g., 20 parallel requests competing for 1 seat).
   - Role authorization matrix testing (participant, organizer, admin, unauthenticated).

3. **Design System & Style Guard Tests (`packages/ui/src/`)**
   - Automated token guard scanning tokens to enforce brand rules (no purple/violet/indigo palette tokens, no CSS gradients, prefers-reduced-motion support).
   - Component rendering, keyboard navigation, accessible name and focus handling (`vitest-axe`).

4. **Frontend Feature & Guard Tests (`apps/*`)**
   - Protected route guards (`RequireAuth`, `RequireOrganizerAuth`, `RequireAdminAuth`).
   - Core interactive user flows in Participant Web, Organizer Web, and Admin Web.

5. **End-to-End User Journeys (`e2e/journeys`)**
   - Playwright end-to-end tests covering all 11 critical user journeys across desktop Chromium and mobile viewports.
   - Deterministic mock interception via `e2e/helpers/mockApi.ts` and page objects in `e2e/pages/`.

---

## 2. Running Tests Locally

Use the root npm scripts to run tests across the workspace:

### Run Everything
```bash
npm test
```

### Run by Layer
```bash
# Pure rule modules & frontend component tests
npm run test:unit

# Backend integration tests with in-memory Mongo replica set
npm run test:integration

# Playwright critical journey E2E tests
npm run test:e2e

# Run with test coverage
npm run test:coverage
```

### Static Analysis & Security
```bash
# Lint all workspaces
npm run lint

# TypeScript typecheck
npm run typecheck

# Check dependency vulnerabilities
npm run audit
```

### Running Specific Workspace Suites
```bash
# Shared rule unit tests
npm run test -w packages/shared

# UI design system tests
npm run test -w packages/ui

# Server integration tests
npm run test -w server

# Participant web app tests
npm run test -w apps/participant-web

# Organizer web portal tests
npm run test -w apps/organizer-web

# Admin console tests
npm run test -w apps/admin-web
```

---

## 3. Test Conventions & Guidelines

1. **File Size Limit:** No test file should exceed ~250 lines. Keep test suites modular and focused on a single feature.
2. **Naming Conventions:**
   - Unit & Integration: `*.test.ts` or `*.test.tsx`.
   - Playwright E2E: `*.spec.ts`.
   - Specification-style descriptions: `it("promotes the next waitlisted team when a team is dropped")`.
3. **No Flakiness or Arbitrary Timeouts:**
   - Use fake timers (`vi.useFakeTimers()`) for time-based assertions.
   - For Playwright, use locator assertions (`await expect(locator).toBeVisible()`) rather than `page.waitForTimeout()`.
4. **Never Weaken Assertions:**
   - If a test uncovers a defect, document it in `docs/testing/bugs-found.md`.
   - Tag incomplete prototype features with `@not-implemented` or `@known-bug` skip tags.

---

## 4. Debugging CI Failures

1. **Playwright Trace Viewer:**
   - When an E2E test fails in CI, the trace and video are uploaded as a workflow artifact (`playwright-report`).
   - Download the artifact and inspect locally:
     ```bash
     npx playwright show-trace path/to/trace.zip
     ```
2. **Server Test Logs:**
   - Integration tests output structured errors via Pino. Set `LOG_LEVEL=debug` locally for detailed output.
3. **Flaky Concurrency Tests:**
   - Verify race condition tests by running them repeatedly:
     ```bash
     npx vitest run server/src/__tests__/integration/concurrency/capacityRace.test.ts --repeat=20
     ```

---

## 5. Required Status Checks for Branch Protection

When configuring branch protection on `main` in GitHub Repository Settings, enable **Require status checks to pass before merging** and enforce the following checks:

- `Lint & Typecheck`
- `Backend Unit Rules`
- `Backend Integration Tests`
- `Frontend Unit & Component Tests (packages/ui)`
- `Frontend Unit & Component Tests (apps/participant-web)`
- `Frontend Unit & Component Tests (apps/organizer-web)`
- `Frontend Unit & Component Tests (apps/admin-web)`
- `Monorepo Build Check`
- `Playwright Critical Journeys`
- `NPM Dependency Audit`
- `CodeQL Static Security Analysis`
