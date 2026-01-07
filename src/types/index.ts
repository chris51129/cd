/**
 * Central Type Definitions for CryptoDuels
 * 
 * Pattern: Parse, Don't Validate
 * WHY: All types defined here represent VALID domain states.
 * Runtime validation happens at system boundaries (API, user input),
 * after which we convert to these opaque types, making invalid states unrepresentable.
 */

// ============================================
// Result Type (Monadic Error Handling)
// ============================================

/**
 * Success variant of Result type
 * @template T - Type of successful value
 */
export interface Success<T> {
    readonly success: true;
    readonly value: T;
    readonly error?: never;
}

/**
 * Failure variant of Result type
 * @template E - Type of error
 */
export interface Failure<E = string> {
    readonly success: false;
    readonly value?: never;
    readonly error: E;
}

/**
 * Result type for operations that can fail
 * WHY: Forces explicit error handling at compile-time. No thrown exceptions in business logic.
 * @template T - Type of successful value
 * @template E - Type of error (defaults to string)
 */
export type Result<T, E = string> = Success<T> | Failure<E>;

/**
 * Helper to create a successful Result
 */
export const ok = <T>(value: T): Success<T> => ({
    success: true,
    value,
});

/**
 * Helper to create a failed Result
 */
export const err = <E = string>(error: E): Failure<E> => ({
    success: false,
    error,
});

// ============================================
// Re-export Game Types
// ============================================

export type {
    GamePhase,
    GameStatus,
    Outcome,
    GameState,
    BaseGameState,
    CoinFlipState,
    DiceState,
    RPSState,
    MemoryState,
    QuickDrawState,
    BlockValidationState,
    GameContext,
    GameStrategy,
    GameRefs,
    GameHandler,
    SecureUtils,
} from '../games/gameStrategy';

export {
    GAME_PHASES,
    GAME_STATUS,
    OUTCOMES,
    isValidPhase,
    isValidStatus,
    isValidOutcome,
} from '../games/gameStrategy';

export type {
    Game,
    GameId,
    GameCategory,
    GameRules,
    GamesRecord,
} from '../constants/games';

export {
    GAMES,
    getGameById,
    getAllGames,
    isValidGameId,
} from '../constants/games';

export type { TierId } from '../constants/tiers';

// ============================================
// Context Types
// ============================================

/**
 * Safety Context Value
 * WHY: Navigation guard during active games prevents accidental state loss
 */
export interface SafetyContextValue {
    readonly handleSafeNavigation: (action: () => void) => void;
    readonly isRisky: boolean;
    readonly setIsRisky: (risky: boolean) => void;
}

/**
 * Valid sound identifiers
 */
export type SoundId = 
    | 'click'
    | 'hover'
    | 'win'
    | 'lose'
    | 'draw'
    | 'countdown'
    | 'flip'
    | 'spin'
    | 'match'
    | 'wrong';

/**
 * Sound Context Value
 */
export interface SoundContextValue {
    readonly isMuted: boolean;
    readonly toggleMute: () => void;
    readonly playSound: (soundId: SoundId) => void;
    readonly volume: number;
    readonly setVolume: (volume: number) => void;
}

/**
 * Theme literal type
 */
export type Theme = 'light' | 'dark';

/**
 * Theme Context Value
 */
export interface ThemeContextValue {
    readonly theme: Theme;
    readonly toggleTheme: () => void;
    readonly setTheme: (theme: Theme) => void;
}

// ============================================
// Component Props Base Types
// ============================================

/**
 * Base props for components that accept children
 */
export interface PropsWithChildren {
    readonly children?: React.ReactNode;
}

/**
 * Base props for components with className
 */
export interface PropsWithClassName {
    readonly className?: string;
}

/**
 * Base props for styled components
 */
export interface StyledComponentProps extends PropsWithClassName {
    readonly style?: React.CSSProperties;
}
