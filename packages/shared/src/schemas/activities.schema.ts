import { z } from 'zod';
import { ActivityStatus, JoinMode, ActivityFormat } from '../enums';

export const activityFilterSchema = z.object({
  query: z.string().optional(),
  category: z.string().optional(),
  dateRange: z.enum(['today', 'tomorrow', 'weekend', 'week', 'custom']).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  isFree: z.boolean().optional(),
  format: z.nativeEnum(ActivityFormat).optional(),
  isTeamEvent: z.boolean().optional(),
  openSeatsOnly: z.boolean().optional(),
  joinMode: z.nativeEnum(JoinMode).optional(),
  organizerBadge: z.string().optional(),
  sort: z.enum(['nearest', 'soonest', 'newest', 'popular']).default('soonest'),
  radiusKm: z.number().min(1).max(100).default(25),
  lat: z.number().optional(),
  lng: z.number().optional(),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20),
});
export type ActivityFilterParams = z.infer<typeof activityFilterSchema>;

export const activitySchema = z.object({
  id: z.string(),
  title: z.string().min(3),
  categorySlug: z.string(),
  categoryLabel: z.string(),
  categoryEmoji: z.string().optional(),
  shortDescription: z.string().max(200),
  fullDescription: z.string(),
  format: z.nativeEnum(ActivityFormat),
  locationName: z.string(),
  address: z.string().optional(),
  lat: z.number().optional(),
  lng: z.number().optional(),
  onlinePlatform: z.string().optional(),
  meetingLink: z.string().optional(), // masked until confirmed
  startDateTime: z.string(),
  endDateTime: z.string(),
  timezone: z.string(),
  capacity: z.number().int().positive().optional(),
  registeredCount: z.number().int().nonnegative().default(0),
  waitlistCount: z.number().int().nonnegative().default(0),
  joinMode: z.nativeEnum(JoinMode),
  waitlistEnabled: z.boolean().default(true),
  isTeamEvent: z.boolean().default(false),
  teamSettings: z.object({
    maxTeams: z.number().int().positive().optional(),
    minTeamSize: z.number().int().min(2).default(2),
    maxTeamSize: z.number().int().min(2).default(5),
    lockDeadline: z.string().optional(),
  }).optional(),
  costInfo: z.string().optional(),
  bannerUrl: z.string().optional(),
  tags: z.array(z.string()).default([]),
  status: z.nativeEnum(ActivityStatus).default(ActivityStatus.PUBLISHED),
  organizerId: z.string(),
  organizerName: z.string(),
  organizerBadge: z.enum(['new', 'bronze', 'silver', 'gold']).default('new'),
  createdAt: z.string(),
});
export type Activity = z.infer<typeof activitySchema>;
