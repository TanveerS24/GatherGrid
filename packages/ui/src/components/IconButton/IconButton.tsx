/**
 * IconButton — a square button that wraps a single icon.
 *
 * Usage:
 *   <IconButton label="Close" onClick={close}><X size={18} /></IconButton>
 */
import React from 'react';
import styles from './IconButton.module.css';

export type IconButtonVariant = 'ghost' | 'outline' | 'solid';
export type IconButtonSize = 'xs' | 'sm' | 'md' | 'lg';

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string; // accessible name (aria-label)
  variant?: IconButtonVariant;
  size?: IconButtonSize;
  isRound?: boolean;
}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ label, variant = 'ghost', size = 'md', isRound = false, className = '', children, ...rest }, ref) => {
    const classes = [
      styles.iconButton,
      styles[variant],
      styles[size],
      isRound ? styles.round : '',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <button ref={ref} className={classes} aria-label={label} {...rest}>
        {children}
      </button>
    );
  },
);

IconButton.displayName = 'IconButton';
