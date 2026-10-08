import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SeatMeter } from './SeatMeter';

describe('SeatMeter', () => {
  it('renders registered vs capacity text', () => {
    render(<SeatMeter registered={37} capacity={50} />);
    expect(screen.getByText(/37 \/ 50 seats/i)).toBeInTheDocument();
  });

  it('renders Full text when capacity is reached', () => {
    render(<SeatMeter registered={50} capacity={50} />);
    expect(screen.getByText(/· Full/i)).toBeInTheDocument();
  });

  it('handles unlimited capacity', () => {
    render(<SeatMeter registered={12} />);
    expect(screen.getByText(/12 participants \(Unlimited\)/i)).toBeInTheDocument();
  });
});
