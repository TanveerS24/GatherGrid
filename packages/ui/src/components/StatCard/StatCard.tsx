/**
 * StatCard — metric display card with label, value, trend indicator, and icon.
 */
import React from 'react';
import { Card } from '../Card/Card';
import styles from './StatCard.module.css';

export interface StatCardProps {
  label: string;
  value: string | number;
  change?: string;
  isPositive?: boolean;
  icon?: React.ReactNode;
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  change,
  isPositive,
  icon,
  className = '',
}) => {
  return (
    <Card variant="flat" padding="md" className={[styles.card, className].filter(Boolean).join(' ')}>
      <div className={styles.header}>
        <span className={styles.label}>{label}</span>
        {icon && <div className={styles.icon}>{icon}</div>}
      </div>
      <div className={styles.valueRow}>
        <span className={styles.value}>{value}</span>
        {change && (
          <span className={[styles.change, isPositive ? styles.positive : styles.negative].join(' ')}>
            {change}
          </span>
        )}
      </div>
    </Card>
  );
};

