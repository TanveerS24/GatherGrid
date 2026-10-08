/**
 * Badge — small status indicator.
 * Usage: <Badge variant="success">Confirmed</Badge>
 */
import React from 'react';
import styles from './Badge.module.css';

export type BadgeVariant = 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'muted';

export interface BadgeProps {
  variant?: BadgeVariant;
  size?: 'sm' | 'md';
  children: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ variant = 'default', size = 'md', children, className = '' }) => (
  <span className={[styles.badge, styles[variant], styles[size], className].filter(Boolean).join(' ')}>
    {children}
  </span>
);

