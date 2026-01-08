/**
 * Game State Validator - Validación Exhaustiva de Estado
 * 
 * Valida la integridad del estado del juego antes de cualquier acción crítica.
 * Previene manipulación del estado mediante:
 * - Validación de tipos
 * - Validación de rangos
 * - Validación de transiciones de estado
 * - Detección de inconsistencias
 * 
 * OWASP Reference: A03:2021 – Injection
 */
import { secureLog } from './security';

// Estados válidos por juego
const VALID_STATES = {
    coinflip: {
        phases: ['setup', 'selection', 'spin', 'result'] as const,
        sides: ['heads', 'tails', null] as const
    },
    dice: {
        phases: ['setup', 'spin', 'result'] as const,
        rollRange: [1, 10] as const
    },
    rps: {
        phases: ['setup', 'selection', 'spin', 'result'] as const,
        sides: ['rock', 'paper', 'scissors', null] as const,
        scoreRange: [0, 2] as const
    },
    memory: {
        phases: ['setup', 'spin', 'result'] as const,
        memoryPhases: ['memorize', 'playing', 'result'] as const,
        boardSize: 16,
        pairRange: [0, 8] as const,
        timeRange: [0, 30] as const
    },
    quickdraw: {
        phases: ['setup', 'spin', 'result'] as const,
        quickDrawStates: ['countdown', 'waiting', 'signal', 'result'] as const,
        countdownRange: [0, 5] as const,
        reactionRange: [0, 30000] as const
    },
    blockvalidation: {
        phases: ['setup', 'spin', 'result'] as const,
        blockStates: ['countdown', 'playing', 'result'] as const,
        gridSize: 25,
        targetRange: [1, 25] as const,
        timeRange: [0, 60] as const
    }
} as const;

/**
 * Valida que un valor esté dentro de un rango
 */
const isInRange = (value: unknown, [min, max]: readonly [number, number]): boolean => {
    return typeof value === 'number' && value >= min && value <= max;
};

/**
 * Valida que un valor esté en una lista
 */
const isValidOption = (value: unknown, options: readonly unknown[]): boolean => {
    return options.includes(value);
};

/**
 * Type alias for game state - loose typing for validation
 * WHY: Validadores reciben estado potencialmente corrupto, necesitan acceso dinámico
 */
type GameStateInput = Record<string, unknown>;

/**
 * Validador para CoinFlip
 */
export const validateCoinflipState = (gameState: GameStateInput): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];
    const rules = VALID_STATES.coinflip;

    if (!isValidOption(gameState.phase, rules.phases)) {
        errors.push(`Invalid phase: ${gameState.phase}`);
    }
    if (!isValidOption(gameState.playerSide, rules.sides)) {
        errors.push(`Invalid playerSide: ${gameState.playerSide}`);
    }
    if (gameState.selectionTimeLeft !== undefined && !isInRange(gameState.selectionTimeLeft, [0, 15])) {
        errors.push(`Invalid selectionTimeLeft: ${gameState.selectionTimeLeft}`);
    }

    return {
        isValid: errors.length === 0,
        errors
    };
};

/**
 * Validador para Dice
 */
export const validateDiceState = (gameState: GameStateInput): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];
    const rules = VALID_STATES.dice;

    if (!isValidOption(gameState.phase, rules.phases)) {
        errors.push(`Invalid phase: ${gameState.phase}`);
    }
    if (gameState.result && typeof gameState.result === 'object') {
        const result = gameState.result as Record<string, unknown>;
        if (!isInRange(result.player, rules.rollRange)) {
            errors.push(`Invalid player roll: ${result.player}`);
        }
        if (!isInRange(result.opponent, rules.rollRange)) {
            errors.push(`Invalid opponent roll: ${result.opponent}`);
        }
    }

    return {
        isValid: errors.length === 0,
        errors
    };
};

/**
 * Validador para RPS
 */
export const validateRPSState = (gameState: GameStateInput): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];
    const rules = VALID_STATES.rps;

    if (!isValidOption(gameState.phase, rules.phases)) {
        errors.push(`Invalid phase: ${gameState.phase}`);
    }
    if (!isValidOption(gameState.playerSide, rules.sides)) {
        errors.push(`Invalid playerSide: ${gameState.playerSide}`);
    }
    if (gameState.scores && typeof gameState.scores === 'object') {
        const scores = gameState.scores as Record<string, unknown>;
        if (!isInRange(scores.player, rules.scoreRange)) {
            errors.push(`Invalid player score: ${scores.player}`);
        }
        if (!isInRange(scores.opponent, rules.scoreRange)) {
            errors.push(`Invalid opponent score: ${scores.opponent}`);
        }
    }

    return {
        isValid: errors.length === 0,
        errors
    };
};

