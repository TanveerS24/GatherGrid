/**
 * ToastProvider & Context for application-wide notifications.
 */
import React, { createContext, useContext, useState, useCallback } from 'react';
import { Toast, type ToastItem, type ToastType } from './Toast';
import styles from './Toast.module.css';

interface ToastContextValue {
  showToast: (message: React.ReactNode, type?: ToastType, duration?: number) => void;
  success: (message: React.ReactNode) => void;
  error: (message: React.ReactNode) => void;
  info: (message: React.ReactNode) => void;
  warning: (message: React.ReactNode) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (message: React.ReactNode, type: ToastType = 'info', duration = 4000) => {
      const id = Math.random().toString(36).slice(2);
      const newToast: ToastItem = { id, message, type, duration };
      setToasts((prev) => [...prev, newToast]);

      if (duration > 0) {
        setTimeout(() => {
          dismiss(id);
        }, duration);
      }
    },
    [dismiss]
  );

  const success = useCallback((msg: React.ReactNode) => showToast(msg, 'success'), [showToast]);
  const error = useCallback((msg: React.ReactNode) => showToast(msg, 'error'), [showToast]);
  const info = useCallback((msg: React.ReactNode) => showToast(msg, 'info'), [showToast]);
  const warning = useCallback((msg: React.ReactNode) => showToast(msg, 'warning'), [showToast]);

  return (
    <ToastContext.Provider value={{ showToast, success, error, info, warning }}>
      {children}
      <div className={styles.container} aria-live="polite">
        {toasts.map((toast) => (
          <Toast key={toast.id} toast={toast} onDismiss={dismiss} />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return ctx;
};

