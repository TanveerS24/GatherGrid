import { OrganizerBadge } from '../enums/index.js';
import { BADGE_THRESHOLDS } from '../constants/index.js';

export function calculateOrganizerBadge(
  completedEvents: number,
  averageRating: number | null = null
): OrganizerBadge {
  // Gold requirement: 25 completed events AND average rating >= 4.3
  if (
    completedEvents >= BADGE_THRESHOLDS.gold.completedEvents &&
    averageRating !== null &&
    averageRating >= BADGE_THRESHOLDS.gold.minAverageRating
  ) {
    return OrganizerBadge.GOLD;
  }

  // Silver requirement: 10 completed events AND average rating >= 4.0
  if (
    completedEvents >= BADGE_THRESHOLDS.silver.completedEvents &&
    averageRating !== null &&
    averageRating >= BADGE_THRESHOLDS.silver.minAverageRating
  ) {
    return OrganizerBadge.SILVER;
  }

  // Bronze requirement: 3 completed events
  if (completedEvents >= BADGE_THRESHOLDS.bronze.completedEvents) {
    return OrganizerBadge.BRONZE;
  }

  // Under 3 completed events
  return OrganizerBadge.NEW;
}
