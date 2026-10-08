import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { SeatMeter } from '../SeatMeter/index.js';
import { StatusPill } from '../StatusPill/index.js';
import { OrganizerBadge } from '../OrganizerBadge/index.js';

describe('SeatMeter Component', () => {
  it('displays seat count ratio and full label when at capacity', () => {
    render(<SeatMeter registered={10} capacity={10} />);
    expect(screen.getByText(/10 \/ 10 seats/i)).toBeInTheDocument();
    expect(screen.getByText(/· full/i)).toBeInTheDocument();
  });

  it('handles unlimited capacity gracefully', () => {
    render(<SeatMeter registered={42} capacity={undefined} />);
    expect(screen.getByText(/42 participants \(unlimited\)/i)).toBeInTheDocument();
  });

  it('displays team unit when isTeamEvent is true', () => {
    render(<SeatMeter registered={4} capacity={8} isTeamEvent />);
    expect(screen.getByText(/4 \/ 8 teams/i)).toBeInTheDocument();
  });
});

describe('StatusPill Component', () => {
  it('renders human-readable status labels for activities and registrations', () => {
    const { rerender } = render(<StatusPill status="confirmed" />);
    expect(screen.getByText(/confirmed/i)).toBeInTheDocument();

    rerender(<StatusPill status="waitlisted" />);
    expect(screen.getByText(/waitlisted/i)).toBeInTheDocument();

    rerender(<StatusPill status="offered" />);
    expect(screen.getByText(/seat offered/i)).toBeInTheDocument();
  });
});

describe('OrganizerBadge Component', () => {
  it('renders badge tier labels and passes accessibility check', async () => {
    const { container, rerender } = render(<OrganizerBadge tier="bronze" />);
    expect(screen.getByText(/bronze/i)).toBeInTheDocument();

    rerender(<OrganizerBadge tier="gold" />);
    expect(screen.getByText(/gold/i)).toBeInTheDocument();

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
