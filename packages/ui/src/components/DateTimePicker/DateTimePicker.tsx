/**
 * DateTimePicker — accessible date and time input with timezone indicator.
 */
import React from 'react';
import { Calendar } from 'lucide-react';
import styles from './DateTimePicker.module.css';

export interface DateTimePickerProps {
  value?: string; // ISO string or YYYY-MM-DDTHH:mm
  onChange: (value: string) => void;
  min?: string;
  max?: string;
  disabled?: boolean;
  error?: string;
  className?: string;
}

export const DateTimePicker: React.FC<DateTimePickerProps> = ({
  value = '',
  onChange,
  min,
  max,
  disabled = false,
  error,
  className = '',
}) => {
  return (
    <div className={[styles.wrapper, error ? styles.hasError : '', className].filter(Boolean).join(' ')}>
      <span className={styles.icon} aria-hidden="true">
        <Calendar size={18} />
      </span>
      <input
        type="datetime-local"
        className={styles.input}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        min={min}
        max={max}
        disabled={disabled}
      />
    </div>
  );
};

