import type { Registration } from '@gathergrid/shared';
import { RegistrationStatus } from '@gathergrid/shared';
import { RegistrationModel, type IRegistration } from './registration.model.js';
import { ActivityModel } from '../activities/activity.model.js';

function toRegistrationDTO(doc: IRegistration): Registration {
  return {
    id: doc.id,
    activityId: doc.activityId,
    userId: doc.userId,
    userName: doc.userName,
    status: doc.status,
    waitlistPosition: doc.waitlistPosition,
    appliedAt: doc.appliedAt,
    confirmedAt: doc.confirmedAt,
  };
}

export const registrationsService = {
  getMyRegistrations: async (userId: string, status?: string): Promise<Registration[]> => {
    const filter: Record<string, unknown> = { userId };
    if (status) filter.status = status;
    const docs = await RegistrationModel.find(filter).sort({ appliedAt: -1 });
    return docs.map(toRegistrationDTO);
  },

  getActivityRegistrations: async (activityId: string) => {
    const docs = await RegistrationModel.find({ activityId }).sort({ appliedAt: -1 });
    return docs.map((d) => ({
      ...toRegistrationDTO(d),
      userEmail: d.userEmail,
      userAvatarUrl: d.userAvatarUrl,
      teamId: d.teamId,
      teamName: d.teamName,
    }));
  },

  create: async (
    activityId: string,
    userId: string,
    userName?: string,
    userEmail?: string,
    userAvatarUrl?: string,
    teamId?: string,
    teamName?: string
  ): Promise<Registration> => {
    const existing = await RegistrationModel.findOne({ activityId, userId });
    if (existing) {
      return toRegistrationDTO(existing);
    }

    const regId = 'reg-' + Math.random().toString(36).slice(2, 9);
    const doc = await RegistrationModel.create({
      id: regId,
      activityId,
      userId,
      userName: userName || 'Participant',
      userEmail,
      userAvatarUrl,
      status: RegistrationStatus.CONFIRMED,
      appliedAt: new Date().toISOString(),
      confirmedAt: new Date().toISOString(),
      teamId,
      teamName,
    });

    await ActivityModel.updateOne({ id: activityId }, { $inc: { registeredCount: 1 } });
    return toRegistrationDTO(doc);
  },

  cancel: async (regId: string, userId: string): Promise<boolean> => {
    const doc = await RegistrationModel.findOne({ id: regId, userId });
    if (!doc) return false;
    doc.status = RegistrationStatus.CANCELLED;
    await doc.save();
    await ActivityModel.updateOne({ id: doc.activityId }, { $inc: { registeredCount: -1 } });
    return true;
  },

  updateStatus: async (regId: string, status: RegistrationStatus): Promise<Registration | null> => {
    const doc = await RegistrationModel.findOne({ id: regId });
    if (!doc) return null;
    doc.status = status;
    if (status === RegistrationStatus.CONFIRMED) {
      doc.confirmedAt = new Date().toISOString();
    }
    await doc.save();
    return toRegistrationDTO(doc);
  },
};
