/**
 * StatusPill — activity/registration status indicator.
 * Usage: <StatusPill status="confirmed" />
 */
import React from 'react';
import { Circle } from 'lucide-react';
import styles from './StatusPill.module.css';

export type StatusPillStatus =
  | 'published' | 'draft' | 'cancelled' | 'postponed' | 'completed'
  | 'confirmed' | 'pending' | 'rejected' | 'waitlisted' | 'offered' | 'expired' | 'attended' | 'no_show';

const STATUS_LABELS: Record<StatusPillStatus, string> = {
  published: 'Published', draft: 'Draft', cancelled: 'Cancelled', postponed: 'Postponed', completed: 'Completed',
  confirmed: 'Confirmed', pending: 'Pending', rejected: 'Rejected', waitlisted: 'Waitlisted',
  offered: 'Seat Offered', expired: 'Offer Expired', attended: 'Attended', no_show: 'No Show',
};

const STATUS_VARIANTS: Record<StatusPillStatus, string> = {
  published: 'success', draft: 'muted', cancelled: 'danger', postponed: 'warning', completed: 'info',
  confirmed: 'success', pending: 'warning', rejected: 'danger', waitlisted: 'default',
  offered: 'primary', expired: 'muted', attended: 'success', no_show: 'muted',
};

export interface StatusPillProps {
  status: StatusPillStatus;
  label?: string;
  className?: string;
}

export const StatusPill: React.FC<StatusPillProps> = ({ status, label, className = '' }) => (
  <span className={[styles.pill, styles[STATUS_VARIANTS[status] ?? 'default'], className].filter(Boolean).join(' ')}>
    <Circle size={6} className={styles.dot} fill="currentColor" />
    {label ?? STATUS_LABELS[status] ?? status}
  </span>
);

