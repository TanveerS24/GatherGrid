import type { Activity } from '@gathergrid/shared';
import { ActivityFormat, ActivityStatus, JoinMode } from '@gathergrid/shared';

export const SEED_ACTIVITIES: Activity[] = [
  {
    id: 'act-1',
    title: 'Sunset Beach Volleyball & Social',
    categorySlug: 'sports',
    categoryLabel: 'Sports',
    categoryEmoji: '🏐',
    shortDescription: 'Casual 4v4 beach volleyball games followed by a sunset beach picnic.',
    fullDescription: 'Join us for fun games on the sand! All skill levels welcome. We have two nets set up. Bring water, sunscreen, and snacks to share.',
    format: ActivityFormat.IN_PERSON,
    locationName: 'Ocean Beach, San Francisco',
    address: 'Great Hwy & Fulton St, San Francisco, CA',
    lat: 37.7719,
    lng: -122.5113,
    startDateTime: '2026-10-18T16:00:00Z',
    endDateTime: '2026-10-18T19:00:00Z',
    timezone: 'America/Los_Angeles',
    capacity: 20,
    registeredCount: 14,
    waitlistCount: 2,
    joinMode: JoinMode.INSTANT,
    waitlistEnabled: true,
    isTeamEvent: false,
    costInfo: 'Free',
    bannerUrl: 'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=800&auto=format&fit=crop&q=80',
    tags: ['volleyball', 'beach', 'sunset', 'social'],
    status: ActivityStatus.PUBLISHED,
    organizerId: 'org-1',
    organizerName: 'Bay Area Outdoor Club',
    organizerBadge: 'gold',
    createdAt: '2026-10-01T10:00:00Z',
  },
  {
    id: 'act-2',
    title: 'Autumn Hackathon: AI for Good',
    categorySlug: 'hackathons',
    categoryLabel: 'Hackathons',
    categoryEmoji: '💻',
    shortDescription: '36-hour sprint building open-source AI solutions for civic & climate challenges.',
    fullDescription: 'Form teams of 2-5 builders and create high-impact prototypes. Free food, mentor support, and prizes for top projects.',
    format: ActivityFormat.IN_PERSON,
    locationName: 'SF Innovation Hub, SoMa',
    address: '500 Howard St, San Francisco, CA',
    lat: 37.7891,
    lng: -122.3982,
    startDateTime: '2026-10-24T09:00:00Z',
    endDateTime: '2026-10-25T18:00:00Z',
    timezone: 'America/Los_Angeles',
    capacity: 30,
    registeredCount: 18,
    waitlistCount: 0,
    joinMode: JoinMode.APPROVAL,
    waitlistEnabled: true,
    isTeamEvent: true,
    costInfo: 'Free',
    bannerUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&auto=format&fit=crop&q=80',
    tags: ['ai', 'hackathon', 'coding', 'teams'],
    status: ActivityStatus.PUBLISHED,
    organizerId: 'org-2',
    organizerName: 'SF Tech & Hackathons',
    organizerBadge: 'silver',
    createdAt: '2026-10-02T12:00:00Z',
  },
  {
    id: 'act-3',
    title: 'Strategy Board Game Night: Catan & Terraforming Mars',
    categorySlug: 'gaming',
    categoryLabel: 'Gaming',
    categoryEmoji: '🎲',
    shortDescription: 'Friendly table-top gaming evening with snacks and hot cider.',
    fullDescription: 'Multiple tables running classic and modern heavy euro games. Beginners welcome; rules taught beforehand.',
    format: ActivityFormat.IN_PERSON,
    locationName: 'Mission Community Center',
    address: '2450 Mission St, San Francisco, CA',
    lat: 37.7587,
    lng: -122.4191,
    startDateTime: '2026-10-16T18:30:00Z',
    endDateTime: '2026-10-16T22:00:00Z',
    timezone: 'America/Los_Angeles',
    capacity: 24,
    registeredCount: 24,
    waitlistCount: 4,
    joinMode: JoinMode.INSTANT,
    waitlistEnabled: true,
    isTeamEvent: false,
    costInfo: '$5 (materials)',
    bannerUrl: 'https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?w=800&auto=format&fit=crop&q=80',
    tags: ['boardgames', 'indoor', 'social'],
    status: ActivityStatus.PUBLISHED,
    organizerId: 'org-3',
    organizerName: 'Mission Board Game Guild',
    organizerBadge: 'bronze',
    createdAt: '2026-10-03T15:00:00Z',
  },
  {
    id: 'act-4',
    title: 'Global Web Performance Workshop',
    categorySlug: 'workshops',
    categoryLabel: 'Workshops',
    categoryEmoji: '🛠️',
    shortDescription: 'Deep dive into Core Web Vitals, CDN routing, and runtime bundling.',
    fullDescription: 'Hands-on live coding workshop optimizing React applications for ultra-fast load times. Meeting link unlocked upon registration.',
    format: ActivityFormat.ONLINE,
    locationName: 'Online (Zoom)',
    onlinePlatform: 'Zoom',
    meetingLink: 'https://zoom.us/j/98234123456',
    startDateTime: '2026-10-20T19:00:00Z',
    endDateTime: '2026-10-20T21:00:00Z',
    timezone: 'America/Los_Angeles',
    capacity: 100,
    registeredCount: 42,
    waitlistCount: 0,
    joinMode: JoinMode.INSTANT,
    waitlistEnabled: false,
    isTeamEvent: false,
    costInfo: 'Free',
    bannerUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80',
    tags: ['webdev', 'performance', 'online'],
    status: ActivityStatus.PUBLISHED,
    organizerId: 'org-2',
    organizerName: 'SF Tech & Hackathons',
    organizerBadge: 'silver',
    createdAt: '2026-10-04T08:00:00Z',
  },
  {
    id: 'act-5',
    title: 'Marin Headlands Coastal Trail Hike',
    categorySlug: 'trips',
    categoryLabel: 'Trips',
    categoryEmoji: '🏕️',
    shortDescription: 'Stunning 6-mile loop along coastal bluffs overlooking Golden Gate Bridge.',
    fullDescription: 'Moderate pace with frequent photo stops. Pack lunch and 2L of water. Carpooling arranged from Marina Green.',
    format: ActivityFormat.IN_PERSON,
    locationName: 'Marin Headlands Visitor Center',
    address: '948 Fort Barry, Sausalito, CA',
    lat: 37.8324,
    lng: -122.5312,
    startDateTime: '2026-10-19T09:00:00Z',
    endDateTime: '2026-10-19T14:00:00Z',
    timezone: 'America/Los_Angeles',
    capacity: 16,
    registeredCount: 12,
    waitlistCount: 1,
    joinMode: JoinMode.INSTANT,
    waitlistEnabled: true,
    isTeamEvent: false,
    costInfo: 'Free',
    bannerUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&auto=format&fit=crop&q=80',
    tags: ['hiking', 'outdoors', 'nature', 'views'],
    status: ActivityStatus.PUBLISHED,
    organizerId: 'org-1',
    organizerName: 'Bay Area Outdoor Club',
    organizerBadge: 'gold',
    createdAt: '2026-10-04T11:00:00Z',
  },
  {
    id: 'act-6',
    title: 'Indie Game Developers Show & Tell',
    categorySlug: 'gaming',
    categoryLabel: 'Gaming',
    categoryEmoji: '🎮',
    shortDescription: 'Playtest work-in-progress indie games and provide constructive dev feedback.',
    fullDescription: 'Live stream + Discord playtests. Creators get 10 minutes on virtual stage followed by hands-on feedback sessions.',
    format: ActivityFormat.ONLINE,
    locationName: 'Online (Discord)',
    onlinePlatform: 'Discord',
    meetingLink: 'https://discord.gg/gathergrid-indie',
    startDateTime: '2026-10-22T18:00:00Z',
    endDateTime: '2026-10-22T20:30:00Z',
    timezone: 'America/Los_Angeles',
    capacity: 50,
    registeredCount: 31,
    waitlistCount: 0,
    joinMode: JoinMode.INSTANT,
    waitlistEnabled: false,
    isTeamEvent: false,
    costInfo: 'Free',
    bannerUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop&q=80',
    tags: ['gamedev', 'indie', 'discord', 'online'],
    status: ActivityStatus.PUBLISHED,
    organizerId: 'org-3',
    organizerName: 'Mission Board Game Guild',
    organizerBadge: 'bronze',
    createdAt: '2026-10-05T09:00:00Z',
  },
];

