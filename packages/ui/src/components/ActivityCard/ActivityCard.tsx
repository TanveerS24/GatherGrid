/**
 * ActivityCard — full rich card with banner, category chip, distance, seats meter, organizer badge, and join mode tag.
 */
import React from 'react';
import { Calendar, MapPin } from 'lucide-react';
import { Card } from '../Card/Card';
import { CategoryChip } from '../CategoryChip/CategoryChip';
import { OrganizerBadge, type OrganizerBadgeTier } from '../OrganizerBadge/OrganizerBadge';
import { SeatMeter } from '../SeatMeter/SeatMeter';
import styles from './ActivityCard.module.css';

export interface ActivityCardProps {
  id: string;
  title: string;
  bannerUrl?: string;
  categorySlug: string;
  categoryLabel: string;
  categoryEmoji?: string;
  startDateTime: string;
  locationName: string;
  distanceKm?: number;
  registeredCount: number;
  capacity?: number;
  joinMode: 'instant' | 'approval';
  isTeamEvent?: boolean;
  costInfo?: string;
  organizerName: string;
  organizerBadgeTier?: OrganizerBadgeTier;
  onClick?: () => void;
  className?: string;
}

export const ActivityCard: React.FC<ActivityCardProps> = ({
  title,
  bannerUrl,
  categorySlug,
  categoryLabel,
  categoryEmoji,
  startDateTime,
  locationName,
  distanceKm,
  registeredCount,
  capacity,
  joinMode,
  isTeamEvent = false,
  costInfo,
  organizerName,
  organizerBadgeTier,
  onClick,
  className = '',
}) => {
  return (
    <Card variant="interactive" padding="none" className={[styles.card, className].filter(Boolean).join(' ')} onClick={onClick}>
      <div className={styles.bannerWrapper}>
        {bannerUrl ? (
          <img src={bannerUrl} alt={title} className={styles.banner} />
        ) : (
          <div className={[styles.bannerFallback, styles[categorySlug] ?? ''].join(' ')}>
            <span className={styles.fallbackEmoji}>{categoryEmoji || '🎈'}</span>
          </div>
        )}
        <div className={styles.categoryBadge}>
          <CategoryChip slug={categorySlug} label={categoryLabel} emoji={categoryEmoji} size="sm" />
        </div>
        {joinMode === 'instant' && (
          <span className={styles.instantTag}>⚡ Instant join</span>
        )}
      </div>

      <div className={styles.body}>
        <h3 className={styles.title}>{title}</h3>

        <div className={styles.metaRow}>
          <span className={styles.metaItem}>
            <Calendar size={14} />
            <span>{startDateTime}</span>
          </span>
          <span className={styles.metaItem}>
            <MapPin size={14} />
            <span>
              {locationName}
              {distanceKm !== undefined && ` (${distanceKm.toFixed(1)} km)`}
            </span>
          </span>
        </div>

        <div className={styles.meterSection}>
          <SeatMeter registered={registeredCount} capacity={capacity} isTeamEvent={isTeamEvent} />
        </div>

        <div className={styles.footer}>
          <div className={styles.organizer}>
            <span className={styles.orgName}>{organizerName}</span>
            {organizerBadgeTier && <OrganizerBadge tier={organizerBadgeTier} size="sm" />}
          </div>
          {costInfo && <span className={styles.costInfo}>{costInfo}</span>}
        </div>
      </div>
    </Card>
  );
};

