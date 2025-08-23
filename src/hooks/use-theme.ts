import { useEffect, useCallback } from 'react';
import { useAppStore } from '@/lib/stores/app-store';
import { THEME } from '@/lib/constants';

export const useTheme = () => {
  const { theme, setTheme } = useAppStore();

  // Apply theme to document
  const applyTheme = useCallback((newTheme: 'light' | 'dark' | 'system') => {
    const root = document.documentElement;
    
    // Remove existing theme classes
    root.classList.remove('light', 'dark');
    
    if (newTheme === 'system') {
      // Check system preference
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.add(systemTheme);
    } else {
      root.classList.add(newTheme);
    }
    
    // Update data attribute for other scripts
    root.setAttribute('data-theme', newTheme);
  }, []);

  // Get current effective theme
  const getCurrentTheme = useCallback((): 'light' | 'dark' => {
    if (theme === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return theme;
  }, [theme]);

  // Toggle between light and dark
  const toggleTheme = useCallback(() => {
    const currentTheme = getCurrentTheme();
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  }, [getCurrentTheme, setTheme]);

  // Set specific theme
  const setLightTheme = useCallback(() => {
    setTheme('light');
  }, [setTheme]);

  const setDarkTheme = useCallback(() => {
    setTheme('dark');
  }, [setTheme]);

  const setSystemTheme = useCallback(() => {
    setTheme('system');
  }, [setTheme]);

  // Listen for system theme changes
  useEffect(() => {
    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      
      const handleChange = () => {
        applyTheme('system');
      };

      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [theme, applyTheme]);

  // Apply theme on mount and theme change
  useEffect(() => {
    applyTheme(theme);
  }, [theme, applyTheme]);

  // Initialize theme on mount
  useEffect(() => {
    // Check if theme is stored in localStorage
    const storedTheme = localStorage.getItem('theme') as 'light' | 'dark' | 'system';
    if (storedTheme && Object.values(THEME).includes(storedTheme)) {
      setTheme(storedTheme);
    }
  }, [setTheme]);

  // Save theme to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);

  return {
    // State
    theme,
    currentTheme: getCurrentTheme(),
    isDark: getCurrentTheme() === 'dark',
    isLight: getCurrentTheme() === 'light',
    isSystem: theme === 'system',

    // Actions
    setTheme,
    toggleTheme,
    setLightTheme,
    setDarkTheme,
    setSystemTheme,

    // Utilities
    applyTheme,
    getCurrentTheme,
  };
};
