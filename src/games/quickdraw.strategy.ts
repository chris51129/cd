/**
 * QuickDraw Strategy
 * 
 * Juego de reflejos - Reacciona lo más rápido posible.
 * Reaction time game.
 * 
 * WHY: Los tiempos de reacción humanos típicos son 150-300ms. El bot simula 
 * tiempos de 200-450ms para dar oportunidad al jugador sin ser trivial.
 * 
 * WHY (DI): secureRandomInt y secureLog vienen del contexto para testing.
 */
import {
    GAME_PHASES,
    GAME_STATUS,
    type GameStrategy,
    type GameContext,
    type GameRefs
} from './gameStrategy';

// ============================================
// Constants
// ============================================

/** Cuenta regresiva inicial (segundos) */
export const COUNTDOWN_SECONDS = 5;

/** Tiempo máximo para reaccionar tras señal verde (ms) */
export const SIGNAL_TIMEOUT_MS = 20000;

/** Penalización por false start (ms) */
const FALSE_START_PENALTY_MS = 1000;

/** Rango de reacción del bot (ms) */
const BOT_REACTION_MIN = 200;
const BOT_REACTION_MAX = 450;

// ============================================
// Types
// ============================================

/** QuickDraw game states */
export type QuickDrawPhase = 'countdown' | 'waiting' | 'signal' | 'result';

/** QuickDraw game state */
export interface QuickDrawGameState {
    readonly quickDrawState: QuickDrawPhase;
    readonly countdownLeft: number;
    readonly startTime: number;
    readonly reactionTime: number | null;
    readonly hasPenalty: boolean;
    readonly signalTimeoutId: ReturnType<typeof setTimeout> | null;
}

/** QuickDraw result */
export interface QuickDrawResult {
    readonly player: number;
    readonly opponent: number;
    readonly reactionTime: number;
    readonly hasPenalty?: boolean;
    readonly timeout?: boolean;
    readonly opponentTimeout?: boolean;
    readonly bothTimeout?: boolean;
    readonly tieBreaker?: 'random';
    readonly outcome: 'win' | 'loss';
}

/** Extended context with security functions - not extending GameContext to avoid type conflicts */
interface QuickDrawContext {
    readonly updateGameState: (updates: Record<string, unknown>) => void;
    readonly setPhase: (phase: string) => void;
    readonly setStatus: (status: string) => void;
    readonly setResult: (result: unknown) => void;
    readonly finishGame: (isWin: boolean, result?: unknown) => void;
    readonly secureRandomInt: (min: number, max: number) => number;
    readonly secureLog: {
        info: (...args: unknown[]) => void;
        warn: (...args: unknown[]) => void;
    };
    readonly gameState: QuickDrawGameState;
}

// ============================================
// Strategy Implementation
// ============================================

/**
 * QuickDraw game strategy implementation
 */
