import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { forgotPasswordSchema, type ForgotPasswordInput, authApi } from '@gathergrid/shared';
import { FormField, Input, Button, Card, useToast } from '@gathergrid/ui';

export const ForgotPasswordPage: React.FC = () => {
  const toast = useToast();
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordInput) => {
    try {
      await authApi.forgotPassword(data);
      setSubmitted(true);
      toast.success('Reset email sent');
    } catch {
      setSubmitted(true);
    }
  };

  return (
    <div style={{ maxWidth: '420px', margin: '4rem auto 2rem', padding: '0 1rem' }}>
      <Card variant="flat" padding="lg">
        <h2 style={{ marginBottom: '0.5rem', textAlign: 'center' }}>Reset Your Password</h2>
        <p style={{ fontSize: '14px', color: 'var(--gg-color-muted)', textAlign: 'center', marginBottom: '1.5rem' }}>
          Enter your email and we'll send you instructions.
        </p>

        {submitted ? (
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '14px', color: 'var(--gg-color-success)', fontWeight: 500, marginBottom: '1.5rem' }}>
              Check your inbox! We've sent password reset instructions if an account exists with that email.
            </p>
            <Link to="/login">
              <Button variant="outline" fullWidth>Return to Log In</Button>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <FormField label="Email address" error={errors.email?.message} required>
              <Input type="email" placeholder="you@example.com" {...register('email')} />
            </FormField>

            <Button type="submit" variant="primary" fullWidth isLoading={isSubmitting}>
              Send Reset Link
            </Button>

            <div style={{ textAlign: 'center', marginTop: '0.5rem' }}>
              <Link to="/login" style={{ fontSize: '14px' }}>Back to Log In</Link>
            </div>
          </form>
        )}
      </Card>
    </div>
  );
};
