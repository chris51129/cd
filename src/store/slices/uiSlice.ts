/**
 * UI Slice - Estado de interfaz de usuario
 * 
 * WHY: Centraliza estado de modales, sidebar, loading para evitar
 * prop drilling y re-renders innecesarios.
 */

import { type StateCreator } from 'zustand';
import type { UIState, UIActions, ModalType, Notification, Store } from '../types';
import { secureRandomInt } from '../../utils/security';

// ============================================
// Initial State
// ============================================

export const initialUIState: UIState = {
    sidebarOpen: true,
    activeModal: null,
    isLoading: false,
    loadingMessage: null,
    notifications: [],
};

// ============================================
// Slice Type
// ============================================

export type UISlice = UIState & UIActions;

// ============================================
// Slice Creator
// ============================================

export const createUISlice: StateCreator<
    Store,
    [],
    [],
    UISlice
> = (set) => ({
    // State
    ...initialUIState,

    // Actions
    toggleSidebar: () => set((state) => ({
        sidebarOpen: !state.sidebarOpen,
    })),

    openModal: (modal: ModalType) => set({
        activeModal: modal,
    }),

    closeModal: () => set({
        activeModal: null,
    }),

    setLoading: (isLoading: boolean, message?: string) => set({
        isLoading,
        loadingMessage: message ?? null,
    }),

    addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => set((state) => ({
        notifications: [
            ...state.notifications,
            {
                ...notification,
                id: `notif-${secureRandomInt(0, 999999)}`,
                timestamp: Date.now(),
            },
        ],
    })),

    removeNotification: (id: string) => set((state) => ({
        notifications: state.notifications.filter((n) => n.id !== id),
    })),
});

// ============================================
// Selectors (for testing)
// ============================================

export const selectSidebarOpen = (state: UISlice): boolean => state.sidebarOpen;
export const selectActiveModal = (state: UISlice): ModalType => state.activeModal;
export const selectIsLoading = (state: UISlice): boolean => state.isLoading;
