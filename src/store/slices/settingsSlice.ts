/**
 * Settings Slice - Configuración persistida del usuario
 * 
 * WHY: Migra estado de ThemeContext, SoundContext, SafetyContext
 * a Zustand con persistencia automática.
 */

import { type StateCreator } from 'zustand';
import type { SettingsState, SettingsActions, Theme, SafetySettings, Store } from '../types';

// ============================================
// Initial State
// ============================================

const initialSafetySettings: SafetySettings = {
    dailyLimit: BigInt(1000000000000000000), // 1 ETH
    sessionLimit: BigInt(500000000000000000), // 0.5 ETH
    maxBetSize: BigInt(100000000000000000),  // 0.1 ETH
    cooldownMinutes: 0,
    selfExclusionUntil: null,
};

export const initialSettingsState: SettingsState = {
    theme: 'dark',
    soundEnabled: true,
    volume: 70,
    musicEnabled: true,
    notificationsEnabled: true,
    safetySettings: initialSafetySettings,
};

// ============================================
// Slice Type
// ============================================

export type SettingsSlice = SettingsState & SettingsActions;

// ============================================
// Slice Creator
// ============================================

export const createSettingsSlice: StateCreator<
    Store,
    [],
    [],
    SettingsSlice
> = (set) => ({
    // State
    ...initialSettingsState,

    // Actions
    toggleTheme: () => set((state) => {
        const newTheme: Theme = state.theme === 'dark' ? 'light' : 'dark';

        // Apply to DOM (for CSS variables)
        if (typeof document !== 'undefined') {
            document.documentElement.setAttribute('data-theme', newTheme);
        }

        return { theme: newTheme };
    }),

    setTheme: (theme: Theme) => set(() => {
        if (typeof document !== 'undefined') {
            document.documentElement.setAttribute('data-theme', theme);
        }
        return { theme };
    }),

    toggleSound: () => set((state) => ({
        soundEnabled: !state.soundEnabled,
    })),

    setVolume: (volume: number) => set({
        // Clamp between 0 and 100
        volume: Math.max(0, Math.min(100, volume)),
    }),

    toggleMusic: () => set((state) => ({
        musicEnabled: !state.musicEnabled,
    })),

    toggleNotifications: () => set((state) => ({
        notificationsEnabled: !state.notificationsEnabled,
    })),

    updateSafetySettings: (settings: Partial<SafetySettings>) => set((state) => ({
        safetySettings: {
            ...state.safetySettings,
            ...settings,
        },
    })),
});

// ============================================
// Selectors (for testing)
// ============================================

export const selectTheme = (state: SettingsSlice): Theme => state.theme;
export const selectSoundEnabled = (state: SettingsSlice): boolean => state.soundEnabled;
export const selectVolume = (state: SettingsSlice): number => state.volume;
