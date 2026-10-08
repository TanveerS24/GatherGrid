import { env } from '../../config/env.js';
import type { GeocodeSuggestion } from '@gathergrid/shared';

const SF_FALLBACK: GeocodeSuggestion = {
  placeId: 'sf-downtown',
  displayName: 'San Francisco, CA',
  lat: 37.7749,
  lng: -122.4194,
  city: 'San Francisco',
};

const SF_SUGGESTIONS: GeocodeSuggestion[] = [
  { placeId: 'sf-mission', displayName: 'Mission District, San Francisco, CA', lat: 37.7599, lng: -122.4148, city: 'San Francisco' },
  { placeId: 'sf-soma', displayName: 'SoMa, San Francisco, CA', lat: 37.7785, lng: -122.4056, city: 'San Francisco' },
  { placeId: 'sf-ggp', displayName: 'Golden Gate Park, San Francisco, CA', lat: 37.7694, lng: -122.4862, city: 'San Francisco' },
  { placeId: 'sf-marina', displayName: 'Marina District, San Francisco, CA', lat: 37.8037, lng: -122.4368, city: 'San Francisco' },
  { placeId: 'sf-northbeach', displayName: 'North Beach, San Francisco, CA', lat: 37.8005, lng: -122.4091, city: 'San Francisco' },
];

export class GeoService {
  async reverse(lat: number, lng: number): Promise<GeocodeSuggestion> {
    try {
      const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`;
      const res = await fetch(url, {
        headers: { 'User-Agent': env.GEOCODE_USER_AGENT },
      });
      if (!res.ok) return { ...SF_FALLBACK, lat, lng };

      const data = (await res.json()) as any;
      const city =
        data.address?.city ||
        data.address?.town ||
        data.address?.village ||
        data.address?.suburb ||
        'San Francisco';
      const neighbourhood = data.address?.neighbourhood || data.address?.suburb || '';
      const displayName = neighbourhood ? `${neighbourhood}, ${city}` : data.display_name || `${city}, CA`;

      return {
        placeId: String(data.place_id || 'place-rev'),
        displayName,
        lat,
        lng,
        city,
      };
    } catch {
      return { ...SF_FALLBACK, lat, lng };
    }
  }

  async suggest(query: string): Promise<GeocodeSuggestion[]> {
    if (!query || query.trim().length < 2) return SF_SUGGESTIONS.slice(0, 3);
    try {
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`;
      const res = await fetch(url, {
        headers: { 'User-Agent': env.GEOCODE_USER_AGENT },
      });
      if (!res.ok) return SF_SUGGESTIONS;

      const items = (await res.json()) as any[];
      if (!items || items.length === 0) return SF_SUGGESTIONS;

      return items.map((item) => ({
        placeId: String(item.place_id),
        displayName: item.display_name,
        lat: parseFloat(item.lat),
        lng: parseFloat(item.lon),
        city: item.address?.city || 'San Francisco',
      }));
    } catch {
      return SF_SUGGESTIONS;
    }
  }
}

export const geoService = new GeoService();
