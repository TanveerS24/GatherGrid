import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { loginSchema, type LoginInput, useAuthStore } from '@gathergrid/shared';
import { FormField, Input, PasswordInput, Button, Card, useToast } from '@gathergrid/ui';

export const LoginPage: React.FC = () => {
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

  const from = (location.state as any)?.from?.pathname || '/';

  const onSubmit = async (data: LoginInput) => {
    setErrorMsg(null);
    try {
      await login(data);
      toast.success('Welcome back!');
      navigate(from, { replace: true });
    } catch (err: any) {
      setErrorMsg(err.message || 'Login failed. Please check credentials.');
    }
  };

  const handleQuickDemo = () => {
    setValue('email', 'participant@gathergrid.com');
    setValue('password', 'password123');
  };

  return (
    <div style={{ maxWidth: '420px', margin: '4rem auto 2rem', padding: '0 1rem' }}>
      <Card variant="flat" padding="lg">
        <h2 style={{ marginBottom: '0.5rem', textAlign: 'center' }}>Log In to GatherGrid</h2>
        <p style={{ fontSize: '14px', color: 'var(--gg-color-muted)', textAlign: 'center', marginBottom: '1.5rem' }}>
          Mandatory login required to browse and join city activities.
        </p>

        {errorMsg && (
          <div style={{ padding: '0.75rem', background: '#fef2f2', color: '#b91c1c', borderRadius: '8px', fontSize: '13px', marginBottom: '1rem' }}>
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <FormField label="Email address" error={errors.email?.message} required>
            <Input type="email" placeholder="you@example.com" {...register('email')} />
          </FormField>

          <FormField label="Password" error={errors.password?.message} required>
            <PasswordInput placeholder="Enter password" {...register('password')} />
          </FormField>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Link to="/forgot-password" style={{ fontSize: '12px' }}>Forgot password?</Link>
          </div>

          <Button type="submit" variant="primary" fullWidth isLoading={isSubmitting}>
            Log In
          </Button>

          <Button type="button" variant="outline" fullWidth onClick={handleQuickDemo}>
            Quick Fill Demo User
          </Button>
        </form>

        <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '14px', color: 'var(--gg-color-muted)' }}>
          Don't have an account? <Link to="/register">Sign up</Link>
        </div>
      </Card>
    </div>
  );
};
