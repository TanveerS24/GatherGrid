import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RatingStars } from '../RatingStars/index.js';
import { CopyField } from '../CopyField/index.js';
import { Slider } from '../Slider/index.js';

describe('RatingStars Component', () => {
  it('renders 5 stars and triggers onChange when clicked in interactive mode', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();

    render(<RatingStars value={3} onChange={onChange} />);

    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(5);

    await user.click(buttons[4]); // 5th star
    expect(onChange).toHaveBeenCalledWith(5);
  });

  it('renders read-only display when onChange is omitted', () => {
    render(<RatingStars value={4} showNumber />);
    expect(screen.getByText('4.0')).toBeInTheDocument();
  });
});

describe('CopyField Component', () => {
  it('renders read-only input and copies value to clipboard on button click', async () => {
    const user = userEvent.setup();
    const writeTextMock = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: writeTextMock },
      writable: true,
      configurable: true,
    });

    render(<CopyField value="GG-998877" label="Team Join Code" />);

    expect(screen.getByText(/team join code/i)).toBeInTheDocument();
    expect(screen.getByDisplayValue('GG-998877')).toBeInTheDocument();

    const copyBtn = screen.getByRole('button', { name: /copy to clipboard/i });
    await user.click(copyBtn);

    expect(writeTextMock).toHaveBeenCalledWith('GG-998877');
    expect(screen.getByText('Copied!')).toBeInTheDocument();
  });
});

describe('Slider Component', () => {
  it('renders radius range input with unit display', () => {
    const onChange = vi.fn();
    render(<Slider min={1} max={100} value={25} unit="km" onChange={onChange} />);

    expect(screen.getByText('25 km')).toBeInTheDocument();
    const slider = screen.getByRole('slider');
    expect(slider).toHaveValue('25');
  });
});
