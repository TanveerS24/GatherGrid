/**
 * BottomSheet — mobile-friendly slide up drawer for filters and options.
 */
import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { IconButton } from '../IconButton/IconButton';
import styles from './BottomSheet.module.css';

export interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export const BottomSheet: React.FC<BottomSheetProps> = ({
  isOpen,
  onClose,
  title,
  children,
  className = '',
}) => {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={[styles.sheet, className].filter(Boolean).join(' ')} onClick={(e) => e.stopPropagation()}>
        <div className={styles.handle} aria-hidden="true" />
        <div className={styles.header}>
          {title && <h3 className={styles.title}>{title}</h3>}
          <IconButton label="Close sheet" variant="ghost" size="sm" onClick={onClose} className={styles.closeBtn}>
            <X size={18} />
          </IconButton>
        </div>
        <div className={styles.content}>{children}</div>
      </div>
    </div>
  );
};