export const quickdrawStrategy: GameStrategy<QuickDrawGameState> & {
    readonly COUNTDOWN_SECONDS: number;
    readonly SIGNAL_TIMEOUT_MS: number;
} = {
    type: 'quickdraw',

    /**
     * Retorna el estado inicial específico de este juego
     */
    getInitialState: (): QuickDrawGameState => ({
        quickDrawState: 'countdown',
        countdownLeft: COUNTDOWN_SECONDS,
        startTime: 0,
        reactionTime: null,
        hasPenalty: false,
        signalTimeoutId: null
    }),

    /**
     * Setup del juego
     */
    setup: (context: GameContext, _refs: GameRefs): void => {
        const ctx = context as unknown as QuickDrawContext;
        const { setPhase, setStatus, updateGameState, secureLog } = ctx;

        setPhase(GAME_PHASES.SPIN);
        setStatus(GAME_STATUS.SPIN);
        updateGameState({
            quickDrawState: 'countdown',
            countdownLeft: COUNTDOWN_SECONDS
        });

        secureLog.info(`[QuickDraw] Starting with ${COUNTDOWN_SECONDS}s countdown`);
    },

    /**
     * QuickDraw no tiene spin tradicional - usa handlers
     */
    spin: (): void => { },

    /**
     * Handlers específicos del juego
     */
    handlers: {
        /**
         * Handler de click para reacción
         */
        handleClick: (context: unknown): void => {
            const ctx = context as unknown as QuickDrawContext;
            const { gameState, updateGameState, setResult, finishGame, secureRandomInt, secureLog } = ctx;

            // No procesar clics durante countdown o result
            if (gameState.quickDrawState === 'countdown') return;
            if (gameState.quickDrawState === 'result') return;

            const now = performance.now();

            if (gameState.quickDrawState === 'waiting') {
                // FALSE START - Penalty but don't finish
                if (!gameState.hasPenalty) {
                    secureLog.warn('[QuickDraw] False Start detected! Penalty: +1000ms');
                    updateGameState({ hasPenalty: true });
                }
                return;
            }

            if (gameState.quickDrawState === 'signal') {
                // VALID REACTION
                const baseReaction = Math.floor(now - gameState.startTime);
                const penalty = gameState.hasPenalty ? FALSE_START_PENALTY_MS : 0;
                const totalReaction = baseReaction + penalty;

                secureLog.info(`[QuickDraw] Base: ${baseReaction}ms | Penalty: ${penalty}ms | Total: ${totalReaction}ms`);

                // Simulating opponent
                const opponentReaction = secureRandomInt(BOT_REACTION_MIN, BOT_REACTION_MAX);

                let isWin = false;
                if (totalReaction < opponentReaction) {
                    isWin = true;
                } else if (totalReaction === opponentReaction) {
                    // RESOLVE COLLISION: Random tie-breaker
                    isWin = secureRandomInt(0, 1) === 1;
                }

                const finalResult: QuickDrawResult = {
                    player: totalReaction,
                    opponent: opponentReaction,
                    reactionTime: totalReaction,
                    hasPenalty: gameState.hasPenalty,
                    outcome: isWin ? 'win' : 'loss'
                };

                updateGameState({
                    quickDrawState: 'result',
                    reactionTime: totalReaction
                });
                setResult(finalResult);
                finishGame(isWin, finalResult);
            }
        },

        /**
         * Auto-resolve si nadie reacciona en 20 segundos
         */
        handleSignalTimeout: (context: unknown): void => {
            const ctx = context as unknown as QuickDrawContext;
            const { gameState, updateGameState, setResult, finishGame, secureRandomInt, secureLog } = ctx;

            if (gameState.quickDrawState !== 'signal') return;

            secureLog.warn('[QuickDraw] Signal timeout (20s)! Auto-resolving...');

            const playerClicked = gameState.reactionTime !== null &&
                gameState.reactionTime < SIGNAL_TIMEOUT_MS;

            let isWin: boolean;
            let finalResult: QuickDrawResult;

            if (playerClicked) {
                // Player clicked, opponent didn't → player wins
                secureLog.info('[QuickDraw] Player clicked, opponent timeout. Player wins!');
                isWin = true;
                finalResult = {
                    player: gameState.reactionTime!,
                    opponent: SIGNAL_TIMEOUT_MS,
                    reactionTime: gameState.reactionTime!,
                    timeout: true,
                    opponentTimeout: true,
                    outcome: 'win'
                };
            } else {
                // Both timed out → random winner
                secureLog.warn('[QuickDraw] Both players timed out! Random winner.');
                isWin = secureRandomInt(0, 1) === 1;
                finalResult = {
                    player: SIGNAL_TIMEOUT_MS,
                    opponent: SIGNAL_TIMEOUT_MS,
                    reactionTime: SIGNAL_TIMEOUT_MS,
                    timeout: true,
                    bothTimeout: true,
                    tieBreaker: 'random',
                    outcome: isWin ? 'win' : 'loss'
                };
            }

            updateGameState({ quickDrawState: 'result', reactionTime: finalResult.player });
            setResult(finalResult);
            finishGame(isWin, finalResult);
        }
    },

    // Export constants
    COUNTDOWN_SECONDS,
    SIGNAL_TIMEOUT_MS
};

export default quickdrawStrategy;
