/**
 * Property-Based Tests for gameReducer
 * 
 * WHY (Protocolo Omega §4.1): PBT descubre edge cases que tests de ejemplo pierden.
 * Cada propiedad se ejecuta con ~100 casos aleatorios por defecto.
 * 
 * INVARIANTS TESTED:
 * 1. timeLeft nunca es negativo
 * 2. Transiciones son deterministas
 * 3. Scores nunca exceden máximo (8)
 * 4. INIT resetea al estado inicial
 * 5. FINISH_GAME produce phase === 'result'
 * 6. flippedIndices.length <= 2
 * 7. board.length === 16 para memory
 * 8. blockNextTarget se incrementa correctamente
 */

import fc from 'fast-check';
import { gameReducer, createInitialState, type GameState } from './gameReducer';
import { PHASES, OUTCOMES } from '../../engine';
import {
    arbGameState,
    arbGameAction,
    arbMilliseconds,
    arbGameType,
    arbMemoryGameState,
    arbBoardIndex,
} from './arbitraries';

// ============================================
// Test Configuration
// ============================================

const PBT_CONFIG = {
    numRuns: 100,  // Balance between coverage and speed
    verbose: false,
};

// ============================================
// Invariant 1: timeLeft nunca negativo
// ============================================

describe('Invariant: timeLeft >= 0', () => {
    it('TICK never produces negative timeLeft for memory game', () => {
        fc.assert(
            fc.property(
                fc.integer({ min: 0, max: 60 }),
                arbMilliseconds(),
                (initialTimeLeft, deltaTime) => {
                    const state: GameState = {
                        ...createInitialState('memory'),
                        timeLeft: initialTimeLeft,
                        memoryPhase: 'playing',
                        phase: PHASES.SPIN,
                    };
                    const newState = gameReducer(state, { type: 'TICK', deltaTime });
                    return newState.timeLeft >= 0;
                }
            ),
            PBT_CONFIG
        );
    });

    it('TICK never produces negative selectionTimeLeft', () => {
        fc.assert(
            fc.property(
                fc.integer({ min: 0, max: 15 }),
                arbMilliseconds(),
                (initialTimeLeft, deltaTime) => {
                    const state: GameState = {
                        ...createInitialState('coinflip'),
                        selectionTimeLeft: initialTimeLeft,
                        phase: PHASES.SELECTION,
                    };
                    const newState = gameReducer(state, { type: 'TICK', deltaTime });
                    return newState.selectionTimeLeft >= 0;
                }
            ),
            PBT_CONFIG
        );
    });

    it('TICK never produces negative memorizeTimeLeft', () => {
        fc.assert(
            fc.property(
                fc.float({ min: 0, max: 5 }),
                arbMilliseconds(),
                (initialTimeLeft, deltaTime) => {
                    const state: GameState = {
                        ...createInitialState('memory'),
                        memorizeTimeLeft: initialTimeLeft,
                        memoryPhase: 'memorize',
                        phase: PHASES.SPIN,
                    };
                    const newState = gameReducer(state, { type: 'TICK', deltaTime });
                    return newState.memorizeTimeLeft >= 0;
                }
            ),
            PBT_CONFIG
        );
    });
});

// ============================================
// Invariant 2: Determinismo
// ============================================

describe('Invariant: Determinism', () => {
    it('same state + same action = same result', () => {
        fc.assert(
            fc.property(
                arbGameState(),
                arbGameAction(),
                (state, action) => {
                    const result1 = gameReducer(state, action);
                    const result2 = gameReducer(state, action);
                    // Compare serialized to avoid reference issues
                    return JSON.stringify(result1) === JSON.stringify(result2);
                }
            ),
            PBT_CONFIG
        );
    });
});

// ============================================
// Invariant 3: Scores <= 8
// ============================================

