/**
 * CountdownTimer — live ticking countdown with expiration notice (e.g. for waitlist offer claim window).
 */
import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import styles from './CountdownTimer.module.css';

export interface CountdownTimerProps {
  expiresAt: string | Date;
  onExpire?: () => void;
  className?: string;
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({
  expiresAt,
  onExpire,
  className = '',
}) => {
  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number; isExpired: boolean }>({
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: false,
  });

  useEffect(() => {
    const target = new Date(expiresAt).getTime();

    const update = () => {
      const now = Date.now();
      const diff = target - now;

      if (diff <= 0) {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0, isExpired: true });
        onExpire?.();
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({ hours, minutes, seconds, isExpired: false });
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [expiresAt, onExpire]);

  if (timeLeft.isExpired) {
    return <span className={[styles.expired, className].filter(Boolean).join(' ')}>Offer Expired</span>;
  }

  const pad = (n: number) => String(n).padStart(2, '0');

  return (
    <div className={[styles.timer, className].filter(Boolean).join(' ')}>
      <Clock size={14} className={styles.icon} />
      <span className={styles.timeString}>
        {pad(timeLeft.hours)}:{pad(timeLeft.minutes)}:{pad(timeLeft.seconds)}
      </span>
    </div>
  );
};
