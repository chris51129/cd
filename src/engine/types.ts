/**
 * Engine Types - Core types for the game engine
 * 
 * WHY: Centralized type definitions for the game loop and object pooling system.
 * Uses Branded Types (Protocolo Sigma §4.1) to prevent unit confusion.
 * 
 * PATTERN: Parse, Don't Validate - these types are validated at boundaries.
 */

// ============================================
// Branded Types for Time Units
// ============================================

/**
 * Unique brand symbol for type discrimination
 * WHY: Prevents accidental assignment between different time units
 */
declare const __timeUnit: unique symbol;

/**
 * Milliseconds - Branded type for time durations
 * WHY: Prevents confusion between ms and seconds in game loop calculations
 */
export type Milliseconds = number & { readonly [__timeUnit]: 'Milliseconds' };

/**
 * Seconds - Branded type for display/config values
 */
export type Seconds = number & { readonly [__timeUnit]: 'Seconds' };

/**
 * DOMHighResTimestamp - Branded type for performance.now() values
 * WHY: Distinguishes absolute timestamps from relative durations
 */
export type HighResTimestamp = number & { readonly [__timeUnit]: 'HighResTimestamp' };

// ============================================
// Smart Constructors
// ============================================

/**
 * Create a Milliseconds value from a number
 * WHY: Explicit conversion at boundaries prevents unit confusion
 */
export const ms = (value: number): Milliseconds => {
    if (!Number.isFinite(value) || value < 0) {
        throw new Error(`[Engine] Invalid milliseconds value: ${value}`);
    }
    return value as Milliseconds;
};

/**
 * Create a Seconds value from a number
 */
export const sec = (value: number): Seconds => {
    if (!Number.isFinite(value) || value < 0) {
        throw new Error(`[Engine] Invalid seconds value: ${value}`);
    }
    return value as Seconds;
};

/**
 * Convert seconds to milliseconds
 */
export const secToMs = (seconds: Seconds): Milliseconds => {
    return (seconds * 1000) as Milliseconds;
};

/**
 * Convert milliseconds to seconds
 */
export const msToSec = (milliseconds: Milliseconds): Seconds => {
    return (milliseconds / 1000) as Seconds;
};

/**
 * Get current high-resolution timestamp
 * WHY: Wrapper for performance.now() with proper typing
 */
export const now = (): HighResTimestamp => {
    return performance.now() as HighResTimestamp;
};

// ============================================
// Game Loop Types
// ============================================

/**
 * Frame data passed to game loop callbacks
 * WHY: Immutable object with all timing information needed per frame
 */
export interface FrameData {
    /** Time elapsed since last frame */
    readonly deltaTime: Milliseconds;
    /** Total time elapsed since loop started */
    readonly totalElapsed: Milliseconds;
    /** Current timestamp (performance.now) */
    readonly timestamp: HighResTimestamp;
    /** Current frame number */
    readonly frameCount: number;
}

/**
 * Game loop callback signature
 */
export type GameLoopCallback = (frame: FrameData) => void;

/**
 * Game loop subscription result
 */
export interface GameLoopSubscription {
    /** Unique identifier for this subscription */
    readonly id: string;
    /** Unsubscribe from the game loop */
    readonly unsubscribe: () => void;
}

/**
 * Game loop controller interface
 */
export interface GameLoopController {
    /** Start the game loop */
    readonly start: () => void;
    /** Stop the game loop */
    readonly stop: () => void;
    /** Subscribe a callback to receive frame updates */
    readonly subscribe: (callback: GameLoopCallback) => GameLoopSubscription;
    /** Check if the loop is currently running */
    readonly isRunning: () => boolean;
    /** Get current frame count */
    readonly getFrameCount: () => number;
}

// ============================================
// Object Pool Types
// ============================================

/**
 * Factory function to create new pool objects
 */
export type ObjectFactory<T> = () => T;

/**
 * Reset function to return object to initial state
 * WHY: Objects are reused, must be reset to prevent state leakage
 */
export type ObjectReset<T> = (obj: T) => void;

/**
 * Pool configuration
 */
export interface PoolConfig<T> {
    /** Factory function to create new objects */
    readonly factory: ObjectFactory<T>;
    /** Reset function to clean objects before reuse */
    readonly reset: ObjectReset<T>;
    /** Initial pool size */
    readonly initialSize: number;
    /** Maximum pool size (security: prevents memory exhaustion) */
    readonly maxSize: number;
    /** Optional name for debugging */
    readonly name?: string;
}

/**
 * Object pool interface
 */
export interface ObjectPool<T> {
    /** Acquire an object from the pool */
    readonly acquire: () => T | null;
    /** Release an object back to the pool */
    readonly release: (obj: T) => boolean;
    /** Get number of available objects */
    readonly available: () => number;
    /** Get total pool size */
    readonly size: () => number;
    /** Dispose the pool and all objects */
    readonly dispose: () => void;
    /** Pool name for debugging */
    readonly name: string;
}

// ============================================
// Game State Types (for Reducer)
// ============================================

/**
 * Game phases - lifecycle stages
 */
export const PHASES = {
    SETUP: 'setup',
    SELECTION: 'selection',
    SPIN: 'spin',
    ROUND_RESULT: 'round_result',
    RESULT: 'result',
} as const;

export type Phase = typeof PHASES[keyof typeof PHASES];

/**
 * Game outcomes
 */
export const OUTCOMES = {
    WIN: 'win',
    LOSS: 'loss',
    DRAW: 'draw',
} as const;

export type Outcome = typeof OUTCOMES[keyof typeof OUTCOMES] | null;

/**
 * Base game action
 */
export interface BaseAction {
    readonly type: string;
}

/**
 * Tick action - emitted every frame
 */
export interface TickAction extends BaseAction {
    readonly type: 'TICK';
    readonly deltaTime: Milliseconds;
    readonly timestamp: HighResTimestamp;
}

/**
 * Type guard for Phase
 */
export const isPhase = (value: unknown): value is Phase => {
    return typeof value === 'string' &&
        Object.values(PHASES).includes(value as Phase);
};

/**
 * Type guard for Outcome
 */
export const isOutcome = (value: unknown): value is Outcome => {
    return value === null ||
        (typeof value === 'string' && Object.values(OUTCOMES).includes(value as Exclude<Outcome, null>));
};
