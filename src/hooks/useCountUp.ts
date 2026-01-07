/**
 * useCountUp - Custom hook for animated count-up effect
 * 
 * WHY: Provides smooth, eased animation for numeric counters.
 * Uses requestAnimationFrame for optimal performance and
 * CSS-like easing (ease-out quartic) for natural feel.
 */
import { useState, useEffect } from 'react';

/**
 * Hook return type
 */
export type UseCountUpResult = number;

/**
 * Hook options
 */
export interface UseCountUpOptions {
    /** Target value to count up to */
    readonly end: number;
    /** Animation duration in milliseconds */
    readonly duration?: number;
}

/**
 * Easing function - ease-out quartic for smooth deceleration
 */
const easeOutQuart = (progress: number): number => {
    return 1 - Math.pow(1 - progress, 4);
};

/**
 * Custom hook for animated count-up effect
 * 
 * @param end - Target value to count up to
 * @param duration - Animation duration in milliseconds (default: 2000)
 * @returns Current animated count value
 * 
 * @example
 * const animatedValue = useCountUp(100, 1500);
 * // animatedValue smoothly counts from 0 to 100 over 1.5 seconds
 */
export const useCountUp = (end: number, duration: number = 2000): UseCountUpResult => {
    const [count, setCount] = useState<number>(0);

    useEffect(() => {
        let startTime: number | undefined;
        let animationFrame: number;

        const step = (timestamp: number): void => {
            if (!startTime) startTime = timestamp;

            const progress = Math.min((timestamp - startTime) / duration, 1);
            const easedProgress = easeOutQuart(progress);

            setCount(Math.floor(easedProgress * end));

            if (progress < 1) {
                animationFrame = requestAnimationFrame(step);
            }
        };

        animationFrame = requestAnimationFrame(step);

        return () => cancelAnimationFrame(animationFrame);
    }, [end, duration]);

    return count;
};

export default useCountUp;