describe('Invariant: Scores bounded', () => {
    it('memoryScores.player never exceeds 8 after CARD_CLICK', () => {
        fc.assert(
            fc.property(
                fc.integer({ min: 0, max: 8 }),
                arbBoardIndex(),
                (initialScore, index) => {
                    const state: GameState = {
                        ...createInitialState('memory'),
                        memoryScores: { player: initialScore, opponent: 0 },
                        phase: PHASES.SPIN,
                        memoryPhase: 'playing',
                        timeLeft: 30,
                        board: [0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7],
                    };
                    const newState = gameReducer(state, { type: 'CARD_CLICK', index });
                    return newState.memoryScores.player <= 8;
                }
            ),
            PBT_CONFIG
        );
    });

    it('memoryScores.opponent never exceeds 8 after OPPONENT_MATCH', () => {
        fc.assert(
            fc.property(
                fc.integer({ min: 0, max: 8 }),
                (initialScore) => {
                    const state: GameState = {
                        ...createInitialState('memory'),
                        memoryScores: { player: 0, opponent: initialScore },
                    };
                    const newState = gameReducer(state, { type: 'OPPONENT_MATCH' });
                    return newState.memoryScores.opponent <= 8;
                }
            ),
            PBT_CONFIG
        );
    });
});

// ============================================
// Invariant 4: INIT resetea estado
// ============================================

describe('Invariant: INIT resets state', () => {
    it('INIT produces initial state for game type', () => {
        fc.assert(
            fc.property(
                arbGameState(),
                arbGameType(),
                (_, gameType) => {
                    const initial = createInitialState(gameType);
                    const result = gameReducer(createInitialState('coinflip'), { type: 'INIT', gameType });
                    return result.gameType === gameType &&
                        result.phase === initial.phase &&
                        result.outcome === null;
                }
            ),
            PBT_CONFIG
        );
    });
});

// ============================================
// Invariant 5: FINISH_GAME es terminal
// ============================================

describe('Invariant: FINISH_GAME is terminal', () => {
    it('FINISH_GAME always produces phase === result', () => {
        fc.assert(
            fc.property(
                arbGameState(),
                fc.boolean(),
                (state, isWin) => {
                    const newState = gameReducer(state, { type: 'FINISH_GAME', isWin, result: null });
                    return newState.phase === PHASES.RESULT;
                }
            ),
            PBT_CONFIG
        );
    });

    it('FINISH_GAME sets correct outcome', () => {
        fc.assert(
            fc.property(
                arbGameState(),
                fc.boolean(),
                (state, isWin) => {
                    const newState = gameReducer(state, { type: 'FINISH_GAME', isWin, result: null });
                    return isWin
                        ? newState.outcome === OUTCOMES.WIN
                        : newState.outcome === OUTCOMES.LOSS;
                }
            ),
            PBT_CONFIG
        );
    });
});

// ============================================
// Invariant 6: flippedIndices.length <= 2
// ============================================

describe('Invariant: flippedIndices bounded', () => {
    it('CARD_CLICK never produces more than 2 flipped cards', () => {
        fc.assert(
            fc.property(
                arbMemoryGameState(),
                arbBoardIndex(),
                (state, index) => {
                    // Ensure we're in a valid state for clicking
                    const validState: GameState = {
                        ...state,
                        phase: PHASES.SPIN,
                        memoryPhase: 'playing',
                        timeLeft: 30,
                        board: [0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7],
                        flippedIndices: state.flippedIndices.slice(0, 2),
                    };
                    const newState = gameReducer(validState, { type: 'CARD_CLICK', index });
                    return newState.flippedIndices.length <= 2;
                }
            ),
            PBT_CONFIG
        );
    });
});

// ============================================
// Invariant 7: board.length constante
// ============================================

describe('Invariant: board size constant', () => {
    it('CARD_CLICK preserves board length', () => {
        fc.assert(
            fc.property(
                arbMemoryGameState(),
                arbBoardIndex(),
                (state, index) => {
                    const validState: GameState = {
                        ...state,
                        phase: PHASES.SPIN,
                        board: [0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7],
                    };
                    const newState = gameReducer(validState, { type: 'CARD_CLICK', index });
                    return newState.board.length === 16;
                }
            ),
            PBT_CONFIG
        );
    });
});

