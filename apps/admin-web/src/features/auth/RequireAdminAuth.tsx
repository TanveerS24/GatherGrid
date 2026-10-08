import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@gathergrid/shared';
import { Skeleton } from '@gathergrid/ui';

export const RequireAdminAuth: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isInitialized, checkAuth } = useAuthStore();
  const location = useLocation();

  useEffect(() => {
    if (!isInitialized) {
      checkAuth();
    }
  }, [isInitialized, checkAuth]);

  if (!isInitialized) {
    return (
      <div style={{ padding: '3rem', maxWidth: '600px', margin: '0 auto' }}>
        <Skeleton variant="text" width="40%" height={32} />
        <Skeleton variant="rectangular" height={160} />
      </div>
    );
  }

  // Mandatory admin authentication (ADR 007)
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
