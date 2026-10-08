# Phase 2 Plan: Design System (packages/ui)

## Goals
- Build every shared UI component listed in Section 5 of the spec.
- Each component: one file, CSS Modules for scoping, tokens via CSS variables.
- Global CSS file with tokens and resets injected by apps.
- Internal component gallery page in apps/participant-web (route /gallery) to visually verify.
- Tests: Vitest + React Testing Library for each component.

## Component list
Button, IconButton, Input, PasswordInput, Textarea, Select, MultiSelect, Checkbox, RadioGroup,
Switch, Slider, NumberStepper, DateTimePicker, FormField, Badge, Chip, CategoryChip, StatusPill,
Avatar, AvatarStack, Card, Modal, ConfirmDialog, Drawer, BottomSheet, Tabs, SegmentedControl,
Toast/ToastProvider, Tooltip, Dropdown, Pagination, InfiniteList, Skeleton, EmptyState, ErrorState,
Stepper, SeatMeter, RatingStars, OrganizerBadge, ImageUploader, MapView (placeholder), MapPin,
ActivityCard, ActivityCardCompact, OrganizerCard, ReviewCard, TeamCard, NotificationItem,
CountdownTimer, CopyField, DataTable, StatCard, BarChart/LineChart wrappers, AppShell,
TopNav, BottomTabs, SidebarNav, PageHeader.

## Key decisions
- CSS Modules scoping (ADR 003 — no Tailwind in packages/ui).
- All transitions via CSS variables (150-200ms).
- MapView is a placeholder stub in Phase 2; real map in Phase 5.
- Charts use recharts.
- Gallery at /gallery is dev-only.
