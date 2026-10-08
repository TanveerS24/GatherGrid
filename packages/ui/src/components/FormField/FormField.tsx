/**
 * FormField — wraps an input control with label, optional helper, error, and required indicator.
 */
import React from 'react';
import styles from './FormField.module.css';

export interface FormFieldProps {
  label?: React.ReactNode;
  htmlFor?: string;
  required?: boolean;
  helperText?: React.ReactNode;
  error?: string;
  children: React.ReactNode;
  className?: string;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  htmlFor,
  required,
  helperText,
  error,
  children,
  className = '',
}) => {
  return (
    <div className={[styles.field, className].filter(Boolean).join(' ')}>
      {label && (
        <label htmlFor={htmlFor} className={styles.label}>
          <span>{label}</span>
          {required && <span className={styles.requiredMark} aria-hidden="true">*</span>}
        </label>
      )}
      <div className={styles.control}>{children}</div>
      {error ? (
        <p className={styles.error} role="alert">{error}</p>
      ) : helperText ? (
        <p className={styles.helper}>{helperText}</p>
      ) : null}
    </div>
  );
};

