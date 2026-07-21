import { api } from '@/lib/api/client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
  emailVerified?: boolean;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;

  // Actions
  signUp: (email: string, password: string, name: string) => Promise<void>;
  verifyEmail: (email: string, otp: string) => Promise<void>;
  resendVerification: (email: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  getSession: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  verifyResetOTP: (email: string, otp: string) => Promise<void>;
  resetPassword: (email: string, newPassword: string) => Promise<void>;
  clearError: () => void;
  setUser: (user: User) => void;
  setToken: (token: string) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,
      error: null,
      isAuthenticated: false,

      signUp: async (email, password, name) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.auth.signUp(email, password, name);
          if (response.error) {
            set({ error: response.error, isLoading: false });
            return;
          }
          set({
            user: response.user,
            token: response.token,
            isAuthenticated: true,
            isLoading: false,
          });
          localStorage.setItem('auth_token', response.token);
        } catch (error: any) {
          set({ error: error.message || `Sign up failed`, isLoading: false });
        }
      },

      verifyEmail: async (email, otp) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.auth.verifyEmail(email, otp);
          if (response.error) {
            set({ error: response.error, isLoading: false });
            return;
          }
          const currentUser = get().user;
          if (currentUser) {
            set({ user: { ...currentUser, emailVerified: true }, isLoading: false });
          } else {
            set({ isLoading: false });
          }
        } catch (error: any) {
          set({ error: error.message || 'Verification failed', isLoading: false });
        }
      },

      resendVerification: async email => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.auth.resendVerification(email);
          if (response.error) {
            set({ error: response.error, isLoading: false });
            return;
          }
          set({ isLoading: false });
        } catch (error: any) {
          set({ error: error.message || 'Failed to send OTP', isLoading: false });
        }
      },

      signIn: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.auth.signIn(email, password);
          if (response.error) {
            set({ error: response.error, isLoading: false });
            return;
          }
          set({
            user: response.user,
            token: response.token,
            isAuthenticated: true,
            isLoading: false,
          });
          localStorage.setItem('auth_token', response.token);
        } catch (error: any) {
          set({ error: error.message || 'Sign in failed', isLoading: false });
        }
      },

      signOut: async () => {
        set({ isLoading: true });
        try {
          await api.auth.logout();
        } catch (error) {
          console.error('Logout error', error);
        } finally {
          localStorage.removeItem('auth_token');
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });
        }
      },

      getSession: async () => {
        const token = localStorage.getItem('auth_token');
        if (!token) {
          set({ isAuthenticated: false, user: null });
          return;
        }

        set({ isLoading: true });
        try {
          const response = await api.auth.getSession(token);
          if (response.error) {
            localStorage.removeItem('auth_token');
            set({ isAuthenticated: false, user: null, isLoading: false });
            return;
          }
          set({
            user: response.user,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          console.error(error);
          localStorage.removeItem('auth_token');
          set({ isAuthenticated: false, user: null, isLoading: false });
        }
      },

      forgotPassword: async email => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.auth.forgotPassword(email);
          if (response.error) {
            set({ error: response.error, isLoading: false });
            return;
          }
          set({ isLoading: false });
        } catch (error: any) {
          set({ error: error.message || 'Failed to send reset OTP', isLoading: false });
        }
      },

      verifyResetOTP: async (email, otp) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.auth.verifyResetOTP(email, otp);
          if (response.error) {
            set({ error: response.error, isLoading: false });
            return;
          }
          set({ isLoading: false });
        } catch (error: any) {
          set({ error: error.message || 'Incalid OTP', isLoading: false });
        }
      },

      resetPassword: async (email, newPassword) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.auth.resetPassword(email, newPassword);
          if (response.error) {
            set({ error: response.error, isLoading: false });
            return;
          }
          set({ isLoading: false });
        } catch (error: any) {
          set({ error: error.message || 'Password reset failed', isLoading: false });
        }
      },

      clearError: () => set({ error: null }),

      setUser: (user: User) => set({ user, isAuthenticated: true }),

      setToken: (token: string) => {
        localStorage.setItem('auth_token', token);
        set({ token });
      },
    }),
    {
      name: 'auth_storage',
      partialize: state => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
