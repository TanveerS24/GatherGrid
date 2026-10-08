import React from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { ToastProvider, AppShell, SidebarNav, Button } from '@gathergrid/ui';
import { Shield, Users, Building, Calendar, AlertOctagon, Tags, FileText, LogOut } from 'lucide-react';
import { useAuthStore } from '@gathergrid/shared';
import { RequireAdminAuth } from './features/auth/RequireAdminAuth';
import { AdminLoginPage } from './features/auth/AdminLoginPage';
import { UsersManagementPage } from './features/management/UsersManagementPage';
import { OrganizersManagementPage } from './features/management/OrganizersManagementPage';
import { ActivitiesModerationPage } from './features/management/ActivitiesModerationPage';
import { ReportsQueuePage } from './features/management/ReportsQueuePage';
import { CategoriesManagementPage } from './features/management/CategoriesManagementPage';
import { AuditLogPage } from './features/management/AuditLogPage';

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  if (!user) return <>{children}</>;

  const navItems = [
    { id: '/', label: 'Overview', icon: <Shield size={18} /> },
    { id: '/users', label: 'Users', icon: <Users size={18} /> },
    { id: '/organizers', label: 'Organizers', icon: <Building size={18} /> },
    { id: '/activities', label: 'Activities', icon: <Calendar size={18} /> },
    { id: '/reports', label: 'Reports Queue', icon: <AlertOctagon size={18} /> },
    { id: '/categories', label: 'Categories', icon: <Tags size={18} /> },
    { id: '/audit-log', label: 'Audit Log', icon: <FileText size={18} /> },
  ];

  return (
    <AppShell
      sidebar={
        <SidebarNav
          logo={<span>GatherGrid Admin</span>}
          items={navItems}
          activeId={location.pathname}
          onSelect={(id) => navigate(id)}
          footer={
            <Button variant="ghost" size="sm" fullWidth leftIcon={<LogOut size={16} />} onClick={() => logout()}>
              Staff Log Out
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
        <AdminLayout>
          <Routes>
            {/* Public Auth Route */}
            <Route path="/login" element={<AdminLoginPage />} />

            {/* Mandatory Protected Routes (ADR 007) */}
            <Route
              path="/"
              element={
                <RequireAdminAuth>
                  <div style={{ padding: '2rem 1.5rem', maxWidth: '1000px', margin: '0 auto' }}>
                    <h2>Platform Overview</h2>
                    <p style={{ color: 'var(--gg-color-muted)', margin: '0.5rem 0 1.5rem' }}>
                      GatherGrid city platform moderation and governance dashboard.
                    </p>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                      <Link to="/users" style={{ textDecoration: 'none' }}>
                        <Button variant="outline" fullWidth>Manage Users</Button>
                      </Link>
                      <Link to="/organizers" style={{ textDecoration: 'none' }}>
                        <Button variant="outline" fullWidth>Review Organizers</Button>
                      </Link>
                      <Link to="/activities" style={{ textDecoration: 'none' }}>
                        <Button variant="outline" fullWidth>Moderate Activities</Button>
                      </Link>
                      <Link to="/reports" style={{ textDecoration: 'none' }}>
                        <Button variant="outline" fullWidth>Reports Queue</Button>
                      </Link>
                    </div>
                  </div>
                </RequireAdminAuth>
              }
            />
            <Route
              path="/users"
              element={
                <RequireAdminAuth>
                  <UsersManagementPage />
                </RequireAdminAuth>
              }
            />
            <Route
              path="/organizers"
              element={
                <RequireAdminAuth>
                  <OrganizersManagementPage />
                </RequireAdminAuth>
              }
            />
            <Route
              path="/activities"
              element={
                <RequireAdminAuth>
                  <ActivitiesModerationPage />
                </RequireAdminAuth>
              }
            />
            <Route
              path="/activites"
              element={
                <RequireAdminAuth>
                  <ActivitiesModerationPage />
                </RequireAdminAuth>
              }
            />
            <Route
              path="/reports"
              element={
                <RequireAdminAuth>
                  <ReportsQueuePage />
                </RequireAdminAuth>
              }
            />
            <Route
              path="/categories"
              element={
                <RequireAdminAuth>
                  <CategoriesManagementPage />
                </RequireAdminAuth>
              }
            />
            <Route
              path="/audit-log"
              element={
                <RequireAdminAuth>
                  <AuditLogPage />
                </RequireAdminAuth>
              }
            />
            <Route
              path="*"
              element={
                <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
                  <h2>Page Not Found</h2>
                  <Link to="/"><Button variant="primary">Return to Console</Button></Link>
                </div>
              }
            />
          </Routes>
        </AdminLayout>
      </ToastProvider>
    </BrowserRouter>
  );
};
