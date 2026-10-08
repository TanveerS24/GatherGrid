import { z } from 'zod';

export const auditLogSchema = z.object({
  id: z.string(),
  adminId: z.string(),
  adminName: z.string(),
  action: z.string(),
  target: z.string(),
  details: z.string().optional(),
  timestamp: z.string(),
});
export type AuditLog = z.infer<typeof auditLogSchema>;

export const categoryAdminSchema = z.object({
  id: z.string(),
  slug: z.string(),
  label: z.string(),
  emoji: z.string(),
  color: z.string(),
  enabled: z.boolean().default(true),
  order: z.number().int().default(0),
});
export type CategoryAdmin = z.infer<typeof categoryAdminSchema>;
