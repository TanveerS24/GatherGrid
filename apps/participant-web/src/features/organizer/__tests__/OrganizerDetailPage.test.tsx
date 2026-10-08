import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { request } from '@gathergrid/shared';
import { OrganizerDetailPage } from '../OrganizerDetailPage.js';

vi.mock('@gathergrid/shared', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@gathergrid/shared')>();
  return {
    ...actual,
    request: vi.fn(),
  };
});

describe('OrganizerDetailPage Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders organizer information, verification badge, and event listings', async () => {
    vi.mocked(request).mockResolvedValue({
      organizer: {
        id: 'org-profile-1',
        name: 'Metro Sports Club',
        organizationName: 'Metro Athletics League',
        email: 'contact@metrosports.test',
        bio: 'City-wide athletic events and pickups.',
        role: 'organizer',
        isVerified: true,
      },
      upcomingActivities: [
        {
          id: 'act-up-1',
          title: 'Downtown 3x3 Basketball',
          startDateTime: '2026-10-25T18:00:00Z',
          format: 'in_person',
          locationName: 'City Center Gymnasium',
          registeredCount: 8,
          capacity: 12,
          costInfo: 'Free',
          categoryLabel: 'Sports',
          categoryEmoji: '🏀',
          status: 'published',
        },
      ],
      pastActivities: [],
    });

    render(
      <MemoryRouter initialEntries={['/organizers/org-profile-1']}>
        <Routes>
          <Route path="/organizers/:id" element={<OrganizerDetailPage />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Metro Sports Club')).toBeInTheDocument();
      expect(screen.getByText('Metro Athletics League')).toBeInTheDocument();
      expect(screen.getByText('Downtown 3x3 Basketball')).toBeInTheDocument();
    });

    expect(screen.getByText(/city-wide athletic events/i)).toBeInTheDocument();
  });
});
