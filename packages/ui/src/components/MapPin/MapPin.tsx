/**
 * MapPin — custom marker pin colored by category.
 */
import React from 'react';
import { MapPin as PinIcon } from 'lucide-react';
import styles from './MapPin.module.css';

export interface MapPinProps {
  categorySlug?: string;
  selected?: boolean;
  onClick?: () => void;
  className?: string;
}

export const MapPin: React.FC<MapPinProps> = ({
  categorySlug = 'social',
  selected = false,
  onClick,
  className = '',
}) => {
  return (
    <button
      type="button"
      className={[
        styles.pin,
        styles[categorySlug] ?? styles.default,
        selected ? styles.selected : '',
        className,
      ].filter(Boolean).join(' ')}
      onClick={onClick}
      aria-label={`Location pin (${categorySlug})`}
    >
      <PinIcon size={20} fill="currentColor" />
    </button>
  );
};

