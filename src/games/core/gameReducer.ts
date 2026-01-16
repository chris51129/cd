/**
 * Game Reducer - Functional Core (FCIS Pattern)
 * 
 * WHY (Protocolo Omega §2.2): Este módulo contiene TODA la lógica de negocio
 * como funciones puras. Sin efectos secundarios, sin I/O.
 * 
 * PATTERN: Reducer pattern - dado un estado y una acción, retorna nuevo estado.
 * 100% testeable sin mocks.
 * 
 * SECURITY: Todas las validaciones de entrada ocurren aquí.
 * Si un estado inválido intenta crearse, el reducer lo rechaza.
 */

import { type Milliseconds, ms, PHASES, OUTCOMES, type Phase, type Outcome } from '../../engine';
import { GAME_CONFIG } from '../../constants/config';

// ============================================
// Types
// ============================================

/**
 * Game types supported by the engine
 */
export type GameType = 'coinflip' | 'dice' | 'rps' | 'memory' | 'quickdraw' | 'blockvalidation';

/**
 * Memory phase sub-states
 */
export type MemoryPhase = 'memorize' | 'playing' | 'result';

/**
 * QuickDraw phase sub-states
 */
export type QuickDrawPhase = 'countdown' | 'waiting' | 'signal' | 'result';

/**
 * BlockValidation phase sub-states
 */
export type BlockPhase = 'countdown' | 'playing' | 'result';

/**
 * Score structure
 */
export interface Scores {
    readonly player: number;
    readonly opponent: number;
}

/**
 * Complete game state (immutable)
 */
export interface GameState {
    // Core state
    readonly gameType: GameType;
    readonly phase: Phase;
    readonly status: string;
    readonly isChooser: boolean;
    readonly playerSide: string | null;
    readonly result: unknown;
    readonly outcome: Outcome;

    // Timing
    readonly elapsedMs: Milliseconds;
    readonly selectionTimeLeft: number;

    // RPS state
    readonly scores: Scores;
    readonly currentRound: number;
    readonly drawCount: number;

    // Memory state
    readonly board: readonly number[];
    readonly flippedIndices: readonly number[];
    readonly matchedIndices: readonly number[];
    readonly memoryScores: Scores;
    readonly timeLeft: number;
    readonly memoryPhase: MemoryPhase;
    readonly memorizePhaseNumber: number;
    readonly memorizeTimeLeft: number;
    readonly revealedIndices: readonly number[];
    readonly pairTimestamps: readonly number[];
    readonly opponentPairTimestamps: readonly number[];
    readonly gameStartTime: number;

    // QuickDraw state
    readonly quickDrawState: QuickDrawPhase;
    readonly countdownLeft: number;
    readonly startTime: number;
    readonly reactionTime: number | null;
    readonly hasPenalty: boolean;

    // BlockValidation state
    readonly blockGrid: readonly number[];
    readonly blockNextTarget: number;
    readonly blockErrors: number;
    readonly blockState: BlockPhase;
    readonly blockStartTime: number;
    readonly blockTimeLeft: number;
    readonly blockTimestamps: readonly number[];
}

// ============================================
// Actions
// ============================================

export type GameAction =
    | { type: 'TICK'; deltaTime: Milliseconds }
    | { type: 'INIT'; gameType: GameType }
    | { type: 'START_SELECTION' }
    | { type: 'SELECT_SIDE'; side: string }
    | { type: 'CONFIRM_ASSIGNED'; side: string }
    | { type: 'AUTO_SELECT' }
    | { type: 'SPIN_COMPLETE'; result: unknown; isWin: boolean }
    | { type: 'COINFLIP_SPIN'; result: 'heads' | 'tails' }
    | { type: 'DICE_SPIN'; playerRoll: number; opponentRoll: number }
    | { type: 'RPS_SPIN'; opponentChoice: 'rock' | 'paper' | 'scissors' }
    | { type: 'CLEAR_FLIPPED' }
    | { type: 'RPS_NEXT_ROUND' }
    | { type: 'CARD_CLICK'; index: number }
    | { type: 'OPPONENT_MATCH' }
    | { type: 'QUICK_DRAW_CLICK' }
    | { type: 'QUICK_DRAW_SIGNAL' }
    | { type: 'BLOCK_CELL_CLICK'; number: number }
    | { type: 'TIME_UP' }
    | { type: 'COUNTDOWN_TICK' }
    | { type: 'START_PLAYING' }
    | { type: 'NEXT_MEMORIZE_PHASE'; newIndices: readonly number[] }
    | { type: 'SET_BOARD'; board: readonly number[]; revealedIndices: readonly number[] }
    | { type: 'FINISH_GAME'; isWin: boolean; result: unknown };

