import { z } from 'zod';
import { ReportStatus, ReportTargetType } from '../enums';

export const reportSchema = z.object({
  id: z.string(),
  targetType: z.nativeEnum(ReportTargetType),
  targetId: z.string(),
  targetTitle: z.string().optional(),
  reporterId: z.string(),
  reporterName: z.string(),
  reason: z.string().min(5).max(500),
  status: z.nativeEnum(ReportStatus).default(ReportStatus.OPEN),
  adminNotes: z.string().optional(),
  createdAt: z.string(),
});
export type Report = z.infer<typeof reportSchema>;
