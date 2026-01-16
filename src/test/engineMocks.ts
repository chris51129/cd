/**
 * Engine Mocks for Testing
 * 
 * WHY: The game engine uses requestAnimationFrame which doesn't work with
 * jest.useFakeTimers(). These mocks allow controlled simulation of frames.
 * 
 * USAGE: Import and call mockGameLoop() before tests, simulateFrames() to advance time.
 */

import type { FrameData, GameLoopCallback, GameLoopSubscription, GameLoopController } from '../engine';
import { ms, type Milliseconds } from '../engine';

// ============================================
// Mock State
// ============================================

let mockCallbacks: GameLoopCallback[] = [];
let mockIsRunning = false;
let mockFrameCount = 0;
let mockTimestamp = 0;

// ============================================
// Mock Game Loop Controller
// ============================================

const createMockGameLoop = (): GameLoopController => ({
    start: () => {
        mockIsRunning = true;
    },
    stop: () => {
        mockIsRunning = false;
    },
    isRunning: () => mockIsRunning,
    subscribe: (callback: GameLoopCallback): GameLoopSubscription => {
        mockCallbacks.push(callback);
        return {
            unsubscribe: () => {
                mockCallbacks = mockCallbacks.filter(cb => cb !== callback);
            },
        };
    },
    getStats: () => ({
        frameCount: mockFrameCount,
        subscriberCount: mockCallbacks.length,
        averageFrameTime: ms(16.67),
    }),
});

// Singleton mock instance
let mockLoopInstance: GameLoopController | null = null;

export const getMockGameLoop = (): GameLoopController => {
    if (!mockLoopInstance) {
        mockLoopInstance = createMockGameLoop();
    }
    return mockLoopInstance;
};

// ============================================
// Test Utilities
// ============================================

/**
 * Reset all mock state between tests
 */
export const resetMockGameLoop = (): void => {
    mockCallbacks = [];
    mockIsRunning = false;
    mockFrameCount = 0;
    mockTimestamp = 0;
    mockLoopInstance = null;
};

/**
 * Simulate a single frame with given delta time
 */
export const simulateFrame = (deltaTimeMs: number = 16.67): void => {
    if (!mockIsRunning) return;

    mockTimestamp += deltaTimeMs;
    mockFrameCount++;

    const frameData: FrameData = {
        deltaTime: ms(deltaTimeMs),
        timestamp: mockTimestamp as unknown as Milliseconds,
        frameNumber: mockFrameCount,
    };

    // Call all subscribers
    mockCallbacks.forEach(cb => cb(frameData));
};

/**
 * Simulate multiple frames to advance time by a given amount
 * 
 * @param totalTimeMs - Total time to advance
 * @param frameTimeMs - Time per frame (default 16.67ms = 60fps)
 */
export const simulateFrames = (totalTimeMs: number, frameTimeMs: number = 16.67): void => {
    const frameCount = Math.ceil(totalTimeMs / frameTimeMs);
    for (let i = 0; i < frameCount; i++) {
        simulateFrame(frameTimeMs);
    }
};

/**
 * Simulate frames until a condition is met or timeout
 * 
 * @param condition - Function that returns true when done
 * @param maxFrames - Maximum frames to simulate (prevent infinite loops)
 * @param frameTimeMs - Time per frame
 */
export const simulateUntil = (
    condition: () => boolean,
    maxFrames: number = 1000,
    frameTimeMs: number = 16.67
): boolean => {
    for (let i = 0; i < maxFrames; i++) {
        if (condition()) return true;
        simulateFrame(frameTimeMs);
    }
    return false;
};

// ============================================
// Jest Mock Setup
// ============================================

/**
 * Setup the mock for jest tests
 * Call this in beforeEach or at the top of test file
 */
export const setupEngineMocks = (): void => {
    jest.mock('../engine', () => {
        const actual = jest.requireActual('../engine');
        return {
            ...actual,
            getGameLoop: () => getMockGameLoop(),
        };
    });
};
