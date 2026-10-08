import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StatusPill } from './StatusPill';

describe('StatusPill', () => {
  it('renders standard status label', () => {
    render(<StatusPill status="confirmed" />);
    expect(screen.getByText('Confirmed')).toBeInTheDocument();
  });

  it('renders custom label when provided', () => {
    render(<StatusPill status="pending" label="Awaiting Host" />);
    expect(screen.getByText('Awaiting Host')).toBeInTheDocument();
  });
});
