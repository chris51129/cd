/**
 * useGameLoop - React hook for game loop integration
 * 
 * WHY: Bridges the game loop engine with React lifecycle.
 * Handles automatic subscription/unsubscription on mount/unmount.
 * 
 * PATTERN: Custom hook with cleanup, follows Rules of Hooks.
 */

import { useEffect, useRef, useCallback } from 'react';
import {
    type GameLoopCallback,
    type FrameData,
    type Milliseconds,
    getGameLoop,
    ms,
} from '../engine';

// ============================================
// useGameLoop Hook
// ============================================

/**
 * Subscribe to the global game loop from a React component
 * 
 * WHY: Abstracts game loop subscription and ensures proper cleanup.
 * The callback will be called every frame (~60fps) with delta time.
 * 
 * @param callback - Function to call each frame
 * @param enabled - Whether the subscription is active (default: true)
 * 
 * @example
 * ```typescript
 * const MyComponent = () => {
 *     const [position, setPosition] = useState(0);
 *     
 *     useGameLoop((frame) => {
 *         // Move 100 pixels per second
 *         setPosition(prev => prev + (100 * frame.deltaTime / 1000));
 *     });
 *     
 *     return <div style={{ left: position }} />;
 * };
 * ```
 */
export const useGameLoop = (
    callback: GameLoopCallback,
    enabled: boolean = true
): void => {
    // Use ref to avoid stale closure issues
    const callbackRef = useRef<GameLoopCallback>(callback);
    callbackRef.current = callback;

    useEffect(() => {
        if (!enabled) return;

        const loop = getGameLoop();

        // Start loop if not running
        if (!loop.isRunning()) {
            loop.start();
        }

        // Subscribe with stable wrapper
        const { unsubscribe } = loop.subscribe((frame) => {
            callbackRef.current(frame);
        });

        return () => {
            unsubscribe();
        };
    }, [enabled]);
};

// ============================================
// useCountdown Hook
// ============================================

/**
 * Countdown hook configuration
 */
export interface CountdownConfig {
    /** Duration in seconds */
    readonly durationSeconds: number;
    /** Called when countdown reaches zero */
    readonly onComplete: () => void;
    /** Called each second with remaining time */
    readonly onTick?: (remainingSeconds: number) => void;
    /** Whether countdown is active */
    readonly enabled?: boolean;
}

/**
 * Countdown hook result
 */
export interface CountdownResult {
    /** Current remaining seconds */
    readonly remainingSeconds: number;
    /** Whether countdown is complete */
    readonly isComplete: boolean;
    /** Reset the countdown */
    readonly reset: () => void;
}

/**
 * Create a countdown timer based on the game loop
 * 
 * WHY: Replaces setTimeout-based countdowns with smooth rAF-based timing.
 * Updates every frame but only triggers onTick on second boundaries.
 * 
 * @param config - Countdown configuration
 * @returns Countdown state and controls
 * 
 * @example
 * ```typescript
 * const { remainingSeconds, isComplete } = useCountdown({
 *     durationSeconds: 10,
 *     onComplete: () => console.log('Time up!'),
 *     onTick: (s) => console.log(`${s} seconds left`),
 * });
 * ```
 */
