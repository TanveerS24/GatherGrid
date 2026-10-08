/**
 * SegmentedControl — horizontal toggle between 2 or more mutually exclusive options.
 */
import React from 'react';
import styles from './SegmentedControl.module.css';

export interface SegmentOption {
  value: string;
  label: React.ReactNode;
}

export interface SegmentedControlProps {
  options: SegmentOption[];
  value: string;
  onChange: (value: string) => void;
  size?: 'sm' | 'md';
  className?: string;
}

export const SegmentedControl: React.FC<SegmentedControlProps> = ({
  options,
  value,
  onChange,
  size = 'md',
  className = '',
}) => {
  return (
    <div className={[styles.container, styles[size], className].filter(Boolean).join(' ')} role="radiogroup">
      {options.map((opt) => {
        const isSelected = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={isSelected}
            className={[styles.option, isSelected ? styles.selected : ''].filter(Boolean).join(' ')}
            onClick={() => onChange(opt.value)}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
};

