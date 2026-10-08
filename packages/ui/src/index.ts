/**
 * @gathergrid/ui — Shared Design System
 */

// Tokens
export { tokens, generateCSSVariables } from './tokens';

// Form controls
export { Button } from './components/Button';
export type { ButtonProps, ButtonVariant, ButtonSize } from './components/Button';

export { IconButton } from './components/IconButton';
export type { IconButtonProps, IconButtonVariant, IconButtonSize } from './components/IconButton';

export { Input } from './components/Input';
export type { InputProps } from './components/Input';

export { PasswordInput } from './components/PasswordInput';
export type { PasswordInputProps } from './components/PasswordInput';

export { Textarea } from './components/Textarea';
export type { TextareaProps } from './components/Textarea';

export { Select } from './components/Select';
export type { SelectProps, SelectOption } from './components/Select';

export { MultiSelect } from './components/MultiSelect';
export type { MultiSelectProps, MultiSelectOption } from './components/MultiSelect';

export { Checkbox } from './components/Checkbox';
export type { CheckboxProps } from './components/Checkbox';

export { RadioGroup } from './components/RadioGroup';
export type { RadioGroupProps, RadioOption } from './components/RadioGroup';

export { Switch } from './components/Switch';
export type { SwitchProps } from './components/Switch';

export { Slider } from './components/Slider';
export type { SliderProps } from './components/Slider';

export { NumberStepper } from './components/NumberStepper';
export type { NumberStepperProps } from './components/NumberStepper';

export { DateTimePicker } from './components/DateTimePicker';
export type { DateTimePickerProps } from './components/DateTimePicker';

export { FormField } from './components/FormField';
export type { FormFieldProps } from './components/FormField';

// Badges, Chips, Pills
export { Badge } from './components/Badge';
export type { BadgeProps, BadgeVariant } from './components/Badge';

export { Chip } from './components/Chip';
export type { ChipProps } from './components/Chip';

export { CategoryChip } from './components/CategoryChip';
export type { CategoryChipProps, CategorySlug } from './components/CategoryChip';

export { StatusPill } from './components/StatusPill';
export type { StatusPillProps, StatusPillStatus } from './components/StatusPill';

// Avatars
export { Avatar } from './components/Avatar';
export type { AvatarProps, AvatarSize } from './components/Avatar';

export { AvatarStack } from './components/AvatarStack';
export type { AvatarStackProps, StackUser } from './components/AvatarStack';

// Containers & Overlays
export { Card } from './components/Card';
export type { CardProps } from './components/Card';

export { Modal } from './components/Modal';
export type { ModalProps } from './components/Modal';

export { ConfirmDialog } from './components/ConfirmDialog';
export type { ConfirmDialogProps } from './components/ConfirmDialog';

export { Drawer } from './components/Drawer';
export type { DrawerProps } from './components/Drawer';

export { BottomSheet } from './components/BottomSheet';
export type { BottomSheetProps } from './components/BottomSheet';

// Navigation & Interactive
export { Tabs } from './components/Tabs';
export type { TabsProps, TabItem } from './components/Tabs';

export { SegmentedControl } from './components/SegmentedControl';
export type { SegmentedControlProps, SegmentOption } from './components/SegmentedControl';

export { Tooltip } from './components/Tooltip';
export type { TooltipProps } from './components/Tooltip';

export { Dropdown } from './components/Dropdown';
export type { DropdownProps, DropdownItem } from './components/Dropdown';

export { Pagination } from './components/Pagination';
export type { PaginationProps } from './components/Pagination';

export { InfiniteList } from './components/InfiniteList';
export type { InfiniteListProps } from './components/InfiniteList';

// States & Feedback
export { Toast, ToastProvider, useToast } from './components/Toast';
export type { ToastProps, ToastItem, ToastType } from './components/Toast';

export { Skeleton } from './components/Skeleton';
export type { SkeletonProps } from './components/Skeleton';

export { EmptyState } from './components/EmptyState';
export type { EmptyStateProps } from './components/EmptyState';

export { ErrorState } from './components/ErrorState';
export type { ErrorStateProps } from './components/ErrorState';

export { Stepper } from './components/Stepper';
export type { StepperProps, StepItem } from './components/Stepper';

// Domain-Specific UI
export { SeatMeter } from './components/SeatMeter';
export type { SeatMeterProps } from './components/SeatMeter';

export { RatingStars } from './components/RatingStars';
export type { RatingStarsProps } from './components/RatingStars';

export { OrganizerBadge } from './components/OrganizerBadge';
export type { OrganizerBadgeProps, OrganizerBadgeTier } from './components/OrganizerBadge';

export { ImageUploader } from './components/ImageUploader';
export type { ImageUploaderProps } from './components/ImageUploader';

export { MapView } from './components/MapView';
export type { MapViewProps } from './components/MapView';

export { MapPin } from './components/MapPin';
export type { MapPinProps } from './components/MapPin';

// Complex Cards & Rows
export { ActivityCard } from './components/ActivityCard';
export type { ActivityCardProps } from './components/ActivityCard';

export { ActivityCardCompact } from './components/ActivityCardCompact';
export type { ActivityCardCompactProps } from './components/ActivityCardCompact';

export { OrganizerCard } from './components/OrganizerCard';
export type { OrganizerCardProps } from './components/OrganizerCard';

export { ReviewCard } from './components/ReviewCard';
export type { ReviewCardProps } from './components/ReviewCard';

export { TeamCard } from './components/TeamCard';
export type { TeamCardProps } from './components/TeamCard';

export { NotificationItem } from './components/NotificationItem';
export type { NotificationItemProps } from './components/NotificationItem';

// Utilities & Data Viz
export { CountdownTimer } from './components/CountdownTimer';
export type { CountdownTimerProps } from './components/CountdownTimer';

export { CopyField } from './components/CopyField';
export type { CopyFieldProps } from './components/CopyField';

export { DataTable } from './components/DataTable';
export type { DataTableProps, Column } from './components/DataTable';

export { StatCard } from './components/StatCard';
export type { StatCardProps } from './components/StatCard';

export { LineChart, BarChart } from './components/Charts';
export type { ChartProps, ChartDataPoint } from './components/Charts';

// Layout Shells
export { AppShell } from './layout/AppShell';
export type { AppShellProps } from './layout/AppShell';

export { TopNav } from './layout/TopNav';
export type { TopNavProps } from './layout/TopNav';

export { BottomTabs } from './layout/BottomTabs';
export type { BottomTabsProps } from './layout/BottomTabs';

export { SidebarNav } from './layout/SidebarNav';
export type { SidebarNavProps, NavItem } from './layout/SidebarNav';

export { PageHeader } from './layout/PageHeader';
export type { PageHeaderProps } from './layout/PageHeader';
