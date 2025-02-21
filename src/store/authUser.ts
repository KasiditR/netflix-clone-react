import axiosInstance from '@/utils/axiosInstance';
import toast from 'react-hot-toast';
import { create } from 'zustand';

type AuthState = {
  user: any;
  isSigningUp: boolean;
  isCheckingAuth: boolean;
  isLoggingOut: boolean;
  isLoggingIn: boolean;
  signup: Function;
  login: Function;
  logout: Function;
  authCheck: Function;
};

export const useAuthStore = create<AuthState>(set => ({
  user: null,
  isSigningUp: false,
  isCheckingAuth: true,
  isLoggingOut: false,
  isLoggingIn: false,
  signup: async (credentials: any) => {
    set({ isSigningUp: true });
    try {
      const response = await axiosInstance.post(
        '/api/v1/auth/signup',
        credentials
      );
      localStorage.setItem('refreshToken', response.data.refreshToken);
      localStorage.setItem('accessToken', response.data.accessToken);
      set({ user: response.data, isSigningUp: false });
      toast.success('Account created successfully');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'An error occurred');
      set({ user: null, isSigningUp: false });
    }
  },
  login: async (credentials: any) => {
    set({ isLoggingIn: true });
    try {
      const response = await axiosInstance.post(
        '/api/v1/auth/login',
        credentials
      );
      localStorage.setItem('refreshToken', response.data.refreshToken);
      localStorage.setItem('accessToken', response.data.accessToken);
      set({ user: response.data, isLoggingIn: false });
      toast.success('Login successful');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Login failed');
      set({ user: null, isLoggingIn: false });
    }
  },
  logout: async () => {
    set({ isLoggingOut: true });
    try {
      await axiosInstance.post('/api/v1/auth/logout');
      set({ user: null, isLoggingOut: false });
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('accessToken')
      toast.success('Logged out successfully');
    } catch (error: any) {
      set({ isLoggingOut: false });
      toast.error(error.response?.data?.message || 'Logout failed');
    }
  },
  authCheck: async () => {
    set({ isCheckingAuth: true });
    try {
      const response = await axiosInstance.get('/api/v1/auth/authCheck');
      set({ user: response.data, isCheckingAuth: false });
    } catch (error: any) {
      set({ user: null, isCheckingAuth: false });
    }
  },
}));
