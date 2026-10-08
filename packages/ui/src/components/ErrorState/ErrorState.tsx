/**
 * ErrorState — error boundary display with retry option.
 */
import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Button } from '../Button/Button';
import styles from './ErrorState.module.css';

export interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Something went wrong',
  message = 'We could not complete your request. Please try again.',
  onRetry,
  className = '',
}) => {
  return (
    <div className={[styles.errorBox, className].filter(Boolean).join(' ')}>
      <div className={styles.icon}>
        <AlertCircle size={36} />
      </div>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.message}>{message}</p>
      {onRetry && (
        <Button variant="outline" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  );
};

