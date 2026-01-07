/**
 * RPS (Rock-Paper-Scissors) Strategy
 * 
 * Piedra, Papel o Tijera - Single Round.
 * Si hay empate, se repite hasta 5 veces. Después, resolución automática.
 * 
 * WHY: El límite de 5 empates evita loops infinitos mientras mantiene
 * la experiencia de juego justa. La auto-resolución asegura que siempre
 * hay un ganador.
 * 
 * WHY (DI): secureRandomInt y secureLog vienen del contexto para testing.
 */
import {
    GAME_PHASES,
    OUTCOMES,
    type GameStrategy,
    type GameContext,
    type GameRefs,
    type Outcome
} from './gameStrategy';

// ============================================
// Constants
// ============================================

/** Tiempo límite para elegir (10 segundos) */
export const SELECTION_TIMEOUT_MS = 10000;

/** Máximo de empates antes de auto-resolver */
export const MAX_DRAW_ROUNDS = 5;

// ============================================
// Types
// ============================================

/** Valid RPS choices */
export type RPSChoice = 'rock' | 'paper' | 'scissors';

/** All valid choices as readonly array */
const RPS_CHOICES: readonly RPSChoice[] = ['rock', 'paper', 'scissors'] as const;

/** Win conditions - maps choice to what it beats */
const WINS: Record<RPSChoice, RPSChoice> = {
    rock: 'scissors',
    paper: 'rock',
    scissors: 'paper'
} as const;

/**
 * RPS game state
 */
export interface RPSGameState {
    readonly drawCount: number;
    readonly selectionTimeLeft: number;
    readonly selectionTimerId: ReturnType<typeof setTimeout> | null;
    readonly rpsResult: RPSResult | null;
}

/**
 * Result of a RPS round
 */
export interface RPSResult {
    readonly player: RPSChoice;
    readonly opponent: RPSChoice;
    readonly autoResolved?: boolean;
    readonly drawCount?: number;
    readonly outcome?: 'win' | 'loss' | 'draw';
}

/**
 * Extended context with security functions - not extending GameContext to avoid type conflicts
 */
interface RPSContext {
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
    readonly gameState?: RPSGameState;
}

// ============================================
// Pure Helper Functions
// ============================================

/**
 * Determina el resultado de una mano RPS
 * WHY: Función pura para testeo unitario fácil
 */
export const determineOutcome = (player: string, opponent: string): Outcome => {
    if (player === opponent) return OUTCOMES.DRAW;
    return WINS[player as RPSChoice] === opponent ? OUTCOMES.WIN : OUTCOMES.LOSS;
};

/**
 * Gets a random RPS choice using provided random function
 */
const getRandomChoice = (secureRandomInt: (min: number, max: number) => number): RPSChoice => {
    return RPS_CHOICES[secureRandomInt(0, 2)];
};

// ============================================
// Strategy Implementation
// ============================================

/**
 * RPS game strategy implementation
 */