export const useCountdown = (config: CountdownConfig): CountdownResult => {
    const {
        durationSeconds,
        onComplete,
        onTick,
        enabled = true,
    } = config;

    // State refs (avoid re-renders every frame)
    const elapsedRef = useRef<Milliseconds>(ms(0));
    const remainingRef = useRef<number>(durationSeconds);
    const lastTickSecondRef = useRef<number>(durationSeconds);
    const isCompleteRef = useRef<boolean>(false);
    const keyRef = useRef<number>(0);

    // Stable callback refs
    const onCompleteRef = useRef(onComplete);
    const onTickRef = useRef(onTick);
    onCompleteRef.current = onComplete;
    onTickRef.current = onTick;

    // Reset function
    const reset = useCallback(() => {
        elapsedRef.current = ms(0);
        remainingRef.current = durationSeconds;
        lastTickSecondRef.current = durationSeconds;
        isCompleteRef.current = false;
        keyRef.current++;

        // Trigger initial tick
        onTickRef.current?.(durationSeconds);
    }, [durationSeconds]);

    // Initial setup
    useEffect(() => {
        remainingRef.current = durationSeconds;
        lastTickSecondRef.current = durationSeconds;
        elapsedRef.current = ms(0);
        isCompleteRef.current = false;

        // Trigger initial tick
        onTickRef.current?.(durationSeconds);
    }, [durationSeconds, keyRef.current]);

    // Game loop subscription
    useGameLoop((frame) => {
        if (isCompleteRef.current) return;

        // Update elapsed time
        elapsedRef.current = (elapsedRef.current + frame.deltaTime) as Milliseconds;

        // Calculate remaining
        const durationMs = durationSeconds * 1000;
        const remaining = Math.max(0, durationMs - elapsedRef.current);
        const currentSecond = Math.ceil(remaining / 1000);

        remainingRef.current = currentSecond;

        // Emit tick on second boundary
        if (currentSecond !== lastTickSecondRef.current && currentSecond >= 0) {
            lastTickSecondRef.current = currentSecond;
            onTickRef.current?.(currentSecond);
        }

        // Complete
        if (remaining <= 0 && !isCompleteRef.current) {
            isCompleteRef.current = true;
            onCompleteRef.current();
        }
    }, enabled && !isCompleteRef.current);

    return {
        remainingSeconds: remainingRef.current,
        isComplete: isCompleteRef.current,
        reset,
    };
};

// ============================================
// useTimeout Hook
// ============================================

/**
 * Timeout hook - fires callback after duration
 * 
 * WHY: Replaces setTimeout with rAF-based timing for consistency.
 * 
 * @param callback - Function to call when timeout fires
 * @param delayMs - Delay in milliseconds
 * @param enabled - Whether timeout is active
 */
export const useTimeout = (
    callback: () => void,
    delayMs: number,
    enabled: boolean = true
): void => {
    const callbackRef = useRef(callback);
    const elapsedRef = useRef<Milliseconds>(ms(0));
    const firedRef = useRef(false);

    callbackRef.current = callback;

    // Reset on delay change
    useEffect(() => {
        elapsedRef.current = ms(0);
        firedRef.current = false;
    }, [delayMs]);

    useGameLoop((frame) => {
        if (firedRef.current) return;

        elapsedRef.current = (elapsedRef.current + frame.deltaTime) as Milliseconds;

        if (elapsedRef.current >= delayMs) {
            firedRef.current = true;
            callbackRef.current();
        }
    }, enabled && !firedRef.current);
};

// ============================================
// useInterval Hook
// ============================================

/**
 * Interval hook - fires callback repeatedly at interval
 * 
 * WHY: Replaces setInterval with rAF-based timing.
 * More accurate and synchronizes with display refresh.
 * 
 * @param callback - Function to call at each interval
 * @param intervalMs - Interval in milliseconds
 * @param enabled - Whether interval is active
 */
export const useInterval = (
    callback: () => void,
    intervalMs: number,
    enabled: boolean = true
): void => {
    const callbackRef = useRef(callback);
    const accumulatedRef = useRef<Milliseconds>(ms(0));

    callbackRef.current = callback;

    useGameLoop((frame) => {
        accumulatedRef.current = (accumulatedRef.current + frame.deltaTime) as Milliseconds;

        if (accumulatedRef.current >= intervalMs) {
            // Fire callback and reset accumulator
            // Note: We subtract intervalMs instead of resetting to 0
            // to maintain timing accuracy across frames
            accumulatedRef.current = (accumulatedRef.current - intervalMs) as Milliseconds;
            callbackRef.current();
        }
    }, enabled);
};

// ============================================
// useFrameData Hook
// ============================================

/**
 * Get the latest frame data
 * 
 * WHY: Sometimes you just want to read frame data without a callback.
 * Useful for imperative code.
 * 
 * @returns Latest frame data (updates every frame)
 */
export const useFrameData = (): FrameData | null => {
    const frameDataRef = useRef<FrameData | null>(null);

    useGameLoop((frame) => {
        frameDataRef.current = frame;
    });

    return frameDataRef.current;
};
