/**
 * Card — clean surface card with rounded corners and soft border.
 */
import React from 'react';
import styles from './Card.module.css';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'flat' | 'elevated' | 'interactive';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ variant = 'flat', padding = 'md', className = '', children, ...rest }, ref) => {
    return (
      <div
        ref={ref}
        className={[styles.card, styles[variant], styles['pad-' + padding], className].filter(Boolean).join(' ')}
        {...rest}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';
