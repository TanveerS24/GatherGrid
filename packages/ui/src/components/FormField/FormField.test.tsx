import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { FormField } from './FormField';
import { Input } from '../Input/Input';

describe('FormField', () => {
  it('renders label, required indicator, and helper text', () => {
    render(
      <FormField label="Email" required helperText="Enter your email" htmlFor="email-input">
        <Input id="email-input" />
      </FormField>
    );

    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByText('*')).toBeInTheDocument();
    expect(screen.getByText('Enter your email')).toBeInTheDocument();
  });

  it('renders error message when error is provided', () => {
    render(
      <FormField label="Email" error="Invalid email address">
        <Input />
      </FormField>
    );

    expect(screen.getByRole('alert')).toHaveTextContent('Invalid email address');
  });
});
