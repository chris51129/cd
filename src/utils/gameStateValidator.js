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
        phases: ['setup', 'selection', 'spin', 'result'],
        sides: ['heads', 'tails', null]
    },
    dice: {
        phases: ['setup', 'spin', 'result'],
        rollRange: [1, 10]
    },
    rps: {
        phases: ['setup', 'selection', 'spin', 'result'],
        sides: ['rock', 'paper', 'scissors', null],
        scoreRange: [0, 2]
    },
    memory: {
        phases: ['setup', 'spin', 'result'],
        memoryPhases: ['memorize', 'playing', 'result'],
        boardSize: 16,
        pairRange: [0, 8],
        timeRange: [0, 30]
    },
    quickdraw: {
        phases: ['setup', 'spin', 'result'],
        quickDrawStates: ['countdown', 'waiting', 'signal', 'result'],
        countdownRange: [0, 5],
        reactionRange: [0, 30000]
    },
    blockvalidation: {
        phases: ['setup', 'spin', 'result'],
        blockStates: ['countdown', 'playing', 'result'],
        gridSize: 25,
        targetRange: [1, 25],
        timeRange: [0, 60]
    }
};

/**
 * Valida que un valor esté dentro de un rango
 */
const isInRange = (value, [min, max]) => {
    return typeof value === 'number' && value >= min && value <= max;
};

/**
 * Valida que un valor esté en una lista
 */
const isValidOption = (value, options) => {
    return options.includes(value);
};

/**
 * Validador para CoinFlip
 */
export const validateCoinflipState = (gameState) => {
    const errors = [];
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
export const validateDiceState = (gameState) => {
    const errors = [];
    const rules = VALID_STATES.dice;

    if (!isValidOption(gameState.phase, rules.phases)) {
        errors.push(`Invalid phase: ${gameState.phase}`);
    }
    if (gameState.result) {
        if (!isInRange(gameState.result.player, rules.rollRange)) {
            errors.push(`Invalid player roll: ${gameState.result.player}`);
        }
        if (!isInRange(gameState.result.opponent, rules.rollRange)) {
            errors.push(`Invalid opponent roll: ${gameState.result.opponent}`);
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
export const validateRPSState = (gameState) => {
    const errors = [];
    const rules = VALID_STATES.rps;

    if (!isValidOption(gameState.phase, rules.phases)) {
        errors.push(`Invalid phase: ${gameState.phase}`);
    }
    if (!isValidOption(gameState.playerSide, rules.sides)) {
        errors.push(`Invalid playerSide: ${gameState.playerSide}`);
    }
    if (gameState.scores) {
        if (!isInRange(gameState.scores.player, rules.scoreRange)) {
            errors.push(`Invalid player score: ${gameState.scores.player}`);
        }
        if (!isInRange(gameState.scores.opponent, rules.scoreRange)) {
            errors.push(`Invalid opponent score: ${gameState.scores.opponent}`);
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
export const validateMemoryState = (gameState) => {
    const errors = [];
    const rules = VALID_STATES.memory;

    if (!isValidOption(gameState.phase, rules.phases)) {
        errors.push(`Invalid phase: ${gameState.phase}`);
    }
    if (gameState.memoryPhase && !isValidOption(gameState.memoryPhase, rules.memoryPhases)) {
        errors.push(`Invalid memoryPhase: ${gameState.memoryPhase}`);
    }
    if (gameState.board && gameState.board.length !== rules.boardSize) {
        errors.push(`Invalid board size: ${gameState.board.length}`);
    }
    if (gameState.memoryScores) {
        if (!isInRange(gameState.memoryScores.player, rules.pairRange)) {
            errors.push(`Invalid player pairs: ${gameState.memoryScores.player}`);
        }
        if (!isInRange(gameState.memoryScores.opponent, rules.pairRange)) {
            errors.push(`Invalid opponent pairs: ${gameState.memoryScores.opponent}`);
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
export const validateQuickDrawState = (gameState) => {
    const errors = [];
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
export const validateBlockValidationState = (gameState) => {
    const errors = [];
    const rules = VALID_STATES.blockvalidation;

    if (!isValidOption(gameState.phase, rules.phases)) {
        errors.push(`Invalid phase: ${gameState.phase}`);
    }
    if (gameState.blockState && !isValidOption(gameState.blockState, rules.blockStates)) {
        errors.push(`Invalid blockState: ${gameState.blockState}`);
    }
    if (gameState.blockGrid && gameState.blockGrid.length !== rules.gridSize) {
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
export const validateGameState = (gameType, gameState) => {
    const validators = {
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
