import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '../types';
import { apiService } from '../services/api';

interface UserState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      user: null,
      isLoading: false,
      error: null,

      login: async (username: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await apiService.login(username, password);
          const user: User = response.user;
          localStorage.setItem('bakery_token', response.token);
          set({ user, isLoading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Login failed',
            isLoading: false 
          });
          throw error;
        }
      },

      logout: () => {
        localStorage.removeItem('bakery_token');
        set({ user: null, error: null });
      },

      checkAuth: async () => {
        const token = localStorage.getItem('bakery_token');
        if (!token) return;

        set({ isLoading: true });
        try {
          const user = await apiService.getMe();
          set({ user, isLoading: false });
        } catch (error) {
          localStorage.removeItem('bakery_token');
          set({ user: null, isLoading: false });
        }
      },
    }),
    {
      name: 'bakery-user-storage',
      partialize: (state) => ({ user: state.user }),
    }
  )
);