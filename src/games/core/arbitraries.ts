/**
 * Arbitraries - Generadores fast-check para Property-Based Testing
 * 
 * WHY (Protocolo Omega §4.1): Los generators permiten probar con miles
 * de casos aleatorios, descubriendo edge cases que tests de ejemplo pierden.
 * 
 * SECURITY: Los ranges están acotados para evitar overflow/DoS en tests.
 */

import fc from 'fast-check';
import {
    type GameState,
    type GameAction,
    type GameType,
    type MemoryPhase,
    type QuickDrawPhase,
    type BlockPhase,
    type HigherLowerPhase,
} from './gameReducer';
import { type Milliseconds, ms, PHASES, OUTCOMES } from '../../engine';

// ============================================
// Primitive Arbitraries
// ============================================

/**
 * Milliseconds bounded to reasonable game values
 * WHY: Prevents integer overflow in calculations
 */
export const arbMilliseconds = (): fc.Arbitrary<Milliseconds> =>
    fc.integer({ min: 0, max: 100 }).map(v => ms(v));

/**
 * Game types
 */
export const arbGameType = (): fc.Arbitrary<GameType> =>
    fc.constantFrom<GameType>(
        'coinflip',
        'dice',
        'rps',
        'memory',
        'quickdraw',
        'blockvalidation',
        'higherlower'
    );

/**
 * Phase values
 */
export const arbPhase = (): fc.Arbitrary<string> =>
    fc.constantFrom(
        PHASES.SETUP,
        PHASES.SELECTION,
        PHASES.SPIN,
        PHASES.RESULT
    );

/**
 * Outcome values
 */
export const arbOutcome = (): fc.Arbitrary<string | null> =>
    fc.constantFrom(null, OUTCOMES.WIN, OUTCOMES.LOSS, OUTCOMES.DRAW);

/**
 * Memory phase
 */
export const arbMemoryPhase = (): fc.Arbitrary<MemoryPhase> =>
    fc.constantFrom<MemoryPhase>('memorize', 'playing', 'result');

/**
 * QuickDraw phase
 */
export const arbQuickDrawPhase = (): fc.Arbitrary<QuickDrawPhase> =>
    fc.constantFrom<QuickDrawPhase>('countdown', 'waiting', 'signal', 'result');

/**
 * Block phase
 */
export const arbBlockPhase = (): fc.Arbitrary<BlockPhase> =>
    fc.constantFrom<BlockPhase>('countdown', 'playing', 'result');

/**
 * HigherLower phase
 */
export const arbHigherLowerPhase = (): fc.Arbitrary<HigherLowerPhase> =>
    fc.constantFrom<HigherLowerPhase>('countdown', 'waiting', 'reveal', 'result');

/**
 * Valid board index (0-15)
 */
export const arbBoardIndex = (): fc.Arbitrary<number> =>
    fc.integer({ min: 0, max: 15 });

/**
 * Invalid board index (for boundary testing)
 */
export const arbInvalidBoardIndex = (): fc.Arbitrary<number> =>
    fc.oneof(
        fc.integer({ min: -100, max: -1 }),
        fc.integer({ min: 16, max: 100 })
    );

/**
 * RPS choice
 */
export const arbRPSChoice = (): fc.Arbitrary<string> =>
    fc.constantFrom('rock', 'paper', 'scissors');

/**
 * Coinflip side
 */
export const arbCoinSide = (): fc.Arbitrary<string> =>
    fc.constantFrom('heads', 'tails');

// ============================================
// Composite Arbitraries
// ============================================

/**
 * Scores bounded to valid game range
 */
export const arbScores = (): fc.Arbitrary<{ player: number; opponent: number }> =>
    fc.record({
        player: fc.integer({ min: 0, max: 8 }),
        opponent: fc.integer({ min: 0, max: 8 }),
    });

/**
 * Memory board (16 cards, pairs of 0-7)
 */
export const arbBoard = (): fc.Arbitrary<readonly number[]> =>
    fc.shuffledSubarray([0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7], { minLength: 16, maxLength: 16 });

