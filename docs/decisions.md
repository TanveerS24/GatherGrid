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

## ADR 005: Component-Scoped CSS Modules for Design System
- **Context:** Design system components need strict visual encapsulation, zero naming clashes, and conformance to flat light theme tokens without heavyweight utility runtime overhead.
- **Decision:** Use CSS Modules (`*.module.css`) per component referencing CSS variables defined in `@gathergrid/ui/src/styles/global.css`.
- **Consequences:** Every component has independent styles; changing `--gg-*` tokens centrally updates styling across all three apps simultaneously.

## ADR 006: Lightweight Map and Data Visualization Wrappers
- **Context:** Maps and analytics are needed across all three portals, but full leaflet integration and complex charting should not bloat base rendering components.
- **Decision:** `MapView` provides a styled canvas container ready for Leaflet layers (fully connected in Phase 5). `LineChart` and `BarChart` wrap Recharts with fixed styling matching design tokens.
- **Consequences:** Unified interface for cards, stats, and maps throughout the application suite.

