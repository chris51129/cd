/**
 * Block Validation Strategy
 * 
 * Tabla de Schulte - Haz clic en números del 1 al 25 en orden.
 * Speed/accuracy game.
 * 
 * WHY: Este juego mide atención selectiva y velocidad de procesamiento visual.
 * La grilla de Schulte es un test neuropsicológico clásico adaptado a gaming.
 * 
 * WHY (DI): secureShuffleArray, secureRandomInt, secureLog vienen del contexto.
 */
import {
    GAME_PHASES,
    GAME_STATUS,
    type GameStrategy,
    type GameContext
} from './gameStrategy';

// ============================================
// Constants
// ============================================

/** Cuenta regresiva inicial (segundos) */
export const COUNTDOWN_SECONDS = 5;

/** Tiempo límite para completar (segundos) */
export const TIME_LIMIT_SECONDS = 45;

/** Total de celdas en el grid */
const GRID_SIZE = 25;

/** Penalización por error (ms) */
const ERROR_PENALTY_MS = 500;

/** Rango de tiempo del bot (ms) */
const BOT_TIME_MIN = 8000;
const BOT_TIME_MAX = 15000;

// ============================================
// Types
// ============================================

/** Block validation game states */
export type BlockValidationPhase = 'countdown' | 'playing' | 'result';

/** Block validation game state */
export interface BlockValidationGameState {
    readonly blockGrid: readonly number[];
    readonly blockNextTarget: number;
    readonly blockErrors: number;
    readonly blockState: BlockValidationPhase;
    readonly blockStartTime: number;
    readonly blockTimeLeft: number;
    readonly countdownLeft: number;
    readonly blockTimestamps: readonly number[];
}

/** Completed game result */
export interface BlockValidationCompletedResult {
    readonly playerTime: number;
    readonly opponentTime: number;
    readonly errors: number;
    readonly totalTime: number;
    readonly completed: true;
    readonly outcome: 'win' | 'loss';
}

/** Timeout game result */
export interface BlockValidationTimeoutResult {
    readonly playerProgress: number;
    readonly opponentProgress: number;
    readonly playerTime: number;
    readonly opponentTime: number;
    readonly errors: number;
    readonly completed: false;
    readonly timeout: true;
    readonly tieBreaker?: 'random_zero';
    readonly outcome: 'win' | 'loss';
}

export type BlockValidationResult = BlockValidationCompletedResult | BlockValidationTimeoutResult;

/** Extended context with security functions - not extending GameContext to avoid type conflicts */
interface BlockValidationContext {
    readonly updateGameState: (updates: Record<string, unknown>) => void;
    readonly setPhase: (phase: string) => void;
    readonly setStatus: (status: string) => void;
    readonly setResult: (result: unknown) => void;
    readonly finishGame: (isWin: boolean, result?: unknown) => void;
    readonly secureShuffleArray: <T>(arr: readonly T[]) => T[];
    readonly secureRandomInt: (min: number, max: number) => number;
    readonly secureLog: {
        info: (...args: unknown[]) => void;
        warn: (...args: unknown[]) => void;
    };
    readonly gameState: BlockValidationGameState;
}

// ============================================
// Strategy Implementation
// ============================================

/**
 * Block Validation game strategy implementation
 */
