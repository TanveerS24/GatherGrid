# Production Source Changes Log

In accordance with Ground Rule 4:
> "Source changes are allowed ONLY to improve testability (for example dependency injection of a clock, extracting a pure function) or to fix a confirmed bug. Every such change must be listed in `docs/testing/source-changes.md`."

---

## Record of Changes

| Change ID | Date | File Modified | Reason / Justification | Description |
|---|---|---|---|---|
| `SRC-001` | Oct 2026 | `packages/shared/src/rules/` | Testability & Specification Adherence | Extracted pure rule modules for registration state machine, waitlist promotion cutoff, team code generation, badges, and reminder offsets. |
| `SRC-002` | Oct 2026 | `server/src/modules/registrations/registration.model.ts` | Bug Fix (`BUG-007`) | Added compound unique index `{ activityId: 1, userId: 1 }` to prevent duplicate concurrent registrations for the same user. |
| `SRC-003` | Oct 2026 | `server/src/modules/activities/activity.model.ts` | Bug Fix (`BUG-010`) | Added `2dsphere` geospatial index to support location query operations. |
| `SRC-004` | Oct 2026 | `server/src/modules/registrations/registrations.service.ts` | Bug Fix (`BUG-009`) / Race Prevention | Updated registration creation logic with atomic capacity check to ensure exact capacity limits under concurrent joins. |
