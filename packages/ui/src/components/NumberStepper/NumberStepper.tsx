/**
 * NumberStepper — increment/decrement numeric stepper with min and max bounds.
 */
import React from 'react';
import { Minus, Plus } from 'lucide-react';
import styles from './NumberStepper.module.css';

export interface NumberStepperProps {
  value: number;
  onChange: (val: number) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  className?: string;
}

export const NumberStepper: React.FC<NumberStepperProps> = ({
  value,
  onChange,
  min = 1,
  max = 999,
  step = 1,
  disabled = false,
  className = '',
}) => {
  const handleDecrement = () => {
    if (!disabled && value - step >= min) onChange(value - step);
  };
  const handleIncrement = () => {
    if (!disabled && value + step <= max) onChange(value + step);
  };

  return (
    <div className={[styles.stepper, disabled ? styles.disabled : '', className].filter(Boolean).join(' ')}>
      <button
        type="button"
        className={styles.button}
        onClick={handleDecrement}
        disabled={disabled || value <= min}
        aria-label="Decrease value"
      >
        <Minus size={14} />
      </button>
      <span className={styles.value}>{value}</span>
      <button
        type="button"
        className={styles.button}
        onClick={handleIncrement}
        disabled={disabled || value >= max}
        aria-label="Increase value"
      >
        <Plus size={14} />
      </button>
    </div>
  );
};

