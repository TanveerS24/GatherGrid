/**
 * TeamCard — renders team with avatar stack, size vs min/max, status pill, and deadline.
 */
import React from 'react';
import { Crown } from 'lucide-react';
import { AvatarStack, type StackUser } from '../AvatarStack/AvatarStack';
import { StatusPill } from '../StatusPill/StatusPill';
import { Card } from '../Card/Card';
import styles from './TeamCard.module.css';

export interface TeamCardProps {
  id: string;
  name: string;
  leaderName: string;
  members: StackUser[];
  minSize: number;
  maxSize: number;
  status: 'confirmed' | 'pending' | 'waitlisted';
  deadlineNotice?: string;
  isCurrentUserLeader?: boolean;
  action?: React.ReactNode;
  className?: string;
}

export const TeamCard: React.FC<TeamCardProps> = ({
  name,
  leaderName,
  members,
  minSize,
  maxSize,
  status,
  deadlineNotice,
  isCurrentUserLeader = false,
  action,
  className = '',
}) => {
  const currentSize = members.length;
  const isUnderMin = currentSize < minSize;

  return (
    <Card variant="flat" padding="md" className={[styles.card, className].filter(Boolean).join(' ')}>
      <div className={styles.header}>
        <div>
          <h4 className={styles.teamName}>{name}</h4>
          <span className={styles.leader}>
            <Crown size={12} className={styles.crown} /> Leader: {leaderName} {isCurrentUserLeader && '(You)'}
          </span>
        </div>
        <StatusPill status={status} />
      </div>

      <div className={styles.memberSection}>
        <AvatarStack users={members} max={5} />
        <span className={[styles.sizeCount, isUnderMin ? styles.underMin : ''].join(' ')}>
          {currentSize} / {maxSize} members (min {minSize})
        </span>
      </div>

      {deadlineNotice && <div className={styles.deadline}>{deadlineNotice}</div>}
      {action && <div className={styles.action}>{action}</div>}
    </Card>
  );
};

