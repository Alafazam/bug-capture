import { useSession, signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { useAppStore } from '@/lib/stores/app-store';
import { showSuccess, showError } from '@/lib/stores/ui-store';
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from '@/lib/constants';

export const useAuth = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { setUser, setAuthenticated, setLoading, logout: logoutStore } = useAppStore();

  // Check if user is authenticated
  const isAuthenticated = status === 'authenticated' && !!session?.user;

  // Check if authentication is loading
  const isLoading = status === 'loading';

  // Get current user
  const user = session?.user || null;

  // Login function
  const login = useCallback(
    async (email: string, password: string) => {
      try {
        setLoading(true);
        const result = await signIn('credentials', {
          email,
          password,
          redirect: false,
        });

        if (result?.error) {
          showError('Login Failed', result.error);
          return { success: false, error: result.error };
        }

        if (result?.ok) {
          showSuccess('Login Successful', SUCCESS_MESSAGES.LOGGED_IN);
          setAuthenticated(true);
          return { success: true };
        }

        return { success: false, error: ERROR_MESSAGES.GENERIC };
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : ERROR_MESSAGES.GENERIC;
        showError('Login Failed', errorMessage);
        return { success: false, error: errorMessage };
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setAuthenticated]
  );

  // Register function
  const register = useCallback(
    async (userData: { name: string; email: string; password: string }) => {
      try {
        setLoading(true);
        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userData),
        });

        const data = await response.json();

        if (!response.ok) {
          showError('Registration Failed', data.error || ERROR_MESSAGES.GENERIC);
          return { success: false, error: data.error };
        }

        showSuccess('Registration Successful', SUCCESS_MESSAGES.REGISTERED);
        return { success: true };
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : ERROR_MESSAGES.GENERIC;
        showError('Registration Failed', errorMessage);
        return { success: false, error: errorMessage };
      } finally {
        setLoading(false);
      }
    },
    [setLoading]
  );

  // Logout function
  const logout = useCallback(async () => {
    try {
      setLoading(true);
      await signOut({ redirect: false });
      logoutStore();
      showSuccess('Logout Successful', SUCCESS_MESSAGES.LOGGED_OUT);
      router.push('/login');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : ERROR_MESSAGES.GENERIC;
      showError('Logout Failed', errorMessage);
    } finally {
      setLoading(false);
    }
  }, [logoutStore, router, setLoading]);

  // Update user profile
  const updateProfile = useCallback(
    async (profileData: any) => {
      try {
        setLoading(true);
        const response = await fetch('/api/users/profile', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(profileData),
        });

        const data = await response.json();

        if (!response.ok) {
          showError('Profile Update Failed', data.error || ERROR_MESSAGES.GENERIC);
          return { success: false, error: data.error };
        }

        showSuccess('Profile Updated', SUCCESS_MESSAGES.UPDATED);
        return { success: true, data: data.user };
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : ERROR_MESSAGES.GENERIC;
        showError('Profile Update Failed', errorMessage);
        return { success: false, error: errorMessage };
      } finally {
        setLoading(false);
      }
    },
    [setLoading]
  );

  // Change password
  const changePassword = useCallback(
    async (passwordData: { currentPassword: string; newPassword: string }) => {
      try {
        setLoading(true);
        const response = await fetch('/api/users/change-password', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(passwordData),
        });

        const data = await response.json();

        if (!response.ok) {
          showError('Password Change Failed', data.error || ERROR_MESSAGES.GENERIC);
          return { success: false, error: data.error };
        }

        showSuccess('Password Changed', 'Your password has been updated successfully.');
        return { success: true };
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : ERROR_MESSAGES.GENERIC;
        showError('Password Change Failed', errorMessage);
        return { success: false, error: errorMessage };
      } finally {
        setLoading(false);
      }
    },
    [setLoading]
  );

  // Check if user has specific role
  const hasRole = useCallback(
    (role: string) => {
      return user?.role === role;
    },
    [user]
  );

  // Check if user has any of the specified roles
  const hasAnyRole = useCallback(
    (roles: string[]) => {
      return roles.includes(user?.role || '');
    },
    [user]
  );

  return {
    // State
    user,
    isAuthenticated,
    isLoading,
    status,

    // Actions
    login,
    register,
    logout,
    updateProfile,
    changePassword,

    // Utilities
    hasRole,
    hasAnyRole,
  };
};
