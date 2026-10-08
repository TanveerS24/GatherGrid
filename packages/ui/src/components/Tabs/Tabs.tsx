/**
 * Tabs — accessible tab strip for navigating between views.
 */
import React from 'react';
import styles from './Tabs.module.css';

export interface TabItem {
  id: string;
  label: React.ReactNode;
  count?: number;
  disabled?: boolean;
}

export interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (id: string) => void;
  variant?: 'underline' | 'pills';
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onChange,
  variant = 'underline',
  className = '',
}) => {
  return (
    <div className={[styles.tabs, styles[variant], className].filter(Boolean).join(' ')} role="tablist">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            disabled={tab.disabled}
            className={[styles.tab, isActive ? styles.active : ''].filter(Boolean).join(' ')}
            onClick={() => onChange(tab.id)}
          >
            <span>{tab.label}</span>
            {tab.count !== undefined && <span className={styles.count}>{tab.count}</span>}
          </button>
        );
      })}
    </div>
  );
};

