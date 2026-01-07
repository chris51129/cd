/**
 * Tests for coinflip.strategy.js
 */
import coinflipStrategy from './coinflip.strategy';
import { GAME_PHASES } from './gameStrategy';

describe('coinflipStrategy', () => {
    test('has correct type', () => {
        expect(coinflipStrategy.type).toBe('coinflip');
    });

    describe('getInitialState', () => {
        test('returns initial state object', () => {
            const state = coinflipStrategy.getInitialState();
            expect(state).toHaveProperty('selectionTimeLeft');
            expect(state.selectionTimeLeft).toBe(10);
        });
    });

    describe('setup', () => {
        test('sets phase to SELECTION and assigns chooser role', () => {
            const setIsChooser = jest.fn();
            const setPhase = jest.fn();
            const secureLog = { info: jest.fn() };
            const secureRandomInt = jest.fn(() => 1);

            const context = {
                secureRandomInt,
                setIsChooser,
                setPhase,
                secureLog,
                updateGameState: jest.fn()
            };

            coinflipStrategy.setup(context, {});

            expect(setPhase).toHaveBeenCalledWith(GAME_PHASES.SELECTION);
            expect(setIsChooser).toHaveBeenCalled();
        });

        test('assigns random chooser role', () => {
            const setIsChooser = jest.fn();
            const secureRandomInt = jest.fn(() => 0);

            const context = {
                secureRandomInt,
                setIsChooser,
                setPhase: jest.fn(),
                secureLog: { info: jest.fn() },
                updateGameState: jest.fn()
            };

            coinflipStrategy.setup(context, {});
            expect(setIsChooser).toHaveBeenCalledWith(false);

            secureRandomInt.mockReturnValue(1);
            coinflipStrategy.setup(context, {});
            expect(setIsChooser).toHaveBeenCalledWith(true);
        });
    });

    describe('spin', () => {
        test('determines winner when player selects heads and result is heads', () => {
            const finishGame = jest.fn();
            const setResult = jest.fn();
            const secureRandomInt = jest.fn(() => 1); // 1 = heads

            const context = {
                playerSide: 'heads',
                finishGame,
                setResult,
                secureRandomInt
            };

            coinflipStrategy.spin(context);

            expect(setResult).toHaveBeenCalledWith('heads');
            expect(finishGame).toHaveBeenCalledWith(true, 'heads');
        });

        test('determines loser when player selects heads and result is tails', () => {
            const finishGame = jest.fn();
            const setResult = jest.fn();
            const secureRandomInt = jest.fn(() => 0); // 0 = tails

            const context = {
                playerSide: 'heads',
                finishGame,
                setResult,
                secureRandomInt
            };

            coinflipStrategy.spin(context);

            expect(setResult).toHaveBeenCalledWith('tails');
            expect(finishGame).toHaveBeenCalledWith(false, 'tails');
        });

        test('determines winner when player selects tails and result is tails', () => {
            const finishGame = jest.fn();
            const setResult = jest.fn();
            const secureRandomInt = jest.fn(() => 0); // 0 = tails

            const context = {
                playerSide: 'tails',
                finishGame,
                setResult,
                secureRandomInt
            };

            coinflipStrategy.spin(context);

            expect(setResult).toHaveBeenCalledWith('tails');
            expect(finishGame).toHaveBeenCalledWith(true, 'tails');
        });
    });

    describe('autoSelect', () => {
        test('returns random choice heads or tails', () => {
            const secureRandomInt = jest.fn(() => 1);
            const secureLog = { warn: jest.fn() };

            const context = { secureRandomInt, secureLog };

            const choice = coinflipStrategy.autoSelect(context);
            expect(['heads', 'tails']).toContain(choice);
        });

        test('logs warning when auto-selecting', () => {
            const secureLog = { warn: jest.fn() };
            const context = {
                secureRandomInt: () => 0,
                secureLog
            };

            coinflipStrategy.autoSelect(context);
            expect(secureLog.warn).toHaveBeenCalled();
        });
    });

    describe('handlers', () => {
        test('handlers object exists', () => {
            expect(coinflipStrategy.handlers).toBeDefined();
            expect(typeof coinflipStrategy.handlers).toBe('object');
        });
    });
});
