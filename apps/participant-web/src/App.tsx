import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { ToastProvider, AppShell, TopNav, Button } from '@gathergrid/ui';
import { GalleryPage } from './pages/gallery/GalleryPage';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AppShell
          topNav={
            <TopNav
              logo={<span>GatherGrid</span>}
              actions={
                <Link to="/gallery">
                  <Button variant="outline" size="sm">Component Gallery</Button>
                </Link>
              }
            >
              <Link to="/" style={{ color: 'var(--gg-color-ink)', fontWeight: 500 }}>Home</Link>
              <Link to="/gallery" style={{ color: 'var(--gg-color-ink)', fontWeight: 500 }}>Gallery</Link>
            </TopNav>
          }
        >
          <Routes>
            <Route
              path="/"
              element={
                <div style={{ textAlign: 'center', padding: '3rem 0' }}>
                  <h1>GatherGrid Participant App</h1>
                  <p style={{ margin: '1rem 0 2rem', color: 'var(--gg-color-muted)' }}>
                    City-wide platform for discovering and joining activities.
                  </p>
                  <Link to="/gallery">
                    <Button variant="primary">Explore Component Gallery</Button>
                  </Link>
                </div>
              }
            />
            <Route path="/gallery" element={<GalleryPage />} />
          </Routes>
        </AppShell>
      </ToastProvider>
    </BrowserRouter>
  );
};
