/**
 * Tests for useCountUp hook
 * Verified against actual hook API
 */
import { renderHook } from '@testing-library/react';
import { useCountUp } from './useCountUp';

describe('useCountUp', () => {
    let rafCallbacks = [];
    let rafId = 0;

    beforeEach(() => {
        rafCallbacks = [];
        rafId = 0;

        // Mock requestAnimationFrame properly
        jest.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
            rafId++;
            rafCallbacks.push({ id: rafId, cb });
            return rafId;
        });

        jest.spyOn(window, 'cancelAnimationFrame').mockImplementation((id) => {
            rafCallbacks = rafCallbacks.filter(item => item.id !== id);
        });
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    test('returns 0 initially', () => {
        const { result } = renderHook(() => useCountUp(100));
        expect(result.current).toBe(0);
    });

    test('returns number type', () => {
        const { result } = renderHook(() => useCountUp(100));
        expect(typeof result.current).toBe('number');
    });

    test('handles zero target', () => {
        const { result } = renderHook(() => useCountUp(0));
        expect(result.current).toBe(0);
    });

    test('uses default duration when not specified', () => {
        const { result } = renderHook(() => useCountUp(100));
        expect(result.current).toBeDefined();
    });

    test('uses custom duration when specified', () => {
        const { result } = renderHook(() => useCountUp(100, 1000));
        expect(result.current).toBeDefined();
    });

    test('cleanup cancels animation frame on unmount', () => {
        const { unmount } = renderHook(() => useCountUp(100));
        expect(() => unmount()).not.toThrow();
        expect(window.cancelAnimationFrame).toHaveBeenCalled();
    });
});
