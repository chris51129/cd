/**
 * Game Loop - requestAnimationFrame-based game loop
 * 
 * WHY (Protocolo Optimización §3): setTimeout/setInterval no están sincronizados
 * con el refresh del monitor y causan jank visual. rAF garantiza 60fps y se
 * pausa automáticamente cuando la pestaña está oculta (ahorro de batería).
 * 
 * PATTERN: Observer pattern para múltiples subscribers, immutable frame data.
 * 
 * FEATURES:
 * - Delta time para física independiente de FPS
 * - Auto-pause cuando tab está hidden (Page Visibility API)
 * - Múltiples subscribers con cleanup automático
 * - Frame skipping protection (max delta clamp)
 */

import {
    type Milliseconds,
    type HighResTimestamp,
    type FrameData,
    type GameLoopCallback,
    type GameLoopSubscription,
    type GameLoopController,
    ms,
    now,
} from './types';

// ============================================
// Constants
// ============================================

/** Maximum delta time to prevent spiral of death after tab pause */
const MAX_DELTA_MS = ms(100); // Cap at 100ms (10fps minimum)

/** Minimum delta time to prevent division issues */
const MIN_DELTA_MS = ms(1);

/** Generate unique subscription IDs */
let subscriptionIdCounter = 0;
const generateSubscriptionId = (): string => {
    subscriptionIdCounter++;
    return `gl_sub_${subscriptionIdCounter}_${Date.now().toString(36)}`;
};

/** Environment check for logging */
const isDevelopment = (): boolean => {
    try {
        if (typeof process !== 'undefined' && process.env?.NODE_ENV) {
            return process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test';
        }
    } catch {
        // Ignore
    }
    return false;
};

// ============================================
// Game Loop Implementation
// ============================================

/**
 * Create a new game loop controller
 * 
 * WHY: Factory function allows multiple independent game loops if needed,
 * though typically one per application.
 * 
 * @returns GameLoopController instance
 * 
 * @example
 * ```typescript
 * const loop = createGameLoop();
 * 
 * const { unsubscribe } = loop.subscribe((frame) => {
 *     // Update game state
 *     updatePosition(frame.deltaTime);
 * });
 * 
 * loop.start();
 * 
 * // On cleanup:
 * unsubscribe();
 * loop.stop();
 * ```
 */
export const createGameLoop = (): GameLoopController => {
    // Internal state
    let isRunning = false;
    let frameId: number | null = null;
    let frameCount = 0;
    let lastFrameTime: HighResTimestamp = now();
    let totalElapsed: Milliseconds = ms(0);
    let isPaused = false;

    // Subscribers map for O(1) add/remove
    const subscribers = new Map<string, GameLoopCallback>();

    /**
     * Handle visibility change (tab switch)
     * WHY: Pause loop when tab is hidden to save resources
     */
    const handleVisibilityChange = (): void => {
        if (document.hidden) {
            isPaused = true;
            if (isDevelopment()) {
                console.log('[GameLoop] Paused (tab hidden)');
            }
        } else {
            isPaused = false;
            // Reset last frame time to avoid huge delta after resume
            lastFrameTime = now();
            if (isDevelopment()) {
                console.log('[GameLoop] Resumed (tab visible)');
            }
        }
    };

    /**
     * Main loop function
     */
    const loop = (timestamp: DOMHighResTimeStamp): void => {
        if (!isRunning) return;

        // Schedule next frame first (ensures consistent timing)
        frameId = requestAnimationFrame(loop);

        // Skip frame if paused (tab hidden)
        if (isPaused) return;

        // Calculate delta time
        const currentTime = timestamp as HighResTimestamp;
        let deltaTime = (currentTime - lastFrameTime) as Milliseconds;

        // Clamp delta time to prevent spiral of death
        if (deltaTime > MAX_DELTA_MS) {
            if (isDevelopment()) {
                console.warn(`[GameLoop] Delta clamped from ${deltaTime}ms to ${MAX_DELTA_MS}ms`);
            }
            deltaTime = MAX_DELTA_MS;
        }

        // Ensure minimum delta
        if (deltaTime < MIN_DELTA_MS) {
            deltaTime = MIN_DELTA_MS;
        }

        // Update timing state
        lastFrameTime = currentTime;
        totalElapsed = (totalElapsed + deltaTime) as Milliseconds;
        frameCount++;

        // Create immutable frame data
        const frameData: FrameData = Object.freeze({
            deltaTime,
            totalElapsed,
            timestamp: currentTime,
            frameCount,
        });

        // Call all subscribers
        subscribers.forEach((callback) => {
            try {
                callback(frameData);
            } catch (error) {
                console.error('[GameLoop] Subscriber error:', error);
            }
        });
    };

    /**
     * Start the game loop
     */
    const start = (): void => {
        if (isRunning) return;

        isRunning = true;
        frameCount = 0;
        totalElapsed = ms(0);
        lastFrameTime = now();
        isPaused = false;

        // Listen for visibility changes
        document.addEventListener('visibilitychange', handleVisibilityChange);

        // Start the loop
        frameId = requestAnimationFrame(loop);

        if (isDevelopment()) {
            console.log('[GameLoop] Started');
        }
    };

    /**
     * Stop the game loop
     */
    const stop = (): void => {
        if (!isRunning) return;

        isRunning = false;

        if (frameId !== null) {
            cancelAnimationFrame(frameId);
            frameId = null;
        }

        // Remove visibility listener
        document.removeEventListener('visibilitychange', handleVisibilityChange);

        if (isDevelopment()) {
            console.log(`[GameLoop] Stopped after ${frameCount} frames`);
        }
    };

    /**
     * Subscribe to game loop updates
     */
    const subscribe = (callback: GameLoopCallback): GameLoopSubscription => {
        const id = generateSubscriptionId();
        subscribers.set(id, callback);

        if (isDevelopment()) {
            console.log(`[GameLoop] Subscriber added (total: ${subscribers.size})`);
        }

        return Object.freeze({
            id,
            unsubscribe: () => {
                subscribers.delete(id);
                if (isDevelopment()) {
                    console.log(`[GameLoop] Subscriber removed (total: ${subscribers.size})`);
                }
            },
        });
    };

    /**
     * Check if loop is running
     */
    const getIsRunning = (): boolean => isRunning;

    /**
     * Get current frame count
     */
    const getFrameCount = (): number => frameCount;

    return Object.freeze({
        start,
        stop,
        subscribe,
        isRunning: getIsRunning,
        getFrameCount,
    });
};

