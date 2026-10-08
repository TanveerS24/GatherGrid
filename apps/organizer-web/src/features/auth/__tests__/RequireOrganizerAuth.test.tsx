import React from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { useAuthStore, UserRole } from '@gathergrid/shared';
import { RequireOrganizerAuth } from '../RequireOrganizerAuth.js';

describe('RequireOrganizerAuth Guard Component', () => {
  beforeEach(() => {
    useAuthStore.setState({ user: null, isInitialized: true });
  });

  it('redirects unauthenticated user to /login', () => {
    render(
      <MemoryRouter initialEntries={['/organizer/dashboard']}>
        <Routes>
          <Route path="/login" element={<div>Organizer Login</div>} />
          <Route
            path="/organizer/dashboard"
            element={
              <RequireOrganizerAuth>
                <div>Organizer Portal Content</div>
              </RequireOrganizerAuth>
            }
          />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Organizer Login')).toBeInTheDocument();
    expect(screen.queryByText('Organizer Portal Content')).not.toBeInTheDocument();
  });

  it('permits authenticated organizer to access portal', () => {
    useAuthStore.setState({
      user: {
        id: 'org-1',
        name: 'Event Host',
        email: 'host@gathergrid.test',
        role: UserRole.ORGANIZER,
        isVerified: true,
        defaultRadiusKm: 25,
      },
      isInitialized: true,
    });

    render(
      <MemoryRouter initialEntries={['/organizer/dashboard']}>
        <Routes>
          <Route
            path="/organizer/dashboard"
            element={
              <RequireOrganizerAuth>
                <div>Organizer Portal Content</div>
              </RequireOrganizerAuth>
            }
          />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Organizer Portal Content')).toBeInTheDocument();
  });
});
