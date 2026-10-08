/**
 * Switch — toggle switch.
 * Usage: <Switch checked={enabled} onChange={setEnabled} label="Enable notifications" />
 */
import React from 'react';
import styles from './Switch.module.css';

export interface SwitchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  label?: React.ReactNode;
  size?: 'sm' | 'md';
}

export const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  ({ label, size = 'md', className = '', id, ...rest }, ref) => {
    const inputId = id ?? 'switch-' + Math.random().toString(36).slice(2);
    return (
      <div className={[styles.wrapper, className].filter(Boolean).join(' ')}>
        <span className={[styles.track, styles[size]].join(' ')}>
          <input ref={ref} type="checkbox" role="switch" id={inputId} className={styles.input} {...rest} />
          <span className={styles.thumb} aria-hidden="true" />
        </span>
        {label && <label htmlFor={inputId} className={styles.label}>{label}</label>}
      </div>
    );
  },
);

Switch.displayName = 'Switch';

