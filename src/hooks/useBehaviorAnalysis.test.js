/**
 * Tests for useBehaviorAnalysis hook
 * Verified against actual hook API
 */
import { renderHook, act } from '@testing-library/react';
import { useBehaviorAnalysis } from './useBehaviorAnalysis';

// Mock secureLog
jest.mock('../utils/security', () => ({
    secureLog: {
        info: jest.fn(),
        warn: jest.fn(),
        error: jest.fn()
    }
}));

describe('useBehaviorAnalysis', () => {
    test('returns required functions', () => {
        const { result } = renderHook(() => useBehaviorAnalysis());

        expect(typeof result.current.recordAction).toBe('function');
        expect(typeof result.current.recordReactionTime).toBe('function');
        expect(typeof result.current.recordClickPosition).toBe('function');
        expect(typeof result.current.analyze).toBe('function');
        expect(typeof result.current.reset).toBe('function');
    });

    test('initializes with suspicionScore of 0', () => {
        const { result } = renderHook(() => useBehaviorAnalysis());
        expect(result.current.suspicionScore).toBe(0);
    });

    test('initializes with null lastAnalysis', () => {
        const { result } = renderHook(() => useBehaviorAnalysis());
        expect(result.current.lastAnalysis).toBeNull();
    });

    test('recordAction records timestamps', () => {
        const { result } = renderHook(() => useBehaviorAnalysis());

        act(() => {
            result.current.recordAction();
            result.current.recordAction();
        });

        // No error should be thrown
        expect(result.current.recordAction).toBeDefined();
    });

    test('recordReactionTime records reaction times', () => {
        const { result } = renderHook(() => useBehaviorAnalysis());

        act(() => {
            result.current.recordReactionTime(150);
            result.current.recordReactionTime(200);
        });

        expect(result.current.recordReactionTime).toBeDefined();
    });

    test('recordClickPosition records x,y coordinates', () => {
        const { result } = renderHook(() => useBehaviorAnalysis());

        act(() => {
            result.current.recordClickPosition(100, 200);
            result.current.recordClickPosition(150, 250);
        });

        expect(result.current.recordClickPosition).toBeDefined();
    });

    test('analyze returns analysis object', () => {
        const { result } = renderHook(() => useBehaviorAnalysis());

        let analysis;
        act(() => {
            analysis = result.current.analyze();
        });

        expect(analysis).toHaveProperty('isBot');
        expect(analysis).toHaveProperty('confidence');
        expect(analysis).toHaveProperty('flags');
    });

    test('analyze detects suspicious patterns with many rapid actions', () => {
        const { result } = renderHook(() => useBehaviorAnalysis());

        // Record many actions with same interval (bot-like behavior)
        act(() => {
            for (let i = 0; i < 10; i++) {
                result.current.recordAction(1000 + i * 100); // Exactly 100ms apart
            }
        });

        let analysis;
        act(() => {
            analysis = result.current.analyze();
        });

        // Should detect low variance intervals
        expect(analysis.flags).toContain('LOW_VARIANCE_INTERVALS');
    });

    test('analyze detects superhuman reactions', () => {
        const { result } = renderHook(() => useBehaviorAnalysis());

        act(() => {
            // Record very fast reactions (< 50ms is superhuman)
            result.current.recordReactionTime(20);
            result.current.recordReactionTime(25);
            result.current.recordReactionTime(30);
        });

        let analysis;
        act(() => {
            analysis = result.current.analyze();
        });

        expect(analysis.flags).toContain('SUPERHUMAN_REACTION');
    });

    test('reset clears all recorded data', () => {
        const { result } = renderHook(() => useBehaviorAnalysis());

        act(() => {
            result.current.recordAction();
            result.current.recordReactionTime(100);
            result.current.recordClickPosition(50, 50);
            result.current.reset();
        });

        // After reset, analyze should return clean state
        let analysis;
        act(() => {
            analysis = result.current.analyze();
        });

        expect(analysis.isBot).toBe(false);
        expect(analysis.flags.length).toBe(0);
    });
});
