/**
 * Drawer — slide-over panel from side (e.g. filters on desktop or mobile drawer).
 */
import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { IconButton } from '../IconButton/IconButton';
import styles from './Drawer.module.css';

export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  children: React.ReactNode;
  position?: 'left' | 'right';
  className?: string;
}

export const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  title,
  children,
  position = 'right',
  className = '',
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <aside
        className={[styles.drawer, styles[position], className].filter(Boolean).join(' ')}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.header}>
          {title && <h3 className={styles.title}>{title}</h3>}
          <IconButton label="Close drawer" variant="ghost" size="sm" onClick={onClose}>
            <X size={18} />
          </IconButton>
        </div>
        <div className={styles.content}>{children}</div>
      </aside>
    </div>
  );
};

