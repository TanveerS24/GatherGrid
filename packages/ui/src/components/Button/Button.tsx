/**
 * Button component
 *
 * Usage:
 *   <Button>Save</Button>
 *   <Button variant="secondary" size="sm" isLoading>Saving...</Button>
 *   <Button variant="danger" leftIcon={<Trash2 size={16} />}>Delete</Button>
 */
import React from 'react';
import styles from './Button.module.css';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      children,
      className = '',
      disabled,
      ...rest
    },
    ref,
  ) => {
    const classes = [
      styles.button,
      styles[variant],
      styles[size],
      fullWidth ? styles.fullWidth : '',
      isLoading ? styles.loading : '',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <button ref={ref} className={classes} disabled={disabled || isLoading} {...rest}>
        {isLoading && (
          <span className={styles.spinner} aria-hidden="true" />
        )}
        {!isLoading && leftIcon && (
          <span className={styles.icon}>{leftIcon}</span>
        )}
        <span className={styles.label}>{children}</span>
        {!isLoading && rightIcon && (
          <span className={styles.icon}>{rightIcon}</span>
        )}
      </button>
    );
  },
);

Button.displayName = 'Button';
