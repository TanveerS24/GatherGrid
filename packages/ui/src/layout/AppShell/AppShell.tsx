/**
 * AppShell — page layout wrapper supporting TopNav or Sidebar with responsive mobile padding.
 */
import React from 'react';
import styles from './AppShell.module.css';

export interface AppShellProps {
  topNav?: React.ReactNode;
  sidebar?: React.ReactNode;
  bottomTabs?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export const AppShell: React.FC<AppShellProps> = ({
  topNav,
  sidebar,
  bottomTabs,
  children,
  className = '',
}) => {
  return (
    <div className={[styles.shell, className].filter(Boolean).join(' ')}>
      {topNav}
      <div className={styles.bodyWrapper}>
        {sidebar}
        <main className={styles.main}>{children}</main>
      </div>
      {bottomTabs}
    </div>
  );
};
