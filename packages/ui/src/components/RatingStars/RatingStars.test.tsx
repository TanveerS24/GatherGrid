import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { RatingStars } from './RatingStars';

describe('RatingStars', () => {
  it('renders rating number when showNumber is true', () => {
    render(<RatingStars value={4.5} showNumber totalRatings={20} />);
    expect(screen.getByText('4.5')).toBeInTheDocument();
    expect(screen.getByText('(20)')).toBeInTheDocument();
  });

  it('triggers onChange when clicked in interactive mode', () => {
    const handleChange = vi.fn();
    render(<RatingStars value={3} onChange={handleChange} />);
    const starBtn = screen.getByRole('button', { name: /4 star/i });
    fireEvent.click(starBtn);
    expect(handleChange).toHaveBeenCalledWith(4);
  });
});
