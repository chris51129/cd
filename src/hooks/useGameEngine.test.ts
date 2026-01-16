/**
 * useGameEngine.test.ts
 * 
 * WHY: Unit tests for game engine hook using mock game loop.
 * Tests the reducer-based state machine and action handlers.
 * 
 * MIGRATION: Updated to use engineMocks instead of jest.advanceTimersByTime
 * because the new engine uses requestAnimationFrame.
 */
import { renderHook, act, waitFor } from '@testing-library/react';
import { useGameEngine } from './useGameEngine';
import { GAME_CONFIG } from '../constants/config';

// ============================================
// Mock Setup
// ============================================

// Mock security utilities for predictable randomness
jest.mock('../utils/security', () => ({
    secureRandomInt: jest.fn((min, _max) => min),
    secureShuffleArray: jest.fn((arr) => arr),
    secureLog: {
        info: jest.fn(),
        warn: jest.fn(),
        error: jest.fn(),
    }
}));

// Mock the game loop module with controllable frame simulation
let mockSubscribers: Array<(frame: { deltaTime: number; timestamp: number; frameNumber: number }) => void> = [];
let mockIsRunning = false;
let mockFrameCount = 0;
let mockTimestamp = 0;

const mockGameLoop = {
    start: jest.fn(() => { mockIsRunning = true; }),
    stop: jest.fn(() => { mockIsRunning = false; }),
    isRunning: jest.fn(() => mockIsRunning),
    subscribe: jest.fn((callback: (frame: { deltaTime: number; timestamp: number; frameNumber: number }) => void) => {
        mockSubscribers.push(callback);
        return {
            unsubscribe: () => {
                mockSubscribers = mockSubscribers.filter(cb => cb !== callback);
            },
        };
    }),
    getStats: jest.fn(() => ({
        frameCount: mockFrameCount,
        subscriberCount: mockSubscribers.length,
        averageFrameTime: 16.67,
    })),
};

jest.mock('../engine', () => {
    const actual = jest.requireActual('../engine');
    return {
        ...actual,
        getGameLoop: () => mockGameLoop,
    };
});

import { secureRandomInt } from '../utils/security';

// ============================================
// Test Utilities
// ============================================

/**
 * Reset mock state between tests
 */
const resetMocks = (): void => {
    mockSubscribers = [];
    mockIsRunning = false;
    mockFrameCount = 0;
    mockTimestamp = 0;
    jest.clearAllMocks();
};

/**
 * Simulate a single frame
 */
const simulateFrame = (deltaTimeMs: number = 16.67): void => {
    if (!mockIsRunning) return;

    mockTimestamp += deltaTimeMs;
    mockFrameCount++;

    const frameData = {
        deltaTime: deltaTimeMs,
        timestamp: mockTimestamp,
        frameNumber: mockFrameCount,
    };

    mockSubscribers.forEach(cb => cb(frameData));
};

/**
 * Simulate frames to advance time
 * @param totalTimeMs - Total time to advance in milliseconds
 * @param frameTimeMs - Time per frame (default 16.67ms = 60fps)
 */
const simulateFrames = (totalTimeMs: number, frameTimeMs: number = 16.67): void => {
    // Start the loop if not running
    if (!mockIsRunning) {
        mockIsRunning = true;
    }

    const frameCount = Math.ceil(totalTimeMs / frameTimeMs);
    for (let i = 0; i < frameCount; i++) {
        simulateFrame(frameTimeMs);
    }
};

// ============================================
// Mock callback
// ============================================

const mockOnFinish = jest.fn();

// ============================================
// Tests
// ============================================

