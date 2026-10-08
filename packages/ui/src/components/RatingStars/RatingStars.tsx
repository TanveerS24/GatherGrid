/**
 * RatingStars — 1-5 star rating component supporting both display and interactive input.
 */
import React, { useState } from 'react';
import { Star } from 'lucide-react';
import styles from './RatingStars.module.css';

export interface RatingStarsProps {
  value: number; // 0 to 5
  onChange?: (val: number) => void; // if provided, component is interactive
  size?: 'sm' | 'md' | 'lg';
  showNumber?: boolean;
  totalRatings?: number;
  className?: string;
}

export const RatingStars: React.FC<RatingStarsProps> = ({
  value,
  onChange,
  size = 'md',
  showNumber = false,
  totalRatings,
  className = '',
}) => {
  const [hoverValue, setHoverValue] = useState<number | null>(null);
  const isInteractive = Boolean(onChange);
  const currentRating = hoverValue !== null ? hoverValue : value;

  const starSizes = { sm: 14, md: 18, lg: 24 };
  const iconSize = starSizes[size];

  return (
    <div className={[styles.container, className].filter(Boolean).join(' ')}>
      <div className={styles.stars} onMouseLeave={() => isInteractive && setHoverValue(null)}>
        {[1, 2, 3, 4, 5].map((star) => {
          const filled = currentRating >= star;
          return (
            <button
              key={star}
              type="button"
              disabled={!isInteractive}
              className={[
                styles.starBtn,
                isInteractive ? styles.clickable : '',
                filled ? styles.filled : styles.empty,
              ].filter(Boolean).join(' ')}
              onClick={() => isInteractive && onChange?.(star)}
              onMouseEnter={() => isInteractive && setHoverValue(star)}
              aria-label={`${star} star`}
            >
              <Star
                size={iconSize}
                fill={filled ? 'currentColor' : 'none'}
                strokeWidth={filled ? 0 : 2}
              />
            </button>
          );
        })}
      </div>
      {showNumber && (
        <span className={styles.number}>
          {value.toFixed(1)}
          {totalRatings !== undefined && <span className={styles.count}>({totalRatings})</span>}
        </span>
      )}
    </div>
  );
};

