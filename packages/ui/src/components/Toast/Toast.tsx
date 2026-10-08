/**
 * Toast notification component with icons and dismiss action.
 */
import React from 'react';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';
import styles from './Toast.module.css';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastItem {
  id: string;
  type: ToastType;
  message: React.ReactNode;
  duration?: number;
}

export interface ToastProps {
  toast: ToastItem;
  onDismiss: (id: string) => void;
}

const ICONS = {
  success: <CheckCircle2 size={18} className={styles.iconSuccess} />,
  error: <AlertCircle size={18} className={styles.iconError} />,
  warning: <AlertTriangle size={18} className={styles.iconWarning} />,
  info: <Info size={18} className={styles.iconInfo} />,
};

export const Toast: React.FC<ToastProps> = ({ toast, onDismiss }) => {
  return (
    <div className={[styles.toast, styles[toast.type]].filter(Boolean).join(' ')} role="alert">
      <span className={styles.icon}>{ICONS[toast.type]}</span>
      <div className={styles.message}>{toast.message}</div>
      <button
        type="button"
        className={styles.dismissBtn}
        onClick={() => onDismiss(toast.id)}
        aria-label="Dismiss notification"
      >
        <X size={14} />
      </button>
    </div>
  );
};

