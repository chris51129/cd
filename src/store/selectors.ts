/**
 * Selectors - Hooks optimizados para acceso selectivo al estado
 * 
 * WHY (Skill react-state-management): Selective subscriptions previenen
 * re-renders innecesarios. Componentes solo re-renderizan cuando
 * su slice específico cambia.
 */

import { useStore } from './store';
import type {

    Theme,
    ModalType,
    UserTier,
    WalletAddress,
    UserStats,
    SafetySettings,
    Notification,
} from './types';

// ============================================
// UI Selectors
// ============================================

/** Sidebar visibility */
export const useSidebar = (): boolean =>
    useStore((s) => s.sidebarOpen);

/** Toggle sidebar action */
export const useToggleSidebar = (): (() => void) =>
    useStore((s) => s.toggleSidebar);

/** Active modal */
export const useActiveModal = (): ModalType =>
    useStore((s) => s.activeModal);

/** Modal actions */
export const useModalActions = () => useStore((s) => ({
    open: s.openModal,
    close: s.closeModal,
}));

/** Loading state */
export const useIsLoading = (): boolean =>
    useStore((s) => s.isLoading);

/** Loading with message */
export const useLoading = () => useStore((s) => ({
    isLoading: s.isLoading,
    message: s.loadingMessage,
    setLoading: s.setLoading,
}));

/** Notifications */
export const useNotifications = (): readonly Notification[] =>
    useStore((s) => s.notifications);

/** Notification actions */
export const useNotificationActions = () => useStore((s) => ({
    add: s.addNotification,
    remove: s.removeNotification,
}));

// ============================================
// User Selectors
// ============================================

/** Wallet address */
export const useAddress = (): WalletAddress | null =>
    useStore((s) => s.address);

/** Connection status */
export const useIsConnected = (): boolean =>
    useStore((s) => s.isConnected);

/** Username */
export const useUsername = (): string | null =>
    useStore((s) => s.username);

/** User tier */
export const useTier = (): UserTier =>
    useStore((s) => s.tier);

/** Balance */
export const useBalance = (): bigint =>
    useStore((s) => s.balance);

/** User stats */
export const useStats = (): UserStats =>
    useStore((s) => s.stats);

/** User actions */
export const useUserActions = () => useStore((s) => ({
    setUser: s.setUser,
    clearUser: s.clearUser,
    updateStats: s.updateStats,
}));

// ============================================
// Settings Selectors
// ============================================

/** Current theme */
export const useThemeValue = (): Theme =>
    useStore((s) => s.theme);

/** Theme with toggle */
export const useTheme = () => useStore((s) => ({
    theme: s.theme,
    isDark: s.theme === 'dark',
    isLight: s.theme === 'light',
    toggle: s.toggleTheme,
    set: s.setTheme,
}));

/** Sound settings */
export const useSound = () => useStore((s) => ({
    enabled: s.soundEnabled,
    volume: s.volume,
    toggle: s.toggleSound,
    setVolume: s.setVolume,
}));

/** Music settings */
export const useMusic = () => useStore((s) => ({
    enabled: s.musicEnabled,
    toggle: s.toggleMusic,
}));

/** Notifications settings */
export const useNotificationSettings = () => useStore((s) => ({
    enabled: s.notificationsEnabled,
    toggle: s.toggleNotifications,
}));

/** Safety settings */
export const useSafetySettings = (): SafetySettings =>
    useStore((s) => s.safetySettings);

/** Safety actions */
export const useSafetyActions = () => useStore((s) => ({
    update: s.updateSafetySettings,
}));

// ============================================
// Composed Selectors
// ============================================

/** User summary for header */
export const useUserSummary = () => useStore((s) => ({
    address: s.address,
    username: s.username,
    tier: s.tier,
    balance: s.balance,
    isConnected: s.isConnected,
}));

/** App settings summary */
export const useAppSettings = () => useStore((s) => ({
    theme: s.theme,
    soundEnabled: s.soundEnabled,
    volume: s.volume,
}));
