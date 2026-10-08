import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { useAuthStore, UserRole, request } from '@gathergrid/shared';
import { ToastProvider } from '@gathergrid/ui';
import { FormTeamsPage } from '../FormTeamsPage.js';

vi.mock('@gathergrid/shared', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@gathergrid/shared')>();
  return {
    ...actual,
    request: vi.fn(),
  };
});

describe('FormTeamsPage Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAuthStore.setState({
      user: {
        id: 'usr-lead-1',
        name: 'Squad Leader',
        email: 'leader@gathergrid.test',
        role: UserRole.PARTICIPANT,
        isVerified: true,
        defaultRadiusKm: 25,
      },
      isInitialized: true,
    });
  });

  it('renders teams formation page with existing teams and create button', async () => {
    vi.mocked(request).mockImplementation(async (endpoint: string) => {
      if (endpoint.includes('/teams')) {
        return [
          {
            id: 'team-1',
            name: 'Cyber Wolves',
            description: 'Coding hackathon team',
            leaderId: 'usr-other',
            leaderName: 'Wolf Lead',
            members: [{ userId: 'usr-other', userName: 'Wolf Lead' }],
            maxMembers: 4,
            lookingFor: ['Frontend'],
            joinCode: 'WOLF88',
          },
        ] as any;
      }
      return {
        id: 'act-hack-1',
        title: 'Global City Hackathon',
        isTeamEvent: true,
      } as any;
    });

    render(
      <MemoryRouter initialEntries={['/activities/act-hack-1/teams']}>
        <ToastProvider>
          <Routes>
            <Route path="/activities/:id/teams" element={<FormTeamsPage />} />
          </Routes>
        </ToastProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Global City Hackathon')).toBeInTheDocument();
      expect(screen.getByText('Cyber Wolves')).toBeInTheDocument();
    });

    expect(screen.getByText('Create New Team')).toBeInTheDocument();
  });
});
