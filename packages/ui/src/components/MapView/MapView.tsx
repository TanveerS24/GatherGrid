/**
 * MapView — map view container (lightweight shell in Phase 2, hooked to Leaflet in Phase 5).
 */
import React from 'react';
import { MapPin } from 'lucide-react';
import styles from './MapView.module.css';

export interface MapViewProps {
  center?: [number, number];
  zoom?: number;
  radiusKm?: number;
  interactive?: boolean;
  children?: React.ReactNode;
  className?: string;
}

export const MapView: React.FC<MapViewProps> = ({
  center = [40.7128, -74.006],
  radiusKm,
  children,
  className = '',
}) => {
  return (
    <div className={[styles.mapContainer, className].filter(Boolean).join(' ')}>
      <div className={styles.placeholderMap}>
        <div className={styles.centerMarker}>
          <MapPin size={28} className={styles.centerIcon} />
          <span className={styles.coords}>
            {center[0].toFixed(3)}, {center[1].toFixed(3)}
          </span>
          {radiusKm && <span className={styles.radiusPill}>Radius: {radiusKm} km</span>}
        </div>
      </div>
      <div className={styles.overlayLayer}>{children}</div>
    </div>
  );
};
