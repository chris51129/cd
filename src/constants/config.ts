/**
 * Application configuration constants
 * Centralizes magic numbers and configurable values
 * 
 * All config objects are readonly to prevent runtime mutation
 */

/**
 * Game timing configuration (in milliseconds)
 */
export interface GameConfig {
    readonly SPIN_DURATION_MS: number;
    readonly RESULT_DELAY_MS: number;
    readonly MATCHMAKING_MIN_MS: number;
    readonly MATCHMAKING_MAX_MS: number;
    readonly SELECTION_TIMEOUT_MS: number;
}

export const GAME_CONFIG: GameConfig = {
    /** Duration of spinning animation before result */
    SPIN_DURATION_MS: 5000,
    /** Delay before showing result overlay */
    RESULT_DELAY_MS: 200,
    /** Matchmaking timeout range - minimum */
    MATCHMAKING_MIN_MS: 3000,
    /** Matchmaking timeout range - maximum */
    MATCHMAKING_MAX_MS: 6000,
    /** Time allowed for player selection (Chooser) */
    SELECTION_TIMEOUT_MS: 10000
} as const;

/**
 * Animation timing configuration
 */
export interface AnimationConfig {
    readonly COIN_FLIP_DURATION_S: number;
    readonly COIN_FLIP_ROTATIONS: number;
    readonly DICE_ROLL_DURATION_S: number;
    readonly RPS_CYCLE_DURATION_S: number;
    readonly RIPPLE_DURATION_S: number;
    readonly RIPPLE_DELAY_S: number;
}

export const ANIMATION_CONFIG: AnimationConfig = {
    COIN_FLIP_DURATION_S: 5,
    COIN_FLIP_ROTATIONS: 10,
    DICE_ROLL_DURATION_S: 3,
    RPS_CYCLE_DURATION_S: 0.3,
    RIPPLE_DURATION_S: 1.5,
    RIPPLE_DELAY_S: 0.5
} as const;

/**
 * Platform configuration
 */
export interface PlatformConfig {
    readonly PROTOCOL_FEE_PERCENTAGE: number;
    readonly REWARD_MULTIPLIER: number;
    readonly CURRENCY: string;
    readonly NETWORK: string;
}

export const PLATFORM_CONFIG: PlatformConfig = {
    /** Protocol fee percentage */
    PROTOCOL_FEE_PERCENTAGE: 5,
    /** Reward multiplier (100% - fee = 95%, split between players) */
    REWARD_MULTIPLIER: 1.95,
    CURRENCY: 'USDT',
    NETWORK: 'Polygon'
} as const;

/**
 * UI configuration
 */
export interface UIConfig {
    readonly ICON_SIZE_LARGE: string;
    readonly ICON_SIZE_MEDIUM: string;
    readonly ICON_SIZE_SMALL: string;
    readonly COLOR_WIN: string;
    readonly COLOR_LOSS: string;
    readonly COLOR_CHOOSER: string;
    readonly COLOR_ASSIGNED: string;
    readonly COLOR_CANCEL: string;
    readonly COLOR_DEFAULT_ACCENT: string;
}

export const UI_CONFIG: UIConfig = {
    ICON_SIZE_LARGE: '4rem',
    ICON_SIZE_MEDIUM: '2.5rem',
    ICON_SIZE_SMALL: '2rem',
    COLOR_WIN: '#22c55e',
    COLOR_LOSS: '#ef4444',
    COLOR_CHOOSER: '#60a5fa',
    COLOR_ASSIGNED: '#facc15',
    COLOR_CANCEL: '#EF4444',
    COLOR_DEFAULT_ACCENT: '#2E5CFF'
} as const;
