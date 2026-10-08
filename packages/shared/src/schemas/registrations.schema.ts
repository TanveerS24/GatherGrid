import { z } from 'zod';
import { RegistrationStatus } from '../enums';

export const registrationSchema = z.object({
  id: z.string(),
  activityId: z.string(),
  userId: z.string(),
  userName: z.string(),
  userAvatar: z.string().optional(),
  userAttendance: z.object({
    joinedCount: z.number(),
    attendedCount: z.number(),
    lateCancelCount: z.number(),
  }).optional(),
  status: z.nativeEnum(RegistrationStatus),
  waitlistPosition: z.number().optional(),
  offerExpiresAt: z.string().optional(),
  teamId: z.string().optional(),
  appliedAt: z.string(),
  confirmedAt: z.string().optional(),
});
export type Registration = z.infer<typeof registrationSchema>;
