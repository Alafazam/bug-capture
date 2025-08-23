import { useQueryState, useQueryStates } from 'nuqs';
import { useCallback, useMemo } from 'react';

// Common search parameter types
export interface SearchParams {
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  filters?: Record<string, any>;
}

// Hook for managing search parameters
export const useSearchParams = () => {
  // Individual search parameters
  const [search, setSearch] = useQueryState('search', { defaultValue: '' });
  const [page, setPage] = useQueryState('page', { defaultValue: 1, parse: parseInt });
  const [limit, setLimit] = useQueryState('limit', { defaultValue: 10, parse: parseInt });
  const [sortBy, setSortBy] = useQueryState('sortBy', { defaultValue: '' });
  const [sortOrder, setSortOrder] = useQueryState('sortOrder', { defaultValue: 'desc' as const });

  // Multiple filters as a single state
  const [filters, setFilters] = useQueryStates({
    category: { defaultValue: '' },
    status: { defaultValue: '' },
    dateFrom: { defaultValue: '' },
    dateTo: { defaultValue: '' },
    tags: { defaultValue: [] as string[] },
  });

  // Get all current search parameters
  const currentParams = useMemo((): SearchParams => ({
    search: search || undefined,
    page: page || 1,
    limit: limit || 10,
    sortBy: sortBy || undefined,
    sortOrder: sortOrder || 'desc',
    filters: Object.fromEntries(
      Object.entries(filters).filter(([_, value]) => 
        value !== '' && value !== null && value !== undefined && 
        (Array.isArray(value) ? value.length > 0 : true)
      )
    ),
  }), [search, page, limit, sortBy, sortOrder, filters]);

  // Update search query
  const updateSearch = useCallback((newSearch: string) => {
    setSearch(newSearch || null);
    // Reset to first page when searching
    setPage(1);
  }, [setSearch, setPage]);

  // Update page
  const updatePage = useCallback((newPage: number) => {
    setPage(newPage);
  }, [setPage]);

  // Update limit
  const updateLimit = useCallback((newLimit: number) => {
    setLimit(newLimit);
    // Reset to first page when changing limit
    setPage(1);
  }, [setLimit, setPage]);

  // Update sorting
  const updateSorting = useCallback((newSortBy: string, newSortOrder: 'asc' | 'desc' = 'desc') => {
    setSortBy(newSortBy || null);
    setSortOrder(newSortOrder);
  }, [setSortBy, setSortOrder]);

  // Update filters
  const updateFilters = useCallback((newFilters: Record<string, any>) => {
    const updatedFilters = { ...filters };
    
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value === '' || value === null || value === undefined) {
        delete updatedFilters[key as keyof typeof filters];
      } else {
        (updatedFilters as any)[key] = value;
      }
    });
    
    setFilters(updatedFilters);
    // Reset to first page when filtering
    setPage(1);
  }, [filters, setFilters, setPage]);

  // Update a single filter
  const updateFilter = useCallback((key: string, value: any) => {
    updateFilters({ [key]: value });
  }, [updateFilters]);

  // Clear all filters
  const clearFilters = useCallback(() => {
    setFilters({
      category: '',
      status: '',
      dateFrom: '',
      dateTo: '',
      tags: [],
    });
    setPage(1);
  }, [setFilters, setPage]);

  // Clear search
  const clearSearch = useCallback(() => {
    setSearch(null);
    setPage(1);
  }, [setSearch, setPage]);

  // Reset all search parameters
  const resetSearchParams = useCallback(() => {
    setSearch(null);
    setPage(1);
    setLimit(10);
    setSortBy(null);
    setSortOrder('desc');
    clearFilters();
  }, [setSearch, setPage, setLimit, setSortBy, setSortOrder, clearFilters]);

  // Check if any filters are active
  const hasActiveFilters = useMemo(() => {
    return !!(
      search ||
      Object.values(filters).some(value => 
        value !== '' && value !== null && value !== undefined && 
        (Array.isArray(value) ? value.length > 0 : true)
      )
    );
  }, [search, filters]);

  // Get active filter count
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (search) count++;
    Object.values(filters).forEach(value => {
      if (value !== '' && value !== null && value !== undefined && 
          (Array.isArray(value) ? value.length > 0 : true)) {
        count++;
      }
    });
    return count;
  }, [search, filters]);

  return {
    // Current state
    search,
    page,
    limit,
    sortBy,
    sortOrder,
    filters,
    currentParams,

    // Actions
    updateSearch,
    updatePage,
    updateLimit,
    updateSorting,
    updateFilters,
    updateFilter,
    clearFilters,
    clearSearch,
    resetSearchParams,

    // Utilities
    hasActiveFilters,
    activeFilterCount,
  };
};

// Hook for managing pagination specifically
export const usePagination = () => {
  const [page, setPage] = useQueryState('page', { defaultValue: 1, parse: parseInt });
  const [limit, setLimit] = useQueryState('limit', { defaultValue: 10, parse: parseInt });

  const updatePage = useCallback((newPage: number) => {
    setPage(newPage);
  }, [setPage]);

  const updateLimit = useCallback((newLimit: number) => {
    setLimit(newLimit);
    setPage(1); // Reset to first page when changing limit
  }, [setLimit, setPage]);

  const nextPage = useCallback(() => {
    setPage((current) => (current || 1) + 1);
  }, [setPage]);

  const prevPage = useCallback(() => {
    setPage((current) => Math.max(1, (current || 1) - 1));
  }, [setPage]);

  const goToPage = useCallback((targetPage: number) => {
    setPage(Math.max(1, targetPage));
  }, [setPage]);

  return {
    page: page || 1,
    limit: limit || 10,
    updatePage,
    updateLimit,
    nextPage,
    prevPage,
    goToPage,
  };
};

// Hook for managing sorting specifically
export const useSorting = () => {
  const [sortBy, setSortBy] = useQueryState('sortBy', { defaultValue: '' });
  const [sortOrder, setSortOrder] = useQueryState('sortOrder', { defaultValue: 'desc' as const });

  const updateSorting = useCallback((newSortBy: string, newSortOrder: 'asc' | 'desc' = 'desc') => {
    setSortBy(newSortBy || null);
    setSortOrder(newSortOrder);
  }, [setSortBy, setSortOrder]);

  const toggleSortOrder = useCallback(() => {
    setSortOrder((current) => current === 'asc' ? 'desc' : 'asc');
  }, [setSortOrder]);

  const clearSorting = useCallback(() => {
    setSortBy(null);
    setSortOrder('desc');
  }, [setSortBy, setSortOrder]);

  return {
    sortBy: sortBy || '',
    sortOrder: sortOrder || 'desc',
    updateSorting,
    toggleSortOrder,
    clearSorting,
  };
};
