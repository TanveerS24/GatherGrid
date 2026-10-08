/**
 * Checkbox — styled checkbox with label.
 * Usage: <Checkbox checked={checked} onChange={setChecked} label="Accept terms" />
 */
import React from 'react';
import { Check } from 'lucide-react';
import styles from './Checkbox.module.css';

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: React.ReactNode;
  error?: string;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, error, className = '', id, ...rest }, ref) => {
    const inputId = id ?? ('checkbox-' + Math.random().toString(36).slice(2));
    return (
      <div className={[styles.wrapper, className].filter(Boolean).join(' ')}>
        <span className={styles.checkWrapper}>
          <input
            ref={ref}
            type="checkbox"
            id={inputId}
            className={styles.input}
            aria-invalid={error ? 'true' : undefined}
            {...rest}
          />
          <span className={styles.box} aria-hidden="true"><Check size={12} strokeWidth={3} /></span>
        </span>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {label && <label htmlFor={inputId} className={styles.label}>{label}</label>}
          {error && <span style={{ fontSize: '12px', color: '#dc2626' }}>{error}</span>}
        </div>
      </div>
    );
  },
);

Checkbox.displayName = 'Checkbox';

