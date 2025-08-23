import { create } from 'zustand';

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export interface ModalState {
  [key: string]: boolean;
}

export interface UIState {
  // Sidebar state
  sidebarOpen: boolean;
  
  // Modal states
  modals: ModalState;
  
  // Notifications
  notifications: Notification[];
  
  // Loading states
  pageLoading: boolean;
  
  // Actions
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  openModal: (modalId: string) => void;
  closeModal: (modalId: string) => void;
  closeAllModals: () => void;
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
  setPageLoading: (loading: boolean) => void;
}

export const useUIStore = create<UIState>((set, get) => ({
  // Initial state
  sidebarOpen: false,
  modals: {},
  notifications: [],
  pageLoading: false,

  // Actions
  toggleSidebar: () =>
    set((state) => ({ sidebarOpen: !state.sidebarOpen })),

  setSidebarOpen: (open) =>
    set({ sidebarOpen: open }),

  openModal: (modalId) =>
    set((state) => ({
      modals: { ...state.modals, [modalId]: true },
    })),

  closeModal: (modalId) =>
    set((state) => ({
      modals: { ...state.modals, [modalId]: false },
    })),

  closeAllModals: () =>
    set({ modals: {} }),

  addNotification: (notification) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newNotification = { ...notification, id };
    
    set((state) => ({
      notifications: [...state.notifications, newNotification],
    }));

    // Auto-remove notification after duration
    if (notification.duration !== 0) {
      setTimeout(() => {
        get().removeNotification(id);
      }, notification.duration || 5000);
    }
  },

  removeNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    })),

  clearNotifications: () =>
    set({ notifications: [] }),

  setPageLoading: (pageLoading) =>
    set({ pageLoading }),
}));

// Selectors for better performance
export const useSidebarOpen = () => useUIStore((state) => state.sidebarOpen);
export const useModals = () => useUIStore((state) => state.modals);
export const useNotifications = () => useUIStore((state) => state.notifications);
export const usePageLoading = () => useUIStore((state) => state.pageLoading);

// Utility functions
export const showNotification = (
  type: Notification['type'],
  title: string,
  message: string,
  duration?: number
) => {
  useUIStore.getState().addNotification({
    type,
    title,
    message,
    duration,
  });
};

export const showSuccess = (title: string, message: string) =>
  showNotification('success', title, message);

export const showError = (title: string, message: string) =>
  showNotification('error', title, message);

export const showWarning = (title: string, message: string) =>
  showNotification('warning', title, message);

export const showInfo = (title: string, message: string) =>
  showNotification('info', title, message);
