import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { Modal } from '../Modal/index.js';
import { Drawer } from '../Drawer/index.js';
import { BottomSheet } from '../BottomSheet/index.js';

describe('Modal Component', () => {
  it('renders content and dialog role when isOpen is true', () => {
    render(
      <Modal isOpen={true} onClose={vi.fn()} title="Test Modal">
        <p>Modal Body Content</p>
      </Modal>
    );

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Test Modal')).toBeInTheDocument();
    expect(screen.getByText('Modal Body Content')).toBeInTheDocument();
  });

  it('renders nothing when isOpen is false', () => {
    render(
      <Modal isOpen={false} onClose={vi.fn()} title="Hidden Modal">
        <p>Hidden Content</p>
      </Modal>
    );

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('triggers onClose when Escape key is pressed', async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();

    render(
      <Modal isOpen={true} onClose={onClose} title="Escape Test">
        <p>Body</p>
      </Modal>
    );

    await user.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('passes axe accessibility test when open', async () => {
    const { container } = render(
      <Modal isOpen={true} onClose={vi.fn()} title="Accessible Dialog">
        <p>Accessible Content</p>
      </Modal>
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

describe('Drawer & BottomSheet Components', () => {
  it('closes Drawer on Escape key press', async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();

    render(
      <Drawer isOpen={true} onClose={onClose} title="Filters Drawer">
        <div>Drawer Body</div>
      </Drawer>
    );

    await user.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalled();
  });

  it('renders BottomSheet content when open', () => {
    render(
      <BottomSheet isOpen={true} onClose={vi.fn()} title="Mobile Sheet">
        <div>Sheet Body</div>
      </BottomSheet>
    );

    expect(screen.getByText('Mobile Sheet')).toBeInTheDocument();
  });
});
