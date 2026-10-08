import { Page } from '@playwright/test';

export interface MockUser {
  id: string;
  name: string;
  email: string;
  role: 'participant' | 'organizer' | 'admin';
  avatarUrl?: string;
}

export const DEFAULT_PARTICIPANT: MockUser = {
  id: 'usr-part-1',
  name: 'Alex Rivera',
  email: 'alex@example.com',
  role: 'participant',
};

export const DEFAULT_ORGANIZER: MockUser = {
  id: 'org-1',
  name: 'Bay Area Outdoor Club',
  email: 'host@outdoors.org',
  role: 'organizer',
};

export const DEFAULT_ADMIN: MockUser = {
  id: 'admin-1',
  name: 'Platform Admin',
  email: 'admin@gathergrid.com',
  role: 'admin',
};

export async function setupMockApi(page: Page, currentUser: MockUser = DEFAULT_PARTICIPANT) {
  // Auth Me
  await page.route('**/api/v1/auth/me', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ status: 'ok', data: currentUser }),
    });
  });

  // Auth Login / Register
  await page.route('**/api/v1/auth/login', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ status: 'ok', data: currentUser, token: 'mock-jwt-token' }),
    });
  });

  await page.route('**/api/v1/auth/register', async (route) => {
    await route.fulfill({
      status: 201,
      contentType: 'application/json',
      body: JSON.stringify({ status: 'ok', data: currentUser, token: 'mock-jwt-token' }),
    });
  });

  // Activities list
  await page.route('**/api/v1/activities?*', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        status: 'ok',
        data: {
          data: [
            {
              id: 'act-1',
              _id: 'act-1',
              title: 'Sunset Beach Volleyball & Social',
              description: 'Casual 4v4 sand volleyball followed by beachside bonfire snacks.',
              category: 'sports',
              organizerId: 'org-1',
              organizerName: 'Bay Area Outdoor Club',
              status: 'published',
              capacity: 16,
              confirmedCount: 14,
              joinMode: 'instant',
              waitlistEnabled: true,
              isTeamEvent: false,
              isOnline: false,
              startDate: '2026-10-15T18:00:00Z',
              endDate: '2026-10-15T20:30:00Z',
              location: {
                address: 'Ocean Beach Fire Pits, San Francisco',
                coordinates: [-122.511, 37.769],
              },
            },
            {
              id: 'act-2',
              _id: 'act-2',
              title: 'Autumn Hackathon: AI for Good',
              description: 'Collaborative team hackathon building tools for civic non-profits.',
              category: 'hackathons',
              organizerId: 'org-2',
              organizerName: 'SF Tech & Hackathons',
              status: 'published',
              capacity: 24,
              confirmedCount: 20,
              joinMode: 'instant',
              waitlistEnabled: true,
              isTeamEvent: true,
              isOnline: false,
              startDate: '2026-10-22T09:00:00Z',
              endDate: '2026-10-22T19:00:00Z',
              location: {
                address: 'SoMa Innovation Center, San Francisco',
                coordinates: [-122.398, 37.781],
              },
            },
          ],
          pagination: { total: 2, page: 1, limit: 10, totalPages: 1 },
        },
      }),
    });
  });
}
