import { z } from 'zod';

export const reviewSchema = z.object({
  id: z.string(),
  activityId: z.string(),
  activityTitle: z.string(),
  organizerId: z.string(),
  userId: z.string(),
  userName: z.string(),
  userAvatar: z.string().optional(),
  rating: z.number().min(1).max(5),
  comment: z.string().max(500).optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});
export type Review = z.infer<typeof reviewSchema>;
