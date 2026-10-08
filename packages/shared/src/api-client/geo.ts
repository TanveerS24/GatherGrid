import { request } from './client';
import type { GeocodeSuggestion } from '../schemas';

export const geoApi = {
  suggest: (query: string) =>
    request<GeocodeSuggestion[]>('/api/v1/geo/suggest?q=' + encodeURIComponent(query)),

  reverse: (lat: number, lng: number) =>
    request<GeocodeSuggestion>('/api/v1/geo/reverse?lat=' + lat + '&lng=' + lng),
};
