/**
 * Store Types - Tipos centralizados para el estado global
 * 
 * WHY (Protocolo Sigma §4.1): Branded Types previenen confusión entre tipos similares.
 * Todas las interfaces son readonly para inmutabilidad.
 */

// ============================================
// Branded Types
// ============================================

declare const __brand: unique symbol;
type Brand<K, T> = K & { readonly [__brand]: T };

/** Wallet address validada */
export type WalletAddress = Brand<string, 'WalletAddress'>;

/** User ID validado */
export type UserId = Brand<string, 'UserId'>;

// ============================================
// User Types
// ============================================

export interface UserStats {
    readonly totalGames: number;
    readonly wins: number;
    readonly losses: number;
    readonly winRate: number;
    readonly currentStreak: number;
    readonly bestStreak: number;
    readonly totalWagered: bigint;
    readonly totalWon: bigint;
}

export type UserTier = 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';

export interface UserState {
    readonly address: WalletAddress | null;
    readonly username: string | null;
    readonly tier: UserTier;
    readonly balance: bigint;
    readonly stats: UserStats;
    readonly isConnected: boolean;
}

// ============================================
// UI Types
// ============================================

export type ModalType =
    | 'settings'
    | 'wallet'
    | 'confirmation'
    | 'rules'
    | 'deposit'
    | 'withdraw'
    | null;

export interface UIState {
    readonly sidebarOpen: boolean;
    readonly activeModal: ModalType;
    readonly isLoading: boolean;
    readonly loadingMessage: string | null;
    readonly notifications: readonly Notification[];
}

export interface Notification {
    readonly id: string;
    readonly type: 'success' | 'error' | 'warning' | 'info';
    readonly message: string;
    readonly timestamp: number;
}

// ============================================
// Settings Types
// ============================================

export type Theme = 'light' | 'dark';

export interface SafetySettings {
    readonly dailyLimit: bigint;
    readonly sessionLimit: bigint;
    readonly maxBetSize: bigint;
    readonly cooldownMinutes: number;
    readonly selfExclusionUntil: number | null;
}

export interface SettingsState {
    readonly theme: Theme;
    readonly soundEnabled: boolean;
    readonly volume: number; // 0-100
    readonly musicEnabled: boolean;
    readonly notificationsEnabled: boolean;
    readonly safetySettings: SafetySettings;
}

// ============================================
// Combined Store Type
// ============================================

export interface StoreState extends UserState, UIState, SettingsState { }

// ============================================
// Action Types
// ============================================

export interface UserActions {
    readonly setUser: (data: Partial<UserState>) => void;
    readonly clearUser: () => void;
    readonly updateStats: (stats: Partial<UserStats>) => void;
}

export interface UIActions {
    readonly toggleSidebar: () => void;
    readonly openModal: (modal: ModalType) => void;
    readonly closeModal: () => void;
    readonly setLoading: (isLoading: boolean, message?: string) => void;
    readonly addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void;
    readonly removeNotification: (id: string) => void;
}

export interface SettingsActions {
    readonly toggleTheme: () => void;
    readonly setTheme: (theme: Theme) => void;
    readonly toggleSound: () => void;
    readonly setVolume: (volume: number) => void;
    readonly toggleMusic: () => void;
    readonly toggleNotifications: () => void;
    readonly updateSafetySettings: (settings: Partial<SafetySettings>) => void;
}

export interface StoreActions extends UserActions, UIActions, SettingsActions { }

// ============================================
// Full Store Type
// ============================================

export type Store = StoreState & StoreActions;

// ============================================
// Smart Constructors
// ============================================

/**
 * Validate and create a WalletAddress
 * WHY: Parse, Don't Validate pattern - validation at boundary
 */
export const toWalletAddress = (address: string): WalletAddress => {
    if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
        throw new Error(`[Store] Invalid wallet address: ${address}`);
    }
    return address.toLowerCase() as WalletAddress;
};

/**
 * Safe wallet address creation (returns null on invalid)
 */
export const tryWalletAddress = (address: string): WalletAddress | null => {
    try {
        return toWalletAddress(address);
    } catch {
        return null;
    }
};
