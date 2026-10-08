/**
 * SeatMeter — visual capacity meter displaying registered vs total seats with color coding.
 */
import React from 'react';
import styles from './SeatMeter.module.css';

export interface SeatMeterProps {
  registered: number;
  capacity?: number; // undefined = unlimited
  isTeamEvent?: boolean;
  className?: string;
}

export const SeatMeter: React.FC<SeatMeterProps> = ({
  registered,
  capacity,
  isTeamEvent = false,
  className = '',
}) => {
  const isUnlimited = capacity === undefined || capacity === null;
  const isFull = !isUnlimited && registered >= capacity;
  const percentage = isUnlimited ? 50 : Math.min(100, (registered / capacity) * 100);

  const fillClass = isFull
    ? styles.fillFull
    : percentage > 80
    ? styles.fillWarning
    : styles.fillNormal;

  return (
    <div className={[styles.container, className].filter(Boolean).join(' ')}>
      <div className={styles.bar}>
        <div
          className={[styles.fill, fillClass].join(' ')}
          style={{ width: isUnlimited ? '100%' : `${percentage}%` }}
        />
      </div>
      <div className={styles.label}>
        {isUnlimited ? (
          <span>{registered} {isTeamEvent ? 'teams' : 'participants'} (Unlimited)</span>
        ) : (
          <span>
            {registered} / {capacity} {isTeamEvent ? 'teams' : 'seats'}
            {isFull && <strong className={styles.fullText}> · Full</strong>}
          </span>
        )}
      </div>
    </div>
  );
};
