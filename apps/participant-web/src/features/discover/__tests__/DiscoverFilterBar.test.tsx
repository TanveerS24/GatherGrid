import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DiscoverFilterBar } from '../DiscoverFilterBar.js';

describe('DiscoverFilterBar Component', () => {
  it('renders category chips and triggers category selection', async () => {
    const onSelectCategory = vi.fn();
    const user = userEvent.setup();

    render(
      <DiscoverFilterBar
        query=""
        onQueryChange={vi.fn()}
        selectedCategory=""
        onSelectCategory={onSelectCategory}
        radiusKm={25}
        onRadiusChange={vi.fn()}
        formatFilter=""
        onFormatChange={vi.fn()}
        isFreeOnly={false}
        onToggleFreeOnly={vi.fn()}
      />
    );

    const sportsChip = screen.getByText('Sports');
    expect(sportsChip).toBeInTheDocument();

    await user.click(sportsChip);
    expect(onSelectCategory).toHaveBeenCalledWith('sports');
  });

  it('renders expanded radius slider and free events toggle', async () => {
    const onToggleFreeOnly = vi.fn();
    const user = userEvent.setup();

    render(
      <DiscoverFilterBar
        query=""
        onQueryChange={vi.fn()}
        selectedCategory=""
        onSelectCategory={vi.fn()}
        radiusKm={35}
        onRadiusChange={vi.fn()}
        formatFilter=""
        onFormatChange={vi.fn()}
        isFreeOnly={false}
        onToggleFreeOnly={onToggleFreeOnly}
      />
    );

    expect(screen.getByText('35 km')).toBeInTheDocument();

    const freeButton = screen.getByRole('button', { name: /free only/i });
    await user.click(freeButton);
    expect(onToggleFreeOnly).toHaveBeenCalled();
  });
});
