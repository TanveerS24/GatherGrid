import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, Link } from 'react-router-dom';
import { registerSchema, type RegisterInput, useAuthStore, UserRole } from '@gathergrid/shared';
import { FormField, Input, PasswordInput, Button, Card, useToast } from '@gathergrid/ui';

export const RegisterPage: React.FC = () => {
  const { register: registerUser } = useAuthStore();
  const navigate = useNavigate();
  const toast = useToast();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: UserRole.PARTICIPANT },
  });

  const onSubmit = async (data: RegisterInput) => {
    setErrorMsg(null);
    try {
      await registerUser(data);
      toast.success('Account created! Welcome to GatherGrid.');
      navigate('/onboarding', { replace: true });
    } catch (err: any) {
      setErrorMsg(err.message || 'Registration failed.');
    }
  };

  return (
    <div style={{ maxWidth: '440px', margin: '4rem auto 2rem', padding: '0 1rem' }}>
      <Card variant="flat" padding="lg">
        <h2 style={{ marginBottom: '0.5rem', textAlign: 'center' }}>Create Your Account</h2>
        <p style={{ fontSize: '14px', color: 'var(--gg-color-muted)', textAlign: 'center', marginBottom: '1.5rem' }}>
          Join activities, meet people, and explore your city.
        </p>

        {errorMsg && (
          <div style={{ padding: '0.75rem', background: '#fef2f2', color: '#b91c1c', borderRadius: '8px', fontSize: '13px', marginBottom: '1rem' }}>
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <FormField label="Full Name" error={errors.name?.message} required>
            <Input placeholder="Maya Lin" {...register('name')} />
          </FormField>

          <FormField label="Email address" error={errors.email?.message} required>
            <Input type="email" placeholder="you@example.com" {...register('email')} />
          </FormField>

          <FormField label="Password" error={errors.password?.message} required helperText="Must be at least 8 characters">
            <PasswordInput placeholder="Create password" {...register('password')} />
          </FormField>

          <Button type="submit" variant="primary" fullWidth isLoading={isSubmitting}>
            Create Account & Continue
          </Button>
        </form>

        <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '14px', color: 'var(--gg-color-muted)' }}>
          Already have an account? <Link to="/login">Log in</Link>
        </div>
      </Card>
    </div>
  );
};
