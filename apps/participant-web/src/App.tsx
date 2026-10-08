import React from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { ToastProvider, AppShell, TopNav, BottomTabs, Button, Avatar } from '@gathergrid/ui';
import { Compass, Map, Globe, Calendar, User as UserIcon } from 'lucide-react';
import { useAuthStore } from '@gathergrid/shared';
import { RequireAuth } from './features/auth/RequireAuth';
import { LoginPage } from './features/auth/LoginPage';
import { RegisterPage } from './features/auth/RegisterPage';
import { ForgotPasswordPage } from './features/auth/ForgotPasswordPage';
import { OnboardingPage } from './features/onboarding/OnboardingPage';
import { ProfilePage } from './features/profile/ProfilePage';
import { GalleryPage } from './pages/gallery/GalleryPage';

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const mobileTabs = [
    { id: 'explore', label: 'Explore', icon: <Compass size={20} /> },
    { id: 'map', label: 'Map', icon: <Map size={20} /> },
    { id: 'online', label: 'Online', icon: <Globe size={20} /> },
    { id: 'activities', label: 'My Events', icon: <Calendar size={20} /> },
    { id: 'me', label: 'Profile', icon: <UserIcon size={20} /> },
  ];

  return (
    <AppShell
      topNav={
        <TopNav
          logo={<Link to="/" style={{ color: 'var(--gg-color-primary)', fontWeight: 700 }}>GatherGrid</Link>}
          actions={
            user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <Link to="/gallery">
                  <Button variant="outline" size="sm">UI Gallery</Button>
                </Link>
                <Link to="/me" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Avatar name={user.name} size="sm" src={user.avatarUrl} />
                  <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--gg-color-ink)' }}>{user.name}</span>
                </Link>
                <Button variant="ghost" size="sm" onClick={() => logout()}>Log out</Button>
              </div>
            ) : (
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <Link to="/login"><Button variant="outline" size="sm">Log In</Button></Link>
                <Link to="/register"><Button variant="primary" size="sm">Sign Up</Button></Link>
              </div>
            )
          }
        >
          {user && (
            <>
              <Link to="/" style={{ color: 'var(--gg-color-ink)', fontWeight: 500 }}>Explore</Link>
              <Link to="/map" style={{ color: 'var(--gg-color-ink)', fontWeight: 500 }}>Map</Link>
              <Link to="/online" style={{ color: 'var(--gg-color-ink)', fontWeight: 500 }}>Online</Link>
              <Link to="/me" style={{ color: 'var(--gg-color-ink)', fontWeight: 500 }}>My Activities</Link>
            </>
          )}
        </TopNav>
      }
      bottomTabs={
        user ? (
          <BottomTabs
            tabs={mobileTabs}
            activeTab="explore"
            onChange={(tab) => {
              if (tab === 'explore') navigate('/');
              else if (tab === 'me') navigate('/me');
              else navigate(`/${tab}`);
            }}
          />
        ) : null
      }
    >
      {children}
    </AppShell>
  );
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AppLayout>
          <Routes>
            {/* Public Auth Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />

            {/* Mandatory Protected Routes (ADR 007) */}
            <Route
              path="/"
              element={
                <RequireAuth>
                  <div style={{ textAlign: 'center', padding: '3rem 0' }}>
                    <h1>GatherGrid Explore</h1>
                    <p style={{ margin: '1rem 0 2rem', color: 'var(--gg-color-muted)' }}>
                      Find and join exciting activities happening near you.
                    </p>
                    <Link to="/gallery">
                      <Button variant="primary">Component Gallery</Button>
                    </Link>
                  </div>
                </RequireAuth>
              }
            />
            <Route
              path="/onboarding"
              element={
                <RequireAuth>
                  <OnboardingPage />
                </RequireAuth>
              }
            />
            <Route
              path="/me"
              element={
                <RequireAuth>
                  <ProfilePage />
                </RequireAuth>
              }
            />
            <Route
              path="/me/profile"
              element={
                <RequireAuth>
                  <ProfilePage />
                </RequireAuth>
              }
            />
            <Route
              path="/gallery"
              element={
                <RequireAuth>
                  <GalleryPage />
                </RequireAuth>
              }
            />
            {/* Friendly 404 */}
            <Route
              path="*"
              element={
                <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
                  <h2>Page Not Found</h2>
                  <p style={{ margin: '1rem 0', color: 'var(--gg-color-muted)' }}>
                    The page you are looking for does not exist.
                  </p>
                  <Link to="/"><Button variant="primary">Return Home</Button></Link>
                </div>
              }
            />
          </Routes>
        </AppLayout>
      </ToastProvider>
    </BrowserRouter>
  );
};