// ============================================
// Singleton Instance (optional, for convenience)
// ============================================

let globalGameLoop: GameLoopController | null = null;

/**
 * Get or create the global game loop instance
 * 
 * WHY: Most apps only need one game loop. This provides a convenient singleton.
 */
export const getGameLoop = (): GameLoopController => {
    if (!globalGameLoop) {
        globalGameLoop = createGameLoop();
    }
    return globalGameLoop;
};

/**
 * Reset the global game loop (useful for tests)
 */
export const resetGameLoop = (): void => {
    if (globalGameLoop) {
        globalGameLoop.stop();
        globalGameLoop = null;
    }
};

// ============================================
// Timer Utilities (built on game loop)
// ============================================

/**
 * Timer state
 */
interface TimerState {
    elapsed: Milliseconds;
    isComplete: boolean;
}

/**
 * Create a one-shot timer that fires after a duration
 * 
 * WHY: Replaces setTimeout with rAF-based timing for smoother animations
 * 
 * @param loop - Game loop to attach to
 * @param durationMs - Duration in milliseconds
 * @param onComplete - Callback when timer completes
 * @returns Cleanup function
 */
export const createTimer = (
    loop: GameLoopController,
    durationMs: Milliseconds,
    onComplete: () => void
): (() => void) => {
    const state: TimerState = {
        elapsed: ms(0),
        isComplete: false,
    };

    const { unsubscribe } = loop.subscribe((frame) => {
        if (state.isComplete) return;

        state.elapsed = (state.elapsed + frame.deltaTime) as Milliseconds;

        if (state.elapsed >= durationMs) {
            state.isComplete = true;
            unsubscribe();
            onComplete();
        }
    });

    return () => {
        state.isComplete = true;
        unsubscribe();
    };
};

/**
 * Create a countdown timer with tick callbacks
 * 
 * WHY: Used for selection timeouts, game countdowns, etc.
 * 
 * @param loop - Game loop to attach to
 * @param durationMs - Total duration in milliseconds
 * @param onTick - Called each second with remaining seconds
 * @param onComplete - Called when countdown reaches zero
 * @returns Cleanup function
 */
export const createCountdown = (
    loop: GameLoopController,
    durationMs: Milliseconds,
    onTick: (remainingSeconds: number) => void,
    onComplete: () => void
): (() => void) => {
    const state = {
        elapsed: ms(0),
        lastTickSecond: Math.ceil(durationMs / 1000),
        isComplete: false,
    };

    // Initial tick
    onTick(state.lastTickSecond);

    const { unsubscribe } = loop.subscribe((frame) => {
        if (state.isComplete) return;

        state.elapsed = (state.elapsed + frame.deltaTime) as Milliseconds;
        const remaining = Math.max(0, durationMs - state.elapsed);
        const currentSecond = Math.ceil(remaining / 1000);

        // Emit tick on second boundary
        if (currentSecond !== state.lastTickSecond) {
            state.lastTickSecond = currentSecond;
            onTick(currentSecond);
        }

        // Complete when done
        if (remaining <= 0) {
            state.isComplete = true;
            unsubscribe();
            onComplete();
        }
    });

    return () => {
        state.isComplete = true;
        unsubscribe();
    };
};

// ============================================
// Exports
// ============================================

export type {
    FrameData,
    GameLoopCallback,
    GameLoopSubscription,
    GameLoopController,
};
