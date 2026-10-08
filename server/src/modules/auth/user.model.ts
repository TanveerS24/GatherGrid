import mongoose, { Schema, type Document } from 'mongoose';
import { UserRole } from '@gathergrid/shared';

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  isVerified: boolean;
  avatarUrl?: string;
  bio?: string;
  organizationName?: string;
  interests: string[];
  homeLocation?: {
    name: string;
    lat: number;
    lng: number;
  };
  defaultRadiusKm: number;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: Object.values(UserRole), default: UserRole.PARTICIPANT },
    isVerified: { type: Boolean, default: false },
    avatarUrl: { type: String },
    bio: { type: String },
    organizationName: { type: String },
    interests: { type: [String], default: [] },
    homeLocation: {
      name: { type: String },
      lat: { type: Number },
      lng: { type: Number },
    },
    defaultRadiusKm: { type: Number, default: 25 },
  },
  {
    timestamps: true,
  },
);

export const UserModel = mongoose.model<IUser>('User', userSchema);
