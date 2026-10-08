import mongoose, { Schema, type Document } from 'mongoose';

export interface ITeamMember {
  userId: string;
  userName: string;
  role?: string;
  avatarUrl?: string;
}

export interface ITeam extends Document {
  id: string;
  activityId: string;
  name: string;
  description: string;
  leaderId: string;
  leaderName: string;
  members: ITeamMember[];
  maxMembers: number;
  lookingFor: string[];
  joinCode?: string;
}

const teamMemberSchema = new Schema<ITeamMember>(
  {
    userId: { type: String, required: true },
    userName: { type: String, required: true },
    role: { type: String },
    avatarUrl: { type: String },
  },
  { _id: false }
);

const teamSchema = new Schema<ITeam>(
  {
    id: { type: String, required: true, unique: true, index: true },
    activityId: { type: String, required: true, index: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    leaderId: { type: String, required: true },
    leaderName: { type: String, required: true },
    members: { type: [teamMemberSchema], default: [] },
    maxMembers: { type: Number, default: 4 },
    lookingFor: { type: [String], default: [] },
    joinCode: { type: String },
  },
  {
    timestamps: true,
  }
);

export const TeamModel = mongoose.model<ITeam>('Team', teamSchema);
