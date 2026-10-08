# Frontend Phase 4 Report: Authentication, Profiles, Onboarding & Mandatory Route Guards

## Overview
In accordance with **ADR 007 (Mandatory Authentication Across All Apps for Browsing and Activities)** and the Master Prompt specifications, Phase 4 delivers comprehensive authentication, user onboarding, profile management, and strict route guarding across all three GatherGrid web portals.

Unauthenticated users cannot browse activities, maps, dashboard pages, or interact with platform content. Any attempted navigation outside public auth paths (`/login`, `/register`, `/forgot-password`) automatically captures the intended location in navigation state and redirects the user to `/login`.

---

## 1. Architecture & Route Guarding (ADR 007)

### Participant Portal (`apps/participant-web`)
- **Route Guard:** `RequireAuth.tsx` verifies auth session on mount via `useAuthStore.checkAuth()`. While verifying, it displays non-jarring skeleton loaders. If unauthenticated, it immediately redirects to `/login` with `state: { from: location }`.
- **Public Routes:**
  - `/login`: Email + password login, remember-me support, link to forgot password and sign up. On successful login, redirects back to the previous target path (`location.state?.from`) or `/`.
  - `/register`: Full registration with instant onboarding handoff.
  - `/forgot-password`: Email recovery request flow with confirmation alert.
- **Mandatory Protected Routes:**
  - `/` (Explore / Activity Discovery)
  - `/map` (City-wide Interactive Leaflet Map)
  - `/online` (Online Activities Hub)
  - `/me` & `/me/profile` (Profile & Activity Management)
  - `/onboarding` (Interests, Home Location, and Radius Setup)
  - `/gallery` (Component Library Showcase)

### Organizer Portal (`apps/organizer-web`)
- **Route Guard:** `RequireOrganizerAuth.tsx` enforces both active authentication and role verification (`user.role === 'ORGANIZER' || user.role === 'ADMIN'`).
- **Public Routes:**
  - `/login`: Host login with clear redirect upon success.
  - `/register`: Organization/Club signup with instant account creation.
- **Mandatory Protected Routes:**
  - `/` (Host Dashboard & Overview)
  - `/activities` (Managed Events)
  - `/activities/new` (Activity Creation Wizard)
  - `/profile` (Public Organizer Profile Settings & Social Links)

### Admin Portal (`apps/admin-web`)
- **Route Guard:** `RequireAdminAuth.tsx` strictly blocks non-staff users, requiring `user.role === 'ADMIN'`.
- **Public Routes:**
  - `/login`: Two-step Staff login (Email/password step followed by 6-digit TOTP two-factor authentication code entry).
- **Mandatory Protected Routes:**
  - `/` (Platform Governance & Moderation Overview)
  - `/users`, `/organizers`, `/activities`, `/reports`, `/categories`, `/audit-log`

---

## 2. Onboarding & Profile Customization

- **Onboarding Flow (`OnboardingPage.tsx`):**
  - **Category Interest Picker:** Select from 10 categories (e.g., Tech & Coding, Outdoors & Hiking, Board Games, Sports & Fitness, Music & Jamming).
  - **Home Location:** Location picker with quick-select options for San Francisco neighborhoods (Mission District, SoMa, Richmond, Marina, Financial District).
  - **Search Radius:** Interactive 1 km to 100 km slider with live visual badge feedback (default: 25 km).
- **Profile Flow (`ProfilePage.tsx`):**
  - Bio and display name updates.
  - Dynamic interest chips toggling.
  - Default radius adjustment.
  - Verification badge and account metadata.

---

## 3. Verification & Quality Gates

- **TypeScript:** 100% strict typechecking pass across all 6 workspaces (`tsc --noEmit`).
- **Unit Tests:** 18/18 tests passing across `@gathergrid/shared`, `@gathergrid/ui`, and `@gathergrid/server`.
- **Production Build:** Vite production build runs cleanly with zero bundle errors.
- **Design System Conformance:** Flat light theme only, CSS variables, zero purple/violet gradients, modular files < 150 lines.
