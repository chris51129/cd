/**
 * Tests for dice.strategy.js
 */
import diceStrategy from './dice.strategy';
import { GAME_PHASES } from './gameStrategy';

describe('diceStrategy', () => {
    test('has correct type', () => {
        expect(diceStrategy.type).toBe('dice');
    });

    describe('getInitialState', () => {
        test('returns initial state', () => {
            const state = diceStrategy.getInitialState();
            expect(state).toBeDefined();
        });
    });

    describe('setup', () => {
        test('sets phase to SPIN', () => {
            const setPhase = jest.fn();
            const setStatus = jest.fn();
            const setIsChooser = jest.fn();
            const secureRandomInt = jest.fn(() => 1);
            const secureLog = { info: jest.fn() };

            const context = {
                setPhase,
                setStatus,
                setIsChooser,
                secureRandomInt,
                secureLog,
                updateGameState: jest.fn()
            };

            diceStrategy.setup(context, {});

            expect(setPhase).toHaveBeenCalledWith(GAME_PHASES.SPIN);
        });
    });

    describe('spin', () => {
        test('generates dice rolls and determines winner', () => {
            const finishGame = jest.fn();
            const setResult = jest.fn();
            let callCount = 0;
            // First call returns 5 (player), second returns 2 (opponent)
            const secureRandomInt = jest.fn(() => {
                callCount++;
                return callCount === 1 ? 5 : 2;
            });

            const context = {
                finishGame,
                setResult,
                secureRandomInt
            };

            diceStrategy.spin(context);

            expect(setResult).toHaveBeenCalled();
            expect(finishGame).toHaveBeenCalled();
        });

        test('player wins when roll is higher', () => {
            const finishGame = jest.fn();
            const setResult = jest.fn();
            let callCount = 0;
            const secureRandomInt = jest.fn(() => {
                callCount++;
                return callCount === 1 ? 6 : 1;
            });

            const context = {
                finishGame,
                setResult,
                secureRandomInt
            };

            diceStrategy.spin(context);

            expect(finishGame).toHaveBeenCalledWith(true, expect.objectContaining({
                player: 6,
                opponent: 1
            }));
        });

        test('player loses when roll is lower', () => {
            const finishGame = jest.fn();
            const setResult = jest.fn();
            let callCount = 0;
            const secureRandomInt = jest.fn(() => {
                callCount++;
                return callCount === 1 ? 1 : 6;
            });

            const context = {
                finishGame,
                setResult,
                secureRandomInt
            };

            diceStrategy.spin(context);

            expect(finishGame).toHaveBeenCalledWith(false, expect.objectContaining({
                player: 1,
                opponent: 6
            }));
        });

        test('handles tie by re-rolling', () => {
            const finishGame = jest.fn();
            const setResult = jest.fn();
            let callCount = 0;
            // First two calls are tie (3, 3), then (5, 2) - player wins
            const secureRandomInt = jest.fn(() => {
                callCount++;
                if (callCount <= 2) return 3;
                return callCount === 3 ? 5 : 2;
            });

            const context = {
                finishGame,
                setResult,
                secureRandomInt
            };

            diceStrategy.spin(context);

            // Should have been called multiple times for re-roll
            expect(secureRandomInt.mock.calls.length).toBeGreaterThan(2);
        });
    });

    describe('handlers', () => {
        test('handlers object exists', () => {
            expect(diceStrategy.handlers).toBeDefined();
        });
    });
});
