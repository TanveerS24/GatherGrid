import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { Button } from '../Button/index.js';
import { Input } from '../Input/index.js';
import { FormField } from '../FormField/index.js';
import { Checkbox } from '../Checkbox/index.js';
import { Switch } from '../Switch/index.js';

describe('Button Component', () => {
  it('renders button with label and variants', () => {
    const { rerender } = render(<Button variant="primary">Submit</Button>);
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();

    rerender(<Button variant="danger">Delete</Button>);
    expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument();
  });

  it('handles click events when enabled', async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();
    render(<Button onClick={onClick}>Click Me</Button>);

    await user.click(screen.getByRole('button', { name: /click me/i }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('disables interaction when disabled or loading', async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();
    const { rerender } = render(
      <Button disabled onClick={onClick}>
        Disabled
      </Button>
    );

    const btn = screen.getByRole('button');
    expect(btn).toBeDisabled();
    await user.click(btn);
    expect(onClick).not.toHaveBeenCalled();

    rerender(
      <Button isLoading onClick={onClick}>
        Loading
      </Button>
    );
    expect(btn).toBeDisabled();
  });

  it('has no accessibility violations (axe)', async () => {
    const { container } = render(<Button>Accessible Action</Button>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

describe('FormField & Input Components', () => {
  it('renders input with label and helper text', () => {
    render(
      <FormField label="Full Name" htmlFor="name-input" helperText="Enter first and last name">
        <Input id="name-input" placeholder="e.g. Jane Doe" />
      </FormField>
    );

    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    expect(screen.getByText(/enter first and last name/i)).toBeInTheDocument();
  });

  it('displays error message with role="alert"', () => {
    render(
      <FormField label="Email" htmlFor="email-input" error="Email is required">
        <Input id="email-input" />
      </FormField>
    );

    const alert = screen.getByRole('alert');
    expect(alert).toHaveTextContent('Email is required');
  });

  it('accepts text input with userEvent typing', async () => {
    const user = userEvent.setup();
    render(<Input placeholder="Type here" />);

    const input = screen.getByPlaceholderText('Type here');
    await user.type(input, 'GatherGrid Rocks');
    expect(input).toHaveValue('GatherGrid Rocks');
  });
});

describe('Checkbox & Switch Components', () => {
  it('toggles checkbox state upon click', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<Checkbox label="I agree to terms" onChange={onChange} />);

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).not.toBeChecked();

    await user.click(checkbox);
    expect(onChange).toHaveBeenCalled();
  });

  it('toggles switch state upon click', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<Switch label="Enable notifications" onChange={onChange} />);

    const switchEl = screen.getByRole('switch');
    await user.click(switchEl);
    expect(onChange).toHaveBeenCalled();
  });
});
