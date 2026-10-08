import React from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { useAuthStore, UserRole } from '@gathergrid/shared';
import { RequireAuth } from '../RequireAuth.js';

describe('RequireAuth Guard Component', () => {
  beforeEach(() => {
    useAuthStore.setState({ user: null, isInitialized: true });
  });

  it('redirects unauthenticated user to /login', () => {
    render(
      <MemoryRouter initialEntries={['/protected']}>
        <Routes>
          <Route path="/login" element={<div>Login Page</div>} />
          <Route
            path="/protected"
            element={
              <RequireAuth>
                <div>Secret Content</div>
              </RequireAuth>
            }
          />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Login Page')).toBeInTheDocument();
    expect(screen.queryByText('Secret Content')).not.toBeInTheDocument();
  });

  it('renders protected child component when user is authenticated', () => {
    useAuthStore.setState({
      user: {
        id: 'usr-1',
        name: 'Alice',
        email: 'alice@test.com',
        role: UserRole.PARTICIPANT,
        isVerified: true,
        defaultRadiusKm: 25,
      },
      isInitialized: true,
    });

    render(
      <MemoryRouter initialEntries={['/protected']}>
        <Routes>
          <Route
            path="/protected"
            element={
              <RequireAuth>
                <div>Secret Content</div>
              </RequireAuth>
            }
          />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Secret Content')).toBeInTheDocument();
  });
});
