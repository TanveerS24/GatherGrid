/**
 * Slider — interactive slider (e.g. for radius selection 1 to 100 km).
 */
import React from 'react';
import styles from './Slider.module.css';

export interface SliderProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  min?: number;
  max?: number;
  step?: number;
  value: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  unit?: string;
  showValue?: boolean;
}

export const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
  ({ min = 1, max = 100, step = 1, value, unit = 'km', showValue = true, className = '', ...rest }, ref) => {
    const percentage = Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));

    return (
      <div className={[styles.container, className].filter(Boolean).join(' ')}>
        <div className={styles.trackWrapper}>
          <input
            ref={ref}
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            className={styles.rangeInput}
            style={{ '--progress': percentage + '%' } as React.CSSProperties}
            {...rest}
          />
        </div>
        {showValue && (
          <span className={styles.valueDisplay}>
            {value} {unit}
          </span>
        )}
      </div>
    );
  }
);

Slider.displayName = 'Slider';

