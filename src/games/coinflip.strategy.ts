/**
 * CoinFlip Strategy
 * 
 * Juego simple de cara o cruz (50/50).
 * Single round game.
 * 
 * WHY: Implementa GameStrategy pattern para desacoplar la lógica
 * del juego del motor de ejecución (useGameEngine).
 * 
 * WHY (Dependency Injection): Las funciones secureRandomInt y secureLog
 * se reciben del contexto, no de imports directos. Esto permite:
 * 1. Mockear en tests
 * 2. Cambiar implementación sin modificar este archivo
 */
import {
    GAME_PHASES,
    type GameStrategy,
    type GameContext,
    type GameRefs,
    type CoinFlipState
} from './gameStrategy';

/** Tiempo límite para selección (10 segundos) */
const SELECTION_TIMEOUT_MS = 10000;

/** Posibles resultados del coinflip */
export type CoinFlipResult = 'heads' | 'tails';

/**
 * Extended context with secureRandomInt and secureLog - not extending GameContext to avoid type conflicts
 */
interface CoinFlipContext {
    readonly updateGameState: (updates: Record<string, unknown>) => void;
    readonly setPhase: (phase: string) => void;
    readonly setIsChooser: (isChooser: boolean) => void;
    readonly setResult: (result: unknown) => void;
    readonly finishGame: (isWin: boolean, result?: unknown) => void;
    readonly playerSide?: string | null;
    readonly secureRandomInt: (min: number, max: number) => number;
    readonly secureLog: {
        info: (...args: unknown[]) => void;
        warn: (...args: unknown[]) => void;
    };
}

/**
 * CoinFlip game strategy implementation
 */
export const coinflipStrategy: GameStrategy<CoinFlipState> = {
    type: 'coinflip',

    /**
     * Retorna el estado inicial específico de este juego
     */
    getInitialState: (): CoinFlipState => ({
        selectionTimeLeft: Math.floor(SELECTION_TIMEOUT_MS / 1000),
        selectionTimerId: null
    }),

    /**
     * Setup del juego - asigna rol aleatorio
     * WHY: Usa secureRandomInt del contexto para permitir mocking en tests
     */
    setup: (context: GameContext, _refs: GameRefs): void => {
        const ctx = context as unknown as CoinFlipContext;
        const { setPhase, setIsChooser, secureRandomInt, secureLog } = ctx;
        const userIsChooser = secureRandomInt(0, 1) === 1;
        setIsChooser(userIsChooser);
        setPhase(GAME_PHASES.SELECTION);

        secureLog.info(`[CoinFlip] Selection phase started. Timeout: ${SELECTION_TIMEOUT_MS}ms`);
    },

    /**
     * Ejecuta la lógica de resultado
     */
    spin: (context: GameContext): void => {
        const ctx = context as unknown as CoinFlipContext;
        const { playerSide, finishGame, setResult, secureRandomInt } = ctx;

        // Use crypto-secure random for coinflip
        const finalResult: CoinFlipResult = secureRandomInt(0, 1) === 1 ? 'heads' : 'tails';
        const isWin = finalResult === playerSide;

        setResult(finalResult);
        finishGame(isWin, finalResult);
    },

    /**
     * Auto-selección si expira el tiempo
     */
    autoSelect: (context: GameContext): CoinFlipResult => {
        const ctx = context as unknown as CoinFlipContext;
        const { secureRandomInt, secureLog } = ctx;
        const autoChoice: CoinFlipResult = secureRandomInt(0, 1) === 1 ? 'heads' : 'tails';
        secureLog.warn(`[CoinFlip] Auto-selecting: ${autoChoice} (timeout)`);
        return autoChoice;
    },

    /**
     * Handlers específicos del juego
     * CoinFlip no tiene handlers especiales
     */
    handlers: {}
};

export default coinflipStrategy;
