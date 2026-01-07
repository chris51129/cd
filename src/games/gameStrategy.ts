/**
 * Game Strategy Base Types
 * 
 * Pattern: Strategy (GoF)
 * 
 * WHY: Este módulo define los contratos de tipo para todas las estrategias de juego.
 * Permite añadir nuevos juegos sin modificar useGameEngine, siguiendo
 * Open/Closed Principle.
 */

// ============================================
// Game Phase & Status Enums
// ============================================

/**
 * Game phases - represents the lifecycle stages of a game
 */
export const GAME_PHASES = {
    SETUP: 'setup',
    SELECTION: 'selection',
    SPIN: 'spin',
    ROUND_RESULT: 'round_result',
    RESULT: 'result'
} as const;

export type GamePhase = typeof GAME_PHASES[keyof typeof GAME_PHASES];

/**
 * Game status - represents the current animation/visual state
 */
export const GAME_STATUS = {
    IDLE: 'idle',
    SPIN: 'spin',
    ROUND_RESULT: 'round_result',
    RESULT: 'result'
} as const;

export type GameStatus = typeof GAME_STATUS[keyof typeof GAME_STATUS];

/**
 * Game outcomes - possible final results
 */
export const OUTCOMES = {
    WIN: 'win',
    LOSS: 'loss',
    DRAW: 'draw'
} as const;

export type Outcome = typeof OUTCOMES[keyof typeof OUTCOMES];

// ============================================
// Game State Types
// ============================================

/**
 * Base game state that all games share
 */
export interface BaseGameState {
    readonly selectionTimeLeft?: number;
    readonly selectionTimerId?: ReturnType<typeof setTimeout> | null;
}

/**
 * CoinFlip specific state
 */
export interface CoinFlipState extends BaseGameState {
    readonly selectionTimeLeft: number;
    readonly selectionTimerId: ReturnType<typeof setTimeout> | null;
}

/**
 * Dice specific state
 */
export interface DiceState extends BaseGameState {
    // Dice doesn't have additional state beyond base
}

/**
 * RPS specific state
 */
export interface RPSState extends BaseGameState {
    readonly selectionTimeLeft: number;
    readonly selectionTimerId: ReturnType<typeof setTimeout> | null;
    readonly round: number;
    readonly tieCount: number;
    readonly userScore: number;
    readonly opponentScore: number;
}

/**
 * Memory specific state
 */
export interface MemoryState extends BaseGameState {
    readonly board: readonly number[];
    readonly flippedIndices: readonly number[];
    readonly matchedIndices: readonly number[];
    readonly userMatches: number;
    readonly opponentMatches: number;
    readonly currentPhase: 'memorize' | 'play';
}

/**
 * QuickDraw specific state
 */
export interface QuickDrawState extends BaseGameState {
    readonly signalTime: number | null;
    readonly reactionTime: number | null;
    readonly falseStart: boolean;
}

/**
 * BlockValidation specific state
 */
export interface BlockValidationState extends BaseGameState {
    readonly currentNumber: number;
    readonly grid: readonly number[];
    readonly clickedPositions: readonly number[];
    readonly startTime: number | null;
    readonly penaltyTime: number;
}

/**
 * Union type for all possible game states
 */
export type GameState =
    | CoinFlipState
    | DiceState
    | RPSState
    | MemoryState
    | QuickDrawState
    | BlockValidationState;

// ============================================
// Game Context & Strategy Types
// ============================================

/**
 * Secure utilities passed to strategies
 */
export interface SecureUtils {
    readonly secureRandomInt: (min: number, max: number) => number;
    readonly secureLog: {
        info: (...args: unknown[]) => void;
        warn: (...args: unknown[]) => void;
        error: (...args: unknown[]) => void;
        security: (...args: unknown[]) => void;
    };
}

/**
 * Context provided to strategy methods
 * Contains all the functions and state needed for game logic
 */
export interface GameContext extends SecureUtils {
    // State setters
    readonly setPhase: (phase: GamePhase) => void;
    readonly setStatus: (status: GameStatus) => void;
    readonly setResult: (result: unknown) => void;
    readonly setIsChooser: (isChooser: boolean) => void;
    readonly updateGameState: (updates: Record<string, unknown>) => void;
    readonly finishGame: (isWin: boolean, result?: unknown) => void;

    // Current state (various names used by strategies)
    readonly playerSide?: string;
    readonly state?: GameState;
    readonly gameState?: Record<string, unknown>;
}

/**
 * Reference object for mutable values that persist across renders
 */
export interface GameRefs {
    readonly hasFinished: boolean;
}

/**
 * Handler function type
 */
export type GameHandler = (context: GameContext, ...args: unknown[]) => void;

/**
 * Game Strategy interface - all games must implement this
 */
export interface GameStrategy<TState extends object = BaseGameState> {
    /** Unique identifier for this game type */
    readonly type: string;

    /** Returns the initial state specific to this game */
    readonly getInitialState: () => TState;

    /** Setup phase - initializes the game, assigns roles */
    readonly setup: (context: GameContext, refs: GameRefs) => void;

    /** Spin/execute phase - runs the game logic and determines result */
    readonly spin: (context: GameContext) => void;

    /** Auto-select handler for timeout (optional) */
    readonly autoSelect?: (context: GameContext) => string;

    /** Game-specific event handlers */
    readonly handlers: Readonly<Record<string, GameHandler>>;
}

// ============================================
// Type Guards
// ============================================

/**
 * Type guard to check if a phase is valid
 */
export const isValidPhase = (phase: unknown): phase is GamePhase => {
    return typeof phase === 'string' &&
        Object.values(GAME_PHASES).includes(phase as GamePhase);
};

/**
 * Type guard to check if a status is valid
 */
export const isValidStatus = (status: unknown): status is GameStatus => {
    return typeof status === 'string' &&
        Object.values(GAME_STATUS).includes(status as GameStatus);
};

/**
 * Type guard to check if an outcome is valid
 */
export const isValidOutcome = (outcome: unknown): outcome is Outcome => {
    return typeof outcome === 'string' &&
        Object.values(OUTCOMES).includes(outcome as Outcome);
};
