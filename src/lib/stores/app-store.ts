import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id: string;
  name: string | null;
  email: string | null;
  role: string;
  image: string | null;
}

export interface AppState {
  // User state
  user: User | null;
  isAuthenticated: boolean;
  
  // Theme state
  theme: 'light' | 'dark' | 'system';
  
  // Loading states
  isLoading: boolean;
  isInitializing: boolean;
  
  // Error state
  error: string | null;
  
  // Actions
  setUser: (user: User | null) => void;
  setAuthenticated: (isAuthenticated: boolean) => void;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  setLoading: (loading: boolean) => void;
  setInitializing: (initializing: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  logout: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      isAuthenticated: false,
      theme: 'system',
      isLoading: false,
      isInitializing: true,
      error: null,

      // Actions
      setUser: (user) =>
        set({
          user,
          isAuthenticated: !!user,
        }),

      setAuthenticated: (isAuthenticated) =>
        set({ isAuthenticated }),

      setTheme: (theme) =>
        set({ theme }),

      setLoading: (isLoading) =>
        set({ isLoading }),

      setInitializing: (isInitializing) =>
        set({ isInitializing }),

      setError: (error) =>
        set({ error }),

      clearError: () =>
        set({ error: null }),

      logout: () =>
        set({
          user: null,
          isAuthenticated: false,
          error: null,
        }),
    }),
    {
      name: 'app-storage',
      partialize: (state) => ({
        theme: state.theme,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

// Selectors for better performance
export const useUser = () => useAppStore((state) => state.user);
export const useIsAuthenticated = () => useAppStore((state) => state.isAuthenticated);
export const useTheme = () => useAppStore((state) => state.theme);
export const useIsLoading = () => useAppStore((state) => state.isLoading);
export const useError = () => useAppStore((state) => state.error);
