import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ToastProvider } from '@gathergrid/ui';
import { ActivitiesModerationPage } from '../ActivitiesModerationPage.js';
import { ReportsQueuePage } from '../ReportsQueuePage.js';

describe('Admin Content Moderation Components', () => {
  it('renders activities moderation table and toggles take down status', async () => {
    const user = userEvent.setup();

    render(
      <ToastProvider>
        <ActivitiesModerationPage />
      </ToastProvider>
    );

    expect(screen.getByText('Activities Moderation')).toBeInTheDocument();
    expect(screen.getByText('Sunset Beach Volleyball & Social')).toBeInTheDocument();

    const takeDownButtons = screen.getAllByRole('button', { name: /take down/i });
    expect(takeDownButtons.length).toBeGreaterThan(0);

    await user.click(takeDownButtons[0]);
    expect(screen.getByText('Activity status changed to cancelled.')).toBeInTheDocument();
  });

  it('renders reports queue and resolves pending member reports', async () => {
    const user = userEvent.setup();

    render(
      <ToastProvider>
        <ReportsQueuePage />
      </ToastProvider>
    );

    expect(screen.getByText('Reports Queue')).toBeInTheDocument();
    expect(screen.getByText('Crypto Trading Meetup')).toBeInTheDocument();
    expect(screen.getByText('Spam Bot 9000')).toBeInTheDocument();

    const resolveButtons = screen.getAllByRole('button', { name: /dismiss \/ resolve/i });
    expect(resolveButtons.length).toBeGreaterThan(0);

    await user.click(resolveButtons[0]);
    expect(screen.getByText('Report resolved and marked.')).toBeInTheDocument();
  });
});
