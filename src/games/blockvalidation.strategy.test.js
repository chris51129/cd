/**
 * Comprehensive tests for BlockValidation Strategy
 * Testing behavior without tight coupling to implementation
 */
import { blockvalidationStrategy } from './blockvalidation.strategy';
import { GAME_PHASES, GAME_STATUS } from './gameStrategy';

describe('blockvalidationStrategy', () => {
    describe('getInitialState', () => {
        test('returns initial state object', () => {
            const state = blockvalidationStrategy.getInitialState();
            expect(state).toHaveProperty('blockGrid');
            expect(state).toHaveProperty('blockNextTarget', 1);
            expect(state).toHaveProperty('blockErrors', 0);
            expect(state).toHaveProperty('blockState', 'countdown');
            expect(state).toHaveProperty('blockTimeLeft');
            expect(state).toHaveProperty('countdownLeft');
            expect(state).toHaveProperty('blockTimestamps');
        });

        test('blockGrid is initially empty', () => {
            const state = blockvalidationStrategy.getInitialState();
            expect(state.blockGrid).toEqual([]);
        });
    });

    describe('generateGrid', () => {
        test('generates 25 numbers', () => {
            const mockShuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);
            const grid = blockvalidationStrategy.generateGrid(mockShuffle);
            expect(grid.length).toBe(25);
        });

        test('contains numbers 1-25', () => {
            const mockShuffle = (arr) => arr;
            const grid = blockvalidationStrategy.generateGrid(mockShuffle);
            for (let i = 1; i <= 25; i++) {
                expect(grid).toContain(i);
            }
        });
    });

    describe('setup', () => {
        test('initializes game state correctly', () => {
            const context = {
                updateGameState: jest.fn(),
                setPhase: jest.fn(),
                setStatus: jest.fn(),
                secureShuffleArray: (arr) => arr,
                secureLog: { info: jest.fn(), warn: jest.fn() }
            };

            blockvalidationStrategy.setup(context);

            expect(context.updateGameState).toHaveBeenCalled();
            expect(context.setPhase).toHaveBeenCalledWith(GAME_PHASES.SPIN);
            expect(context.setStatus).toHaveBeenCalledWith(GAME_STATUS.SPIN);
        });

        test('generates grid with 25 numbers', () => {
            let capturedState;
            const context = {
                updateGameState: jest.fn((state) => { capturedState = state; }),
                setPhase: jest.fn(),
                setStatus: jest.fn(),
                secureShuffleArray: (arr) => arr,
                secureLog: { info: jest.fn(), warn: jest.fn() }
            };

            blockvalidationStrategy.setup(context);
            expect(capturedState.blockGrid.length).toBe(25);
        });
    });

    describe('handlers.handleCellClick', () => {
        const createContext = (gameState) => ({
            gameState: {
                blockState: 'playing',
                blockNextTarget: 1,
                blockErrors: 0,
                blockStartTime: 1000,
                blockTimestamps: [],
                ...gameState
            },
            updateGameState: jest.fn(),
            setResult: jest.fn(),
            finishGame: jest.fn(),
            secureRandomInt: jest.fn(() => 10000),
            secureLog: { info: jest.fn(), warn: jest.fn() }
        });

        test('ignores click during countdown', () => {
            const context = createContext({ blockState: 'countdown' });
            blockvalidationStrategy.handlers.handleCellClick(1, context);
            expect(context.updateGameState).not.toHaveBeenCalled();
        });

        test('ignores invalid numbers', () => {
            const context = createContext({});
            blockvalidationStrategy.handlers.handleCellClick(0, context);
            expect(context.updateGameState).not.toHaveBeenCalled();
        });

        test('ignores numbers > 25', () => {
            const context = createContext({});
            blockvalidationStrategy.handlers.handleCellClick(26, context);
            expect(context.updateGameState).not.toHaveBeenCalled();
        });

        test('correct click advances target', () => {
            const context = createContext({ blockNextTarget: 1 });
            blockvalidationStrategy.handlers.handleCellClick(1, context);
            expect(context.updateGameState).toHaveBeenCalled();
        });

        test('wrong click increases errors', () => {
            const context = createContext({ blockNextTarget: 5 });
            blockvalidationStrategy.handlers.handleCellClick(3, context);
            expect(context.updateGameState).toHaveBeenCalled();
        });

        test('clicking 25 as last target finishes game', () => {
            const context = createContext({ blockNextTarget: 25, blockErrors: 0 });
            blockvalidationStrategy.handlers.handleCellClick(25, context);
            expect(context.finishGame).toHaveBeenCalled();
            expect(context.setResult).toHaveBeenCalled();
        });
    });

    describe('handlers.handleTimeLimit', () => {
        const createContext = (gameState) => ({
            gameState: {
                blockState: 'playing',
                blockNextTarget: 10,
                blockErrors: 2,
                blockStartTime: 1000,
                blockTimestamps: [1500, 2000, 3000],
                ...gameState
            },
            updateGameState: jest.fn(),
            setResult: jest.fn(),
            finishGame: jest.fn(),
            secureRandomInt: jest.fn(() => 10),
            secureLog: { info: jest.fn(), warn: jest.fn() }
        });

        test('ignores if not playing', () => {
            const context = createContext({ blockState: 'countdown' });
            blockvalidationStrategy.handlers.handleTimeLimit(context);
            expect(context.finishGame).not.toHaveBeenCalled();
        });

        test('handles timeout correctly', () => {
            const context = createContext({});
            blockvalidationStrategy.handlers.handleTimeLimit(context);
            expect(context.finishGame).toHaveBeenCalled();
            expect(context.setResult).toHaveBeenCalled();
        });

        test('handles zero progress edge case', () => {
            const context = createContext({ blockNextTarget: 1, blockTimestamps: [] });
            blockvalidationStrategy.handlers.handleTimeLimit(context);
            expect(context.finishGame).toHaveBeenCalled();
        });
    });

    describe('constants', () => {
        test('exports COUNTDOWN_SECONDS', () => {
            expect(blockvalidationStrategy.COUNTDOWN_SECONDS).toBeDefined();
            expect(typeof blockvalidationStrategy.COUNTDOWN_SECONDS).toBe('number');
        });

        test('exports TIME_LIMIT_SECONDS', () => {
            expect(blockvalidationStrategy.TIME_LIMIT_SECONDS).toBeDefined();
            expect(typeof blockvalidationStrategy.TIME_LIMIT_SECONDS).toBe('number');
        });
    });
});
