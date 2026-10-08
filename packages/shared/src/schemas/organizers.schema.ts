import { z } from 'zod';
import { OrganizerBadge } from '../enums';

export const organizerProfileSchema = z.object({
  id: z.string(),
  organizationName: z.string(),
  contactEmail: z.string().email(),
  bio: z.string().optional(),
  logoUrl: z.string().optional(),
  badgeTier: z.nativeEnum(OrganizerBadge).default(OrganizerBadge.NEW),
  averageRating: z.number().min(0).max(5).default(0),
  totalRatingsCount: z.number().int().nonnegative().default(0),
  completedEventsCount: z.number().int().nonnegative().default(0),
  cancelledEventsCount: z.number().int().nonnegative().default(0),
});
export type OrganizerProfile = z.infer<typeof organizerProfileSchema>;
