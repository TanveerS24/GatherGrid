import type { Activity } from '@gathergrid/shared';
import { ActivityStatus, JoinMode } from '@gathergrid/shared';
import { ActivityModel, type IActivity } from './activity.model.js';
import { TeamModel, type ITeam } from './team.model.js';
import { UserModel } from '../auth/user.model.js';

export function toActivityDTO(doc: IActivity): Activity {
  return {
    id: doc.id,
    title: doc.title,
    categorySlug: doc.categorySlug,
    categoryLabel: doc.categoryLabel,
    categoryEmoji: doc.categoryEmoji,
    shortDescription: doc.shortDescription,
    fullDescription: doc.fullDescription,
    format: doc.format,
    locationName: doc.locationName,
    address: doc.address,
    onlinePlatform: doc.onlinePlatform,
    lat: doc.lat,
    lng: doc.lng,
    startDateTime: doc.startDateTime,
    endDateTime: doc.endDateTime,
    timezone: doc.timezone,
    capacity: doc.capacity,
    registeredCount: doc.registeredCount,
    waitlistCount: doc.waitlistCount,
    joinMode: doc.joinMode,
    waitlistEnabled: doc.waitlistEnabled,
    isTeamEvent: doc.isTeamEvent,
    costInfo: doc.costInfo,
    bannerUrl: doc.bannerUrl,
    tags: doc.tags || [],
    status: doc.status,
    organizerId: doc.organizerId,
    organizerName: doc.organizerName,
    organizerBadge: (doc.organizerBadge || 'bronze') as 'new' | 'bronze' | 'silver' | 'gold',
    createdAt: doc.createdAt,
  };
}

export const activitiesService = {
  list: async (params: {
    query?: string;
    category?: string;
    format?: string;
    isFree?: string;
    organizerId?: string;
    status?: string;
    page?: number;
    limit?: number;
  }) => {
    const filter: Record<string, unknown> = {};

    if (params.category) filter.categorySlug = params.category;
    if (params.format) filter.format = params.format;
    if (params.organizerId) filter.organizerId = params.organizerId;
    if (params.status) filter.status = params.status;
    if (params.isFree === 'true') filter.costInfo = { $regex: 'free', $options: 'i' };

    if (params.query) {
      filter.$or = [
        { title: { $regex: params.query, $options: 'i' } },
        { shortDescription: { $regex: params.query, $options: 'i' } },
        { tags: { $in: [new RegExp(params.query, 'i')] } },
      ];
    }

    const page = params.page || 1;
    const limit = params.limit || 50;
    const skip = (page - 1) * limit;

    const [docs, total] = await Promise.all([
      ActivityModel.find(filter).sort({ startDateTime: 1 }).skip(skip).limit(limit),
      ActivityModel.countDocuments(filter),
    ]);

    return {
      data: docs.map(toActivityDTO),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
        hasNext: skip + limit < total,
        hasPrev: page > 1,
      },
    };
  },

  getById: async (id: string): Promise<Activity | null> => {
    const doc = await ActivityModel.findOne({ id });
    return doc ? toActivityDTO(doc) : null;
  },

  create: async (data: Partial<Activity>, userId: string, userName: string): Promise<Activity> => {
    const actId = 'act-' + Math.random().toString(36).slice(2, 9);
    const doc = await ActivityModel.create({
      ...data,
      id: actId,
      registeredCount: 0,
      waitlistCount: 0,
      status: ActivityStatus.PUBLISHED,
      organizerId: userId,
      organizerName: userName,
      organizerBadge: 'bronze',
      joinMode: data.joinMode || JoinMode.INSTANT,
      createdAt: new Date().toISOString(),
    });
    return toActivityDTO(doc);
  },

  getTeams: async (activityId: string): Promise<ITeam[]> => {
    return TeamModel.find({ activityId });
  },

  createTeam: async (
    activityId: string,
    teamData: { name: string; description?: string; lookingFor?: string[]; maxMembers?: number },
    userId: string,
    userName: string,
    avatarUrl?: string
  ): Promise<ITeam> => {
    const teamId = 'team-' + Math.random().toString(36).slice(2, 9);
    return TeamModel.create({
      id: teamId,
      activityId,
      name: teamData.name,
      description: teamData.description || '',
      leaderId: userId,
      leaderName: userName,
      maxMembers: teamData.maxMembers || 4,
      lookingFor: teamData.lookingFor || [],
      joinCode: Math.random().toString(36).slice(2, 8).toUpperCase(),
      members: [
        {
          userId,
          userName,
          role: 'Team Lead',
          avatarUrl,
        },
      ],
    });
  },

  joinTeam: async (
    teamId: string,
    userId: string,
    userName: string,
    role?: string,
    avatarUrl?: string
  ): Promise<ITeam | null> => {
    const team = await TeamModel.findOne({ id: teamId });
    if (!team) return null;
    if (team.members.some((m) => m.userId === userId)) return team;
    if (team.members.length >= team.maxMembers) {
      throw new Error('This team is already at full capacity');
    }
    team.members.push({ userId, userName, role: role || 'Member', avatarUrl });
    await team.save();
    return team;
  },

  getOrganizerProfile: async (organizerId: string) => {
    const org = await UserModel.findById(organizerId);
    if (!org) {
      // Also fallback to search by ID string
      const alt = await UserModel.findOne({ _id: organizerId }).catch(() => null);
      if (!alt) return null;
    }
    const target = org || (await UserModel.findOne({ _id: organizerId }));
    if (!target) return null;

    const [upcoming, past] = await Promise.all([
      ActivityModel.find({ organizerId, status: ActivityStatus.PUBLISHED }),
      ActivityModel.find({ organizerId, status: ActivityStatus.COMPLETED }),
    ]);

    return {
      organizer: {
        id: target._id.toString(),
        name: target.name,
        organizationName: target.organizationName,
        email: target.email,
        bio: target.bio,
        avatarUrl: target.avatarUrl,
        role: target.role,
        isVerified: target.isVerified,
      },
      upcomingActivities: upcoming.map(toActivityDTO),
      pastActivities: past.map(toActivityDTO),
    };
  },
};
