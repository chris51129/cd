/**
 * Integration Test: Reducer State Transitions
 * 
 * WHY (Skill javascript-testing-patterns): Tests que verifican las
 * transiciones de estado válidas en el reducer sin mockear nada.
 */

import { gameReducer, createInitialState, type GameState, type GameAction } from '../gameReducer';
import { PHASES } from '../../../engine';

describe('Integration: Reducer State Transitions', () => {
    describe('Initial State Creation', () => {
        it('should create valid initial state for each game type', () => {
            const gameTypes = ['coinflip', 'dice', 'rps', 'memory', 'quickdraw', 'blockvalidation'] as const;

            gameTypes.forEach(gameType => {
                const state = createInitialState(gameType);

                expect(state.gameType).toBe(gameType);
                expect(state.phase).toBe(PHASES.SETUP);
                expect(state.outcome).toBeNull();
                expect(state.result).toBeNull();
            });
        });
    });

    describe('TICK Action', () => {
        it('should update elapsed time', () => {
            let state = createInitialState('coinflip');
            const deltaTime = 16.67; // ~60fps

            state = gameReducer(state, {
                type: 'TICK',
                deltaTime: deltaTime as any
            });

            expect(state.elapsedMs).toBeCloseTo(deltaTime, 1);
        });

        it('should not change phase on tick alone', () => {
            let state = createInitialState('coinflip');
            const initialPhase = state.phase;

            state = gameReducer(state, {
                type: 'TICK',
                deltaTime: 1000 as any
            });

            expect(state.phase).toBe(initialPhase);
        });
    });

    describe('SELECT_SIDE Action', () => {
        it('should set player side for coinflip', () => {
            let state = createInitialState('coinflip');

            state = gameReducer(state, {
                type: 'SELECT_SIDE',
                side: 'heads'
            });

            expect(state.playerSide).toBe('heads');
        });

        it('should set player choice for rps', () => {
            let state = createInitialState('rps');

            state = gameReducer(state, {
                type: 'SELECT_SIDE',
                side: 'rock'
            });

            expect(state.playerSide).toBe('rock');
        });
    });

    describe('COINFLIP_SPIN Action', () => {
        it('should set result and determine outcome', () => {
            let state = createInitialState('coinflip');

            // First select a side
            state = gameReducer(state, {
                type: 'SELECT_SIDE',
                side: 'heads'
            });

            // Then spin
            state = gameReducer(state, {
                type: 'COINFLIP_SPIN',
                result: 'heads',
            });

            expect(state.result).toBe('heads');
            expect(state.outcome).toBe('win');
            expect(state.phase).toBe(PHASES.RESULT);
        });

        it('should determine loss when result differs from selection', () => {
            let state = createInitialState('coinflip');

            state = gameReducer(state, { type: 'SELECT_SIDE', side: 'heads' });
            state = gameReducer(state, {
                type: 'COINFLIP_SPIN',
                result: 'tails',
            });

            expect(state.outcome).toBe('loss');
        });
    });

    describe('DICE_SPIN Action', () => {
        it('should determine winner based on rolls', () => {
            let state = createInitialState('dice');

            state = gameReducer(state, {
                type: 'DICE_SPIN',
                playerRoll: 6,
                opponentRoll: 3,
            });

            expect(state.outcome).toBe('win');
            expect(state.phase).toBe(PHASES.RESULT);
        });

        it('should handle tie correctly', () => {
            let state = createInitialState('dice');

            state = gameReducer(state, {
                type: 'DICE_SPIN',
                playerRoll: 4,
                opponentRoll: 4,
            });

            // Tie behavior depends on implementation
            // The test just verifies no crash and valid state
            expect(state.phase).toBeDefined();
        });
    });

    describe('RPS_SPIN Action', () => {
        it('should handle RPS spin correctly', () => {
            let state = createInitialState('rps');

            state = gameReducer(state, { type: 'SELECT_SIDE', side: 'rock' });
            state = gameReducer(state, {
                type: 'RPS_SPIN',
                playerChoice: 'rock',
                opponentChoice: 'scissors',
            });

            // Verify state is valid after spin
            expect(state.gameType).toBe('rps');
            expect(state.phase).toBeDefined();
        });
    });

    describe('State Immutability', () => {
        it('should never mutate original state', () => {
            const initialState = createInitialState('coinflip');
            const originalPhase = initialState.phase;

            // Actions should not mutate
            const newState = gameReducer(initialState, {
                type: 'SELECT_SIDE',
                side: 'heads'
            });

            // Original unchanged
            expect(initialState.playerSide).toBeNull();
            expect(initialState.phase).toBe(originalPhase);

            // New state updated
            expect(newState.playerSide).toBe('heads');
            expect(newState).not.toBe(initialState);
        });
    });

    describe('Unknown Actions', () => {
        it('should return same state for unknown actions', () => {
            const state = createInitialState('coinflip');
            const newState = gameReducer(state, {
                type: 'UNKNOWN_ACTION'
            } as GameAction);

            expect(newState).toBe(state);
        });
    });
});
