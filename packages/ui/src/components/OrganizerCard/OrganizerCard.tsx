/**
 * OrganizerCard — preview card for host profile with badge, rating, and events count.
 */
import React from 'react';
import { Avatar } from '../Avatar/Avatar';
import { OrganizerBadge, type OrganizerBadgeTier } from '../OrganizerBadge/OrganizerBadge';
import { RatingStars } from '../RatingStars/RatingStars';
import { Card } from '../Card/Card';
import styles from './OrganizerCard.module.css';

export interface OrganizerCardProps {
  id: string;
  name: string;
  avatarUrl?: string;
  badgeTier?: OrganizerBadgeTier;
  rating?: number;
  completedEventsCount: number;
  bio?: string;
  onClick?: () => void;
  className?: string;
}

export const OrganizerCard: React.FC<OrganizerCardProps> = ({
  name,
  avatarUrl,
  badgeTier = 'new',
  rating,
  completedEventsCount,
  bio,
  onClick,
  className = '',
}) => {
  return (
    <Card variant="flat" padding="md" className={[styles.card, className].filter(Boolean).join(' ')} onClick={onClick}>
      <div className={styles.header}>
        <Avatar src={avatarUrl} name={name} size="lg" />
        <div className={styles.info}>
          <div className={styles.nameRow}>
            <h4 className={styles.name}>{name}</h4>
            <OrganizerBadge tier={badgeTier} size="sm" />
          </div>
          <div className={styles.stats}>
            {rating !== undefined && <RatingStars value={rating} size="sm" showNumber />}
            <span className={styles.events}>{completedEventsCount} events hosted</span>
          </div>
        </div>
      </div>
      {bio && <p className={styles.bio}>{bio}</p>}
    </Card>
  );
};

