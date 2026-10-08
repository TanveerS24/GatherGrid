import React from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { useAuthStore, UserRole } from '@gathergrid/shared';
import { RequireAdminAuth } from '../RequireAdminAuth.js';

describe('RequireAdminAuth Guard Component', () => {
  beforeEach(() => {
    useAuthStore.setState({ user: null, isInitialized: true });
  });

  it('redirects unauthenticated user to admin /login', () => {
    render(
      <MemoryRouter initialEntries={['/admin/reports']}>
        <Routes>
          <Route path="/login" element={<div>Staff Login Screen</div>} />
          <Route
            path="/admin/reports"
            element={
              <RequireAdminAuth>
                <div>Restricted Reports Console</div>
              </RequireAdminAuth>
            }
          />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Staff Login Screen')).toBeInTheDocument();
    expect(screen.queryByText('Restricted Reports Console')).not.toBeInTheDocument();
  });

  it('permits authenticated administrator to enter platform console', () => {
    useAuthStore.setState({
      user: {
        id: 'admin-1',
        name: 'Chief Moderator',
        email: 'admin@gathergrid.test',
        role: UserRole.ADMIN,
        isVerified: true,
        defaultRadiusKm: 25,
      },
      isInitialized: true,
    });

    render(
      <MemoryRouter initialEntries={['/admin/reports']}>
        <Routes>
          <Route
            path="/admin/reports"
            element={
              <RequireAdminAuth>
                <div>Restricted Reports Console</div>
              </RequireAdminAuth>
            }
          />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Restricted Reports Console')).toBeInTheDocument();
  });
});
