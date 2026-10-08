/**
 * MultiSelect — select multiple items from options list with tag chips.
 */
import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, X } from 'lucide-react';
import styles from './MultiSelect.module.css';

export interface MultiSelectOption {
  value: string;
  label: string;
}

export interface MultiSelectProps {
  options: MultiSelectOption[];
  value: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export const MultiSelect: React.FC<MultiSelectProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Select items...',
  disabled = false,
  className = '',
}) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleOption = (val: string) => {
    if (value.includes(val)) {
      onChange(value.filter((v) => v !== val));
    } else {
      onChange([...value, val]);
    }
  };

  const removeValue = (val: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(value.filter((v) => v !== val));
  };

  return (
    <div ref={containerRef} className={[styles.container, className].filter(Boolean).join(' ')}>
      <div
        className={[styles.trigger, open ? styles.open : '', disabled ? styles.disabled : ''].filter(Boolean).join(' ')}
        onClick={() => !disabled && setOpen(!open)}
        tabIndex={disabled ? -1 : 0}
        role="combobox"
        aria-expanded={open}
      >
        <div className={styles.chips}>
          {value.length === 0 ? (
            <span className={styles.placeholder}>{placeholder}</span>
          ) : (
            value.map((v) => {
              const opt = options.find((o) => o.value === v);
              return (
                <span key={v} className={styles.chip}>
                  {opt ? opt.label : v}
                  <button type="button" onClick={(e) => removeValue(v, e)} className={styles.removeBtn} aria-label="Remove">
                    <X size={12} />
                  </button>
                </span>
              );
            })
          )}
        </div>
        <ChevronDown size={16} className={styles.chevron} />
      </div>

      {open && (
        <div className={styles.dropdown} role="listbox">
          {options.map((opt) => {
            const isSelected = value.includes(opt.value);
            return (
              <div
                key={opt.value}
                className={[styles.option, isSelected ? styles.selected : ''].filter(Boolean).join(' ')}
                onClick={() => toggleOption(opt.value)}
                role="option"
                aria-selected={isSelected}
              >
                <input type="checkbox" checked={isSelected} readOnly className={styles.checkbox} />
                <span>{opt.label}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