// ============================================
// Initial State Factory
// ============================================

/**
 * Create initial state for a game type
 * WHY: Pure function, can be called from both reducer and hook
 */
export const createInitialState = (gameType: GameType): GameState => ({
    // Core
    gameType,
    phase: PHASES.SETUP,
    status: 'idle',
    isChooser: false,
    playerSide: null,
    result: null,
    outcome: null,

    // Timing
    elapsedMs: ms(0),
    selectionTimeLeft: GAME_CONFIG.SELECTION_TIMEOUT_MS / 1000,

    // RPS
    scores: { player: 0, opponent: 0 },
    currentRound: 1,
    drawCount: 0,

    // Memory
    board: [],
    flippedIndices: [],
    matchedIndices: [],
    memoryScores: { player: 0, opponent: 0 },
    timeLeft: 30,
    memoryPhase: 'memorize',
    memorizePhaseNumber: 1,
    memorizeTimeLeft: 2.5,
    revealedIndices: [],
    pairTimestamps: [],
    opponentPairTimestamps: [],
    gameStartTime: 0,

    // QuickDraw
    quickDrawState: 'countdown',
    countdownLeft: 5,
    startTime: 0,
    reactionTime: null,
    hasPenalty: false,

    // BlockValidation
    blockGrid: [],
    blockNextTarget: 1,
    blockErrors: 0,
    blockState: 'countdown',
    blockStartTime: 0,
    blockTimeLeft: 30,
    blockTimestamps: [],
});

// ============================================
// Pure Handler Functions
// ============================================

/**
 * Handle TICK action - called every frame
 * WHY: Centralized timing logic, decrements all countdowns
 */
const handleTick = (state: GameState, deltaTime: Milliseconds): GameState => {
    const newElapsed = (state.elapsedMs + deltaTime) as Milliseconds;
    let updates: Partial<GameState> = { elapsedMs: newElapsed };

    // Selection countdown (coinflip, rps)
    if (state.phase === PHASES.SELECTION && state.selectionTimeLeft > 0) {
        const decrement = deltaTime / 1000;
        const newTimeLeft = Math.max(0, state.selectionTimeLeft - decrement);
        updates = { ...updates, selectionTimeLeft: newTimeLeft };
    }

    // Memory memorize phase countdown
    if (state.gameType === 'memory' && state.memoryPhase === 'memorize' && state.memorizeTimeLeft > 0) {
        const decrement = deltaTime / 1000;
        const newTimeLeft = Math.max(0, state.memorizeTimeLeft - decrement);
        updates = { ...updates, memorizeTimeLeft: newTimeLeft };
    }

    // Memory playing phase countdown
    if (state.gameType === 'memory' && state.memoryPhase === 'playing' && state.timeLeft > 0) {
        const decrement = deltaTime / 1000;
        const newTimeLeft = Math.max(0, state.timeLeft - decrement);
        updates = { ...updates, timeLeft: newTimeLeft };
    }

    // QuickDraw countdown
    if (state.gameType === 'quickdraw' && state.quickDrawState === 'countdown' && state.countdownLeft > 0) {
        const decrement = deltaTime / 1000;
        const newCountdown = Math.max(0, state.countdownLeft - decrement);
        updates = { ...updates, countdownLeft: newCountdown };
    }

    // BlockValidation countdown and game time
    if (state.gameType === 'blockvalidation') {
        if (state.blockState === 'countdown' && state.countdownLeft > 0) {
            const decrement = deltaTime / 1000;
            const newCountdown = Math.max(0, state.countdownLeft - decrement);
            updates = { ...updates, countdownLeft: newCountdown };
        }
        if (state.blockState === 'playing' && state.blockTimeLeft > 0) {
            const decrement = deltaTime / 1000;
            const newTimeLeft = Math.max(0, state.blockTimeLeft - decrement);
            updates = { ...updates, blockTimeLeft: newTimeLeft };
        }
    }

    return { ...state, ...updates };
};

/**
 * Handle START_SELECTION action - transition from setup to selection
 */
