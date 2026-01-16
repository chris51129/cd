/**
 * User Slice - Estado del usuario/sesión
 * 
 * WHY: Centraliza información de wallet, balance, stats del jugador.
 * Preparado para integración con Web3 (wagmi).
 */

import { type StateCreator } from 'zustand';
import type {
    UserState,
    UserActions,
    UserStats,
    UserTier,
    WalletAddress,
    Store
} from '../types';

// ============================================
// Initial State
// ============================================

const initialStats: UserStats = {
    totalGames: 0,
    wins: 0,
    losses: 0,
    winRate: 0,
    currentStreak: 0,
    bestStreak: 0,
    totalWagered: BigInt(0),
    totalWon: BigInt(0),
};

export const initialUserState: UserState = {
    address: null,
    username: null,
    tier: 'bronze',
    balance: BigInt(0),
    stats: initialStats,
    isConnected: false,
};

// ============================================
// Slice Type
// ============================================

export type UserSlice = UserState & UserActions;

// ============================================
// Slice Creator
// ============================================

export const createUserSlice: StateCreator<
    Store,
    [],
    [],
    UserSlice
> = (set) => ({
    // State
    ...initialUserState,

    // Actions
    setUser: (data: Partial<UserState>) => set((state) => ({
        ...state,
        ...data,
        isConnected: data.address !== undefined ? data.address !== null : state.isConnected,
    })),

    clearUser: () => set({
        ...initialUserState,
    }),

    updateStats: (stats: Partial<UserStats>) => set((state) => {
        const newStats = { ...state.stats, ...stats };

        // Recalculate win rate
        const totalGames = newStats.wins + newStats.losses;
        const winRate = totalGames > 0
            ? Math.round((newStats.wins / totalGames) * 100)
            : 0;

        return {
            stats: {
                ...newStats,
                winRate,
            },
        };
    }),
});

// ============================================
// Selectors (for testing)
// ============================================

export const selectAddress = (state: UserSlice): WalletAddress | null => state.address;
export const selectIsConnected = (state: UserSlice): boolean => state.isConnected;
export const selectTier = (state: UserSlice): UserTier => state.tier;
export const selectBalance = (state: UserSlice): bigint => state.balance;
