/**
 * Avatar — user or organizer image with fallback initials.
 * Usage: <Avatar src={url} name="Jane Smith" size="md" />
 */
import React from 'react';
import styles from './Avatar.module.css';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface AvatarProps {
  src?: string;
  name?: string;
  size?: AvatarSize;
  className?: string;
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('');
}

function stringToColor(s: string): string {
  const colors = ['#FF6B4A','#14B8A6','#FFC93C','#22C55E','#38BDF8','#F59E0B','#EC4899','#8B5CF6'];
  let hash = 0;
  for (let i = 0; i < s.length; i++) hash = s.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length] as string;
}

export const Avatar: React.FC<AvatarProps> = ({ src, name = '', size = 'md', className = '' }) => {
  const initials = name ? getInitials(name) : '?';
  const bg = stringToColor(name || '?');
  return (
    <span
      className={[styles.avatar, styles[size], className].filter(Boolean).join(' ')}
      style={src ? undefined : { background: bg }}
      aria-label={name || undefined}
    >
      {src ? (
        <img src={src} alt={name} className={styles.img} />
      ) : (
        <span className={styles.initials}>{initials}</span>
      )}
    </span>
  );
};

