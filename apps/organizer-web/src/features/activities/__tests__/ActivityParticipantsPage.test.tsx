import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { RegistrationStatus, request } from '@gathergrid/shared';
import { ToastProvider } from '@gathergrid/ui';
import { ActivityParticipantsPage } from '../ActivityParticipantsPage.js';

vi.mock('@gathergrid/shared', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@gathergrid/shared')>();
  return {
    ...actual,
    request: vi.fn(),
  };
});

describe('ActivityParticipantsPage Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders participant roster with names, emails, and statuses', async () => {
    vi.mocked(request).mockImplementation(async (endpoint: string) => {
      if (endpoint.includes('/registrations')) {
        return [
          {
            id: 'reg-part-1',
            activityId: 'act-100',
            userId: 'usr-1',
            userName: 'Samantha Ray',
            userEmail: 'samantha@gathergrid.test',
            status: RegistrationStatus.CONFIRMED,
            appliedAt: new Date().toISOString(),
          },
        ] as any;
      }
      return {
        id: 'act-100',
        title: 'Morning Trail Run',
        registeredCount: 1,
        capacity: 20,
      } as any;
    });

    render(
      <MemoryRouter initialEntries={['/activities/act-100/participants']}>
        <ToastProvider>
          <Routes>
            <Route path="/activities/:id/participants" element={<ActivityParticipantsPage />} />
          </Routes>
        </ToastProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Morning Trail Run')).toBeInTheDocument();
      expect(screen.getByText('Samantha Ray')).toBeInTheDocument();
      expect(screen.getByText('samantha@gathergrid.test')).toBeInTheDocument();
    });
  });
});
