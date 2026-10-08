/**
 * RadioGroup — controlled group of radio inputs.
 * Usage: <RadioGroup name="plan" options={[{value:'free',label:'Free'}]} value={v} onChange={setV} />
 */
import React from 'react';
import styles from './RadioGroup.module.css';

export interface RadioOption {
  value: string;
  label: React.ReactNode;
  description?: string;
  disabled?: boolean;
}

export interface RadioGroupProps {
  name: string;
  options: RadioOption[];
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
  orientation?: 'vertical' | 'horizontal';
  className?: string;
}

export const RadioGroup: React.FC<RadioGroupProps> = ({
  name, options, value, onChange, error, orientation = 'vertical', className = '',
}) => (
  <div role="radiogroup" className={[styles.group, styles[orientation], className].filter(Boolean).join(' ')}>
    {options.map((opt) => {
      const id = name + '-' + opt.value;
      return (
        <label key={opt.value} htmlFor={id} className={[styles.option, opt.disabled ? styles.disabled : ''].filter(Boolean).join(' ')}>
          <span className={styles.radioWrapper}>
            <input
              type="radio" id={id} name={name} value={opt.value}
              checked={value === opt.value} onChange={() => onChange?.(opt.value)}
              disabled={opt.disabled} className={styles.input}
            />
            <span className={styles.circle} aria-hidden="true" />
          </span>
          <span>
            <span className={styles.label}>{opt.label}</span>
            {opt.description && <span className={styles.desc}>{opt.description}</span>}
          </span>
        </label>
      );
    })}
    {error && <p className={styles.error}>{error}</p>}
  </div>
);