/**
 * Validador para Memory
 */
export const validateMemoryState = (gameState: GameStateInput): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];
    const rules = VALID_STATES.memory;

    if (!isValidOption(gameState.phase, rules.phases)) {
        errors.push(`Invalid phase: ${gameState.phase}`);
    }
    if (gameState.memoryPhase && !isValidOption(gameState.memoryPhase, rules.memoryPhases)) {
        errors.push(`Invalid memoryPhase: ${gameState.memoryPhase}`);
    }
    if (gameState.board && Array.isArray(gameState.board) && gameState.board.length !== rules.boardSize) {
        errors.push(`Invalid board size: ${gameState.board.length}`);
    }
    if (gameState.memoryScores && typeof gameState.memoryScores === 'object') {
        const memoryScores = gameState.memoryScores as Record<string, unknown>;
        if (!isInRange(memoryScores.player, rules.pairRange)) {
            errors.push(`Invalid player pairs: ${memoryScores.player}`);
        }
        if (!isInRange(memoryScores.opponent, rules.pairRange)) {
            errors.push(`Invalid opponent pairs: ${memoryScores.opponent}`);
        }
    }
    if (gameState.timeLeft !== undefined && !isInRange(gameState.timeLeft, rules.timeRange)) {
        errors.push(`Invalid timeLeft: ${gameState.timeLeft}`);
    }

    return {
        isValid: errors.length === 0,
        errors
    };
};

/**
 * Validador para Quick Draw
 */
export const validateQuickDrawState = (gameState: GameStateInput): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];
    const rules = VALID_STATES.quickdraw;

    if (!isValidOption(gameState.phase, rules.phases)) {
        errors.push(`Invalid phase: ${gameState.phase}`);
    }
    if (gameState.quickDrawState && !isValidOption(gameState.quickDrawState, rules.quickDrawStates)) {
        errors.push(`Invalid quickDrawState: ${gameState.quickDrawState}`);
    }
    if (gameState.countdownLeft !== undefined && !isInRange(gameState.countdownLeft, rules.countdownRange)) {
        errors.push(`Invalid countdownLeft: ${gameState.countdownLeft}`);
    }
    if (gameState.reactionTime !== null && !isInRange(gameState.reactionTime, rules.reactionRange)) {
        errors.push(`Invalid reactionTime: ${gameState.reactionTime}`);
    }

    return {
        isValid: errors.length === 0,
        errors
    };
};

/**
 * Validador para Block Validation
 */
export const validateBlockValidationState = (gameState: GameStateInput): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];
    const rules = VALID_STATES.blockvalidation;

    if (!isValidOption(gameState.phase, rules.phases)) {
        errors.push(`Invalid phase: ${gameState.phase}`);
    }
    if (gameState.blockState && !isValidOption(gameState.blockState, rules.blockStates)) {
        errors.push(`Invalid blockState: ${gameState.blockState}`);
    }
    if (gameState.blockGrid && Array.isArray(gameState.blockGrid) && gameState.blockGrid.length !== rules.gridSize) {
        errors.push(`Invalid grid size: ${gameState.blockGrid.length}`);
    }
    if (gameState.blockNextTarget !== undefined && !isInRange(gameState.blockNextTarget, rules.targetRange)) {
        errors.push(`Invalid blockNextTarget: ${gameState.blockNextTarget}`);
    }
    if (gameState.blockTimeLeft !== undefined && !isInRange(gameState.blockTimeLeft, rules.timeRange)) {
        errors.push(`Invalid blockTimeLeft: ${gameState.blockTimeLeft}`);
    }

    return {
        isValid: errors.length === 0,
        errors
    };
};

/**
 * Validador principal que selecciona el validador correcto
 */
export const validateGameState = (gameType: string, gameState: GameStateInput): { isValid: boolean; errors: string[] } => {
    const validators: Record<string, (state: GameStateInput) => { isValid: boolean; errors: string[] }> = {
        coinflip: validateCoinflipState,
        dice: validateDiceState,
        rps: validateRPSState,
        memory: validateMemoryState,
        quickdraw: validateQuickDrawState,
        blockvalidation: validateBlockValidationState
    };

    const validator = validators[gameType];
    if (!validator) {
        secureLog.error(`[StateValidator] Unknown game type: ${gameType}`);
        return { isValid: false, errors: [`Unknown game type: ${gameType}`] };
    }

    const result = validator(gameState);

    if (!result.isValid) {
        secureLog.error(`[StateValidator] Invalid state for ${gameType}:`, result.errors);
    }

    return result;
};

export default validateGameState;