/**
 * Flipped indices (0, 1, or 2 cards)
 */
export const arbFlippedIndices = (): fc.Arbitrary<readonly number[]> =>
    fc.oneof(
        fc.constant([]),
        fc.tuple(arbBoardIndex()).map(([a]) => [a]),
        fc.tuple(arbBoardIndex(), arbBoardIndex()).filter(([a, b]) => a !== b).map(([a, b]) => [a, b])
    );

/**
 * Matched indices (even number, valid pairs)
 */
export const arbMatchedIndices = (): fc.Arbitrary<readonly number[]> =>
    fc.array(arbBoardIndex(), { minLength: 0, maxLength: 8 })
        .map(arr => arr.slice(0, Math.floor(arr.length / 2) * 2)); // Ensure even length

/**
 * Block grid (1-25 shuffled)
 */
export const arbBlockGrid = (): fc.Arbitrary<readonly number[]> =>
    fc.shuffledSubarray(
        Array.from({ length: 25 }, (_, i) => i + 1),
        { minLength: 25, maxLength: 25 }
    );

// ============================================
// GameState Arbitrary
// ============================================

/**
 * Complete GameState arbitrary
 * WHY: Allows testing reducer with arbitrary valid/invalid states
 */
export const arbGameState = (): fc.Arbitrary<GameState> =>
    fc.record({
        // Core
        gameType: arbGameType(),
        phase: arbPhase(),
        status: fc.constantFrom('idle', 'spin', 'result', 'round_result'),
        isChooser: fc.boolean(),
        playerSide: fc.oneof(fc.constant(null), arbRPSChoice(), arbCoinSide()),
        result: fc.oneof(fc.constant(null), fc.string()),
        outcome: arbOutcome(),

        // Timing
        elapsedMs: arbMilliseconds(),
        selectionTimeLeft: fc.integer({ min: 0, max: 15 }),

        // RPS
        scores: arbScores(),
        currentRound: fc.integer({ min: 1, max: 5 }),
        drawCount: fc.integer({ min: 0, max: 10 }),

        // Memory
        board: arbBoard(),
        flippedIndices: arbFlippedIndices(),
        matchedIndices: arbMatchedIndices(),
        memoryScores: arbScores(),
        timeLeft: fc.integer({ min: 0, max: 60 }),
        memoryPhase: arbMemoryPhase(),
        memorizePhaseNumber: fc.integer({ min: 1, max: 3 }),
        memorizeTimeLeft: fc.float({ min: 0, max: 5 }),
        revealedIndices: fc.array(arbBoardIndex(), { minLength: 0, maxLength: 4 }),
        pairTimestamps: fc.array(fc.integer({ min: 0, max: 100000 }), { maxLength: 8 }),
        opponentPairTimestamps: fc.array(fc.integer({ min: 0, max: 100000 }), { maxLength: 8 }),
        gameStartTime: fc.integer({ min: 0, max: 100000 }),

        // QuickDraw
        quickDrawState: arbQuickDrawPhase(),
        countdownLeft: fc.integer({ min: 0, max: 10 }),
        startTime: fc.integer({ min: 0, max: 100000 }),
        reactionTime: fc.oneof(fc.constant(null), fc.integer({ min: 0, max: 30000 })),
        hasPenalty: fc.boolean(),

        // BlockValidation
        blockGrid: arbBlockGrid(),
        blockNextTarget: fc.integer({ min: 1, max: 26 }),
        blockErrors: fc.integer({ min: 0, max: 25 }),
        blockState: arbBlockPhase(),
        blockStartTime: fc.integer({ min: 0, max: 100000 }),
        blockTimeLeft: fc.integer({ min: 0, max: 60 }),
        blockTimestamps: fc.array(fc.integer({ min: 0, max: 100000 }), { maxLength: 25 }),

        // HigherLower
        hlCurrentCard: fc.oneof(fc.constant(null), fc.record({
            suit: fc.constantFrom<'hearts' | 'diamonds' | 'clubs' | 'spades'>('hearts', 'diamonds', 'clubs', 'spades'),
            rank: fc.integer({ min: 1, max: 13 }),
        })),
        hlNextCard: fc.oneof(fc.constant(null), fc.record({
            suit: fc.constantFrom<'hearts' | 'diamonds' | 'clubs' | 'spades'>('hearts', 'diamonds', 'clubs', 'spades'),
            rank: fc.integer({ min: 1, max: 13 }),
        })),
        hlDeck: fc.array(fc.record({
            suit: fc.constantFrom<'hearts' | 'diamonds' | 'clubs' | 'spades'>('hearts', 'diamonds', 'clubs', 'spades'),
            rank: fc.integer({ min: 1, max: 13 }),
        }), { maxLength: 52 }),
        hlPlayerScore: fc.integer({ min: 0, max: 5 }),
        hlOpponentScore: fc.integer({ min: 0, max: 5 }),
        hlPlayerLives: fc.integer({ min: 0, max: 3 }),
        hlOpponentLives: fc.integer({ min: 0, max: 3 }),
        hlPhase: arbHigherLowerPhase(),
        hlPlayerPrediction: fc.oneof(fc.constant(null), fc.constantFrom<'higher' | 'lower'>('higher', 'lower')),
        hlRound: fc.integer({ min: 1, max: 50 }),
        hlTimeLeft: fc.integer({ min: 0, max: 10 }),
    }) as fc.Arbitrary<GameState>;

