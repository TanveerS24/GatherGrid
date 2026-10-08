/**
 * NotificationItem — individual notification row with icon, timestamp, and unread dot.
 */
import React from 'react';
import { Bell, CheckCircle2, AlertTriangle, Calendar, MessageSquare, Users } from 'lucide-react';
import styles from './NotificationItem.module.css';

export interface NotificationItemProps {
  id: string;
  type: string;
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  onClick?: () => void;
  className?: string;
}

const TYPE_ICONS: Record<string, React.ReactNode> = {
  registration_confirmed: <CheckCircle2 size={16} className={styles.iconSuccess} />,
  activity_cancelled: <AlertTriangle size={16} className={styles.iconDanger} />,
  activity_reminder: <Calendar size={16} className={styles.iconInfo} />,
  announcement: <MessageSquare size={16} className={styles.iconPrimary} />,
  team_request: <Users size={16} className={styles.iconPrimary} />,
};

export const NotificationItem: React.FC<NotificationItemProps> = ({
  type,
  title,
  message,
  timestamp,
  isRead,
  onClick,
  className = '',
}) => {
  const icon = TYPE_ICONS[type] || <Bell size={16} />;

  return (
    <div
      className={[
        styles.item,
        !isRead ? styles.unread : '',
        onClick ? styles.clickable : '',
        className,
      ].filter(Boolean).join(' ')}
      onClick={onClick}
    >
      <div className={styles.iconWrapper}>{icon}</div>
      <div className={styles.content}>
        <div className={styles.header}>
          <span className={styles.title}>{title}</span>
          <span className={styles.time}>{timestamp}</span>
        </div>
        <p className={styles.message}>{message}</p>
      </div>
      {!isRead && <span className={styles.unreadDot} aria-hidden="true" />}
    </div>
  );
};