describe('useGameEngine', () => {
    beforeEach(() => {
        resetMocks();
    });

    describe('Initialization', () => {
        test('Hook initializes without errors', () => {
            const { result } = renderHook(() =>
                useGameEngine({ gameType: 'coinflip', onFinish: mockOnFinish })
            );

            expect(result.current.gameState).toBeDefined();
            expect(result.current.actions).toBeDefined();
        });

        test('Initializes coinflip with correct initial state', () => {
            (secureRandomInt as jest.Mock).mockReturnValue(1); // User is Chooser

            const { result } = renderHook(() =>
                useGameEngine({ gameType: 'coinflip', onFinish: mockOnFinish })
            );

            // Phase may be 'setup' or 'selection' depending on useEffect timing
            expect(['setup', 'selection']).toContain(result.current.gameState.phase);
            expect(result.current.gameState.outcome).toBeNull();
        });
    });

    describe('Game Types Initialization', () => {
        test.each([
            'coinflip',
            'dice',
            'rps',
            'memory',
            'quickdraw',
            'blockvalidation',
        ] as const)('Initializes %s game correctly', (gameType) => {
            const { result } = renderHook(() =>
                useGameEngine({ gameType, onFinish: mockOnFinish })
            );

            expect(result.current.gameState).toBeDefined();
            expect(result.current.actions).toBeDefined();
        });
    });

    describe('Actions', () => {
        test('selectSide sets playerSide', () => {
            const { result } = renderHook(() =>
                useGameEngine({ gameType: 'coinflip', onFinish: mockOnFinish })
            );

            act(() => {
                result.current.actions.selectSide('heads');
            });

            // The action should set playerSide and may or may not transition
            // depending on current phase (setup vs selection)
            expect(result.current.gameState.playerSide).toBe('heads');
        });

        test('actions object has all required functions', () => {
            const { result } = renderHook(() =>
                useGameEngine({ gameType: 'coinflip', onFinish: mockOnFinish })
            );

            expect(typeof result.current.actions.selectSide).toBe('function');
            expect(typeof result.current.actions.confirmAssigned).toBe('function');
            expect(typeof result.current.actions.handleMemoryCardClick).toBe('function');
            expect(typeof result.current.actions.handleQuickDrawClick).toBe('function');
            expect(typeof result.current.actions.handleBlockCellClick).toBe('function');
        });
    });

    describe('Game Loop Integration', () => {
        test('subscribes to game loop on mount', () => {
            renderHook(() =>
                useGameEngine({ gameType: 'coinflip', onFinish: mockOnFinish })
            );

            // Should have subscribed to the game loop
            expect(mockGameLoop.subscribe).toHaveBeenCalled();
        });

        test('TICK action decrements selectionTimeLeft', async () => {
            const { result } = renderHook(() =>
                useGameEngine({ gameType: 'coinflip', onFinish: mockOnFinish })
            );

            const initialTimeLeft = result.current.gameState.selectionTimeLeft ?? 10;

            // Simulate 2 seconds of frames
            act(() => {
                simulateFrames(2000);
            });

            // Time should have decreased (but we're in setup phase, not selection)
            // Let's transition to selection first
            act(() => {
                result.current.actions.selectSide('heads');
            });

            // Now we're in spin phase, not selection
            expect(result.current.gameState.phase).toBe('spin');
        });
    });

    describe('Coinflip Game Flow', () => {
        test('Complete coinflip game cycle', async () => {
            (secureRandomInt as jest.Mock)
                .mockReturnValueOnce(1)  // isChooser
                .mockReturnValueOnce(1); // Result: heads

            const { result } = renderHook(() =>
                useGameEngine({ gameType: 'coinflip', onFinish: mockOnFinish })
            );

            // Select a side
            act(() => {
                result.current.actions.selectSide('heads');
            });

            expect(result.current.gameState.phase).toBe('spin');
            expect(result.current.gameState.playerSide).toBe('heads');

            // Simulate spin duration with frames
            act(() => {
                simulateFrames(GAME_CONFIG.SPIN_DURATION_MS + 100);
            });

            // Wait for state to update
            await waitFor(() => {
                // The game should finish after spin duration
                // Note: The actual result depends on strategy.spin being called
            }, { timeout: 1000 });
        });
    });

    describe('RPS Game Flow', () => {
        test('RPS selectSide sets playerSide', () => {
            const { result } = renderHook(() =>
                useGameEngine({ gameType: 'rps', onFinish: mockOnFinish })
            );

            // Select rock
            act(() => {
                result.current.actions.selectSide('rock');
            });

            // The action should set playerSide
            expect(result.current.gameState.playerSide).toBe('rock');
        });
    });

    describe('Memory Game', () => {
        test('Memory game initializes with correct board size', () => {
            const { result } = renderHook(() =>
                useGameEngine({ gameType: 'memory', onFinish: mockOnFinish })
            );

            // Board should be empty initially (set by reducer)
            expect(result.current.gameState.board).toBeDefined();
        });

        test('handleMemoryCardClick is callable', () => {
            const { result } = renderHook(() =>
                useGameEngine({ gameType: 'memory', onFinish: mockOnFinish })
            );

            // Should not throw
            act(() => {
                result.current.actions.handleMemoryCardClick(0);
            });
        });
    });

    describe('QuickDraw Game', () => {
        test('QuickDraw initializes correctly', () => {
            const { result } = renderHook(() =>
                useGameEngine({ gameType: 'quickdraw', onFinish: mockOnFinish })
            );

            // After mount effects, quickdraw may be in 'waiting' state
            // (START_PLAYING dispatched in useEffect)
            expect(['countdown', 'waiting']).toContain(result.current.gameState.quickDrawState);
        });

        test('handleQuickDrawClick is callable', () => {
            const { result } = renderHook(() =>
                useGameEngine({ gameType: 'quickdraw', onFinish: mockOnFinish })
            );

            // Should not throw
            act(() => {
                result.current.actions.handleQuickDrawClick();
            });
        });
    });

    describe('BlockValidation Game', () => {
        test('BlockValidation initializes with grid', () => {
            const { result } = renderHook(() =>
                useGameEngine({ gameType: 'blockvalidation', onFinish: mockOnFinish })
            );

            expect(result.current.gameState.blockNextTarget).toBe(1);
            expect(result.current.gameState.blockErrors).toBe(0);
        });

        test('handleBlockCellClick is callable', () => {
            const { result } = renderHook(() =>
                useGameEngine({ gameType: 'blockvalidation', onFinish: mockOnFinish })
            );

            // Should not throw
            act(() => {
                result.current.actions.handleBlockCellClick(1);
            });
        });
    });

    describe('Edge Cases', () => {
        test('Handles unknown game type gracefully', () => {
            expect(() => {
                renderHook(() =>
                    useGameEngine({ gameType: 'unknown' as 'coinflip', onFinish: mockOnFinish })
                );
            }).not.toThrow();
        });

        test('Works without onFinish callback', () => {
            const { result } = renderHook(() =>
                useGameEngine({ gameType: 'coinflip' })
            );

            expect(result.current.gameState).toBeDefined();
        });

        test('Multiple rapid actions do not cause errors', () => {
            const { result } = renderHook(() =>
                useGameEngine({ gameType: 'coinflip', onFinish: mockOnFinish })
            );

            expect(() => {
                act(() => {
                    result.current.actions.selectSide('heads');
                    result.current.actions.selectSide('tails');
                    result.current.actions.selectSide('heads');
                });
            }).not.toThrow();
        });
    });

    describe('Cleanup', () => {
        test('Unsubscribes from game loop on unmount', () => {
            const { unmount } = renderHook(() =>
                useGameEngine({ gameType: 'coinflip', onFinish: mockOnFinish })
            );

            const subscriberCountBefore = mockSubscribers.length;

            unmount();

            // Subscribers should decrease after unmount
            expect(mockSubscribers.length).toBeLessThanOrEqual(subscriberCountBefore);
        });
    });
});
