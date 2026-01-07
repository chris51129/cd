/**
 * useGameEngine.test.js
 * Unit testing the Game Logic in isolation from the UI
 */
import { renderHook, act } from '@testing-library/react';
import { useGameEngine } from './useGameEngine';
import { GAME_CONFIG } from '../constants/config';

// Mock timers
jest.useFakeTimers();

// Mock security utilities for predictable randomness
jest.mock('../utils/security', () => ({
    secureRandomInt: jest.fn((min, max) => min),
    secureShuffleArray: jest.fn((arr) => arr),
    secureLog: {
        info: jest.fn(),
        warn: jest.fn(),
        error: jest.fn(),
    }
}));

// Mock helpers
jest.mock('../utils/helpers', () => ({
    getRandomInt: jest.fn((min) => min),
    secureRandomInt: jest.fn((min) => min),
}));

import { secureRandomInt } from '../utils/security';

// Mock dependencies
const mockOnFinish = jest.fn();

describe('useGameEngine', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('Game Logic with Secure Random', () => {
        test('Initializes Coinflip in Selection phase (Random returns 1 -> Chooser)', () => {
            secureRandomInt.mockReturnValue(1); // User is Chooser
            const { result } = renderHook(() => useGameEngine({ gameType: 'coinflip', onFinish: mockOnFinish }));

            expect(result.current.gameState.phase).toBe('selection');
            expect(result.current.gameState.isChooser).toBe(true);
        });

        test('Initializes Coinflip in Selection phase (Random returns 0 -> Assigned)', () => {
            secureRandomInt.mockReturnValue(0); // User is Assigned
            const { result } = renderHook(() => useGameEngine({ gameType: 'coinflip', onFinish: mockOnFinish }));

            expect(result.current.gameState.phase).toBe('selection');
            expect(result.current.gameState.isChooser).toBe(false);
        });

        test('Transitions to Spin when side selected', () => {
            const { result } = renderHook(() => useGameEngine({ gameType: 'coinflip', onFinish: mockOnFinish }));

            act(() => {
                result.current.actions.selectSide('heads');
            });

            expect(result.current.gameState.phase).toBe('spin');
            expect(result.current.gameState.status).toBe('spin');
            expect(result.current.gameState.playerSide).toBe('heads');
        });

        test('Runs Spin Timer and Finishes Game (Win)', () => {
            // Setup: Chooser
            secureRandomInt.mockReturnValueOnce(1);
            const { result } = renderHook(() => useGameEngine({ gameType: 'coinflip', onFinish: mockOnFinish }));

            act(() => {
                result.current.actions.selectSide('heads');
            });

            // Mock Result: 1 -> heads. Player selected heads. Win.
            secureRandomInt.mockReturnValueOnce(1);

            act(() => {
                jest.advanceTimersByTime(GAME_CONFIG.SPIN_DURATION_MS);
            });

            expect(result.current.gameState.phase).toBe('result');
            expect(result.current.gameState.outcome).toBe('win');
            expect(result.current.gameState.result).toBe('heads');
            expect(mockOnFinish).toHaveBeenCalledWith({ result: 'heads', outcome: 'win' });
        });

        test('Runs Spin Timer and Finishes Game (Loss)', () => {
            // Setup: Chooser
            secureRandomInt.mockReturnValueOnce(1);
            const { result } = renderHook(() => useGameEngine({ gameType: 'coinflip', onFinish: mockOnFinish }));

            act(() => {
                result.current.actions.selectSide('heads');
            });

            // Mock Result: 0 -> tails. Player selected heads. Loss.
            secureRandomInt.mockReturnValueOnce(0);

            act(() => {
                jest.advanceTimersByTime(GAME_CONFIG.SPIN_DURATION_MS);
            });

            expect(result.current.gameState.phase).toBe('result');
            expect(result.current.gameState.outcome).toBe('loss');
            expect(result.current.gameState.result).toBe('tails');
            expect(mockOnFinish).toHaveBeenCalledWith({ result: 'tails', outcome: 'loss' });
        });
    });

    // Basic hook initialization test
    test('Hook initializes without errors', () => {
        const { result } = renderHook(() => useGameEngine({ gameType: 'coinflip', onFinish: mockOnFinish }));
        expect(result.current.gameState).toBeDefined();
        expect(result.current.actions).toBeDefined();
    });

    describe('Different Game Types', () => {
        test('Initializes dice game', () => {
            const { result } = renderHook(() => useGameEngine({ gameType: 'dice', onFinish: mockOnFinish }));
            expect(result.current.gameState).toBeDefined();
            expect(result.current.actions).toBeDefined();
        });

        test('Initializes rps game', () => {
            const { result } = renderHook(() => useGameEngine({ gameType: 'rps', onFinish: mockOnFinish }));
            expect(result.current.gameState).toBeDefined();
            expect(result.current.actions).toBeDefined();
        });

        test('Initializes memory game', () => {
            const { result } = renderHook(() => useGameEngine({ gameType: 'memory', onFinish: mockOnFinish }));
            expect(result.current.gameState).toBeDefined();
            expect(result.current.actions).toBeDefined();
        });

        test('Initializes quickdraw game', () => {
            const { result } = renderHook(() => useGameEngine({ gameType: 'quickdraw', onFinish: mockOnFinish }));
            expect(result.current.gameState).toBeDefined();
            expect(result.current.actions).toBeDefined();
        });

        test('Initializes blockvalidation game', () => {
            const { result } = renderHook(() => useGameEngine({ gameType: 'blockvalidation', onFinish: mockOnFinish }));
            expect(result.current.gameState).toBeDefined();
            expect(result.current.actions).toBeDefined();
        });
    });

    describe('Actions', () => {
        test('selectSide transitions to spin phase', () => {
            const { result } = renderHook(() => useGameEngine({ gameType: 'coinflip', onFinish: mockOnFinish }));

            act(() => {
                result.current.actions.selectSide('heads');
            });

            expect(result.current.gameState.phase).toBe('spin');
            expect(result.current.gameState.playerSide).toBe('heads');
        });

        test('actions object has required functions', () => {
            const { result } = renderHook(() => useGameEngine({ gameType: 'coinflip', onFinish: mockOnFinish }));
            expect(result.current.actions.selectSide).toBeDefined();
            expect(typeof result.current.actions.selectSide).toBe('function');
        });
    });

    describe('Edge Cases', () => {
        test('Handles unknown game type gracefully', () => {
            expect(() => {
                renderHook(() => useGameEngine({ gameType: 'unknown', onFinish: mockOnFinish }));
            }).not.toThrow();
        });

        test('Works without onFinish callback', () => {
            const { result } = renderHook(() => useGameEngine({ gameType: 'coinflip' }));
            expect(result.current.gameState).toBeDefined();
        });
    });
});
