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

    const activity = await ActivityModel.findOne({ id: activityId });
    if (!activity) {
      throw new Error('Activity not found');
    }

    // Atomic capacity increment if capacity is available or unlimited
    const updated = await ActivityModel.findOneAndUpdate(
      {
        id: activityId,
        $or: [
          { capacity: { $lte: 0 } },
          { $expr: { $lt: ['$registeredCount', '$capacity'] } },
        ],
      },
      { $inc: { registeredCount: 1 } },
      { new: true }
    );

    const isFull = !updated;
    let initialStatus = RegistrationStatus.CONFIRMED;
    let waitlistPosition: number | undefined;

    if (isFull) {
      if (!activity.waitlistEnabled) {
        throw new Error('Activity is full and waitlist is disabled');
      }
      initialStatus = RegistrationStatus.WAITLISTED;
      const count = await RegistrationModel.countDocuments({
        activityId,
        status: RegistrationStatus.WAITLISTED,
      });
      waitlistPosition = count + 1;
      await ActivityModel.updateOne({ id: activityId }, { $inc: { waitlistCount: 1 } });
    }

    const regId = 'reg-' + Math.random().toString(36).slice(2, 9);
    const doc = await RegistrationModel.create({
      id: regId,
      activityId,
      userId,
      userName: userName || 'Participant',
      userEmail,
      userAvatarUrl,
      status: initialStatus,
      waitlistPosition,
      appliedAt: new Date().toISOString(),
      confirmedAt:
        initialStatus === RegistrationStatus.CONFIRMED
          ? new Date().toISOString()
          : undefined,
      teamId,
      teamName,
    });

    return toRegistrationDTO(doc);
  },

  cancel: async (regId: string, userId: string): Promise<boolean> => {
    const doc = await RegistrationModel.findOne({ id: regId, userId });
    if (!doc) return false;
    const oldStatus = doc.status;
    doc.status = RegistrationStatus.CANCELLED;
    await doc.save();
    if (oldStatus === RegistrationStatus.CONFIRMED) {
      await ActivityModel.updateOne({ id: doc.activityId }, { $inc: { registeredCount: -1 } });
    } else if (oldStatus === RegistrationStatus.WAITLISTED) {
      await ActivityModel.updateOne({ id: doc.activityId }, { $inc: { waitlistCount: -1 } });
    }
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