let activitiesList: Activity[] = [...SEED_ACTIVITIES];

export const activitiesService = {
  list: (params: {
    query?: string;
    category?: string;
    format?: string;
    isFree?: string;
    page?: number;
    limit?: number;
  }) => {
    let result = [...activitiesList];
    if (params.category) {
      result = result.filter((a) => a.categorySlug === params.category);
    }
    if (params.query) {
      const q = params.query.toLowerCase();
      result = result.filter(
        (a) => a.title.toLowerCase().includes(q) || a.shortDescription.toLowerCase().includes(q)
      );
    }
    if (params.format) {
      result = result.filter((a) => a.format === params.format);
    }
    if (params.isFree === 'true') {
      result = result.filter((a) => a.costInfo?.toLowerCase().includes('free'));
    }
    const page = params.page || 1;
    const limit = params.limit || 20;
    const start = (page - 1) * limit;
    return {
      data: result.slice(start, start + limit),
      pagination: {
        page,
        limit,
        total: result.length,
        totalPages: Math.ceil(result.length / limit) || 1,
        hasNext: start + limit < result.length,
        hasPrev: page > 1,
      },
    };
  },

  getById: (id: string) => activitiesList.find((a) => a.id === id) || null,

  create: (data: Partial<Activity>, userId: string, userName: string) => {
    const act: Activity = {
      ...data,
      id: 'act-' + Math.random().toString(36).slice(2, 9),
      registeredCount: 0,
      waitlistCount: 0,
      status: ActivityStatus.PUBLISHED,
      organizerId: userId,
      organizerName: userName,
      organizerBadge: 'new',
      createdAt: new Date().toISOString(),
    } as Activity;
    activitiesList.unshift(act);
    return act;
  },
};
