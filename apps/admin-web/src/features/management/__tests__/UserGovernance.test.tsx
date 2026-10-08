import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ToastProvider } from '@gathergrid/ui';
import { UsersManagementPage } from '../UsersManagementPage.js';

describe('UsersManagementPage Governance Component', () => {
  it('renders platform user roster and toggles user suspension status', async () => {
    const user = userEvent.setup();

    render(
      <ToastProvider>
        <UsersManagementPage />
      </ToastProvider>
    );

    expect(screen.getByText('User Accounts Management')).toBeInTheDocument();
    expect(screen.getByText('Maya Lin')).toBeInTheDocument();
    expect(screen.getByText('Spam Bot 9000')).toBeInTheDocument();

    // Toggle suspension on active user Maya Lin
    const suspendButtons = screen.getAllByRole('button', { name: /suspend/i });
    expect(suspendButtons.length).toBeGreaterThan(0);

    await user.click(suspendButtons[0]);
    // Status should toggle to suspended
    expect(screen.getByText('User Maya Lin set to suspended.')).toBeInTheDocument();
  });
});
