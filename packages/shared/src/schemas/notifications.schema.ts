import { z } from 'zod';
import { NotificationType } from '../enums';

export const notificationSchema = z.object({
  id: z.string(),
  userId: z.string(),
  type: z.nativeEnum(NotificationType),
  title: z.string(),
  message: z.string(),
  link: z.string().optional(),
  isRead: z.boolean().default(false),
  createdAt: z.string(),
});
export type Notification = z.infer<typeof notificationSchema>;
