/**
 * Dice Strategy
 * 
 * Duelo de dados - el número más alto gana.
 * Single round game.
 * 
 * WHY: No hay fase de selección - va directo a spin para UX más rápida.
 * Los dados generan valores 1-10 (más rango que 1-6 estándar para menor
 * probabilidad de empates).
 * 
 * WHY (DI): secureRandomInt viene del contexto para permitir mocking en tests.
 */
import {
    GAME_PHASES,
    GAME_STATUS,
    type GameStrategy,
    type GameContext,
    type DiceState
} from './gameStrategy';

/**
 * Result of a dice roll
 */
export interface DiceResult {
    readonly player: number;
    readonly opponent: number;
    readonly tieResolved: boolean;
}

/**
 * Extended context with secureRandomInt - not extending GameContext to avoid type conflicts
 */
interface DiceContext {
    readonly updateGameState: (updates: Record<string, unknown>) => void;
    readonly setPhase: (phase: string) => void;
    readonly setStatus: (status: string) => void;
    readonly setIsChooser: (isChooser: boolean) => void;
    readonly setResult: (result: unknown) => void;
    readonly finishGame: (isWin: boolean, result?: unknown) => void;
    readonly secureRandomInt: (min: number, max: number) => number;
}

/**
 * Dice game strategy implementation
 */
export const diceStrategy: GameStrategy<DiceState> = {
    type: 'dice',

    /**
     * Retorna el estado inicial específico de este juego
     * Dice no necesita estado adicional beyond base
     */
    getInitialState: (): DiceState => ({}),

    /**
     * Setup del juego
     * WHY: Dice va directo a spin porque no hay selección de lado
     */
    setup: (context: GameContext): void => {
        const ctx = context as unknown as DiceContext;
        const { setIsChooser, setPhase, setStatus, secureRandomInt } = ctx;
        const userIsChooser = secureRandomInt(0, 1) === 1;
        setIsChooser(userIsChooser);
        // Dice va directo a spin (no hay selección)
        setPhase(GAME_PHASES.SPIN);
        setStatus(GAME_STATUS.SPIN);
    },

    /**
     * Ejecuta la lógica de resultado
     * WHY: Loop hasta que no haya empate - asegura un ganador definitivo
     */
    spin: (context: GameContext): void => {
        const ctx = context as unknown as DiceContext;
        const { finishGame, setResult, secureRandomInt } = ctx;

        let playerRoll: number;
        let opponentRoll: number;
        let attempts = 0;

        // Loop until there's a winner (no ties allowed)
        do {
            playerRoll = secureRandomInt(1, 10);
            opponentRoll = secureRandomInt(1, 10);
            attempts++;
            // Safety break - mathematically should converge
            if (attempts > 100) break;
        } while (playerRoll === opponentRoll);

        const isWin = playerRoll > opponentRoll;
        const finalResult: DiceResult = {
            player: playerRoll,
            opponent: opponentRoll,
            tieResolved: attempts > 1
        };

        setResult(finalResult);
        finishGame(isWin, finalResult);
    },

    /**
     * Handlers específicos del juego
     * Dice no tiene handlers especiales
     */
    handlers: {}
};

export default diceStrategy;
