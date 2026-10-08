import { request } from './client';
import type { LoginInput, RegisterInput, ForgotPasswordInput, ResetPasswordInput, AuthUser } from '../schemas';

export const authApi = {
  login: (data: LoginInput) =>
    request<AuthUser>('/api/v1/auth/login', { method: 'POST', body: JSON.stringify(data) }),

  register: (data: RegisterInput) =>
    request<AuthUser>('/api/v1/auth/register', { method: 'POST', body: JSON.stringify(data) }),

  logout: () =>
    request<{ success: boolean }>('/api/v1/auth/logout', { method: 'POST' }),

  me: () =>
    request<AuthUser>('/api/v1/auth/me'),

  forgotPassword: (data: ForgotPasswordInput) =>
    request<{ message: string }>('/api/v1/auth/forgot-password', { method: 'POST', body: JSON.stringify(data) }),

  resetPassword: (data: ResetPasswordInput) =>
    request<{ message: string }>('/api/v1/auth/reset-password', { method: 'POST', body: JSON.stringify(data) }),

  updateProfile: (data: Partial<AuthUser>) =>
    request<AuthUser>('/api/v1/auth/profile', { method: 'PATCH', body: JSON.stringify(data) }),
};
