# Phase 4 Plan: Auth, Profiles, Onboarding & Mandatory Route Guards

## Goals
- Implement authentication for all three applications:
  1. Participant App (pps/participant-web)
  2. Organizer Portal (pps/organizer-web)
  3. Admin Panel (pps/admin-web)
- Enforce mandatory login across all apps (ADR 007): unauthenticated visitors are redirected to /login with return URL.
- Onboarding wizard for participants (interests, home location, radius).
- Profile pages & settings for participants, organizers, and admins.
- Shared auth store (Zustand + React Hook Form + Zod).

## Components & Structure
- Shared Auth store & hooks: packages/shared/src/auth or app features
- Route guards: <RequireAuth>, <RequireRole>
- Participant App:
  - Auth pages: LoginPage, RegisterPage, ForgotPasswordPage, ResetPasswordPage
  - Onboarding: OnboardingPage
  - Profile: ProfilePage, SettingsPage
- Organizer App:
  - Auth pages: LoginPage, RegisterPage
  - Profile: OrganizerProfilePage
- Admin App:
  - Auth pages: LoginPage (with optional TOTP step)

## Verification
- Unit & component tests for auth forms, route guards, and session state.
- Verify redirect-to-login when browsing unauthenticated.
- Verify return-to-location after successful login.
- Typecheck, tests, and build pass across all workspaces.
