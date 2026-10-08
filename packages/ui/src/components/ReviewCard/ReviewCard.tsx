/**
 * ReviewCard — participant rating and comment card.
 */
import React from 'react';
import { Avatar } from '../Avatar/Avatar';
import { RatingStars } from '../RatingStars/RatingStars';
import { Card } from '../Card/Card';
import styles from './ReviewCard.module.css';

export interface ReviewCardProps {
  id: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  date: string;
  comment?: string;
  activityTitle?: string;
  className?: string;
}

export const ReviewCard: React.FC<ReviewCardProps> = ({
  userName,
  userAvatar,
  rating,
  date,
  comment,
  activityTitle,
  className = '',
}) => {
  return (
    <Card variant="flat" padding="sm" className={[styles.card, className].filter(Boolean).join(' ')}>
      <div className={styles.header}>
        <div className={styles.user}>
          <Avatar src={userAvatar} name={userName} size="sm" />
          <div>
            <div className={styles.userName}>{userName}</div>
            <div className={styles.date}>{date}</div>
          </div>
        </div>
        <RatingStars value={rating} size="sm" />
      </div>
      {activityTitle && <div className={styles.activity}>{activityTitle}</div>}
      {comment && <p className={styles.comment}>{comment}</p>}
    </Card>
  );
};

