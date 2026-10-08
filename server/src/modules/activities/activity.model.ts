import mongoose, { Schema, type Document } from 'mongoose';
import { ActivityFormat, ActivityStatus, JoinMode } from '@gathergrid/shared';

export interface IActivity extends Document {
  id: string;
  title: string;
  categorySlug: string;
  categoryLabel: string;
  categoryEmoji: string;
  shortDescription: string;
  fullDescription: string;
  format: ActivityFormat;
  locationName: string;
  address?: string;
  onlinePlatform?: string;
  lat?: number;
  lng?: number;
  startDateTime: string;
  endDateTime: string;
  timezone: string;
  capacity: number;
  registeredCount: number;
  waitlistCount: number;
  joinMode: JoinMode;
  waitlistEnabled: boolean;
  isTeamEvent: boolean;
  costInfo: string;
  bannerUrl: string;
  tags: string[];
  status: ActivityStatus;
  organizerId: string;
  organizerName: string;
  organizerBadge: string;
  createdAt: string;
}

const activitySchema = new Schema<IActivity>(
  {
    id: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true, trim: true },
    categorySlug: { type: String, required: true, index: true },
    categoryLabel: { type: String, required: true },
    categoryEmoji: { type: String, default: '🌟' },
    shortDescription: { type: String, required: true },
    fullDescription: { type: String, default: '' },
    format: { type: String, enum: Object.values(ActivityFormat), default: ActivityFormat.IN_PERSON },
    locationName: { type: String, required: true },
    address: { type: String },
    onlinePlatform: { type: String },
    lat: { type: Number },
    lng: { type: Number },
    startDateTime: { type: String, required: true, index: true },
    endDateTime: { type: String, required: true },
    timezone: { type: String, default: 'America/Los_Angeles' },
    capacity: { type: Number, default: 20 },
    registeredCount: { type: Number, default: 0 },
    waitlistCount: { type: Number, default: 0 },
    joinMode: { type: String, enum: Object.values(JoinMode), default: JoinMode.INSTANT },
    waitlistEnabled: { type: Boolean, default: true },
    isTeamEvent: { type: Boolean, default: false },
    costInfo: { type: String, default: 'Free' },
    bannerUrl: { type: String, default: '' },
    tags: { type: [String], default: [] },
    status: { type: String, enum: Object.values(ActivityStatus), default: ActivityStatus.PUBLISHED, index: true },
    organizerId: { type: String, required: true, index: true },
    organizerName: { type: String, required: true },
    organizerBadge: { type: String, default: 'bronze' },
    createdAt: { type: String, default: () => new Date().toISOString() },
  },
  {
    timestamps: true,
  }
);

export const ActivityModel = mongoose.model<IActivity>('Activity', activitySchema);
