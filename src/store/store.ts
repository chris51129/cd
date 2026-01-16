/**
 * Store - Zustand store instance
 * 
 * WHY: Separated from index.ts to avoid circular dependencies
 * with selectors.ts
 */

import { create } from 'zustand';
import { devtools, persist, createJSONStorage } from 'zustand/middleware';
import { createUISlice } from './slices/uiSlice';
import { createUserSlice } from './slices/userSlice';
import { createSettingsSlice } from './slices/settingsSlice';
import type { Store } from './types';

// ============================================
// Custom Storage (handles BigInt serialization)
// ============================================

const customStorage = createJSONStorage(() => localStorage, {
    reviver: (_key, value) => {
        // Restore BigInt from string
        if (typeof value === 'string' && value.startsWith('__bigint__:')) {
            return BigInt(value.slice(11));
        }
        return value;
    },
    replacer: (_key, value) => {
        // Serialize BigInt to string
        if (typeof value === 'bigint') {
            return `__bigint__:${value.toString()}`;
        }
        return value;
    },
});

// ============================================
// Persist Config
// ============================================

interface PersistedState {
    theme: string;
    soundEnabled: boolean;
    volume: number;
    musicEnabled: boolean;
    notificationsEnabled: boolean;
    safetySettings: unknown;
    address: string | null;
    username: string | null;
}

// ============================================
// Store Creation
// ============================================

export const useStore = create<Store>()(
    devtools(
        persist(
            (...args) => ({
                ...createUISlice(...args),
                ...createUserSlice(...args),
                ...createSettingsSlice(...args),
            }),
            {
                name: 'cryptoduels-store',
                storage: customStorage,
                partialize: (state): PersistedState => ({
                    theme: state.theme,
                    soundEnabled: state.soundEnabled,
                    volume: state.volume,
                    musicEnabled: state.musicEnabled,
                    notificationsEnabled: state.notificationsEnabled,
                    safetySettings: state.safetySettings,
                    address: state.address,
                    username: state.username,
                }),
                onRehydrateStorage: () => (state) => {
                    if (state?.theme && typeof document !== 'undefined') {
                        document.documentElement.setAttribute('data-theme', state.theme);
                    }
                },
            }
        ),
        { name: 'CryptoDuels' }
    )
);
