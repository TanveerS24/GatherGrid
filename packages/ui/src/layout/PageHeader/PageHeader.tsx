/**
 * PageHeader — standardized page top banner with title, optional back button, and actions.
 */
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { IconButton } from '../../components/IconButton/IconButton';
import styles from './PageHeader.module.css';

export interface PageHeaderProps {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  onBack?: () => void;
  actions?: React.ReactNode;
  className?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  onBack,
  actions,
  className = '',
}) => {
  return (
    <header className={[styles.header, className].filter(Boolean).join(' ')}>
      <div className={styles.left}>
        {onBack && (
          <IconButton label="Go back" variant="ghost" size="sm" onClick={onBack} className={styles.backBtn}>
            <ArrowLeft size={18} />
          </IconButton>
        )}
        <div>
          <h1 className={styles.title}>{title}</h1>
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        </div>
      </div>
      {actions && <div className={styles.actions}>{actions}</div>}
    </header>
  );
};