export const rpsStrategy: GameStrategy<RPSGameState> & {
    readonly determineOutcome: typeof determineOutcome;
    readonly SELECTION_TIMEOUT_MS: number;
    readonly MAX_DRAW_ROUNDS: number;
} = {
    type: 'rps',

    /**
     * Retorna el estado inicial específico de este juego
     */
    getInitialState: (): RPSGameState => ({
        drawCount: 0,
        selectionTimeLeft: Math.floor(SELECTION_TIMEOUT_MS / 1000),
        selectionTimerId: null,
        rpsResult: null
    }),

    /**
     * Setup del juego
     * WHY: En RPS ambos jugadores eligen simultáneamente (isChooser = true)
     */
    setup: (context: GameContext, _refs: GameRefs): void => {
        const ctx = context as unknown as RPSContext;
        const { setIsChooser, setPhase, updateGameState, secureLog } = ctx;
        setIsChooser(true);
        setPhase(GAME_PHASES.SELECTION);
        updateGameState({
            drawCount: 0,
            selectionTimeLeft: Math.floor(SELECTION_TIMEOUT_MS / 1000)
        });
        secureLog.info(`[RPS] Single-round mode. Selection timeout: ${SELECTION_TIMEOUT_MS}ms`);
    },

    /**
     * Ejecuta la lógica de resultado
     */
    spin: (context: GameContext): void => {
        const ctx = context as unknown as RPSContext;
        const { playerSide, setResult, updateGameState, finishGame, secureRandomInt, secureLog } = ctx;
        const gameState = ctx.gameState || rpsStrategy.getInitialState();

        // Verificar si ya excedimos el límite de empates
        if (gameState.drawCount >= MAX_DRAW_ROUNDS) {
            secureLog.warn(`[RPS] ${MAX_DRAW_ROUNDS} consecutive draws! Auto-resolving...`);

            let playerChoice: RPSChoice;
            let opponentChoice: RPSChoice;
            let isWin: boolean;

            // Loop hasta que no haya empate
            do {
                playerChoice = getRandomChoice(secureRandomInt);
                opponentChoice = getRandomChoice(secureRandomInt);
            } while (playerChoice === opponentChoice);

            isWin = determineOutcome(playerChoice, opponentChoice) === OUTCOMES.WIN;

            const finalResult: RPSResult = {
                player: playerChoice,
                opponent: opponentChoice,
                autoResolved: true,
                drawCount: gameState.drawCount,
                outcome: isWin ? 'win' : 'loss'
            };

            setResult(finalResult);
            finishGame(isWin, finalResult);
            return;
        }

        // Juego normal: usar la elección del jugador
        const opponentChoice = getRandomChoice(secureRandomInt);
        const outcome = determineOutcome(playerSide || 'rock', opponentChoice);

        const finalResult: RPSResult = {
            player: playerSide as RPSChoice,
            opponent: opponentChoice
        };

        if (outcome === OUTCOMES.DRAW) {
            // Empate - incrementar contador y preparar siguiente ronda
            secureLog.info(`[RPS] Draw! Count: ${gameState.drawCount + 1}/${MAX_DRAW_ROUNDS}`);

            updateGameState({
                drawCount: gameState.drawCount + 1,
                status: 'round_result',
                outcome: 'draw',
                rpsResult: finalResult
            });

            setResult(finalResult);

            // Preparar siguiente ronda tras mostrar resultado
            setTimeout(() => {
                updateGameState({
                    playerSide: null,
                    selectionTimeLeft: Math.floor(SELECTION_TIMEOUT_MS / 1000)
                });
            }, 2500);
        } else {
            // Victoria o derrota - terminar juego
            const isWin = outcome === OUTCOMES.WIN;
            secureLog.info(`[RPS] ${isWin ? 'Player wins!' : 'Opponent wins!'}`);

            const resultWithOutcome: RPSResult = {
                ...finalResult,
                drawCount: gameState.drawCount,
                outcome: isWin ? 'win' : 'loss'
            };

            setResult(resultWithOutcome);

            updateGameState({
                status: 'round_result',
                outcome: isWin ? 'win' : 'loss',
                rpsResult: finalResult
            });

            setTimeout(() => {
                finishGame(isWin, resultWithOutcome);
            }, 2000);
        }
    },

    /**
     * Auto-selección si expira el tiempo (10 segundos)
     */
    autoSelect: (context: GameContext): string => {
        const ctx = context as unknown as RPSContext;
        const { secureRandomInt, secureLog } = ctx;
        const autoChoice = getRandomChoice(secureRandomInt);
        secureLog.warn(`[RPS] Auto-selecting: ${autoChoice} (10s timeout)`);
        return autoChoice;
    },

    /**
     * Handlers específicos del juego
     * RPS usa selectSide genérico
     */
    handlers: {},

    // Export helpers and constants
    determineOutcome,
    SELECTION_TIMEOUT_MS,
    MAX_DRAW_ROUNDS
};

export default rpsStrategy;
