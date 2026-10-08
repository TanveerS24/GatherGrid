import mongoose, { Schema, type Document } from 'mongoose';
import { RegistrationStatus } from '@gathergrid/shared';

export interface IRegistration extends Document {
  id: string;
  activityId: string;
  userId: string;
  userName: string;
  userEmail?: string;
  userAvatarUrl?: string;
  status: RegistrationStatus;
  waitlistPosition?: number;
  appliedAt: string;
  confirmedAt?: string;
  teamId?: string;
  teamName?: string;
}

const registrationSchema = new Schema<IRegistration>(
  {
    id: { type: String, required: true, unique: true, index: true },
    activityId: { type: String, required: true, index: true },
    userId: { type: String, required: true, index: true },
    userName: { type: String, required: true },
    userEmail: { type: String },
    userAvatarUrl: { type: String },
    status: {
      type: String,
      enum: Object.values(RegistrationStatus),
      default: RegistrationStatus.CONFIRMED,
      index: true,
    },
    waitlistPosition: { type: Number },
    appliedAt: { type: String, default: () => new Date().toISOString() },
    confirmedAt: { type: String },
    teamId: { type: String },
    teamName: { type: String },
  },
  {
    timestamps: true,
  }
);

registrationSchema.index({ activityId: 1, userId: 1 }, { unique: true });

export const RegistrationModel = mongoose.model<IRegistration>('Registration', registrationSchema);
