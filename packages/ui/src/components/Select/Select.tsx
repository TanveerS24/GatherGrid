/**
 * Select — dropdown select input.
 * Usage: <Select options={[{ value: 'a', label: 'Option A' }]} />
 */
import React from 'react';
import { ChevronDown } from 'lucide-react';
import styles from './Select.module.css';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'children'> {
  options: SelectOption[];
  placeholder?: string;
  error?: string;
  selectSize?: 'sm' | 'md' | 'lg';
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ options, placeholder, error, selectSize = 'md', className = '', ...rest }, ref) => (
    <div className={styles.wrapper}>
      <select
        ref={ref}
        className={[styles.select, styles[selectSize], error ? styles.hasError : '', className].filter(Boolean).join(' ')}
        aria-invalid={error ? 'true' : undefined}
        {...rest}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((o) => (
          <option key={o.value} value={o.value} disabled={o.disabled}>{o.label}</option>
        ))}
      </select>
      <span className={styles.icon}><ChevronDown size={16} /></span>
    </div>
  ),
);

Select.displayName = 'Select';

