/**
 * Memory Strategy
 * Módulo de memoria - Competición de retención cognitiva.
 * 
 * ANTI-CHEAT: Revelación progresiva de cartas para evitar capturas de pantalla.
 * Fase 1: 4 cartas aleatorias (2.5s) → Fase 2: otras 4 cartas aleatorias (2.5s) → Juego
 * 
 * WHY: La revelación progresiva evita que un jugador capture toda la información
 * de una sola vez con una captura de pantalla.
 * 
 * WHY (DI): secureShuffleArray, secureRandomInt, secureLog vienen del contexto.
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

/** Iconos crypto para las cartas */
export const MEMORY_ICONS: readonly string[] = ['₿', 'Ξ', '◎', '⟠', '✦', '◆', '⬡', '❖'] as const;

/** Configuración de fase de memorización progresiva (Anti-Cheat) */
export const MEMORIZE_CONFIG = {
    PHASE_DURATION_SECONDS: 2.5,
    CARDS_PER_PHASE: 4,
    TOTAL_PHASES: 2
} as const;

/** Total de cartas en el tablero */
const TOTAL_CARDS = 16;

/** Cooldown entre clicks (ms) */
const CLICK_COOLDOWN_MS = 100;

// ============================================
// Types
// ============================================

/** Memory game phases */
export type MemoryPhase = 'memorize' | 'playing' | 'result';

/** Memory scores */
export interface MemoryScores {
    readonly player: number;
    readonly opponent: number;
}

/** Memory game state */
export interface MemoryGameState {
    readonly board: readonly number[];
    readonly flippedIndices: readonly number[];
    readonly matchedIndices: readonly number[];
    readonly memoryScores: MemoryScores;
    readonly timeLeft: number;
    readonly memoryPhase: MemoryPhase;
    readonly memorizePhaseNumber: number;
    readonly memorizeTimeLeft: number;
    readonly revealedIndices: readonly number[];
    readonly pairTimestamps: readonly number[];
    readonly gameStartTime: number;
    readonly phase?: string;
}

/** Refs used for memory game handlers */
export interface MemoryRefs extends GameRefs {
    readonly isProcessingRef: { current: boolean };
    readonly lastClickTimeRef: { current: number };
}

/** Extended context with security functions - not extending GameContext to avoid type conflicts */
interface MemoryContext {
    readonly updateGameState: (updates: Record<string, unknown>) => void;
    readonly setPhase: (phase: string) => void;
    readonly setStatus: (status: string) => void;
    readonly finishGame: (isWin: boolean, result?: unknown) => void;
    readonly secureShuffleArray: <T>(arr: readonly T[]) => T[];
    readonly secureRandomInt: (min: number, max: number) => number;
    readonly secureLog: {
        info: (...args: unknown[]) => void;
        warn: (...args: unknown[]) => void;
    };
    readonly gameState?: MemoryGameState;
}

// ============================================
// Pure Helper Functions
// ============================================

/**
 * Selecciona N índices aleatorios del tablero, excluyendo ciertos índices
 * WHY: Función pura para facilitar testing
 */
export const selectRandomIndices = (
    count: number,
    exclude: readonly number[] = [],
    totalCards: number = TOTAL_CARDS,
    randomFn: (min: number, max: number) => number
): number[] => {
    const available: number[] = [];
    for (let i = 0; i < totalCards; i++) {
        if (!exclude.includes(i)) {
            available.push(i);
        }
    }

    const selected: number[] = [];
    const availableCopy = [...available];

    for (let i = 0; i < Math.min(count, availableCopy.length); i++) {
        const randomIndex = randomFn(0, availableCopy.length - 1);
        selected.push(availableCopy[randomIndex]);
        availableCopy.splice(randomIndex, 1);
    }

    return selected;
};

// ============================================
// Strategy Implementation
// ============================================

/**
 * Memory game strategy implementation
 */
