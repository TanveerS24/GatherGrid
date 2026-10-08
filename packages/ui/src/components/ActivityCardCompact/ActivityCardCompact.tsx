/**
 * ActivityCardCompact — horizontal compact item for map popups and quick lists.
 */
import React from 'react';
import { Calendar, MapPin } from 'lucide-react';
import { Card } from '../Card/Card';
import { CategoryChip } from '../CategoryChip/CategoryChip';
import styles from './ActivityCardCompact.module.css';

export interface ActivityCardCompactProps {
  id: string;
  title: string;
  categorySlug: string;
  categoryLabel: string;
  categoryEmoji?: string;
  startDateTime: string;
  locationName: string;
  seatsText: string;
  onClick?: () => void;
  className?: string;
}

export const ActivityCardCompact: React.FC<ActivityCardCompactProps> = ({
  title,
  categorySlug,
  categoryLabel,
  categoryEmoji,
  startDateTime,
  locationName,
  seatsText,
  onClick,
  className = '',
}) => {
  return (
    <Card variant="interactive" padding="sm" className={[styles.card, className].filter(Boolean).join(' ')} onClick={onClick}>
      <div className={styles.header}>
        <CategoryChip slug={categorySlug} label={categoryLabel} emoji={categoryEmoji} size="sm" />
        <span className={styles.seats}>{seatsText}</span>
      </div>
      <h4 className={styles.title}>{title}</h4>
      <div className={styles.meta}>
        <span><Calendar size={12} /> {startDateTime}</span>
        <span><MapPin size={12} /> {locationName}</span>
      </div>
    </Card>
  );
};

