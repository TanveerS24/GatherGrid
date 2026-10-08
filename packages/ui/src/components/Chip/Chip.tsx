/**
 * Chip — removable tag chip.
 * Usage: <Chip label="React" onRemove={handleRemove} />
 */
import React from 'react';
import { X } from 'lucide-react';
import styles from './Chip.module.css';

export interface ChipProps {
  label: string;
  onRemove?: () => void;
  variant?: 'default' | 'primary';
  className?: string;
}

export const Chip: React.FC<ChipProps> = ({ label, onRemove, variant = 'default', className = '' }) => (
  <span className={[styles.chip, styles[variant], className].filter(Boolean).join(' ')}>
    {label}
    {onRemove && (
      <button type="button" className={styles.remove} onClick={onRemove} aria-label={`Remove ${label}`}>
        <X size={12} strokeWidth={2.5} />
      </button>
    )}
  </span>
);