const handleStartSelection = (state: GameState): GameState => {
    if (state.phase !== PHASES.SETUP) return state;

    return {
        ...state,
        phase: PHASES.SELECTION,
        status: 'idle',
    };
};

/**
 * Handle SELECT_SIDE action
 * WHY: Also allows transition from SETUP for games like coinflip/rps
 */
const handleSelectSide = (state: GameState, side: string): GameState => {
    // From SELECTION phase - select and go to spin
    if (state.phase === PHASES.SELECTION) {
        return {
            ...state,
            playerSide: side,
            phase: PHASES.SPIN,
            status: 'spin',
        };
    }

    // From SETUP phase - select and go to spin directly (for simplified flow)
    if (state.phase === PHASES.SETUP && side !== '') {
        return {
            ...state,
            playerSide: side,
            phase: PHASES.SPIN,
            status: 'spin',
        };
    }

    // Empty side with SETUP = just transition to selection
    if (state.phase === PHASES.SETUP && side === '') {
        return {
            ...state,
            phase: PHASES.SELECTION,
            status: 'idle',
        };
    }

    return state;
};

/**
 * Handle CARD_CLICK action (Memory game)
 */
const handleCardClick = (state: GameState, index: number): GameState => {
    // Validations
    if (state.gameType !== 'memory') return state;
    if (state.phase !== PHASES.SPIN) return state;
    if (state.memoryPhase !== 'playing') return state;
    if (state.timeLeft <= 0) return state;
    if (index < 0 || index >= 16) return state;
    if (state.matchedIndices.includes(index)) return state;
    if (state.flippedIndices.includes(index)) return state;
    if (state.flippedIndices.length >= 2) return state;

    const newFlipped = [...state.flippedIndices, index];

    // First card
    if (newFlipped.length === 1) {
        return { ...state, flippedIndices: newFlipped };
    }

    // Second card - check for match
    const [first, second] = newFlipped;
    if (first === second) return state;

    const isMatch = state.board[first] === state.board[second];

    if (isMatch) {
        return {
            ...state,
            flippedIndices: [],
            matchedIndices: [...state.matchedIndices, first, second],
            memoryScores: {
                ...state.memoryScores,
                player: state.memoryScores.player + 1,
            },
            pairTimestamps: [...state.pairTimestamps, state.elapsedMs],
        };
    }

    // No match - keep cards flipped (UI will handle flip back after delay)
    return { ...state, flippedIndices: newFlipped };
};

/**
 * Handle OPPONENT_MATCH action (Memory game opponent simulation)
 */
const handleOpponentMatch = (state: GameState): GameState => {
    if (state.gameType !== 'memory') return state;
    if (state.memoryScores.opponent >= 8) return state;

    return {
        ...state,
        memoryScores: {
            ...state.memoryScores,
            opponent: state.memoryScores.opponent + 1,
        },
        opponentPairTimestamps: [...state.opponentPairTimestamps, state.elapsedMs],
    };
};

/**
 * Handle QUICK_DRAW_CLICK action
 */
const handleQuickDrawClick = (state: GameState): GameState => {
    if (state.gameType !== 'quickdraw') return state;
    if (state.quickDrawState === 'countdown') return state;
    if (state.quickDrawState === 'result') return state;

    // False start during waiting phase
    if (state.quickDrawState === 'waiting') {
        if (state.hasPenalty) return state; // Already penalized
        return { ...state, hasPenalty: true };
    }

    // Valid click during signal - reaction time calculated externally
    // This just records that click happened
    return state;
};

/**
 * Handle FINISH_GAME action
 */
const handleFinishGame = (state: GameState, isWin: boolean, result: unknown): GameState => {
    return {
        ...state,
        phase: PHASES.RESULT,
        status: 'result',
        outcome: isWin ? OUTCOMES.WIN : OUTCOMES.LOSS,
        result,
    };
};

/**
 * Handle flip back after non-match (Memory)
 */
const handleFlipBack = (state: GameState): GameState => {
    if (state.gameType !== 'memory') return state;
    return { ...state, flippedIndices: [] };
};

/**
 * Handle NEXT_MEMORIZE_PHASE action
 */
