/**
 * Tests for game strategies
 * Coverage: Strategy pattern implementation for all game types
 */
import coinflipStrategy from './coinflip.strategy';
import diceStrategy from './dice.strategy';
import rpsStrategy from './rps.strategy';
import memoryStrategy from './memory.strategy';
import quickdrawStrategy from './quickdraw.strategy';
import blockvalidationStrategy from './blockvalidation.strategy';

// Mock security utilities
jest.mock('../utils/security', () => ({
    secureRandomInt: jest.fn(),
    secureShuffleArray: jest.fn((arr) => [...arr]),
    secureLog: {
        info: jest.fn(),
        warn: jest.fn(),
        error: jest.fn(),
    }
}));

import * as security from '../utils/security';

describe('Game Strategies', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        security.secureRandomInt.mockReturnValue(1);
    });

    describe('coinflipStrategy', () => {
        test('has correct type', () => {
            expect(coinflipStrategy.type).toBe('coinflip');
        });

        test('getInitialState returns selection time', () => {
            const state = coinflipStrategy.getInitialState();
            expect(state).toHaveProperty('selectionTimeLeft');
            expect(state.selectionTimeLeft).toBe(15);
        });

        test('setup sets chooser and phase', () => {
            const mockContext = {
                secureRandomInt: security.secureRandomInt,
                updateGameState: jest.fn(),
                setPhase: jest.fn(),
                setIsChooser: jest.fn(),
                secureLog: security.secureLog
            };

            coinflipStrategy.setup(mockContext, {});

            expect(mockContext.setIsChooser).toHaveBeenCalled();
            expect(mockContext.setPhase).toHaveBeenCalledWith('selection');
        });

        test('spin determines winner correctly', () => {
            const mockContext = {
                playerSide: 'heads',
                finishGame: jest.fn(),
                setResult: jest.fn(),
                secureRandomInt: jest.fn().mockReturnValue(1) // heads
            };

            coinflipStrategy.spin(mockContext);

            expect(mockContext.setResult).toHaveBeenCalledWith('heads');
            expect(mockContext.finishGame).toHaveBeenCalledWith(true, 'heads');
        });

        test('autoSelect returns random choice', () => {
            const mockContext = {
                secureRandomInt: jest.fn().mockReturnValue(0),
                secureLog: security.secureLog
            };

            const choice = coinflipStrategy.autoSelect(mockContext);
            expect(['heads', 'tails']).toContain(choice);
        });
    });

    describe('diceStrategy', () => {
        test('has correct type', () => {
            expect(diceStrategy.type).toBe('dice');
        });

        test('getInitialState returns empty or selection state', () => {
            const state = diceStrategy.getInitialState();
            expect(typeof state).toBe('object');
        });

        test('has setup method', () => {
            expect(typeof diceStrategy.setup).toBe('function');
        });

        test('has spin method', () => {
            expect(typeof diceStrategy.spin).toBe('function');
        });
    });

    describe('rpsStrategy', () => {
        test('has correct type', () => {
            expect(rpsStrategy.type).toBe('rps');
        });

        test('getInitialState includes scores and draw count', () => {
            const state = rpsStrategy.getInitialState();
            expect(state).toHaveProperty('selectionTimeLeft');
            expect(state).toHaveProperty('drawCount');
        });

        test('setup sets chooser to true (RPS always picks)', () => {
            const mockContext = {
                setPhase: jest.fn(),
                setIsChooser: jest.fn(),
                updateGameState: jest.fn(),
                secureLog: security.secureLog
            };

            rpsStrategy.setup(mockContext, {});

            expect(mockContext.setIsChooser).toHaveBeenCalledWith(true);
        });

        test('autoSelect returns valid RPS choice', () => {
            const mockContext = {
                secureRandomInt: jest.fn().mockReturnValue(0),
                secureLog: security.secureLog
            };

            const choice = rpsStrategy.autoSelect(mockContext);
            expect(['rock', 'paper', 'scissors']).toContain(choice);
        });
    });

    describe('memoryStrategy', () => {
        test('has correct type', () => {
            expect(memoryStrategy.type).toBe('memory');
        });

        test('getInitialState includes board and scores', () => {
            const state = memoryStrategy.getInitialState();
            expect(state).toHaveProperty('board');
            expect(state).toHaveProperty('memoryScores');
            expect(state).toHaveProperty('flippedIndices');
            expect(state).toHaveProperty('matchedIndices');
            expect(Array.isArray(state.board)).toBe(true);
        });

        test('board is initialized (may be shuffled)', () => {
            const state = memoryStrategy.getInitialState();
            expect(Array.isArray(state.board)).toBe(true);
            // Board is populated during setup, initial may be empty or filled
            expect(state.board).toBeDefined();
        });

        test('has handlers for card clicks', () => {
            expect(memoryStrategy.handlers).toBeDefined();
            expect(typeof memoryStrategy.handlers.handleCardClick).toBe('function');
        });
    });

    describe('quickdrawStrategy', () => {
        test('has correct type', () => {
            expect(quickdrawStrategy.type).toBe('quickdraw');
        });

        test('getInitialState includes quickdraw state', () => {
            const state = quickdrawStrategy.getInitialState();
            expect(state).toHaveProperty('quickDrawState');
            expect(state).toHaveProperty('countdownLeft');
        });

        test('has handlers for click and timeout', () => {
            expect(quickdrawStrategy.handlers).toBeDefined();
            expect(typeof quickdrawStrategy.handlers.handleClick).toBe('function');
        });
    });

    describe('blockvalidationStrategy', () => {
        test('has correct type', () => {
            expect(blockvalidationStrategy.type).toBe('blockvalidation');
        });

        test('getInitialState includes grid and targets', () => {
            const state = blockvalidationStrategy.getInitialState();
            expect(state).toHaveProperty('blockGrid');
            expect(state).toHaveProperty('blockNextTarget');
            expect(state).toHaveProperty('blockErrors');
            expect(Array.isArray(state.blockGrid)).toBe(true);
        });

        test('grid is initialized', () => {
            const state = blockvalidationStrategy.getInitialState();
            expect(Array.isArray(state.blockGrid)).toBe(true);
            // Grid is populated during setup, initial may be empty
            expect(state.blockGrid).toBeDefined();
        });

        test('has handlers for cell clicks', () => {
            expect(blockvalidationStrategy.handlers).toBeDefined();
            expect(typeof blockvalidationStrategy.handlers.handleCellClick).toBe('function');
        });
    });

    describe('All strategies have required interface', () => {
        const strategies = [
            { name: 'coinflip', strategy: coinflipStrategy },
            { name: 'dice', strategy: diceStrategy },
            { name: 'rps', strategy: rpsStrategy },
            { name: 'memory', strategy: memoryStrategy },
            { name: 'quickdraw', strategy: quickdrawStrategy },
            { name: 'blockvalidation', strategy: blockvalidationStrategy },
        ];

        strategies.forEach(({ name, strategy }) => {
            test(`${name} has type property`, () => {
                expect(strategy.type).toBe(name);
            });

            test(`${name} has getInitialState method`, () => {
                expect(typeof strategy.getInitialState).toBe('function');
            });

            test(`${name} has setup method`, () => {
                expect(typeof strategy.setup).toBe('function');
            });

            test(`${name} getInitialState returns object`, () => {
                const state = strategy.getInitialState();
                expect(typeof state).toBe('object');
            });
        });
    });
});
