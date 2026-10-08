/**
 * CopyField — input field with one-click copy button and copied tooltip/toast (for join codes and meeting links).
 */
import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import styles from './CopyField.module.css';

export interface CopyFieldProps {
  value: string;
  label?: string;
  className?: string;
}

export const CopyField: React.FC<CopyFieldProps> = ({
  value,
  label,
  className = '',
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  return (
    <div className={[styles.container, className].filter(Boolean).join(' ')}>
      {label && <span className={styles.label}>{label}</span>}
      <div className={styles.fieldWrapper}>
        <input type="text" readOnly value={value} className={styles.input} />
        <button
          type="button"
          className={[styles.copyBtn, copied ? styles.copied : ''].filter(Boolean).join(' ')}
          onClick={handleCopy}
          aria-label="Copy to clipboard"
        >
          {copied ? <Check size={16} /> : <Copy size={16} />}
          <span>{copied ? 'Copied!' : 'Copy'}</span>
        </button>
      </div>
    </div>
  );
};

