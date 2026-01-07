/**
 * Tests for memory.strategy.js
 */
import memoryStrategy, { MEMORY_ICONS } from './memory.strategy';
import { GAME_PHASES, GAME_STATUS } from './gameStrategy';

describe('memoryStrategy', () => {
    test('has correct type', () => {
        expect(memoryStrategy.type).toBe('memory');
    });

    test('MEMORY_ICONS has 8 crypto icons', () => {
        expect(MEMORY_ICONS).toHaveLength(8);
    });

    describe('getInitialState', () => {
        test('returns initial state with empty board', () => {
            const state = memoryStrategy.getInitialState();
            expect(state.board).toEqual([]);
            expect(state.flippedIndices).toEqual([]);
            expect(state.matchedIndices).toEqual([]);
            expect(state.memoryScores).toEqual({ player: 0, opponent: 0 });
            expect(state.timeLeft).toBe(30);
            expect(state.memoryPhase).toBe('memorize');
            expect(state.memorizePhaseNumber).toBe(1);
            expect(state.memorizeTimeLeft).toBe(2.5);
            expect(state.revealedIndices).toEqual([]);
        });
    });

    describe('generateBoard', () => {
        test('generates 16-card board', () => {
            const secureShuffleArray = jest.fn(arr => arr);
            const board = memoryStrategy.generateBoard(secureShuffleArray);
            expect(board).toHaveLength(16);
        });

        test('shuffles the board', () => {
            const secureShuffleArray = jest.fn(arr => [...arr].reverse());
            memoryStrategy.generateBoard(secureShuffleArray);
            expect(secureShuffleArray).toHaveBeenCalled();
        });
    });

    describe('setup', () => {
        test('initializes game state correctly', () => {
            const updateGameState = jest.fn();
            const setPhase = jest.fn();
            const setStatus = jest.fn();
            const secureShuffleArray = jest.fn(arr => arr);
            const secureRandomInt = jest.fn((min, max) => min); // Devuelve siempre el mínimo
            const secureLog = { info: jest.fn() };

            const context = {
                updateGameState,
                setPhase,
                setStatus,
                secureShuffleArray,
                secureRandomInt,
                secureLog
            };

            memoryStrategy.setup(context);

            expect(updateGameState).toHaveBeenCalledWith(expect.objectContaining({
                flippedIndices: [],
                matchedIndices: [],
                memoryPhase: 'memorize',
                memorizePhaseNumber: 1,
                memorizeTimeLeft: 2.5
            }));
            // Debe tener revealedIndices con 4 elementos
            const callArg = updateGameState.mock.calls[0][0];
            expect(callArg.revealedIndices).toHaveLength(4);
            expect(setPhase).toHaveBeenCalledWith(GAME_PHASES.SPIN);
            expect(setStatus).toHaveBeenCalledWith(GAME_STATUS.SPIN);
        });
    });

    describe('spin', () => {
        test('does nothing (timer managed externally)', () => {
            expect(() => memoryStrategy.spin()).not.toThrow();
        });
    });

    describe('checkTimeUp', () => {
        test('returns false when time is not up', () => {
            const context = {
                gameState: { timeLeft: 10, memoryScores: { player: 3, opponent: 2 } },
                finishGame: jest.fn()
            };

            const result = memoryStrategy.checkTimeUp(context);
            expect(result).toBe(false);
            expect(context.finishGame).not.toHaveBeenCalled();
        });

        test('finishes game and returns true when time is 0', () => {
            const finishGame = jest.fn();
            const scores = { player: 5, opponent: 3 };
            const context = {
                gameState: { timeLeft: 0, memoryScores: scores },
                finishGame
            };

            const result = memoryStrategy.checkTimeUp(context);
            expect(result).toBe(true);
            expect(finishGame).toHaveBeenCalledWith(true, scores);
        });

        test('player loses when opponent has more pairs', () => {
            const finishGame = jest.fn();
            const scores = { player: 2, opponent: 5 };
            const context = {
                gameState: { timeLeft: 0, memoryScores: scores },
                finishGame
            };

            memoryStrategy.checkTimeUp(context);
            expect(finishGame).toHaveBeenCalledWith(false, scores);
        });
    });

    describe('handlers.handleCardClick', () => {
        test('returns false for invalid index', () => {
            const context = {
                gameState: { phase: GAME_PHASES.SPIN },
                updateGameState: jest.fn()
            };
            const refs = {
                isProcessingRef: { current: false },
                lastClickTimeRef: { current: 0 }
            };

            const result = memoryStrategy.handlers.handleCardClick('invalid', context, refs);
            expect(result).toBe(false);
        });

        test('returns false for out of range index', () => {
            const context = {
                gameState: { phase: GAME_PHASES.SPIN },
                updateGameState: jest.fn()
            };
            const refs = {
                isProcessingRef: { current: false },
                lastClickTimeRef: { current: 0 }
            };

            expect(memoryStrategy.handlers.handleCardClick(-1, context, refs)).toBe(false);
            expect(memoryStrategy.handlers.handleCardClick(16, context, refs)).toBe(false);
        });

        test('returns false when processing', () => {
            const context = {
                gameState: { phase: GAME_PHASES.SPIN },
                updateGameState: jest.fn()
            };
            const refs = {
                isProcessingRef: { current: true },
                lastClickTimeRef: { current: 0 }
            };

            const result = memoryStrategy.handlers.handleCardClick(5, context, refs);
            expect(result).toBe(false);
        });

        test('returns false when click is too fast (rate limiting)', () => {
            const context = {
                gameState: { phase: GAME_PHASES.SPIN },
                updateGameState: jest.fn()
            };
            const refs = {
                isProcessingRef: { current: false },
                lastClickTimeRef: { current: Date.now() } // Just clicked
            };

            const result = memoryStrategy.handlers.handleCardClick(5, context, refs);
            expect(result).toBe(false);
        });

        test('calls updateGameState for valid click', () => {
            const updateGameState = jest.fn();
            const context = {
                gameState: {
                    phase: GAME_PHASES.SPIN,
                    memoryPhase: 'playing',
                    timeLeft: 20,
                    matchedIndices: [],
                    flippedIndices: [],
                    board: [0, 1, 2, 3, 4, 5, 6, 7, 0, 1, 2, 3, 4, 5, 6, 7]
                },
                updateGameState
            };
            const refs = {
                isProcessingRef: { current: false },
                lastClickTimeRef: { current: 0 }
            };

            memoryStrategy.handlers.handleCardClick(5, context, refs);
            expect(updateGameState).toHaveBeenCalled();
        });
    });
});
