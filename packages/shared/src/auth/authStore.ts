import { create } from 'zustand';
import { authApi } from '../api-client/auth';
import type { AuthUser, LoginInput, RegisterInput } from '../schemas';

interface AuthState {
  user: AuthUser | null;
  isLoading: boolean;
  isInitialized: boolean;
  login: (data: LoginInput) => Promise<AuthUser>;
  register: (data: RegisterInput) => Promise<AuthUser>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<AuthUser | null>;
  updateUser: (user: Partial<AuthUser>) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: false,
  isInitialized: false,

  login: async (data: LoginInput) => {
    set({ isLoading: true });
    try {
      const user = await authApi.login(data);
      set({ user, isLoading: false, isInitialized: true });
      return user;
    } catch (err) {
      set({ isLoading: false });
      throw err;
    }
  },

  register: async (data: RegisterInput) => {
    set({ isLoading: true });
    try {
      const user = await authApi.register(data);
      set({ user, isLoading: false, isInitialized: true });
      return user;
    } catch (err) {
      set({ isLoading: false });
      throw err;
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      await authApi.logout();
    } finally {
      set({ user: null, isLoading: false, isInitialized: true });
    }
  },

  checkAuth: async () => {
    set({ isLoading: true });
    try {
      const user = await authApi.me();
      set({ user, isLoading: false, isInitialized: true });
      return user;
    } catch {
      set({ user: null, isLoading: false, isInitialized: true });
      return null;
    }
  },

  updateUser: (data: Partial<AuthUser>) => {
    set((state) => ({
      user: state.user ? { ...state.user, ...data } : null,
    }));
  },
}));