export const blockvalidationStrategy: GameStrategy<BlockValidationGameState> & {
    readonly generateGrid: <T>(shuffleFn: (arr: readonly T[]) => T[]) => number[];
    readonly COUNTDOWN_SECONDS: number;
    readonly TIME_LIMIT_SECONDS: number;
} = {
    type: 'blockvalidation',

    /**
     * Retorna el estado inicial específico de este juego
     */
    getInitialState: (): BlockValidationGameState => ({
        blockGrid: [],
        blockNextTarget: 1,
        blockErrors: 0,
        blockState: 'countdown',
        blockStartTime: 0,
        blockTimeLeft: TIME_LIMIT_SECONDS,
        countdownLeft: COUNTDOWN_SECONDS,
        blockTimestamps: []
    }),

    /**
     * Genera un grid 5x5 con números 1-25 barajados
     */
    generateGrid: <T>(shuffleFn: (arr: readonly T[]) => T[]): number[] => {
        const numbers = Array.from({ length: GRID_SIZE }, (_, i) => i + 1);
        return shuffleFn(numbers as unknown as readonly T[]) as unknown as number[];
    },

    /**
     * Setup del juego
     */
    setup: (context: GameContext): void => {
        const ctx = context as unknown as BlockValidationContext;
        const { updateGameState, setPhase, setStatus, secureShuffleArray, secureLog } = ctx;
        const grid = blockvalidationStrategy.generateGrid(secureShuffleArray);

        updateGameState({
            blockGrid: grid,
            blockNextTarget: 1,
            blockErrors: 0,
            blockState: 'countdown',
            blockTimeLeft: TIME_LIMIT_SECONDS,
            countdownLeft: COUNTDOWN_SECONDS,
            blockTimestamps: []
        });
        setPhase(GAME_PHASES.SPIN);
        setStatus(GAME_STATUS.SPIN);
        secureLog.info(`[BlockValidation] Starting with ${COUNTDOWN_SECONDS}s countdown`);
    },

    /**
     * BlockValidation no tiene spin tradicional - usa handlers
     */
    spin: (): void => { },

    /**
     * Handlers específicos del juego
     */
    handlers: {
        /**
         * Handler de click en celda
         */
        handleCellClick: (clickedNumber: unknown, context: unknown): void => {
            const ctx = context as unknown as BlockValidationContext;
            const { gameState, updateGameState, setResult, finishGame, secureRandomInt, secureLog } = ctx;

            // No procesar clics durante countdown o después de terminar
            if (gameState.blockState !== 'playing') return;

            // Validar input
            if (typeof clickedNumber !== 'number' || clickedNumber < 1 || clickedNumber > GRID_SIZE) {
                secureLog.warn('[BlockValidation] Invalid input:', clickedNumber);
                return;
            }

            if (clickedNumber === gameState.blockNextTarget) {
                // CORRECTO
                const timestamp = performance.now();
                secureLog.info(`[BlockValidation] Correct: ${clickedNumber}`);

                if (gameState.blockNextTarget === GRID_SIZE) {
                    // JUEGO COMPLETADO
                    const playerTime = Math.floor(timestamp - gameState.blockStartTime);
                    const penalty = gameState.blockErrors * ERROR_PENALTY_MS;
                    const totalTime = playerTime + penalty;

                    // Simular oponente
                    const opponentTime = secureRandomInt(BOT_TIME_MIN, BOT_TIME_MAX);

                    let isWin = false;
                    if (totalTime < opponentTime) {
                        isWin = true;
                    } else if (totalTime === opponentTime) {
                        isWin = secureRandomInt(0, 1) === 1;
                    }

                    const finalResult: BlockValidationCompletedResult = {
                        playerTime,
                        opponentTime,
                        errors: gameState.blockErrors,
                        totalTime,
                        completed: true,
                        outcome: isWin ? 'win' : 'loss'
                    };

                    secureLog.info(`[BlockValidation] Finished: ${totalTime}ms vs ${opponentTime}ms`);
                    updateGameState({ blockState: 'result' });
                    setResult(finalResult);
                    finishGame(isWin, finalResult);
                } else {
                    updateGameState({
                        blockNextTarget: gameState.blockNextTarget + 1,
                        blockTimestamps: [...gameState.blockTimestamps, timestamp]
                    });
                }
            } else {
                // ERROR
                secureLog.warn(`[BlockValidation] Error: clicked ${clickedNumber}, expected ${gameState.blockNextTarget}`);
                updateGameState({
                    blockErrors: gameState.blockErrors + 1
                });
            }
        },

        /**
         * Handler de timeout - tiempo límite alcanzado
         */
        handleTimeLimit: (context: unknown): void => {
            const ctx = context as unknown as BlockValidationContext;
            const { gameState, updateGameState, setResult, finishGame, secureRandomInt, secureLog } = ctx;

            if (gameState.blockState !== 'playing') return;

            secureLog.warn('[BlockValidation] Time limit reached!');

            const playerProgress = gameState.blockNextTarget - 1;
            const playerTime = gameState.blockTimestamps.length > 0
                ? gameState.blockTimestamps[gameState.blockTimestamps.length - 1] - gameState.blockStartTime
                : TIME_LIMIT_SECONDS * 1000;

            // EDGE CASE: Jugador no clickeó ningún bloque
            if (playerProgress === 0) {
                secureLog.warn('[BlockValidation] Player at 0 progress! Assigning random winner.');
                const isWin = secureRandomInt(0, 1) === 1;
                const finalResult: BlockValidationTimeoutResult = {
                    playerProgress: 0,
                    opponentProgress: secureRandomInt(0, 5),
                    playerTime,
                    opponentTime: TIME_LIMIT_SECONDS * 1000,
                    errors: gameState.blockErrors,
                    completed: false,
                    timeout: true,
                    tieBreaker: 'random_zero',
                    outcome: isWin ? 'win' : 'loss'
                };
                updateGameState({ blockState: 'result' });
                setResult(finalResult);
                finishGame(isWin, finalResult);
                return;
            }

            // Simular progreso del oponente
            const opponentProgress = secureRandomInt(10, GRID_SIZE);
            const opponentTime = secureRandomInt(BOT_TIME_MIN, BOT_TIME_MAX);

            let isWin = false;
            if (playerProgress > opponentProgress) {
                isWin = true;
            } else if (playerProgress === opponentProgress) {
                isWin = playerTime < opponentTime;
                if (playerTime === opponentTime) {
                    isWin = secureRandomInt(0, 1) === 1;
                }
            }

            const finalResult: BlockValidationTimeoutResult = {
                playerProgress,
                opponentProgress,
                playerTime,
                opponentTime,
                errors: gameState.blockErrors,
                completed: false,
                timeout: true,
                outcome: isWin ? 'win' : 'loss'
            };

            updateGameState({ blockState: 'result' });
            setResult(finalResult);
            finishGame(isWin, finalResult);
        }
    },

    // Constants
    COUNTDOWN_SECONDS,
    TIME_LIMIT_SECONDS
};

export default blockvalidationStrategy;
