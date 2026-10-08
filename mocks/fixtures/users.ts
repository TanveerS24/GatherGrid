import { UserRole } from '@gathergrid/shared';
import type { AuthUser } from '@gathergrid/shared';

export const mockUsers: Record<string, AuthUser> = {
  participant: {
    id: 'user-part-1',
    name: 'Maya Lin',
    email: 'participant@gathergrid.com',
    role: UserRole.PARTICIPANT,
    isVerified: true,
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
    bio: 'Avid beach volleyball player and weekend hiker.',
    interests: ['sports', 'trips', 'social'],
    homeLocation: { name: 'Mission District, SF', lat: 37.7599, lng: -122.4148 },
    defaultRadiusKm: 25,
  },
  organizer: {
    id: 'user-org-1',
    name: 'Carlos Santana',
    email: 'organizer@gathergrid.com',
    role: UserRole.ORGANIZER,
    isVerified: true,
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    bio: 'Founder of Bay Area Outdoor Club.',
    interests: ['sports', 'trips'],
    homeLocation: { name: 'SoMa, SF', lat: 37.7785, lng: -122.3995 },
    defaultRadiusKm: 30,
  },
  admin: {
    id: 'user-admin-1',
    name: 'Sarah Connor',
    email: 'admin@gathergrid.com',
    role: UserRole.ADMIN,
    isVerified: true,
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    bio: 'GatherGrid Platform Administrator.',
    interests: [],
    homeLocation: { name: 'San Francisco, CA', lat: 37.7749, lng: -122.4194 },
    defaultRadiusKm: 50,
  },
};
