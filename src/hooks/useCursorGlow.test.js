/**
 * Tests for useCursorGlow hook
 * Verified against actual hook API
 */
import { renderHook, act } from '@testing-library/react';
import useCursorGlow from './useCursorGlow';

describe('useCursorGlow', () => {
    test('returns ref object', () => {
        const { result } = renderHook(() => useCursorGlow());
        expect(result.current.ref).toBeDefined();
        expect(result.current.ref.current).toBeNull(); // Initially null
    });

    test('returns handlers object', () => {
        const { result } = renderHook(() => useCursorGlow());
        expect(result.current.handlers).toBeDefined();
    });

    test('handlers has onMouseMove function', () => {
        const { result } = renderHook(() => useCursorGlow());
        expect(typeof result.current.handlers.onMouseMove).toBe('function');
    });

    test('handlers has onMouseEnter function', () => {
        const { result } = renderHook(() => useCursorGlow());
        expect(typeof result.current.handlers.onMouseEnter).toBe('function');
    });

    test('handlers has onMouseLeave function', () => {
        const { result } = renderHook(() => useCursorGlow());
        expect(typeof result.current.handlers.onMouseLeave).toBe('function');
    });

    test('onMouseMove handles case when ref.current is null', () => {
        const { result } = renderHook(() => useCursorGlow());

        // Should not throw when ref.current is null
        expect(() => {
            result.current.handlers.onMouseMove({ clientX: 100, clientY: 100 });
        }).not.toThrow();
    });

    test('onMouseEnter handles case when ref.current is null', () => {
        const { result } = renderHook(() => useCursorGlow());

        expect(() => {
            result.current.handlers.onMouseEnter();
        }).not.toThrow();
    });

    test('onMouseLeave handles case when ref.current is null', () => {
        const { result } = renderHook(() => useCursorGlow());

        expect(() => {
            result.current.handlers.onMouseLeave();
        }).not.toThrow();
    });
});
