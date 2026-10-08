# Phase 2 Report: Design System (`packages/ui`)

## What was built

### Shared Design Tokens & Global CSS
- Token specification in `packages/ui/src/tokens.ts` (colors, typography, radii, shadows, spacing, transitions).
- Global styles in `packages/ui/src/styles/global.css` declaring all CSS custom properties on `:root` with light-theme palette, category color variables, accessible focus ring, reset, and reduced-motion support.

### Complete UI Component Library (`packages/ui`)
Every component was built with:
- One component per file with its own `.module.css`.
- Strict typing and full props interface exported.
- Design token CSS variables used exclusively (no hardcoded ad-hoc styles).
- Accessible keyboard navigation, ARIA attributes, and roles.

#### Form Controls
- `Button` — variants (`primary`, `secondary`, `outline`, `ghost`, `danger`), sizes (`xs`, `sm`, `md`, `lg`), loading spinner, icon slots.
- `IconButton` — accessible `aria-label`, variants, round toggle.
- `Input` — text input with error states, left/right addons, sizes.
- `PasswordInput` — secure input with show/hide password toggle.
- `Textarea` — multi-line text input with custom resize and error styling.
- `Select` — custom styled select with options list and chevron.
- `MultiSelect` — multi-tag selection dropdown with chip dismiss.
- `Checkbox` — custom checkmark indicator with label.
- `RadioGroup` — vertical/horizontal radio options with descriptions.
- `Switch` — accessible toggle switch with animated thumb.
- `Slider` — continuous range slider for radius selection (1 to 100 km).
- `NumberStepper` — increment/decrement stepper with min/max bounds.
- `DateTimePicker` — timezone-aware datetime picker.
- `FormField` — wrapper for label, required asterisk, helper text, and error messages.

#### Badges, Chips, Pills & Avatars
- `Badge` — semantic status tags (`default`, `primary`, `success`, `warning`, `danger`, `info`, `muted`).
- `Chip` — removable tag chip with dismiss button.
- `CategoryChip` — emoji-coded category badges using flat category colors.
- `StatusPill` — activity and registration lifecycle indicator with colored dot.
- `Avatar` — user/host image with automatic initials and hashed fallback colors.
- `AvatarStack` — overlapping avatars with `+N` overflow indicator.

#### Containers & Overlays
- `Card` — clean surface card (`flat`, `elevated`, `interactive`).
- `Modal` — accessible dialog overlay with focus trap, backdrop blur, ESC key dismiss.
- `ConfirmDialog` — confirmation modal with destructive warning styling.
- `Drawer` — slide-over side drawer for desktop filter panel.
- `BottomSheet` — mobile slide-up sheet with gesture handle.

#### Navigation & Interactive Controls
- `Tabs` — tab strip (`underline`, `pills`) with count pills.
- `SegmentedControl` — horizontal radio switch for view modes (List / Map).
- `Tooltip` — hover bubble with accessible attributes.
- `Dropdown` — action menu with trigger and floating item list.
- `Pagination` — previous/next page navigation.
- `InfiniteList` — scroll sentinel with `IntersectionObserver` trigger.

#### States & Visual Feedback
- `Toast` & `ToastProvider` (`useToast`) — app-wide notification system with success/error/warning/info toasts.
- `Skeleton` — placeholder shimmer loader matching target elements.
- `EmptyState` — friendly illustration/icon, title, message, and call-to-action button.
- `ErrorState` — error boundary display with retry action.
- `Stepper` — multi-step progress bar with completed checkmarks.

#### Domain-Specific UI
- `SeatMeter` — capacity gauge ("Registered 37 / 50 seats") with warning and full color states.
- `RatingStars` — 1-5 star rating component supporting display and interactive input.
- `OrganizerBadge` — host tier badge (Bronze, Silver, Gold, New Organizer) with tooltip explanations.
- `ImageUploader` — drag-and-drop file upload with preview and client-side validation.
- `MapView` — map container shell ready for Leaflet layers in Phase 5.
- `MapPin` — category-colored pin marker.
- `ActivityCard` — rich card with banner, category chip, distance, seats meter, host badge, instant join tag.
- `ActivityCardCompact` — condensed activity item for map popups and lists.
- `OrganizerCard` — organizer preview card with avatar, rating, completed events count, bio.
- `ReviewCard` — participant review card with rating stars and comment.
- `TeamCard` — team card with avatar stack, min/max size indicator, and status.
- `NotificationItem` — notification row with icon, timestamp, and unread dot.
- `CountdownTimer` — live countdown for waitlist offer claim windows.
- `CopyField` — copy-to-clipboard input for join codes and links.
- `DataTable` — sortable, selectable data table with pagination.
- `StatCard` — metric display with trend change indicators.
- `Charts` (`LineChart`, `BarChart`) — Recharts wrappers using design system tokens.

#### Layout Shells
- `PageHeader` — title, subtitle, back button, actions.
- `TopNav` — desktop navigation bar.
- `BottomTabs` — mobile fixed bottom navigation bar (Explore, Map, Online, My Activities, Me).
- `SidebarNav` — organizer and admin desktop navigation sidebar.
- `AppShell` — unified app frame with responsive layout behavior.

### Component Gallery
- Built dev-accessible Component Gallery in `apps/participant-web` (at `/gallery`) showcasing every component.

## Verified

| Check | Result |
|---|---|
| `npm run typecheck` across all 6 workspaces | ✅ 0 errors |
| `npm run test -w packages/ui` | ✅ 13/13 unit tests pass |
| `apps/participant-web` build & preview | ✅ Verified |
| Design rules (flat colors, light theme, no purple gradient) | ✅ Strict compliance |

## Known limitations
- `MapView` currently renders a placeholder grid and coordinates until Phase 5 when Leaflet & OpenStreetMap tiles are wired up with live clustering.
