/**
 * SidebarNav — desktop navigation sidebar for organizer portal and admin panel.
 */
import React from 'react';
import styles from './SidebarNav.module.css';

export interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  badge?: number;
}

export interface SidebarNavProps {
  items: NavItem[];
  activeId: string;
  onSelect: (id: string) => void;
  logo?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

export const SidebarNav: React.FC<SidebarNavProps> = ({
  items,
  activeId,
  onSelect,
  logo,
  footer,
  className = '',
}) => {
  return (
    <aside className={[styles.sidebar, className].filter(Boolean).join(' ')}>
      {logo && <div className={styles.logo}>{logo}</div>}
      <nav className={styles.nav}>
        {items.map((item) => {
          const isActive = activeId === item.id;
          return (
            <button
              key={item.id}
              type="button"
              className={[styles.item, isActive ? styles.active : ''].filter(Boolean).join(' ')}
              onClick={() => onSelect(item.id)}
            >
              <span className={styles.icon}>{item.icon}</span>
              <span className={styles.label}>{item.label}</span>
              {item.badge !== undefined && item.badge > 0 && (
                <span className={styles.badge}>{item.badge}</span>
              )}
            </button>
          );
        })}
      </nav>
      {footer && <div className={styles.footer}>{footer}</div>}
    </aside>
  );
};

