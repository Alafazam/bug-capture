import { useState, useCallback } from 'react';
import { apiClient, apiUtils } from '@/lib/utils/api-utils';
import { showError, showSuccess } from '@/lib/stores/ui-store';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '@/lib/constants';
import { z } from 'zod';

// API request state
interface ApiState<T = any> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

// API request options
interface ApiRequestOptions {
  showSuccessMessage?: boolean;
  showErrorMessage?: boolean;
  successMessage?: string;
  errorMessage?: string;
  validateSchema?: z.ZodSchema<any>;
}

// Hook for making API requests
export const useApi = <T = any>() => {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  // Generic request function
  const request = useCallback(
    async (
      requestFn: () => Promise<any>,
      options: ApiRequestOptions = {}
    ): Promise<{ success: boolean; data?: T; error?: string }> => {
      const {
        showSuccessMessage = true,
        showErrorMessage = true,
        successMessage,
        errorMessage,
        validateSchema,
      } = options;

      try {
        setState(prev => ({ ...prev, loading: true, error: null }));
        
        const response = await requestFn();
        
        if (!response.success) {
          const error = response.error || ERROR_MESSAGES.GENERIC;
          setState(prev => ({ ...prev, loading: false, error }));
          
          if (showErrorMessage) {
            showError('Request Failed', errorMessage || error);
          }
          
          return { success: false, error };
        }

        let data = response.data;
        
        // Validate response with schema if provided
        if (validateSchema) {
          try {
            data = apiUtils.validateResponse(response, validateSchema);
          } catch (validationError) {
            const error = validationError instanceof Error ? validationError.message : 'Validation failed';
            setState(prev => ({ ...prev, loading: false, error }));
            
            if (showErrorMessage) {
              showError('Validation Error', error);
            }
            
            return { success: false, error };
          }
        }

        setState({ data, loading: false, error: null });
        
        if (showSuccessMessage) {
          showSuccess('Success', successMessage || SUCCESS_MESSAGES.SAVED);
        }
        
        return { success: true, data };
      } catch (error) {
        const errorMessage = apiUtils.handleError(error);
        setState(prev => ({ ...prev, loading: false, error: errorMessage }));
        
        if (showErrorMessage) {
          showError('Request Failed', errorMessage || ERROR_MESSAGES.GENERIC);
        }
        
        return { success: false, error: errorMessage };
      }
    },
    []
  );

  // GET request
  const get = useCallback(
    async (endpoint: string, options?: ApiRequestOptions) => {
      return request(() => apiClient.get<T>(endpoint), options);
    },
    [request]
  );

  // POST request
  const post = useCallback(
    async (endpoint: string, data?: any, options?: ApiRequestOptions) => {
      return request(() => apiClient.post<T>(endpoint, data), options);
    },
    [request]
  );

  // PUT request
  const put = useCallback(
    async (endpoint: string, data?: any, options?: ApiRequestOptions) => {
      return request(() => apiClient.put<T>(endpoint, data), options);
    },
    [request]
  );

  // DELETE request
  const del = useCallback(
    async (endpoint: string, options?: ApiRequestOptions) => {
      return request(() => apiClient.delete<T>(endpoint), options);
    },
    [request]
  );

  // PATCH request
  const patch = useCallback(
    async (endpoint: string, data?: any, options?: ApiRequestOptions) => {
      return request(() => apiClient.patch<T>(endpoint, data), options);
    },
    [request]
  );

  // Upload file
  const uploadFile = useCallback(
    async (file: File, endpoint?: string, options?: ApiRequestOptions) => {
      return request(
        () => apiUtils.uploadFile(file, endpoint),
        {
          successMessage: SUCCESS_MESSAGES.UPLOADED,
          ...options,
        }
      );
    },
    [request]
  );

  // Reset state
  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  // Set data manually
  const setData = useCallback((data: T) => {
    setState(prev => ({ ...prev, data, error: null }));
  }, []);

  // Set error manually
  const setError = useCallback((error: string) => {
    setState(prev => ({ ...prev, error, loading: false }));
  }, []);

  return {
    // State
    ...state,

    // Actions
    request,
    get,
    post,
    put,
    delete: del,
    patch,
    uploadFile,
    reset,
    setData,
    setError,
  };
};

// Hook for managing multiple API requests
export const useMultiApi = () => {
  const [requests, setRequests] = useState<Record<string, ApiState>>({});

  // Add or update a request
  const setRequest = useCallback((key: string, state: Partial<ApiState>) => {
    setRequests(prev => ({
      ...prev,
      [key]: { ...prev[key], ...state },
    }));
  }, []);

  // Remove a request
  const removeRequest = useCallback((key: string) => {
    setRequests(prev => {
      const newRequests = { ...prev };
      delete newRequests[key];
      return newRequests;
    });
  }, []);

  // Check if any request is loading
  const isLoading = Object.values(requests).some(req => req.loading);

  // Get all errors
  const errors = Object.entries(requests)
    .filter(([_, req]) => req.error)
    .map(([key, req]) => ({ key, error: req.error }));

  // Clear all errors
  const clearErrors = useCallback(() => {
    setRequests(prev => {
      const newRequests = { ...prev };
      Object.keys(newRequests).forEach(key => {
        newRequests[key].error = null;
      });
      return newRequests;
    });
  }, []);

  // Reset all requests
  const resetAll = useCallback(() => {
    setRequests({});
  }, []);

  return {
    requests,
    setRequest,
    removeRequest,
    isLoading,
    errors,
    clearErrors,
    resetAll,
  };
};

// Hook for optimistic updates
export const useOptimisticUpdate = <T = any>() => {
  const [optimisticData, setOptimisticData] = useState<T | null>(null);
  const [isOptimistic, setIsOptimistic] = useState(false);

  const optimisticUpdate = useCallback(
    async (
      optimisticData: T,
      updateFn: () => Promise<{ success: boolean; data?: T; error?: string }>,
      rollbackFn?: () => void
    ) => {
      setOptimisticData(optimisticData);
      setIsOptimistic(true);

      try {
        const result = await updateFn();
        
        if (result.success) {
          setOptimisticData(null);
          setIsOptimistic(false);
          return result;
        } else {
          // Rollback on failure
          if (rollbackFn) {
            rollbackFn();
          }
          setOptimisticData(null);
          setIsOptimistic(false);
          return result;
        }
      } catch (error) {
        // Rollback on error
        if (rollbackFn) {
          rollbackFn();
        }
        setOptimisticData(null);
        setIsOptimistic(false);
        throw error;
      }
    },
    []
  );

  const clearOptimistic = useCallback(() => {
    setOptimisticData(null);
    setIsOptimistic(false);
  }, []);

  return {
    optimisticData,
    isOptimistic,
    optimisticUpdate,
    clearOptimistic,
  };
};
