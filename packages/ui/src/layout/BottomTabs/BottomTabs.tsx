/**
 * BottomTabs — fixed bottom navigation bar for mobile participant app.
 */
import React from 'react';
import styles from './BottomTabs.module.css';

export interface TabItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  badge?: number;
}

export interface BottomTabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (id: string) => void;
  className?: string;
}

export const BottomTabs: React.FC<BottomTabsProps> = ({
  tabs,
  activeTab,
  onChange,
  className = '',
}) => {
  return (
    <nav className={[styles.bottomNav, className].filter(Boolean).join(' ')} aria-label="Mobile navigation">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            className={[styles.tab, isActive ? styles.active : ''].filter(Boolean).join(' ')}
            onClick={() => onChange(tab.id)}
            aria-selected={isActive}
          >
            <div className={styles.iconWrapper}>
              {tab.icon}
              {tab.badge !== undefined && tab.badge > 0 && (
                <span className={styles.badge}>{tab.badge}</span>
              )}
            </div>
            <span className={styles.label}>{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
};

