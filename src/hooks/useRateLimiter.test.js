/**
 * Tests for useRateLimiter hook
 * Client-side rate limiting for security
 */
import { renderHook, act } from '@testing-library/react';
import { useRateLimiter } from './useRateLimiter';

describe('useRateLimiter', () => {
    beforeEach(() => {
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    test('canAct returns true initially', () => {
        const { result } = renderHook(() => useRateLimiter('selection'));
        expect(result.current.canAct()).toBe(true);
    });

    test('canAct returns false when called too quickly', () => {
        const { result } = renderHook(() => useRateLimiter('selection'));

        result.current.canAct();
        expect(result.current.canAct()).toBe(false);
    });

    test('canAct returns true after cooldown', () => {
        const { result } = renderHook(() => useRateLimiter('selection'));

        result.current.canAct();

        act(() => {
            jest.advanceTimersByTime(600);
        });

        expect(result.current.canAct()).toBe(true);
    });

    test('uses correct cooldown for memory action type', () => {
        const { result } = renderHook(() => useRateLimiter('memory'));
        expect(result.current.cooldown).toBe(100);
    });

    test('uses correct cooldown for quickdraw action type', () => {
        const { result } = renderHook(() => useRateLimiter('quickdraw'));
        expect(result.current.cooldown).toBe(50);
    });

    test('uses correct cooldown for blockvalidation action type', () => {
        const { result } = renderHook(() => useRateLimiter('blockvalidation'));
        expect(result.current.cooldown).toBe(50);
    });

    test('uses default cooldown for unknown action type', () => {
        const { result } = renderHook(() => useRateLimiter('unknown'));
        expect(result.current.cooldown).toBe(100);
    });

    test('recordAction updates last action time', () => {
        const { result } = renderHook(() => useRateLimiter('selection'));

        result.current.recordAction();
        expect(result.current.canAct()).toBe(false);
    });

    test('getTimeUntilReady returns 0 when ready', () => {
        const { result } = renderHook(() => useRateLimiter('selection'));

        act(() => {
            jest.advanceTimersByTime(1000);
        });

        expect(result.current.getTimeUntilReady()).toBe(0);
    });

    test('getTimeUntilReady returns remaining time when cooling down', () => {
        const { result } = renderHook(() => useRateLimiter('selection'));

        result.current.canAct();

        const timeRemaining = result.current.getTimeUntilReady();
        expect(timeRemaining).toBeGreaterThan(0);
        expect(timeRemaining).toBeLessThanOrEqual(500);
    });

    test('reset clears all state', () => {
        const { result } = renderHook(() => useRateLimiter('selection'));

        // Make some actions
        result.current.canAct();

        // Reset
        act(() => {
            result.current.reset();
        });

        // Should be able to act again
        expect(result.current.canAct()).toBe(true);
        expect(result.current.isSuspicious).toBe(false);
    });

    test('detects bot behavior with excessive actions', () => {
        const { result } = renderHook(() => useRateLimiter('memory'));

        // Spam actions rapidly
        for (let i = 0; i < 20; i++) {
            result.current.recordAction();
        }

        // Should block after too many actions
        expect(result.current.canAct()).toBe(false);
    });
});
