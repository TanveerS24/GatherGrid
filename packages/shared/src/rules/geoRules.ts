export interface Coordinates {
  lat: number;
  lng: number;
}

export function haversineDistanceKm(coord1: Coordinates, coord2: Coordinates): number {
  const toRad = (x: number) => (x * Math.PI) / 180;
  const R = 6371; // Earth radius in km

  const dLat = toRad(coord2.lat - coord1.lat);
  const dLng = toRad(coord2.lng - coord1.lng);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(coord1.lat)) *
      Math.cos(toRad(coord2.lat)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

export function isWithinRadius(
  center: Coordinates,
  point: Coordinates,
  radiusKm: number
): boolean {
  return haversineDistanceKm(center, point) <= radiusKm;
}

export function sortByDistance<T extends { lat?: number; lng?: number }>(
  items: T[],
  center: Coordinates
): (T & { distanceKm: number })[] {
  return items
    .filter((item): item is T & { lat: number; lng: number } => item.lat != null && item.lng != null)
    .map((item) => ({
      ...item,
      distanceKm: haversineDistanceKm(center, { lat: item.lat, lng: item.lng }),
    }))
    .sort((a, b) => a.distanceKm - b.distanceKm);
}