// ============================================
// Invariant 8: blockNextTarget incrementa correctamente
// ============================================

describe('Invariant: blockNextTarget progression', () => {
    it('correct BLOCK_CELL_CLICK increments target', () => {
        fc.assert(
            fc.property(
                fc.integer({ min: 1, max: 24 }),
                (currentTarget) => {
                    const state: GameState = {
                        ...createInitialState('blockvalidation'),
                        blockNextTarget: currentTarget,
                        blockState: 'playing',
                        phase: PHASES.SPIN,
                    };
                    const newState = gameReducer(state, { type: 'BLOCK_CELL_CLICK', number: currentTarget });
                    return newState.blockNextTarget === currentTarget + 1;
                }
            ),
            PBT_CONFIG
        );
    });

    it('incorrect BLOCK_CELL_CLICK increments errors', () => {
        fc.assert(
            fc.property(
                fc.integer({ min: 1, max: 25 }),
                fc.integer({ min: 1, max: 25 }),
                fc.integer({ min: 0, max: 10 }),
                (currentTarget, clickedNumber, initialErrors) => {
                    if (clickedNumber === currentTarget) return true; // Not applicable

                    const state: GameState = {
                        ...createInitialState('blockvalidation'),
                        blockNextTarget: currentTarget,
                        blockErrors: initialErrors,
                        blockState: 'playing',
                        phase: PHASES.SPIN,
                    };
                    const newState = gameReducer(state, { type: 'BLOCK_CELL_CLICK', number: clickedNumber });
                    return newState.blockErrors === initialErrors + 1;
                }
            ),
            PBT_CONFIG
        );
    });
});

// ============================================
// Edge Case: Invalid actions ignored
// ============================================

describe('Edge cases: Invalid actions', () => {
    it('CARD_CLICK on invalid index is ignored', () => {
        fc.assert(
            fc.property(
                fc.oneof(
                    fc.integer({ min: -100, max: -1 }),
                    fc.integer({ min: 16, max: 100 })
                ),
                (invalidIndex) => {
                    const state: GameState = {
                        ...createInitialState('memory'),
                        phase: PHASES.SPIN,
                        memoryPhase: 'playing',
                        timeLeft: 30,
                        board: [0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7],
                    };
                    const newState = gameReducer(state, { type: 'CARD_CLICK', index: invalidIndex });
                    // State should be unchanged
                    return newState.flippedIndices.length === state.flippedIndices.length;
                }
            ),
            PBT_CONFIG
        );
    });

    it('SELECT_SIDE ignored when in spin or result phase', () => {
        fc.assert(
            fc.property(
                fc.constantFrom(PHASES.SPIN, PHASES.RESULT),
                fc.string(),
                (phase, side) => {
                    const state: GameState = {
                        ...createInitialState('coinflip'),
                        phase: phase as typeof PHASES.SPIN,
                        playerSide: null,
                    };
                    const newState = gameReducer(state, { type: 'SELECT_SIDE', side });
                    // Phase should not change when already in SPIN or RESULT
                    return newState.phase === phase;
                }
            ),
            PBT_CONFIG
        );
    });
});

// ============================================
// Stress test: Random action sequences
// ============================================

describe('Stress: Random action sequences', () => {
    it('reducer handles random action sequences without crashing', () => {
        fc.assert(
            fc.property(
                arbGameType(),
                fc.array(arbGameAction(), { minLength: 1, maxLength: 50 }),
                (gameType, actions) => {
                    let state = createInitialState(gameType);

                    for (const action of actions) {
                        try {
                            state = gameReducer(state, action);
                        } catch (error) {
                            // Reducer should never throw
                            return false;
                        }
                    }

                    // State should still be valid
                    return typeof state.phase === 'string' &&
                        typeof state.gameType === 'string';
                }
            ),
            { ...PBT_CONFIG, numRuns: 50 } // Fewer runs for stress test
        );
    });
});
