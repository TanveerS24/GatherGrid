/**
 * Input — text input with error and helper text support.
 *
 * Usage:
 *   <Input label="Email" type="email" placeholder="you@example.com" />
 *   <Input error="Required" />
 */
import React from 'react';
import styles from './Input.module.css';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  leftAddon?: React.ReactNode;
  rightAddon?: React.ReactNode;
  inputSize?: 'sm' | 'md' | 'lg';
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ error, leftAddon, rightAddon, inputSize = 'md', className = '', ...rest }, ref) => {
    const wrapperClasses = [styles.wrapper, leftAddon ? styles.hasLeft : '', rightAddon ? styles.hasRight : '']
      .filter(Boolean)
      .join(' ');

    const inputClasses = [styles.input, styles[inputSize], error ? styles.hasError : '', className]
      .filter(Boolean)
      .join(' ');

    return (
      <div className={wrapperClasses}>
        {leftAddon && <span className={styles.addon}>{leftAddon}</span>}
        <input ref={ref} className={inputClasses} aria-invalid={error ? 'true' : undefined} {...rest} />
        {rightAddon && <span className={`${styles.addon} ${styles.addonRight}`}>{rightAddon}</span>}
      </div>
    );
  },
);

Input.displayName = 'Input';
