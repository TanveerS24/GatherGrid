/**
 * OrganizerBadge — renders tier badge (Bronze, Silver, Gold, or New Organizer) with informative tooltip.
 */
import React from 'react';
import { Award, ShieldCheck, Sparkles } from 'lucide-react';
import { Tooltip } from '../Tooltip/Tooltip';
import styles from './OrganizerBadge.module.css';

export type OrganizerBadgeTier = 'new' | 'bronze' | 'silver' | 'gold';

export interface OrganizerBadgeProps {
  tier: OrganizerBadgeTier;
  size?: 'sm' | 'md';
  className?: string;
}

const TIER_DETAILS = {
  new: {
    label: 'New organizer',
    desc: 'Hosted fewer than 3 events so far.',
    icon: <Sparkles size={14} />,
    colorClass: styles.newTier,
  },
  bronze: {
    label: 'Bronze Host',
    desc: 'Completed at least 3 successful events.',
    icon: <Award size={14} />,
    colorClass: styles.bronzeTier,
  },
  silver: {
    label: 'Silver Host',
    desc: 'Completed 10+ events with avg rating 4.0+.',
    icon: <ShieldCheck size={14} />,
    colorClass: styles.silverTier,
  },
  gold: {
    label: 'Gold Host',
    desc: 'Completed 25+ events with avg rating 4.3+.',
    icon: <ShieldCheck size={14} />,
    colorClass: styles.goldTier,
  },
};

export const OrganizerBadge: React.FC<OrganizerBadgeProps> = ({
  tier,
  size = 'md',
  className = '',
}) => {
  const info = TIER_DETAILS[tier] || TIER_DETAILS.new;

  return (
    <Tooltip content={info.desc}>
      <span className={[styles.badge, info.colorClass, styles[size], className].filter(Boolean).join(' ')}>
        <span className={styles.icon}>{info.icon}</span>
        <span>{info.label}</span>
      </span>
    </Tooltip>
  );
};
