# Architecture Decision Records (ADR)

## ADR 001: Monorepo Architecture with npm Workspaces
- **Context:** The system consists of three separate frontend applications (`apps/participant-web`, `apps/organizer-web`, `apps/admin-web`), one Express backend (`server`), and shared code packages (`packages/shared`, `packages/ui`, `packages/config`).
- **Decision:** Use native npm workspaces without extra orchestrators like Turbo or Nx to keep tooling minimal and dependable.
- **Consequences:** Simple dependency management with root-level scripts targeting `--workspaces`.

## ADR 002: Modular Clean Layering in Express
- **Context:** Backend maintainability requires avoiding bloated controllers and tight coupling to MongoDB.
- **Decision:** Strict layer separation: `routes -> controllers -> services -> repositories -> models`. Controllers only parse requests and format responses. Services hold business logic. Repositories hold database queries. Pure rules live in dedicated `rules/` subdirectories.
- **Consequences:** Controllers never query Mongoose directly; business rules can be unit-tested without mocking database calls.

## ADR 003: Shared Design Tokens & Vanilla CSS in UI Package
- **Context:** Design requirements specify warm off-white tones, clean typography (Outfit/Nunito + Inter), flat colors, no purple gradients, and strict token-driven theming.
- **Decision:** Shared tokens in `@gathergrid/ui/tokens` with CSS variable generator. Components in `@gathergrid/ui` rely on CSS variables for maximum portability without requiring Tailwind setup across workspaces unless requested.

## ADR 004: Environmental Strictness & Boot Fail-Fast
- **Context:** Missing environment variables cause runtime failures that are hard to diagnose.
- **Decision:** Centralized Zod schema validation (`envSchema`) during app bootstrap. If any variable is missing or malformed, the process immediately logs an itemized error and exits with code 1.