const handleNextMemorizePhase = (state: GameState, newIndices: readonly number[]): GameState => {
    if (state.gameType !== 'memory') return state;
    if (state.memoryPhase !== 'memorize') return state;

    const nextPhase = state.memorizePhaseNumber + 1;

    if (nextPhase > 2) {
        // Start playing phase
        return {
            ...state,
            memoryPhase: 'playing',
            revealedIndices: [],
            gameStartTime: state.elapsedMs,
        };
    }

    return {
        ...state,
        memorizePhaseNumber: nextPhase,
        memorizeTimeLeft: 2.5,
        revealedIndices: newIndices,
    };
};

/**
 * Handle START_PLAYING action
 */
const handleStartPlaying = (state: GameState): GameState => {
    if (state.gameType === 'quickdraw') {
        if (state.quickDrawState !== 'countdown') return state;
        return { ...state, quickDrawState: 'waiting' };
    }

    if (state.gameType === 'blockvalidation') {
        if (state.blockState !== 'countdown') return state;
        return {
            ...state,
            blockState: 'playing',
            blockStartTime: state.elapsedMs,
        };
    }

    return state;
};

/**
 * Handle QUICK_DRAW_SIGNAL action
 */
const handleQuickDrawSignal = (state: GameState): GameState => {
    if (state.gameType !== 'quickdraw') return state;
    if (state.quickDrawState !== 'waiting') return state;

    return {
        ...state,
        quickDrawState: 'signal',
        startTime: state.elapsedMs,
    };
};

/**
 * Handle BLOCK_CELL_CLICK action
 */
const handleBlockCellClick = (state: GameState, clickedNumber: number): GameState => {
    if (state.gameType !== 'blockvalidation') return state;
    if (state.blockState !== 'playing') return state;

    if (clickedNumber === state.blockNextTarget) {
        // Correct click
        const newTarget = state.blockNextTarget + 1;
        const newTimestamps = [...state.blockTimestamps, state.elapsedMs];

        if (newTarget > 25) {
            // Game complete - calculate finish time
            return {
                ...state,
                blockNextTarget: newTarget,
                blockTimestamps: newTimestamps,
                blockState: 'result',
            };
        }

        return {
            ...state,
            blockNextTarget: newTarget,
            blockTimestamps: newTimestamps,
        };
    } else {
        // Wrong click
        return {
            ...state,
            blockErrors: state.blockErrors + 1,
        };
    }
};

// ============================================
// Spin Handlers (Migrated from strategies)
// ============================================

/**
 * Handle COINFLIP_SPIN action
 * WHY: Pure function - given result, determines win/loss based on playerSide
 */
const handleCoinflipSpin = (state: GameState, result: 'heads' | 'tails'): GameState => {
    if (state.gameType !== 'coinflip') return state;

    const isWin = state.playerSide === result;
    return {
        ...state,
        result,
        outcome: isWin ? OUTCOMES.WIN : OUTCOMES.LOSS,
        phase: PHASES.RESULT,
        status: 'result',
    };
};

/**
 * Handle DICE_SPIN action
 * WHY: Pure function - compares rolls to determine winner
 */
const handleDiceSpin = (state: GameState, playerRoll: number, opponentRoll: number): GameState => {
    if (state.gameType !== 'dice') return state;

    // Validate rolls are in valid range
    if (playerRoll < 1 || playerRoll > 10 || opponentRoll < 1 || opponentRoll > 10) {
        return state;
    }

    const isWin = playerRoll > opponentRoll;
    const result = { player: playerRoll, opponent: opponentRoll };

    return {
        ...state,
        result,
        outcome: isWin ? OUTCOMES.WIN : OUTCOMES.LOSS,
        phase: PHASES.RESULT,
        status: 'result',
    };
};

/**
 * RPS win conditions - what each choice beats
 */
const RPS_WINS: Record<string, string> = {
    rock: 'scissors',
    paper: 'rock',
    scissors: 'paper',
} as const;

/**
 * Handle RPS_SPIN action
 * WHY: Pure function - handles draw counting and win/loss determination
 */
