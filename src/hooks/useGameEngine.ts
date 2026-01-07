/**
 * useGameEngine - Módulo central de ejecución para CryptoDuels
 * Refactorizado con Patrón Strategy/Factory (v2 Core)
 *
 * Este hook orquesta la lógica de juegos usando estrategias independientes.
 * Cada tipo de juego tiene su propia estrategia en src/games/
 * 
 * WHY: Central orchestration hook that manages game state transitions,
 * timers, and delegates game-specific logic to strategy modules.
 * Follows FCIS pattern - this is the "imperative shell" that orchestrates I/O (timers).
 */
import { useState, useEffect, useRef, useCallback, useMemo, type MutableRefObject } from 'react';
import { GAME_CONFIG } from '../constants/config';
import { getGameStrategy, getInitialGameState, GAME_PHASES, GAME_STATUS, type GameStrategy } from '../games';
import { secureRandomInt, secureShuffleArray, secureLog } from '../utils/security';

// ============================================
// Types
// ============================================

/** Game types supported by the engine */
export type GameType = 'coinflip' | 'dice' | 'rps' | 'memory' | 'quickdraw' | 'blockvalidation';

/** Game outcome */
export type GameOutcome = 'win' | 'loss' | null;

/** Memory scores */
export interface MemoryScores {
    readonly player: number;
    readonly opponent: number;
}

/** RPS scores */
export interface RPSScores {
    readonly player: number;
    readonly opponent: number;
}

/** Complete game state */
export interface GameState {
    // Base state
    readonly phase: string;
    readonly status: string;
    readonly isChooser: boolean;
    readonly playerSide: string | null;
    readonly result: unknown;
    readonly outcome: GameOutcome;

    // RPS state
    readonly scores: RPSScores;
    readonly currentRound: number;

    // Selection state
    readonly selectionTimeLeft?: number;
    readonly selectionTimerId?: ReturnType<typeof setTimeout> | null;

    // Memory state
    readonly board?: readonly number[];
    readonly flippedIndices?: readonly number[];
    readonly matchedIndices?: readonly number[];
    readonly memoryScores?: MemoryScores;
    readonly timeLeft?: number;
    readonly pairTimestamps?: readonly number[];
    readonly opponentPairTimestamps?: readonly number[];
    readonly gameStartTime?: number;
    readonly memoryPhase?: 'memorize' | 'playing' | 'result';
    readonly memorizePhaseNumber?: number;
    readonly memorizeTimeLeft?: number;
    readonly revealedIndices?: readonly number[];

    // QuickDraw state
    readonly quickDrawState?: 'countdown' | 'waiting' | 'signal' | 'result';
    readonly countdownLeft?: number;
    readonly startTime?: number;
    readonly reactionTime?: number | null;
    readonly hasPenalty?: boolean;
    readonly signalTimeoutId?: ReturnType<typeof setTimeout> | null;

    // BlockValidation state
    readonly blockGrid?: readonly number[];
    readonly blockNextTarget?: number;
    readonly blockErrors?: number;
    readonly blockState?: 'countdown' | 'playing' | 'result';
    readonly blockStartTime?: number;
    readonly blockTimeLeft?: number;
    readonly blockTimestamps?: readonly number[];
}

/** Game finish result */
export interface GameFinishResult {
    readonly result: unknown;
    readonly outcome: GameOutcome;
}

/** Hook props */
export interface UseGameEngineProps {
    readonly gameType: GameType;
    readonly onFinish?: (result: GameFinishResult) => void;
}

/** Action handlers */
export interface GameActions {
    readonly selectSide: (side: string) => void;
    readonly confirmAssigned: (assignedSide: string) => void;
    readonly handleMemoryCardClick: (index: number) => void;
    readonly handleQuickDrawClick: () => void;
    readonly handleBlockCellClick: (clickedNumber: number) => void;
}

/** Hook return type */
export interface UseGameEngineResult {
    readonly gameState: GameState;
    readonly actions: GameActions;
    readonly strategy: string | null;
    readonly isStrategyLoaded: boolean;
}

/** Strategy context refs */
export interface StrategyRefs {
    readonly hasFinished: MutableRefObject<boolean>;
    readonly isProcessingRef: MutableRefObject<boolean>;
    readonly lastClickTimeRef: MutableRefObject<number>;
}

