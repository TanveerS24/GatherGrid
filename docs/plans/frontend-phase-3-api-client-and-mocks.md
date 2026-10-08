# Phase 3 Plan: API Client & Mock Mode

## Goals
- Build the typed API client in packages/shared/src/api-client based on Zod schemas for all resources.
- Central request wrapper with error normalization (ApiError), request IDs, automatic token refresh, httpOnly cookie credentials.
- MSW mock mode (mocks/) with realistic seeded data (activities, organizers with badges, waitlists, teams, notifications).
- Enforce mandatory login rule (ADR 007): unauthenticated requests for browse/activities return 401.
- Document the entire API contract in docs/api-contract.md.

## Schemas & Client Resources
- auth (login, register, logout, me, refresh, forgot/reset password)
- activities (query, getById, create, update, cancel, postpone, repost)
- registrations (join, cancel, listByActivity, approve, reject, attendance)
- teams (create, joinWithCode, soloPool, requests, transferLeadership)
- notifications (list, markRead, markAllRead)
- reviews (create, listByActivity, listByOrganizer)
- reports (create, adminQueue, resolve, dismiss)
- organizers (getProfile, updateProfile, getStats)
- admin (users, organizers, activities, categories, auditLog)
- geo (geocodeSuggestions, reverseGeocode)

## Verification
- Vitest unit tests for api-client and request wrapper.
- MSW handler tests verifying status transitions, capacity limits, and auth enforcement.
- Typecheck across monorepo with 0 errors.
