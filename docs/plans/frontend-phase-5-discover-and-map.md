# Frontend Phase 5 Plan: Discover, Map, Online Hub & My Activities

## 1. Goals
1. Deliver the full **Discover & Explore** page (`/`) with keyword search, location input, radius slider (1–100 km), category filter chips, attendance format toggle, and view modes (Grid, List).
2. Deliver the dedicated **Map** page (`/map`) featuring a full Leaflet map with interactive custom pins, popup activity card previews, and radius visualization.
3. Deliver the **Online Activities Hub** (`/online`) showcasing remote and hybrid activities with platform tags, countdown timers, and instant RSVP.
4. Deliver the **My Activities** page (`/activities` & `/me/activities`) with segmented status tabs ("Upcoming / Confirmed", "Waitlisted", "Past"), action controls, and realistic mock data.
5. Deliver the **Activity Details** view (`/activities/:id`) with rich banner, organizer badge, seat meter, map snippet, and RSVP button.
6. Mount all corresponding endpoints in the Express server (`/api/v1/activities`, `/api/v1/registrations/me`, `/api/v1/activities/:id/registrations`) with rich SF fixtures so data renders reliably across dev server and mock runs.
7. Enforce mandatory authentication (**ADR 007**) across all pages.

---

## 2. File & Component Structure
- `apps/participant-web/src/features/discover/DiscoverPage.tsx`: Main activity search and filter feed.
- `apps/participant-web/src/features/discover/ActivityDetailPage.tsx`: Detailed activity view.
- `apps/participant-web/src/features/map/MapPage.tsx`: Interactive Leaflet map view with pins and card previews.
- `apps/participant-web/src/features/online/OnlinePage.tsx`: Virtual events hub.
- `apps/participant-web/src/features/activities/MyActivitiesPage.tsx`: Registered activities manager.
- `server/src/modules/activities/`: Backend activities module serving seed data.
- `server/src/modules/registrations/`: Backend registrations module serving user RSVPs.
- Update `apps/participant-web/src/App.tsx` routes.

---

## 3. State & API Contract
- `activitiesApi.list(params)`: Fetch activities with filters.
- `activitiesApi.getById(id)`: Fetch single activity.
- `registrationsApi.getMyRegistrations()`: Fetch user RSVPs.
- `registrationsApi.register(activityId)`: RSVP to activity.
- `registrationsApi.cancel(registrationId)`: Cancel RSVP.
