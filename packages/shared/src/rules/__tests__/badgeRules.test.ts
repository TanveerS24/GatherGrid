import { describe, it, expect } from 'vitest';
import { OrganizerBadge } from '../../enums/index.js';
import { calculateOrganizerBadge } from '../badgeRules.js';

describe('Organizer Badge Progression & Threshold Rules', () => {
  describe('exact boundary values', () => {
    it('awards NEW status for fewer than 3 completed events', () => {
      expect(calculateOrganizerBadge(0, null)).toBe(OrganizerBadge.NEW);
      expect(calculateOrganizerBadge(1, 5.0)).toBe(OrganizerBadge.NEW);
      expect(calculateOrganizerBadge(2, 4.9)).toBe(OrganizerBadge.NEW);
    });

    it('awards BRONZE at exactly 3 completed events regardless of rating', () => {
      expect(calculateOrganizerBadge(3, null)).toBe(OrganizerBadge.BRONZE);
      expect(calculateOrganizerBadge(3, 3.2)).toBe(OrganizerBadge.BRONZE);
      expect(calculateOrganizerBadge(9, 4.8)).toBe(OrganizerBadge.BRONZE);
    });

    it('awards SILVER at 10 events with rating >= 4.0; stays BRONZE if rating < 4.0', () => {
      // 10 events with rating below 4.0 -> remains BRONZE
      expect(calculateOrganizerBadge(10, 3.99)).toBe(OrganizerBadge.BRONZE);

      // Exact boundary: 10 events with 4.0 -> SILVER
      expect(calculateOrganizerBadge(10, 4.0)).toBe(OrganizerBadge.SILVER);
      expect(calculateOrganizerBadge(24, 4.5)).toBe(OrganizerBadge.SILVER);
    });

    it('awards GOLD at 25 events with rating >= 4.3; stays SILVER if rating < 4.3', () => {
      // 25 events with rating below 4.3 -> remains SILVER
      expect(calculateOrganizerBadge(25, 4.29)).toBe(OrganizerBadge.SILVER);

      // Exact boundary: 25 events with 4.3 -> GOLD
      expect(calculateOrganizerBadge(25, 4.3)).toBe(OrganizerBadge.GOLD);
      expect(calculateOrganizerBadge(50, 4.9)).toBe(OrganizerBadge.GOLD);
    });
  });
});
