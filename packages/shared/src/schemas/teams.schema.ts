import { z } from 'zod';

export const teamSchema = z.object({
  id: z.string(),
  activityId: z.string(),
  name: z.string().min(2).max(40),
  description: z.string().max(200).optional(),
  joinCode: z.string(),
  leaderId: z.string(),
  leaderName: z.string(),
  members: z.array(z.object({
    userId: z.string(),
    name: z.string(),
    avatarUrl: z.string().optional(),
    joinedAt: z.string(),
  })),
  minSize: z.number().int().min(2),
  maxSize: z.number().int().min(2),
  status: z.enum(['forming', 'ready', 'locked', 'dropped', 'waitlisted', 'confirmed']),
  lockDeadline: z.string().optional(),
});
export type Team = z.infer<typeof teamSchema>;

export const soloPoolParticipantSchema = z.object({
  userId: z.string(),
  userName: z.string(),
  userAvatar: z.string().optional(),
  activityId: z.string(),
  optedInAt: z.string(),
});
export type SoloPoolParticipant = z.infer<typeof soloPoolParticipantSchema>;
