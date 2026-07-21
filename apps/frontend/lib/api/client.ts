const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export const api = {
  auth: {
    signUp: async (email: string, password: string, name: string) => {
      const response = await fetch(`${API_URL}/api/auth/sign-up`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name }),
      });
      return response.json();
    },

    verifyEmail: async (email: string, otp: string) => {
      const response = await fetch(`${API_URL}/api/auth/verify-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });
      return response.json();
    },

    resendVerification: async (email: string) => {
      const response = await fetch(`${API_URL}/api/auth/resend-verification`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      return response.json();
    },

    signIn: async (email: string, password: string) => {
      const response = await fetch(`${API_URL}/api/auth/sign-in`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      return response.json();
    },

    getSession: async (token: string) => {
      const response = await fetch(`${API_URL}/api/auth/session`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.json();
    },

    logout: async () => {
      const response = await fetch(`${API_URL}/api/auth/logout`, {
        method: 'POST',
      });
      return response.json();
    },

    forgotPassword: async (email: string) => {
      const response = await fetch(`${API_URL}/api/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      return response.json();
    },

    verifyResetOTP: async (email: string, otp: string) => {
      const response = await fetch(`${API_URL}/api/auth/verify-reset-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });
      return response.json();
    },

    resetPassword: async (email: string, newPassword: string) => {
      const response = await fetch(`${API_URL}/api/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, newPassword }),
      });
      return response.json();
    },
  },
};
