/**
 * CategoryChip — shows a category with emoji and flat accent color.
 * Usage: <CategoryChip slug="sports" label="Sports" emoji="⚽" />
 */
import React from 'react';
import styles from './CategoryChip.module.css';

export type CategorySlug =
  | 'sports' | 'hackathons' | 'workshops' | 'gaming'
  | 'study-groups' | 'cultural' | 'trips' | 'social' | 'career' | 'online';

export interface CategoryChipProps {
  slug: CategorySlug | string;
  label: string;
  emoji?: string;
  size?: 'sm' | 'md';
  onClick?: () => void;
  isActive?: boolean;
  className?: string;
}

export const CategoryChip: React.FC<CategoryChipProps> = ({
  slug, label, emoji, size = 'md', onClick, isActive = false, className = '',
}) => (
  <button
    type="button"
    className={[styles.chip, styles[slug] ?? '', styles[size], isActive ? styles.active : '', className].filter(Boolean).join(' ')}
    onClick={onClick}
    data-active={isActive}
  >
    {emoji && <span className={styles.emoji}>{emoji}</span>}
    <span>{label}</span>
  </button>
);

