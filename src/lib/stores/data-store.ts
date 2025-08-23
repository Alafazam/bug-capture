import { create } from 'zustand';

export interface SortConfig {
  key: string;
  direction: 'asc' | 'desc';
}

export interface PaginationState {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface DataState<T> {
  // Data
  items: T[];
  filteredItems: T[];
  
  // Filters and search
  filters: Record<string, any>;
  searchQuery: string;
  
  // Sorting
  sortConfig: SortConfig | null;
  
  // Pagination
  pagination: PaginationState;
  
  // Loading and error states
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setItems: (items: T[]) => void;
  addItem: (item: T) => void;
  updateItem: (id: string, updates: Partial<T>) => void;
  removeItem: (id: string) => void;
  setFilters: (filters: Record<string, any>) => void;
  setSearchQuery: (query: string) => void;
  setSorting: (config: SortConfig | null) => void;
  setPagination: (pagination: Partial<PaginationState>) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearFilters: () => void;
  reset: () => void;
}

export const createDataStore = <T extends { id: string }>(
  initialState: Partial<DataState<T>> = {}
) => {
  const defaultState: DataState<T> = {
    items: [],
    filteredItems: [],
    filters: {},
    searchQuery: '',
    sortConfig: null,
    pagination: {
      page: 1,
      limit: 10,
      total: 0,
      totalPages: 0,
    },
    isLoading: false,
    error: null,
    ...initialState,
  };

  return create<DataState<T>>((set, get) => ({
    ...defaultState,

    setItems: (items) => {
      const state = get();
      const filteredItems = applyFiltersAndSort(items, state.filters, state.searchQuery, state.sortConfig);
      const pagination = calculatePagination(filteredItems.length, state.pagination.limit, state.pagination.page);
      
      set({
        items,
        filteredItems,
        pagination,
      });
    },

    addItem: (item) => {
      const state = get();
      const newItems = [...state.items, item];
      const filteredItems = applyFiltersAndSort(newItems, state.filters, state.searchQuery, state.sortConfig);
      const pagination = calculatePagination(filteredItems.length, state.pagination.limit, state.pagination.page);
      
      set({
        items: newItems,
        filteredItems,
        pagination,
      });
    },

    updateItem: (id, updates) => {
      const state = get();
      const newItems = state.items.map((item) =>
        item.id === id ? { ...item, ...updates } : item
      );
      const filteredItems = applyFiltersAndSort(newItems, state.filters, state.searchQuery, state.sortConfig);
      
      set({
        items: newItems,
        filteredItems,
      });
    },

    removeItem: (id) => {
      const state = get();
      const newItems = state.items.filter((item) => item.id !== id);
      const filteredItems = applyFiltersAndSort(newItems, state.filters, state.searchQuery, state.sortConfig);
      const pagination = calculatePagination(filteredItems.length, state.pagination.limit, state.pagination.page);
      
      set({
        items: newItems,
        filteredItems,
        pagination,
      });
    },

    setFilters: (filters) => {
      const state = get();
      const newFilters = { ...state.filters, ...filters };
      const filteredItems = applyFiltersAndSort(state.items, newFilters, state.searchQuery, state.sortConfig);
      const pagination = calculatePagination(filteredItems.length, state.pagination.limit, 1);
      
      set({
        filters: newFilters,
        filteredItems,
        pagination: { ...pagination, page: 1 },
      });
    },

    setSearchQuery: (searchQuery) => {
      const state = get();
      const filteredItems = applyFiltersAndSort(state.items, state.filters, searchQuery, state.sortConfig);
      const pagination = calculatePagination(filteredItems.length, state.pagination.limit, 1);
      
      set({
        searchQuery,
        filteredItems,
        pagination: { ...pagination, page: 1 },
      });
    },

    setSorting: (sortConfig) => {
      const state = get();
      const filteredItems = applyFiltersAndSort(state.items, state.filters, state.searchQuery, sortConfig);
      
      set({
        sortConfig,
        filteredItems,
      });
    },

    setPagination: (pagination) => {
      const state = get();
      const newPagination = { ...state.pagination, ...pagination };
      const calculatedPagination = calculatePagination(
        state.filteredItems.length,
        newPagination.limit,
        newPagination.page
      );
      
      set({
        pagination: calculatedPagination,
      });
    },

    setLoading: (isLoading) => set({ isLoading }),

    setError: (error) => set({ error }),

    clearFilters: () => {
      const state = get();
      const filteredItems = applyFiltersAndSort(state.items, {}, '', state.sortConfig);
      const pagination = calculatePagination(filteredItems.length, state.pagination.limit, 1);
      
      set({
        filters: {},
        searchQuery: '',
        filteredItems,
        pagination: { ...pagination, page: 1 },
      });
    },

    reset: () => set(defaultState),
  }));
};

// Utility functions
function applyFiltersAndSort<T>(
  items: T[],
  filters: Record<string, any>,
  searchQuery: string,
  sortConfig: SortConfig | null
): T[] {
  let filtered = [...items];

  // Apply search
  if (searchQuery) {
    filtered = filtered.filter((item) =>
      Object.values(item).some((value) =>
        String(value).toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }

  // Apply filters
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      filtered = filtered.filter((item) => {
        const itemValue = (item as any)[key];
        if (Array.isArray(value)) {
          return value.includes(itemValue);
        }
        return itemValue === value;
      });
    }
  });

  // Apply sorting
  if (sortConfig) {
    filtered.sort((a, b) => {
      const aValue = (a as any)[sortConfig.key];
      const bValue = (b as any)[sortConfig.key];
      
      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }

  return filtered;
}

function calculatePagination(total: number, limit: number, page: number): PaginationState {
  const totalPages = Math.ceil(total / limit);
  return {
    page: Math.min(page, totalPages || 1),
    limit,
    total,
    totalPages,
  };
}
