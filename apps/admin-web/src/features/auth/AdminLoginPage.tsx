import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useLocation } from 'react-router-dom';
import { loginSchema, type LoginInput, useAuthStore } from '@gathergrid/shared';
import { FormField, Input, PasswordInput, Button, Card, useToast } from '@gathergrid/ui';

export const AdminLoginPage: React.FC = () => {
  const { login } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  const [totpStep, setTotpStep] = useState(false);
  const [totpCode, setTotpCode] = useState('');
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
    if (!totpStep) {
      // Advance to 2FA TOTP verification
      setTotpStep(true);
      return;
    }

    try {
      await login(data);
      toast.success('Admin authentication verified');
      navigate(from, { replace: true });
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Authentication failed');
    }
  };

  const handleQuickDemo = () => {
    setValue('email', 'admin@gathergrid.com');
    setValue('password', 'password123');
    setTotpStep(true);
    setTotpCode('123456');
  };

  return (
    <div style={{ maxWidth: '420px', margin: '4rem auto', padding: '0 1rem' }}>
      <Card variant="flat" padding="lg">
        <h2 style={{ marginBottom: '0.25rem', textAlign: 'center' }}>Staff Administration</h2>
        <p style={{ fontSize: '14px', color: 'var(--gg-color-muted)', textAlign: 'center', marginBottom: '1.5rem' }}>
          Restricted platform management and moderation console.
        </p>

        {errorMsg && (
          <div style={{ padding: '0.75rem', background: '#fef2f2', color: '#b91c1c', borderRadius: '8px', fontSize: '13px', marginBottom: '1rem' }}>
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {!totpStep ? (
            <>
              <FormField label="Staff Email" error={errors.email?.message} required>
                <Input type="email" placeholder="staff@gathergrid.com" {...register('email')} />
              </FormField>

              <FormField label="Password" error={errors.password?.message} required>
                <PasswordInput placeholder="Admin password" {...register('password')} />
              </FormField>

              <Button type="submit" variant="primary" fullWidth isLoading={isSubmitting}>
                Continue to 2FA Verification
              </Button>
            </>
          ) : (
            <>
              <FormField label="Authenticator TOTP Code (6 digits)" required helperText="Enter the code from your 2FA app or use demo">
                <Input
                  placeholder="e.g. 123456"
                  maxLength={6}
                  value={totpCode}
                  onChange={(e) => setTotpCode(e.target.value)}
                />
              </FormField>

              <Button type="submit" variant="primary" fullWidth isLoading={isSubmitting}>
                Verify & Enter Console
              </Button>

              <Button type="button" variant="ghost" fullWidth onClick={() => setTotpStep(false)}>
                Back to Credentials
              </Button>
            </>
          )}

          <Button type="button" variant="outline" fullWidth onClick={handleQuickDemo}>
            Quick Fill Demo Staff
          </Button>
        </form>
      </Card>
    </div>
  );
};
