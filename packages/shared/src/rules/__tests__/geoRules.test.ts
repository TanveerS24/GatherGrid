import { describe, it, expect } from 'vitest';
import {
  haversineDistanceKm,
  isWithinRadius,
  sortByDistance,
} from '../geoRules.js';

describe('Geo Distance & Bounding Logic Rules', () => {
  // Fixed coordinates: Downtown LA
  const downtownLA = { lat: 34.0522, lng: -118.2437 };
  // Santa Monica (~24 km west)
  const santaMonica = { lat: 34.0195, lng: -118.4912 };
  // San Diego (~180 km south)
  const sanDiego = { lat: 32.7157, lng: -117.1611 };

  it('calculates deterministic haversine distance between coordinates', () => {
    const distLAtoSM = haversineDistanceKm(downtownLA, santaMonica);
    // Expected distance is approximately 23-25 km
    expect(distLAtoSM).toBeGreaterThan(22);
    expect(distLAtoSM).toBeLessThan(26);
  });

  it('correctly filters points within radius', () => {
    expect(isWithinRadius(downtownLA, santaMonica, 30)).toBe(true);
    expect(isWithinRadius(downtownLA, santaMonica, 10)).toBe(false);
    expect(isWithinRadius(downtownLA, sanDiego, 50)).toBe(false);
  });

  it('sorts activities deterministically by ascending distance from origin', () => {
    const items = [
      { id: 'far', lat: sanDiego.lat, lng: sanDiego.lng },
      { id: 'near', lat: santaMonica.lat, lng: santaMonica.lng },
    ];

    const sorted = sortByDistance(items, downtownLA);
    expect(sorted[0].id).toBe('near');
    expect(sorted[1].id).toBe('far');
  });
});