// ============================================
// GameAction Arbitraries
// ============================================

/**
 * TICK action
 */
export const arbTickAction = (): fc.Arbitrary<GameAction> =>
    fc.record({
        type: fc.constant('TICK' as const),
        deltaTime: arbMilliseconds(),
    });

/**
 * SELECT_SIDE action
 */
export const arbSelectSideAction = (): fc.Arbitrary<GameAction> =>
    fc.record({
        type: fc.constant('SELECT_SIDE' as const),
        side: fc.oneof(arbRPSChoice(), arbCoinSide()),
    });

/**
 * CARD_CLICK action
 */
export const arbCardClickAction = (): fc.Arbitrary<GameAction> =>
    fc.record({
        type: fc.constant('CARD_CLICK' as const),
        index: fc.oneof(arbBoardIndex(), arbInvalidBoardIndex()),
    });

/**
 * BLOCK_CELL_CLICK action
 */
export const arbBlockCellClickAction = (): fc.Arbitrary<GameAction> =>
    fc.record({
        type: fc.constant('BLOCK_CELL_CLICK' as const),
        number: fc.integer({ min: 0, max: 30 }),
    });

/**
 * FINISH_GAME action
 */
export const arbFinishGameAction = (): fc.Arbitrary<GameAction> =>
    fc.record({
        type: fc.constant('FINISH_GAME' as const),
        isWin: fc.boolean(),
        result: fc.oneof(fc.constant(null), fc.string(), fc.integer()),
    });

/**
 * Any valid GameAction
 */
export const arbGameAction = (): fc.Arbitrary<GameAction> =>
    fc.oneof(
        arbTickAction(),
        arbSelectSideAction(),
        arbCardClickAction(),
        arbBlockCellClickAction(),
        arbFinishGameAction(),
        fc.constant({ type: 'QUICK_DRAW_CLICK' } as GameAction),
        fc.constant({ type: 'QUICK_DRAW_SIGNAL' } as GameAction),
        fc.constant({ type: 'OPPONENT_MATCH' } as GameAction),
        fc.constant({ type: 'START_PLAYING' } as GameAction),
        fc.record({
            type: fc.constant('INIT' as const),
            gameType: arbGameType(),
        }),
    );

// ============================================
// Shrinkers customizados (optional)
// ============================================

/**
 * Create a memory-game specific state for focused testing
 */
export const arbMemoryGameState = (): fc.Arbitrary<GameState> =>
    arbGameState().filter(s => s.gameType === 'memory');

/**
 * Create a quickdraw-game specific state for focused testing
 */
export const arbQuickDrawGameState = (): fc.Arbitrary<GameState> =>
    arbGameState().filter(s => s.gameType === 'quickdraw');
