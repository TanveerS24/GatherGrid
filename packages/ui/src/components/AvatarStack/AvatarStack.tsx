/**
 * AvatarStack — overlapping group of avatars with overflow count.
 * Usage: <AvatarStack users={[{ name, src }]} max={4} />
 */
import React from 'react';
import { Avatar, type AvatarSize } from '../Avatar/Avatar';
import styles from './AvatarStack.module.css';

export interface StackUser { name: string; src?: string; }

export interface AvatarStackProps {
  users: StackUser[];
  max?: number;
  size?: AvatarSize;
  className?: string;
}

export const AvatarStack: React.FC<AvatarStackProps> = ({ users, max = 4, size = 'sm', className = '' }) => {
  const shown = users.slice(0, max);
  const overflow = users.length - shown.length;
  return (
    <div className={[styles.stack, className].filter(Boolean).join(' ')}>
      {shown.map((u, i) => (
        <Avatar key={i} name={u.name} src={u.src} size={size} className={styles.avatar} />
      ))}
      {overflow > 0 && (
        <span className={[styles.overflow, styles[size]].join(' ')}>+{overflow}</span>
      )}
    </div>
  );
};
