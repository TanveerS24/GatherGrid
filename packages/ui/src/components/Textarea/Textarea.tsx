/**
 * Textarea — multi-line input.
 * Usage: <Textarea rows={4} placeholder="Describe..." />
 */
import React from 'react';
import styles from './Textarea.module.css';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
  resize?: 'none' | 'vertical' | 'horizontal' | 'both';
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ error, resize = 'vertical', className = '', style, ...rest }, ref) => (
    <textarea
      ref={ref}
      className={[styles.textarea, error ? styles.hasError : '', className].filter(Boolean).join(' ')}
      style={{ resize, ...style }}
      aria-invalid={error ? 'true' : undefined}
      {...rest}
    />
  ),
);

Textarea.displayName = 'Textarea';
