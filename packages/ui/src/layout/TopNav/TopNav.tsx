/**
 * TopNav — desktop & tablet navigation header.
 */
import React from 'react';
import styles from './TopNav.module.css';

export interface TopNavProps {
  logo?: React.ReactNode;
  children?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}

export const TopNav: React.FC<TopNavProps> = ({
  logo,
  children,
  actions,
  className = '',
}) => {
  return (
    <nav className={[styles.nav, className].filter(Boolean).join(' ')} aria-label="Main navigation">
      <div className={styles.container}>
        <div className={styles.left}>
          {logo && <div className={styles.logo}>{logo}</div>}
          <div className={styles.links}>{children}</div>
        </div>
        {actions && <div className={styles.actions}>{actions}</div>}
      </div>
    </nav>
  );
};

