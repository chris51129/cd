/**
 * Tests for rps.strategy.js (Rock-Paper-Scissors)
 */
import rpsStrategy from './rps.strategy';
import { GAME_PHASES, OUTCOMES } from './gameStrategy';

describe('rpsStrategy', () => {
    beforeEach(() => {
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    test('has correct type', () => {
        expect(rpsStrategy.type).toBe('rps');
    });

    describe('getInitialState', () => {
        test('returns initial state with drawCount 0', () => {
            const state = rpsStrategy.getInitialState();
            expect(state.drawCount).toBe(0);
            expect(state.selectionTimeLeft).toBe(10);
            expect(state.rpsResult).toBeNull();
        });
    });

    describe('setup', () => {
        test('sets player as chooser and phase to SELECTION', () => {
            const setIsChooser = jest.fn();
            const setPhase = jest.fn();
            const updateGameState = jest.fn();
            const secureLog = { info: jest.fn() };

            const context = {
                setIsChooser,
                setPhase,
                updateGameState,
                secureLog
            };

            rpsStrategy.setup(context, {});

            expect(setIsChooser).toHaveBeenCalledWith(true);
            expect(setPhase).toHaveBeenCalledWith(GAME_PHASES.SELECTION);
            expect(updateGameState).toHaveBeenCalledWith(expect.objectContaining({
                drawCount: 0
            }));
        });
    });

    describe('determineOutcome', () => {
        test('rock beats scissors', () => {
            expect(rpsStrategy.determineOutcome('rock', 'scissors')).toBe(OUTCOMES.WIN);
        });

        test('scissors beats paper', () => {
            expect(rpsStrategy.determineOutcome('scissors', 'paper')).toBe(OUTCOMES.WIN);
        });

        test('paper beats rock', () => {
            expect(rpsStrategy.determineOutcome('paper', 'rock')).toBe(OUTCOMES.WIN);
        });

        test('rock loses to paper', () => {
            expect(rpsStrategy.determineOutcome('rock', 'paper')).toBe(OUTCOMES.LOSS);
        });

        test('scissors loses to rock', () => {
            expect(rpsStrategy.determineOutcome('scissors', 'rock')).toBe(OUTCOMES.LOSS);
        });

        test('paper loses to scissors', () => {
            expect(rpsStrategy.determineOutcome('paper', 'scissors')).toBe(OUTCOMES.LOSS);
        });

        test('same choices = draw', () => {
            expect(rpsStrategy.determineOutcome('rock', 'rock')).toBe(OUTCOMES.DRAW);
            expect(rpsStrategy.determineOutcome('paper', 'paper')).toBe(OUTCOMES.DRAW);
            expect(rpsStrategy.determineOutcome('scissors', 'scissors')).toBe(OUTCOMES.DRAW);
        });
    });

    describe('spin', () => {
        test('handles win outcome', () => {
            const finishGame = jest.fn();
            const setResult = jest.fn();
            const updateGameState = jest.fn();
            const secureLog = { info: jest.fn() };
            // Return 2 = scissors for opponent, player has rock = win
            const secureRandomInt = jest.fn(() => 2);

            const context = {
                gameState: { drawCount: 0 },
                playerSide: 'rock',
                finishGame,
                setResult,
                updateGameState,
                secureRandomInt,
                secureLog
            };

            rpsStrategy.spin(context);

            expect(setResult).toHaveBeenCalled();
            expect(updateGameState).toHaveBeenCalled();
        });

        test('handles loss outcome', () => {
            const finishGame = jest.fn();
            const setResult = jest.fn();
            const updateGameState = jest.fn();
            const secureLog = { info: jest.fn() };
            // Return 1 = paper for opponent, player has rock = loss
            const secureRandomInt = jest.fn(() => 1);

            const context = {
                gameState: { drawCount: 0 },
                playerSide: 'rock',
                finishGame,
                setResult,
                updateGameState,
                secureRandomInt,
                secureLog
            };

            rpsStrategy.spin(context);

            expect(setResult).toHaveBeenCalled();
        });

        test('handles draw outcome and increments drawCount', () => {
            const setResult = jest.fn();
            const updateGameState = jest.fn();
            const secureLog = { info: jest.fn() };
            // Return 0 = rock for opponent, player has rock = draw
            const secureRandomInt = jest.fn(() => 0);

            const context = {
                gameState: { drawCount: 0 },
                playerSide: 'rock',
                finishGame: jest.fn(),
                setResult,
                updateGameState,
                secureRandomInt,
                secureLog
            };

            rpsStrategy.spin(context);

            expect(updateGameState).toHaveBeenCalledWith(expect.objectContaining({
                drawCount: 1,
                outcome: 'draw'
            }));
        });

        test('auto-resolves after MAX_DRAW_ROUNDS', () => {
            const finishGame = jest.fn();
            const setResult = jest.fn();
            const secureLog = { warn: jest.fn() };
            let callCount = 0;
            // Alternate between choices to ensure non-draw
            const secureRandomInt = jest.fn(() => {
                callCount++;
                return callCount % 3;
            });

            const context = {
                gameState: { drawCount: 5 }, // At max draws
                playerSide: 'rock',
                finishGame,
                setResult,
                updateGameState: jest.fn(),
                secureRandomInt,
                secureLog
            };

            rpsStrategy.spin(context);

            expect(secureLog.warn).toHaveBeenCalled();
            expect(finishGame).toHaveBeenCalled();
        });
    });

    describe('autoSelect', () => {
        test('returns random RPS choice', () => {
            const secureRandomInt = jest.fn(() => 0);
            const secureLog = { warn: jest.fn() };

            const context = { secureRandomInt, secureLog };

            const choice = rpsStrategy.autoSelect(context);
            expect(['rock', 'paper', 'scissors']).toContain(choice);
        });
    });

    describe('constants', () => {
        test('exports SELECTION_TIMEOUT_MS', () => {
            expect(rpsStrategy.SELECTION_TIMEOUT_MS).toBeDefined();
            expect(rpsStrategy.SELECTION_TIMEOUT_MS).toBeGreaterThan(0);
        });

        test('exports MAX_DRAW_ROUNDS', () => {
            expect(rpsStrategy.MAX_DRAW_ROUNDS).toBeDefined();
            expect(rpsStrategy.MAX_DRAW_ROUNDS).toBe(5);
        });
    });
});