/** Strategy context type */
export interface StrategyContext {
    readonly gameState: GameState;
    readonly setPhase: (phase: string) => void;
    readonly setStatus: (status: string) => void;
    readonly setIsChooser: (isChooser: boolean) => void;
    readonly setResult: (result: unknown) => void;
    readonly setFlippedIndices: (updates: number[] | ((prev: readonly number[]) => number[])) => void;
    readonly setMatchedIndices: (updates: number[] | ((prev: readonly number[]) => number[])) => void;
    readonly updateGameState: (updates: Partial<GameState> | ((prev: GameState) => Partial<GameState>)) => void;
    readonly finishGame: (isWin: boolean, finalResult: unknown) => void;
    readonly handleRPSRound: (isRoundWin: boolean, isDraw: boolean, finalResult: unknown) => void;
    readonly refs: StrategyRefs;
    readonly secureRandomInt: typeof secureRandomInt;
    readonly secureShuffleArray: typeof secureShuffleArray;
    readonly secureLog: typeof secureLog;
    readonly playerSide?: string | null;
}

// ============================================
// Hook Implementation
// ============================================

/**
 * Central game engine hook
 * 
 * @param props - Game type and finish callback
 * @returns Game state, actions, and metadata
 */
const useGameEngine = ({ gameType, onFinish }: UseGameEngineProps): UseGameEngineResult => {
    // Obtener la estrategia del juego
    const strategy = useMemo(() => getGameStrategy(gameType) as GameStrategy<Record<string, unknown>> | null, [gameType]);

    // Estado inicial combinado (base + específico del juego)
    const initialGameState = useMemo((): GameState => ({
        // Estado base
        phase: GAME_PHASES.SETUP,
        status: GAME_STATUS.IDLE,
        isChooser: false,
        playerSide: null,
        result: null,
        outcome: null,
        // Estado RPS
        scores: { player: 0, opponent: 0 },
        currentRound: 1,
        // Estado específico del juego
        ...getInitialGameState(gameType)
    }), [gameType]);

    // Estado unificado del juego
    const [gameState, setGameState] = useState<GameState>(initialGameState);

    // Referencias
    const hasFinished = useRef<boolean>(false);
    const isProcessingRef = useRef<boolean>(false);
    const lastClickTimeRef = useRef<number>(0);

    // ========== HELPERS ==========

    /**
     * Actualiza el estado del juego de forma parcial
     */
    const updateGameState = useCallback((updates: Partial<GameState> | ((prev: GameState) => Partial<GameState>)): void => {
        if (typeof updates === 'function') {
            setGameState(prev => ({ ...prev, ...updates(prev) }));
        } else {
            setGameState(prev => ({ ...prev, ...updates }));
        }
    }, []);

    /**
     * Finaliza el juego
     */
    const finishGame = useCallback((isWin: boolean, finalResult: unknown): void => {
        const outcome: GameOutcome = isWin ? 'win' : 'loss';
        updateGameState({
            outcome,
            status: GAME_STATUS.RESULT,
            phase: GAME_PHASES.RESULT
        });
        hasFinished.current = true;

        if (onFinish) {
            onFinish({ result: finalResult, outcome });
        }
    }, [onFinish, updateGameState]);

    /**
     * Maneja una ronda de RPS (Single Round Mode)
     */
    const handleRPSRound = useCallback((isRoundWin: boolean, isDraw: boolean, _finalResult: unknown): void => {
        if (!isDraw) {
            secureLog.info(`[RPS] Round result: ${isRoundWin ? 'WIN' : 'LOSS'}`);
        } else {
            secureLog.info(`[RPS] Round result: DRAW`);
        }
    }, []);

    // ========== CONTEXTO PARA ESTRATEGIAS ==========

    const strategyContext = useMemo((): StrategyContext => ({
        gameState,
        setPhase: (phase: string) => updateGameState({ phase }),
        setStatus: (status: string) => updateGameState({ status }),
        setIsChooser: (isChooser: boolean) => updateGameState({ isChooser }),
        setResult: (result: unknown) => updateGameState({ result }),
        setFlippedIndices: (updates) => updateGameState(prev => ({
            flippedIndices: typeof updates === 'function' ? updates(prev.flippedIndices || []) : updates
        })),
        setMatchedIndices: (updates) => updateGameState(prev => ({
            matchedIndices: typeof updates === 'function' ? updates(prev.matchedIndices || []) : updates
        })),
        updateGameState,
        finishGame,
        handleRPSRound,
        refs: {
            hasFinished,
            isProcessingRef,
            lastClickTimeRef
        },
        secureRandomInt,
        secureShuffleArray,
        secureLog
    }), [gameState, updateGameState, finishGame, handleRPSRound]);

    // ========== SETUP PHASE ==========

    useEffect(() => {
        if (gameState.phase === GAME_PHASES.SETUP && strategy) {
            secureLog.info(`[GameEngine] Setting up game: ${gameType}`);
            strategy.setup(strategyContext as unknown as Parameters<typeof strategy.setup>[0], { hasFinished: hasFinished.current });
        }
    }, [gameState.phase, gameType, strategy, strategyContext]);

    // ========== SELECTION TIMEOUT (Coinflip & RPS) ==========

    useEffect(() => {
        if (gameState.phase !== GAME_PHASES.SELECTION) return;
        if (!strategy || !strategy.autoSelect) return;
        if (gameState.selectionTimeLeft === undefined) return;

        if (gameState.selectionTimeLeft > 0) {
            const timer = setTimeout(() => {
                updateGameState(prev => ({
                    selectionTimeLeft: (prev.selectionTimeLeft || 0) - 1
                }));
            }, 1000);
            return () => clearTimeout(timer);
        } else {
            secureLog.warn(`[GameEngine] Selection timeout! Auto-selecting for ${gameType}`);
            const autoChoice = strategy.autoSelect(strategyContext as unknown as Parameters<typeof strategy.autoSelect>[0]);

            updateGameState({
                playerSide: autoChoice as string,
                phase: GAME_PHASES.SPIN,
                status: GAME_STATUS.SPIN
            });
        }
        return undefined;
    }, [gameState.phase, gameState.selectionTimeLeft, strategy, strategyContext, gameType, updateGameState]);

    // ========== SPIN PHASE ==========

    useEffect(() => {
        if (gameState.phase === GAME_PHASES.SPIN &&
            gameState.status === GAME_STATUS.SPIN &&
            strategy &&
            strategy.spin) {

            const timer = setTimeout(() => {
                strategy.spin({
                    ...strategyContext,
                    playerSide: gameState.playerSide
                } as unknown as Parameters<typeof strategy.spin>[0]);
            }, GAME_CONFIG.SPIN_DURATION_MS);

            return () => clearTimeout(timer);
        }
        return undefined;
    }, [gameState.phase, gameState.status, gameState.playerSide, strategy, strategyContext]);

    // ========== QUICKDRAW COUNTDOWN ==========
    useEffect(() => {
        if (gameType !== 'quickdraw' || gameState.phase !== GAME_PHASES.SPIN) return;
        if (gameState.quickDrawState !== 'countdown') return;

        if ((gameState.countdownLeft || 0) > 0) {
            const timer = setTimeout(() => {
                updateGameState(prev => ({ countdownLeft: (prev.countdownLeft || 0) - 1 }));
            }, 1000);
            return () => clearTimeout(timer);
        } else {
            secureLog.info('[QuickDraw] Countdown finished. Transitioning to waiting...');
            updateGameState({ quickDrawState: 'waiting' });
        }
        return undefined;
    }, [gameType, gameState.phase, gameState.quickDrawState, gameState.countdownLeft, updateGameState]);

    // ========== QUICKDRAW WAITING → SIGNAL ==========
    useEffect(() => {
        if (gameType !== 'quickdraw' || gameState.phase !== GAME_PHASES.SPIN) return;
        if (gameState.quickDrawState !== 'waiting') return;

        const delay = secureRandomInt(2000, 7000);
        secureLog.info(`[QuickDraw] Waiting phase. Signal in ${delay}ms`);

        const signalTimer = setTimeout(() => {
            if (hasFinished.current) return;
            secureLog.info('[QuickDraw] Showing green signal!');
            updateGameState({
                quickDrawState: 'signal',
                startTime: performance.now()
            });
        }, delay);

        return () => clearTimeout(signalTimer);
    }, [gameType, gameState.phase, gameState.quickDrawState, updateGameState]);

    // ========== QUICKDRAW SIGNAL TIMEOUT ==========
    useEffect(() => {
        if (gameType !== 'quickdraw' || gameState.phase !== GAME_PHASES.SPIN) return;
        if (gameState.quickDrawState !== 'signal') return;

        const timeoutMs = (strategy as GameStrategy<Record<string, unknown>> & { SIGNAL_TIMEOUT_MS?: number })?.SIGNAL_TIMEOUT_MS || 20000;
        const timeoutTimer = setTimeout(() => {
            if (hasFinished.current) return;
            secureLog.warn('[QuickDraw] Signal timeout (20s)! Auto-resolving...');
            const handlers = strategy?.handlers as Record<string, (ctx: unknown) => void> | undefined;
            if (handlers?.handleSignalTimeout) {
                handlers.handleSignalTimeout(strategyContext);
            }
        }, timeoutMs);

        return () => clearTimeout(timeoutTimer);
    }, [gameType, gameState.phase, gameState.quickDrawState, strategy, strategyContext]);

    // ========== BLOCKVALIDATION COUNTDOWN & TIME LIMIT ==========
    useEffect(() => {
        if (gameType !== 'blockvalidation' || gameState.phase !== GAME_PHASES.SPIN) return;

        if (gameState.blockState === 'countdown') {
            if ((gameState.countdownLeft || 0) > 0) {
                const timer = setTimeout(() => {
                    updateGameState(prev => ({ countdownLeft: (prev.countdownLeft || 0) - 1 }));
                }, 1000);
                return () => clearTimeout(timer);
            } else {
                secureLog.info('[BlockValidation] Countdown finished. Game starting!');
                updateGameState({
                    blockState: 'playing',
                    blockStartTime: performance.now()
                });
            }
        }

        if (gameState.blockState === 'playing') {
            if ((gameState.blockTimeLeft || 0) > 0) {
                const timer = setTimeout(() => {
                    updateGameState(prev => ({ blockTimeLeft: (prev.blockTimeLeft || 0) - 1 }));
                }, 1000);
                return () => clearTimeout(timer);
            } else {
                const handlers = strategy?.handlers as Record<string, (ctx: unknown) => void> | undefined;
                if (handlers?.handleTimeLimit) {
                    handlers.handleTimeLimit(strategyContext);
                }
            }
        }
        return undefined;
    }, [gameType, gameState.phase, gameState.blockState, gameState.countdownLeft, gameState.blockTimeLeft, strategy, strategyContext, updateGameState]);

    // ========== MEMORY PROGRESSIVE MEMORIZE PHASE ==========
    useEffect(() => {
        if (gameType !== 'memory' ||
            gameState.phase !== GAME_PHASES.SPIN ||
            gameState.memoryPhase !== 'memorize') return;

        const PHASE_DURATION = 2.5;
        const CARDS_PER_PHASE = 4;
        const TOTAL_PHASES = 2;

        if ((gameState.memorizeTimeLeft || 0) > 0) {
            const timer = setTimeout(() => {
                updateGameState(prev => ({
                    memorizeTimeLeft: Math.max(0, (prev.memorizeTimeLeft || 0) - 0.1)
                }));
            }, 100);
            return () => clearTimeout(timer);
        } else {
            const currentPhase = gameState.memorizePhaseNumber || 1;

            if (currentPhase < TOTAL_PHASES) {
                secureLog.info(`[Memory] Phase ${currentPhase} finished. Starting phase ${currentPhase + 1}/${TOTAL_PHASES}`);

                const previousIndices = gameState.revealedIndices || [];
                const newIndices: number[] = [];
                const available: number[] = [];

                for (let i = 0; i < 16; i++) {
                    if (!previousIndices.includes(i)) {
                        available.push(i);
                    }
                }

                const availableCopy = [...available];
                for (let i = 0; i < Math.min(CARDS_PER_PHASE, availableCopy.length); i++) {
                    const randomIndex = secureRandomInt(0, availableCopy.length - 1);
                    newIndices.push(availableCopy[randomIndex]);
                    availableCopy.splice(randomIndex, 1);
                }

                updateGameState({
                    memorizePhaseNumber: currentPhase + 1,
                    memorizeTimeLeft: PHASE_DURATION,
                    revealedIndices: newIndices
                });
            } else {
                secureLog.info('[Memory] All memorize phases finished. Game starting!');
                updateGameState({
                    memoryPhase: 'playing',
                    revealedIndices: [],
                    gameStartTime: performance.now()
                });
            }
        }
        return undefined;
    }, [gameType, gameState.phase, gameState.memoryPhase, gameState.memorizeTimeLeft, gameState.memorizePhaseNumber, gameState.revealedIndices, updateGameState]);

    // ========== MEMORY GAME LOGIC ==========
    useEffect(() => {
        if (gameType !== 'memory' || gameState.phase !== GAME_PHASES.SPIN) return;
        if (gameState.memoryPhase !== 'playing') return;

        const memScores = gameState.memoryScores || { player: 0, opponent: 0 };

        // Victory check
        if (memScores.player >= 8 || memScores.opponent >= 8) {
            let isWin = false;
            if (memScores.player > memScores.opponent) {
                isWin = true;
            } else if (memScores.player === memScores.opponent) {
                const playerTotalTime = (gameState.pairTimestamps?.length || 0) > 0
                    ? (gameState.pairTimestamps?.[gameState.pairTimestamps.length - 1] || 0) - (gameState.gameStartTime || 0)
                    : Infinity;
                const opponentTotalTime = (gameState.opponentPairTimestamps?.length || 0) > 0
                    ? (gameState.opponentPairTimestamps?.[gameState.opponentPairTimestamps.length - 1] || 0) - (gameState.gameStartTime || 0)
                    : Infinity;

                secureLog.info(`[Memory] Tie-breaker: Player ${playerTotalTime}ms vs Opponent ${opponentTotalTime}ms`);
                isWin = playerTotalTime < opponentTotalTime;

                if (playerTotalTime === opponentTotalTime) {
                    isWin = secureRandomInt(0, 1) === 1;
                }
            }
            finishGame(isWin, { ...memScores, tieBreaker: 'time' });
            return;
        }

        // Countdown timer
        if ((gameState.timeLeft || 0) > 0) {
            const timer = setTimeout(() => {
                updateGameState(prev => ({ timeLeft: (prev.timeLeft || 0) - 1 }));
            }, 1000);
            return () => clearTimeout(timer);
        } else {
            let isWin = false;

            if (memScores.player === 0 && memScores.opponent === 0) {
                secureLog.warn('[Memory] Both players at 0 pairs! Assigning random winner.');
                isWin = secureRandomInt(0, 1) === 1;
                finishGame(isWin, { ...memScores, tieBreaker: 'random_zero' });
                return;
            }

            if (memScores.player > memScores.opponent) {
                isWin = true;
            } else if (memScores.player === memScores.opponent) {
                const playerTotalTime = (gameState.pairTimestamps?.length || 0) > 0
                    ? (gameState.pairTimestamps?.[gameState.pairTimestamps.length - 1] || 0) - (gameState.gameStartTime || 0)
                    : Infinity;
                const opponentTotalTime = (gameState.opponentPairTimestamps?.length || 0) > 0
                    ? (gameState.opponentPairTimestamps?.[gameState.opponentPairTimestamps.length - 1] || 0) - (gameState.gameStartTime || 0)
                    : Infinity;

                secureLog.info(`[Memory] Time-up tie-breaker: Player ${playerTotalTime}ms vs Opponent ${opponentTotalTime}ms`);
                isWin = playerTotalTime < opponentTotalTime;

                if (playerTotalTime === opponentTotalTime) {
                    isWin = secureRandomInt(0, 1) === 1;
                }
            }
            finishGame(isWin, { ...memScores, tieBreaker: 'time' });
        }
        return undefined;
    }, [gameType, gameState.phase, gameState.timeLeft, gameState.memoryScores, gameState.pairTimestamps, gameState.opponentPairTimestamps, gameState.gameStartTime, gameState.memoryPhase, finishGame, updateGameState]);

    // ========== MEMORY OPPONENT SIMULATION ==========
    useEffect(() => {
        if (gameType !== 'memory' || gameState.phase !== GAME_PHASES.SPIN || hasFinished.current) return;

        const simulateOpponentMatch = (): ReturnType<typeof setTimeout> => {
            const delay = secureRandomInt(5000, 9000);
            const timer = setTimeout(() => {
                if (hasFinished.current) return;

                updateGameState(prev => {
                    const prevScores = prev.memoryScores || { player: 0, opponent: 0 };
                    if (prevScores.opponent >= 8) return prev;

                    return {
                        ...prev,
                        memoryScores: {
                            ...prevScores,
                            opponent: prevScores.opponent + 1
                        },
                        opponentPairTimestamps: [...(prev.opponentPairTimestamps || []), performance.now()]
                    };
                });

                simulateOpponentMatch();
            }, delay);

            return timer;
        };

        const opponentTimer = simulateOpponentMatch();
        return () => clearTimeout(opponentTimer);
    }, [gameType, gameState.phase, updateGameState]);

    // ========== HANDLERS GENÉRICOS ==========

    const selectSide = useCallback((side: string): void => {
        updateGameState({
            playerSide: side,
            phase: GAME_PHASES.SPIN,
            status: GAME_STATUS.SPIN
        });
    }, [updateGameState]);

    const confirmAssigned = useCallback((assignedSide: string): void => {
        updateGameState({
            playerSide: assignedSide,
            phase: GAME_PHASES.SPIN,
            status: GAME_STATUS.SPIN
        });
    }, [updateGameState]);

    // ========== HANDLERS ESPECÍFICOS ==========

    const handleMemoryCardClick = useCallback((index: number): void => {
        if (!strategy || gameType !== 'memory') return;
        const handlers = strategy.handlers as unknown as Record<string, (idx: number, ctx: unknown, refs: unknown) => void> | undefined;
        if (handlers?.handleCardClick) {
            handlers.handleCardClick(index, strategyContext, {
                isProcessingRef,
                lastClickTimeRef
            });
        }
    }, [strategy, gameType, strategyContext]);

    const handleQuickDrawClick = useCallback((): void => {
        if (!strategy || gameType !== 'quickdraw') return;
        const handlers = strategy.handlers as unknown as Record<string, (ctx: unknown) => void> | undefined;
        if (handlers?.handleClick) {
            handlers.handleClick(strategyContext);
        }
    }, [strategy, gameType, strategyContext]);

    const handleBlockCellClick = useCallback((clickedNumber: number): void => {
        if (!strategy || gameType !== 'blockvalidation') return;
        const handlers = strategy.handlers as unknown as Record<string, (num: number, ctx: unknown) => void> | undefined;
        if (handlers?.handleCellClick) {
            handlers.handleCellClick(clickedNumber, strategyContext);
        }
    }, [strategy, gameType, strategyContext]);

    // ========== RETURN ==========

    return {
        gameState: {
            phase: gameState.phase,
            status: gameState.status,
            isChooser: gameState.isChooser,
            playerSide: gameState.playerSide,
            result: gameState.result,
            outcome: gameState.outcome,
            scores: gameState.scores,
            currentRound: gameState.currentRound,
            selectionTimeLeft: gameState.selectionTimeLeft,
            board: gameState.board || [],
            flippedIndices: gameState.flippedIndices || [],
            matchedIndices: gameState.matchedIndices || [],
            memoryScores: gameState.memoryScores || { player: 0, opponent: 0 },
            timeLeft: gameState.timeLeft || 0,
            pairTimestamps: gameState.pairTimestamps || [],
            gameStartTime: gameState.gameStartTime || 0,
            memoryPhase: gameState.memoryPhase || 'memorize',
            memorizePhaseNumber: gameState.memorizePhaseNumber || 1,
            memorizeTimeLeft: gameState.memorizeTimeLeft || 0,
            revealedIndices: gameState.revealedIndices || [],
            quickDrawState: gameState.quickDrawState || 'countdown',
            countdownLeft: gameState.countdownLeft || 0,
            reactionTime: gameState.reactionTime || null,
            hasPenalty: gameState.hasPenalty || false,
            blockGrid: gameState.blockGrid || [],
            blockNextTarget: gameState.blockNextTarget || 1,
            blockErrors: gameState.blockErrors || 0,
            blockState: gameState.blockState || 'countdown',
            blockStartTime: gameState.blockStartTime || 0,
            blockTimeLeft: gameState.blockTimeLeft || 0,
            blockTimestamps: gameState.blockTimestamps || [],
        },
        actions: {
            selectSide,
            confirmAssigned,
            handleMemoryCardClick,
            handleQuickDrawClick,
            handleBlockCellClick
        },
        strategy: strategy?.type || null,
        isStrategyLoaded: !!strategy
    };
};

// Exportaciones nombradas (preferidas)
export { useGameEngine };