const handleRpsSpin = (state: GameState, opponentChoice: 'rock' | 'paper' | 'scissors'): GameState => {
    if (state.gameType !== 'rps') return state;

    const playerChoice = state.playerSide || 'rock';
    const result = { player: playerChoice, opponent: opponentChoice };

    // Check for draw
    if (playerChoice === opponentChoice) {
        const newDrawCount = state.drawCount + 1;

        // After 5 draws, this should be handled by shell with auto-resolution
        if (newDrawCount >= 5) {
            return {
                ...state,
                result,
                drawCount: newDrawCount,
                outcome: OUTCOMES.DRAW,
                phase: PHASES.RESULT,
                status: 'result',
            };
        }

        // More rounds allowed - return to selection
        return {
            ...state,
            result,
            drawCount: newDrawCount,
            playerSide: null,
            selectionTimeLeft: 10,
            status: 'round_result',
        };
    }

    // Determine winner
    const isWin = RPS_WINS[playerChoice] === opponentChoice;

    return {
        ...state,
        result: { ...result, drawCount: state.drawCount, outcome: isWin ? 'win' : 'loss' },
        outcome: isWin ? OUTCOMES.WIN : OUTCOMES.LOSS,
        phase: PHASES.RESULT,
        status: 'result',
    };
};

/**
 * Handle CLEAR_FLIPPED action (for memory game)
 * WHY: Called after non-match to reset flipped cards
 */
const handleClearFlipped = (state: GameState): GameState => {
    if (state.gameType !== 'memory') return state;
    return { ...state, flippedIndices: [] };
};

/**
 * Handle RPS_NEXT_ROUND action
 * WHY: After showing draw result, transition back to selection
 */
const handleRpsNextRound = (state: GameState): GameState => {
    if (state.gameType !== 'rps') return state;
    if (state.status !== 'round_result') return state;

    return {
        ...state,
        playerSide: null,
        selectionTimeLeft: 10,
        phase: PHASES.SELECTION,
        status: 'idle',
    };
};

/**
 * Handle SET_BOARD action (for memory game initialization)
 * WHY: Allows shell to set shuffled board and initial revealed indices
 */
const handleSetBoard = (state: GameState, board: readonly number[], revealedIndices: readonly number[]): GameState => {
    if (state.gameType !== 'memory') return state;

    return {
        ...state,
        board,
        revealedIndices,
        phase: PHASES.SPIN,
        status: 'spin',
    };
};

// ============================================
// Main Reducer
// ============================================

/**
 * Pure game reducer - all game logic consolidated here
 * WHY: Single source of truth for state transitions.
 * Easy to test, easy to understand, easy to extend.
 */
export const gameReducer = (state: GameState, action: GameAction): GameState => {
    switch (action.type) {
        case 'TICK':
            return handleTick(state, action.deltaTime);

        case 'INIT':
            return createInitialState(action.gameType);

        case 'START_SELECTION':
            return handleStartSelection(state);

        case 'SELECT_SIDE':
            return handleSelectSide(state, action.side);

        case 'CONFIRM_ASSIGNED':
            return handleSelectSide(state, action.side);

        case 'CARD_CLICK':
            return handleCardClick(state, action.index);

        case 'OPPONENT_MATCH':
            return handleOpponentMatch(state);

        case 'QUICK_DRAW_CLICK':
            return handleQuickDrawClick(state);

        case 'QUICK_DRAW_SIGNAL':
            return handleQuickDrawSignal(state);

        case 'BLOCK_CELL_CLICK':
            return handleBlockCellClick(state, action.number);

        case 'START_PLAYING':
            return handleStartPlaying(state);

        case 'NEXT_MEMORIZE_PHASE':
            return handleNextMemorizePhase(state, action.newIndices);

        case 'COINFLIP_SPIN':
            return handleCoinflipSpin(state, action.result);

        case 'DICE_SPIN':
            return handleDiceSpin(state, action.playerRoll, action.opponentRoll);

        case 'RPS_SPIN':
            return handleRpsSpin(state, action.opponentChoice);

        case 'CLEAR_FLIPPED':
            return handleClearFlipped(state);

        case 'RPS_NEXT_ROUND':
            return handleRpsNextRound(state);

        case 'SET_BOARD':
            return handleSetBoard(state, action.board, action.revealedIndices);

        case 'FINISH_GAME':
            return handleFinishGame(state, action.isWin, action.result);

        case 'TIME_UP':
            // Handled by shell - determines winner and dispatches FINISH_GAME
            return state;

        default:
            return state;
    }
};

/**
 * Action creator for clearing flipped cards after delay
 */
export const flipBackAction = (): ((state: GameState) => GameState) => handleFlipBack;

// ============================================
// Exports
// ============================================

// Note: GameState and GameAction are exported inline with their declarations
