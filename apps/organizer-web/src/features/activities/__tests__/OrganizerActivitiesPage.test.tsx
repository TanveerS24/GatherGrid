import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { activitiesApi } from '@gathergrid/shared';
import { OrganizerActivitiesPage } from '../OrganizerActivitiesPage.js';

vi.mock('@gathergrid/shared', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@gathergrid/shared')>();
  return {
    ...actual,
    activitiesApi: {
      list: vi.fn(),
    },
  };
});

describe('OrganizerActivitiesPage Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders hosted activities list and create activity button', async () => {
    vi.mocked(activitiesApi.list).mockResolvedValue({
      data: [
        {
          id: 'act-org-1',
          title: 'Full Stack Coding Meetup',
          startDateTime: '2026-10-30T19:00:00Z',
          format: 'in_person',
          locationName: 'Tech Hub Downtown',
          registeredCount: 15,
          capacity: 30,
          categoryLabel: 'Workshops',
          categoryEmoji: '🛠️',
          status: 'published',
        },
      ] as any,
      pagination: { total: 1, page: 1, limit: 50, totalPages: 1 },
    });

    render(
      <MemoryRouter>
        <OrganizerActivitiesPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('My Hosted Activities')).toBeInTheDocument();
      expect(screen.getByText('Full Stack Coding Meetup')).toBeInTheDocument();
    });

    expect(screen.getByText('Create Activity')).toBeInTheDocument();
  });
});
