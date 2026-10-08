import { ActivityFormat, ActivityStatus, JoinMode } from '@gathergrid/shared';
import { ActivityModel, type IActivity } from '../../modules/activities/activity.model.js';
import { TeamModel, type ITeam } from '../../modules/activities/team.model.js';
import { RegistrationModel, type IRegistration } from '../../modules/registrations/registration.model.js';
import { RegistrationStatus } from '@gathergrid/shared';

export async function createTestActivity(overrides: Partial<IActivity> = {}): Promise<IActivity> {
  const id = overrides.id || `act-${Math.random().toString(36).slice(2, 9)}`;
  return ActivityModel.create({
    id,
    title: overrides.title || 'Community Basketball Pickup',
    categorySlug: overrides.categorySlug || 'sports',
    categoryLabel: overrides.categoryLabel || 'Sports & Fitness',
    categoryEmoji: overrides.categoryEmoji || '🏀',
    shortDescription: overrides.shortDescription || 'Weekend 5v5 pickup basketball game.',
    fullDescription: overrides.fullDescription || 'All skill levels welcome. Bring sneakers.',
    format: overrides.format || ActivityFormat.IN_PERSON,
    locationName: overrides.locationName || 'Venice Beach Courts',
    address: overrides.address || '1800 Ocean Front Walk, Venice, CA',
    lat: overrides.lat ?? 33.985,
    lng: overrides.lng ?? -118.469,
    startDateTime: overrides.startDateTime || new Date(Date.now() + 86400000).toISOString(),
    endDateTime: overrides.endDateTime || new Date(Date.now() + 93600000).toISOString(),
    timezone: overrides.timezone || 'America/Los_Angeles',
    capacity: overrides.capacity ?? 10,
    registeredCount: overrides.registeredCount ?? 0,
    waitlistCount: overrides.waitlistCount ?? 0,
    joinMode: overrides.joinMode || JoinMode.INSTANT,
    waitlistEnabled: overrides.waitlistEnabled ?? true,
    isTeamEvent: overrides.isTeamEvent ?? false,
    costInfo: overrides.costInfo || 'Free',
    bannerUrl: overrides.bannerUrl || '',
    tags: overrides.tags || ['basketball', 'sports'],
    status: overrides.status || ActivityStatus.PUBLISHED,
    organizerId: overrides.organizerId || 'org-123',
    organizerName: overrides.organizerName || 'Coach Carter',
    organizerBadge: overrides.organizerBadge || 'bronze',
    ...overrides,
  });
}

export async function createTestRegistration(overrides: Partial<IRegistration> = {}): Promise<IRegistration> {
  const id = overrides.id || `reg-${Math.random().toString(36).slice(2, 9)}`;
  return RegistrationModel.create({
    id,
    activityId: overrides.activityId || 'act-123',
    userId: overrides.userId || 'usr-123',
    userName: overrides.userName || 'John Doe',
    status: overrides.status || RegistrationStatus.CONFIRMED,
    appliedAt: overrides.appliedAt || new Date().toISOString(),
    ...overrides,
  });
}

export async function createTestTeam(overrides: Partial<ITeam> = {}): Promise<ITeam> {
  const id = overrides.id || `team-${Math.random().toString(36).slice(2, 9)}`;
  return TeamModel.create({
    id,
    activityId: overrides.activityId || 'act-123',
    name: overrides.name || 'Thunder Squad',
    leaderId: overrides.leaderId || 'lead-1',
    leaderName: overrides.leaderName || 'Captain Jack',
    members: overrides.members || [{ userId: 'lead-1', userName: 'Captain Jack', role: 'Team Lead' }],
    maxMembers: overrides.maxMembers ?? 4,
    joinCode: overrides.joinCode || 'THND99',
    lookingFor: overrides.lookingFor || ['Point Guard'],
    ...overrides,
  });
}
