import React from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { ToastProvider, AppShell, SidebarNav, Button } from '@gathergrid/ui';
import { LayoutDashboard, Calendar, PlusCircle, User, LogOut } from 'lucide-react';
import { useAuthStore } from '@gathergrid/shared';
import { RequireOrganizerAuth } from './features/auth/RequireOrganizerAuth';
import { OrganizerLoginPage } from './features/auth/OrganizerLoginPage';
import { OrganizerRegisterPage } from './features/auth/OrganizerRegisterPage';
import { OrganizerProfilePage } from './features/profile/OrganizerProfilePage';
import { OrganizerActivitiesPage } from './features/activities/OrganizerActivitiesPage';
import { CreateActivityPage } from './features/activities/CreateActivityPage';

const OrganizerLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  if (!user) return <>{children}</>;

  const navItems = [
    { id: '/', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
    { id: '/activities', label: 'My Activities', icon: <Calendar size={18} /> },
    { id: '/activities/new', label: 'Create Activity', icon: <PlusCircle size={18} /> },
    { id: '/profile', label: 'Host Profile', icon: <User size={18} /> },
  ];

  return (
    <AppShell
      sidebar={
        <SidebarNav
          logo={<span>GatherGrid Host</span>}
          items={navItems}
          activeId={location.pathname}
          onSelect={(id) => navigate(id)}
          footer={
            <Button variant="ghost" size="sm" fullWidth leftIcon={<LogOut size={16} />} onClick={() => logout()}>
              Log Out
            </Button>
          }
        />
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
        <OrganizerLayout>
          <Routes>
            {/* Public Auth Routes */}
            <Route path="/login" element={<OrganizerLoginPage />} />
            <Route path="/register" element={<OrganizerRegisterPage />} />

            {/* Mandatory Protected Routes (ADR 007) */}
            <Route
              path="/"
              element={
                <RequireOrganizerAuth>
                  <div style={{ padding: '2rem 1rem' }}>
                    <h2>Organizer Dashboard</h2>
                    <p style={{ color: 'var(--gg-color-muted)', margin: '0.5rem 0 1.5rem' }}>
                      Welcome back! Manage your events, review applicants, and track attendance.
                    </p>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                      <Link to="/activities/new">
                        <Button variant="primary">Create New Activity</Button>
                      </Link>
                      <Link to="/activities">
                        <Button variant="outline">View My Activities</Button>
                      </Link>
                    </div>
                  </div>
                </RequireOrganizerAuth>
              }
            />
            <Route
              path="/activities"
              element={
                <RequireOrganizerAuth>
                  <OrganizerActivitiesPage />
                </RequireOrganizerAuth>
              }
            />
            <Route
              path="/activites"
              element={
                <RequireOrganizerAuth>
                  <OrganizerActivitiesPage />
                </RequireOrganizerAuth>
              }
            />
            <Route
              path="/activities/new"
              element={
                <RequireOrganizerAuth>
                  <CreateActivityPage />
                </RequireOrganizerAuth>
              }
            />
            <Route
              path="/profile"
              element={
                <RequireOrganizerAuth>
                  <OrganizerProfilePage />
                </RequireOrganizerAuth>
              }
            />
            <Route
              path="*"
              element={
                <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
                  <h2>Page Not Found</h2>
                  <Link to="/"><Button variant="primary">Return to Dashboard</Button></Link>
                </div>
              }
            />
          </Routes>
        </OrganizerLayout>
      </ToastProvider>
    </BrowserRouter>
  );
};
