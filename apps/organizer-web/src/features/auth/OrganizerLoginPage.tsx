import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { loginSchema, type LoginInput, useAuthStore } from '@gathergrid/shared';
import { FormField, Input, PasswordInput, Button, Card, useToast } from '@gathergrid/ui';

export const OrganizerLoginPage: React.FC = () => {
  const { login } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const locationState = location.state as { from?: { pathname?: string } } | null;
  const from = locationState?.from?.pathname || '/';

  const onSubmit = async (data: LoginInput) => {
    setErrorMsg(null);
    try {
      await login(data);
      toast.success('Welcome to Organizer Portal');
      navigate(from, { replace: true });
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Login failed.');
    }
  };

  const handleQuickDemo = () => {
    setValue('email', 'organizer@gathergrid.com');
    setValue('password', 'password123');
  };

  return (
    <div style={{ maxWidth: '420px', margin: '4rem auto', padding: '0 1rem' }}>
      <Card variant="flat" padding="lg">
        <h2 style={{ marginBottom: '0.25rem', textAlign: 'center' }}>Organizer Portal</h2>
        <p style={{ fontSize: '14px', color: 'var(--gg-color-muted)', textAlign: 'center', marginBottom: '1.5rem' }}>
          Host, manage, and grow your city activities.
        </p>

        {errorMsg && (
          <div style={{ padding: '0.75rem', background: '#fef2f2', color: '#b91c1c', borderRadius: '8px', fontSize: '13px', marginBottom: '1rem' }}>
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <FormField label="Organizer Email" error={errors.email?.message} required>
            <Input type="email" placeholder="host@organization.com" {...register('email')} />
          </FormField>

          <FormField label="Password" error={errors.password?.message} required>
            <PasswordInput placeholder="Enter password" {...register('password')} />
          </FormField>

          <Button type="submit" variant="primary" fullWidth isLoading={isSubmitting}>
            Log In to Portal
          </Button>

          <Button type="button" variant="outline" fullWidth onClick={handleQuickDemo}>
            Quick Fill Demo Host
          </Button>
        </form>

        <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '14px', color: 'var(--gg-color-muted)' }}>
          New organizer? <Link to="/register">Create free host account</Link>
        </div>
      </Card>
    </div>
  );
};
