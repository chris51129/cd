/**
 * Comprehensive tests for QuickDraw Strategy
 * Testing behavior without tight coupling to implementation
 */
import { quickdrawStrategy } from './quickdraw.strategy';
import { GAME_PHASES, GAME_STATUS } from './gameStrategy';

describe('quickdrawStrategy', () => {
    describe('getInitialState', () => {
        test('returns initial state object', () => {
            const state = quickdrawStrategy.getInitialState();
            expect(state).toHaveProperty('quickDrawState');
            expect(state).toHaveProperty('countdownLeft');
        });

        test('starts in countdown state', () => {
            const state = quickdrawStrategy.getInitialState();
            expect(state.quickDrawState).toBe('countdown');
        });

        test('has default countdown value', () => {
            const state = quickdrawStrategy.getInitialState();
            expect(state.countdownLeft).toBeGreaterThan(0);
        });
    });

    describe('setup', () => {
        test('initializes game state correctly', () => {
            const context = {
                updateGameState: jest.fn(),
                setPhase: jest.fn(),
                setStatus: jest.fn(),
                secureLog: { info: jest.fn(), warn: jest.fn() }
            };

            quickdrawStrategy.setup(context);

            expect(context.updateGameState).toHaveBeenCalled();
            expect(context.setPhase).toHaveBeenCalledWith(GAME_PHASES.SPIN);
            expect(context.setStatus).toHaveBeenCalledWith(GAME_STATUS.SPIN);
        });
    });

    describe('handlers.handleClick', () => {
        const createContext = (gameState) => ({
            gameState: {
                quickDrawState: 'waiting',
                hasPenalty: false,
                startTime: 1000,
                ...gameState
            },
            updateGameState: jest.fn(),
            setResult: jest.fn(),
            finishGame: jest.fn(),
            secureRandomInt: jest.fn(() => 300),
            secureLog: { info: jest.fn(), warn: jest.fn() }
        });

        test('ignores click during countdown', () => {
            const context = createContext({ quickDrawState: 'countdown' });
            quickdrawStrategy.handlers.handleClick(context);
            expect(context.updateGameState).not.toHaveBeenCalled();
        });

        test('ignores click during result', () => {
            const context = createContext({ quickDrawState: 'result' });
            quickdrawStrategy.handlers.handleClick(context);
            expect(context.finishGame).not.toHaveBeenCalled();
        });

        test('sets penalty on false start', () => {
            const context = createContext({ quickDrawState: 'waiting', hasPenalty: false });
            quickdrawStrategy.handlers.handleClick(context);
            expect(context.updateGameState).toHaveBeenCalledWith({ hasPenalty: true });
        });

        test('does not set second penalty', () => {
            const context = createContext({ quickDrawState: 'waiting', hasPenalty: true });
            quickdrawStrategy.handlers.handleClick(context);
            expect(context.updateGameState).not.toHaveBeenCalled();
        });

        test('finishes game on valid click during signal', () => {
            const context = createContext({ quickDrawState: 'signal' });
            quickdrawStrategy.handlers.handleClick(context);
            expect(context.finishGame).toHaveBeenCalled();
            expect(context.setResult).toHaveBeenCalled();
        });
    });

    describe('handlers.handleSignalTimeout', () => {
        const createContext = (gameState) => ({
            gameState: {
                quickDrawState: 'signal',
                hasPenalty: false,
                reactionTime: null,
                ...gameState
            },
            updateGameState: jest.fn(),
            setResult: jest.fn(),
            finishGame: jest.fn(),
            secureRandomInt: jest.fn(() => 0),
            secureLog: { info: jest.fn(), warn: jest.fn() }
        });

        test('ignores if not in signal state', () => {
            const context = createContext({ quickDrawState: 'waiting' });
            quickdrawStrategy.handlers.handleSignalTimeout(context);
            expect(context.finishGame).not.toHaveBeenCalled();
        });

        test('handles timeout correctly', () => {
            const context = createContext({});
            quickdrawStrategy.handlers.handleSignalTimeout(context);
            expect(context.finishGame).toHaveBeenCalled();
        });
    });

    describe('constants', () => {
        test('exports COUNTDOWN_SECONDS', () => {
            expect(quickdrawStrategy.COUNTDOWN_SECONDS).toBeDefined();
            expect(typeof quickdrawStrategy.COUNTDOWN_SECONDS).toBe('number');
        });
    });
});