export const memoryStrategy: GameStrategy<MemoryGameState> & {
    readonly generateBoard: <T>(shuffleFn: (arr: readonly T[]) => T[]) => number[];
    readonly checkTimeUp: (context: GameContext) => boolean;
    readonly MEMORIZE_CONFIG: typeof MEMORIZE_CONFIG;
    readonly MEMORY_ICONS: typeof MEMORY_ICONS;
} = {
    type: 'memory',

    /**
     * Retorna el estado inicial específico de este módulo
     */
    getInitialState: (): MemoryGameState => ({
        board: [],
        flippedIndices: [],
        matchedIndices: [],
        memoryScores: { player: 0, opponent: 0 },
        timeLeft: 30,
        memoryPhase: 'memorize',
        memorizePhaseNumber: 1,
        memorizeTimeLeft: MEMORIZE_CONFIG.PHASE_DURATION_SECONDS,
        revealedIndices: [],
        pairTimestamps: [],
        gameStartTime: 0
    }),

    /**
     * Genera un tablero de memoria con parejas barajadas
     */
    generateBoard: <T>(shuffleFn: (arr: readonly T[]) => T[]): number[] => {
        const pairs = [0, 1, 2, 3, 4, 5, 6, 7];
        const doubled = [...pairs, ...pairs];
        return shuffleFn(doubled as unknown as readonly T[]) as unknown as number[];
    },

    /**
     * Setup del juego - inicializa tablero y primera fase de memorización
     */
    setup: (context: GameContext): void => {
        const ctx = context as unknown as MemoryContext;
        const { updateGameState, setPhase, setStatus, secureShuffleArray, secureRandomInt, secureLog } = ctx;
        const board = memoryStrategy.generateBoard(secureShuffleArray);

        // Seleccionar 4 cartas aleatorias para la primera fase de memorización
        const initialRevealedIndices = selectRandomIndices(
            MEMORIZE_CONFIG.CARDS_PER_PHASE,
            [],
            TOTAL_CARDS,
            secureRandomInt
        );

        updateGameState({
            board,
            flippedIndices: [],
            matchedIndices: [],
            memoryScores: { player: 0, opponent: 0 },
            timeLeft: 30,
            memoryPhase: 'memorize',
            memorizePhaseNumber: 1,
            memorizeTimeLeft: MEMORIZE_CONFIG.PHASE_DURATION_SECONDS,
            revealedIndices: initialRevealedIndices,
            pairTimestamps: [],
            gameStartTime: 0
        });
        setPhase(GAME_PHASES.SPIN);
        setStatus(GAME_STATUS.SPIN);
        secureLog.info(`[Memory] Starting progressive memorize phase 1/2 with ${MEMORIZE_CONFIG.CARDS_PER_PHASE} cards`);
    },

    /**
     * Memory no tiene spin tradicional - el timer es manejado externamente
     */
    spin: (): void => {
        // El timer de memoria es manejado por un useEffect en el hook principal
    },

    /**
     * Handlers específicos del juego
     */
    handlers: {
        /**
         * Handler de click en carta
         * Signature: (index, context, refs) para compatibilidad con JS original
         */
        handleCardClick: (index: unknown, context: unknown, refs: unknown): boolean => {
            const ctx = context as unknown as MemoryContext;
            const memRefs = refs as MemoryRefs;
            const { updateGameState, gameState } = ctx;
            const state = gameState || memoryStrategy.getInitialState();

            const now = Date.now();

            // ===== VALIDACIONES BÁSICAS =====
            if (typeof index !== 'number' || !Number.isInteger(index)) return false;
            if (index < 0 || index >= TOTAL_CARDS) return false;

            // Rate Limiting
            if (now - memRefs.lastClickTimeRef.current < CLICK_COOLDOWN_MS) return false;
            memRefs.lastClickTimeRef.current = now;

            // Mutex Lock
            if (memRefs.isProcessingRef.current) return false;
            memRefs.isProcessingRef.current = true;

            // Validaciones que dependen del estado actual
            if (state.phase !== GAME_PHASES.SPIN || state.timeLeft <= 0) {
                memRefs.isProcessingRef.current = false;
                return false;
            }
            if (state.memoryPhase !== 'playing') {
                memRefs.isProcessingRef.current = false;
                return false;
            }
            if (state.matchedIndices.includes(index)) {
                memRefs.isProcessingRef.current = false;
                return false;
            }
            if (state.flippedIndices.includes(index)) {
                memRefs.isProcessingRef.current = false;
                return false;
            }
            if (state.flippedIndices.length >= 2) {
                memRefs.isProcessingRef.current = false;
                return false;
            }

            // Añadir carta a flippedIndices
            const newFlipped = [...state.flippedIndices, index];

            if (newFlipped.length === 1) {
                memRefs.isProcessingRef.current = false;
                updateGameState({ flippedIndices: newFlipped });
                return true;
            }

            // Si hay 2 cartas, verificar match
            const [first, second] = newFlipped;

            if (first === second) {
                memRefs.isProcessingRef.current = false;
                return false;
            }

            const isMatch = state.board[first] === state.board[second];

            if (isMatch) {
                memRefs.isProcessingRef.current = false;
                updateGameState({
                    flippedIndices: [],
                    matchedIndices: [...state.matchedIndices, first, second],
                    memoryScores: {
                        ...state.memoryScores,
                        player: state.memoryScores.player + 1
                    },
                    pairTimestamps: [...state.pairTimestamps, performance.now()]
                });
            } else {
                updateGameState({ flippedIndices: newFlipped });
                setTimeout(() => {
                    updateGameState({ flippedIndices: [] });
                    memRefs.isProcessingRef.current = false;
                }, 1000);
            }

            return true;
        }
    },

    /**
     * Verifica si el tiempo se acabó y determina ganador
     */
    checkTimeUp: (context: GameContext): boolean => {
        const ctx = context as unknown as MemoryContext;
        const { finishGame, gameState } = ctx;
        const state = gameState || memoryStrategy.getInitialState();

        if (state.timeLeft === 0) {
            const playerWins = state.memoryScores.player > state.memoryScores.opponent;
            finishGame(playerWins, state.memoryScores);
            return true;
        }
        return false;
    },

    MEMORIZE_CONFIG,
    MEMORY_ICONS
};

export default memoryStrategy;
