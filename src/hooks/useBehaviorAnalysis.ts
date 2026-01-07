/**
 * useBehaviorAnalysis - Análisis Comportamental Anti-Bot
 * 
 * Detecta patrones de comportamiento que indican automatización:
 * - Intervalos de clic exactamente iguales (bots)
 * - Tiempos de reacción inhumanamente rápidos (<50ms)
 * - Patrones de movimiento lineales perfectos
 * - Varianza cero en tiempos de respuesta
 * 
 * OWASP Reference: A01:2021 – Broken Access Control
 * 
 * WHY: Defense-in-depth approach. Even with on-chain protection,
 * client-side bot detection provides early warning and can prevent
 * obvious automated attacks from reaching the blockchain.
 */
import { useRef, useCallback } from 'react';
import { secureLog } from '../utils/security';

// ============================================
// Types
// ============================================

/** Click position with timestamp */
export interface ClickPosition {
    readonly x: number;
    readonly y: number;
    readonly timestamp: number;
}

/** Analysis result */
export interface BehaviorAnalysisResult {
    readonly isBot: boolean;
    readonly confidence: number;
    readonly flags: readonly string[];
}

/** Suspicion score configuration */
interface SuspicionScoreConfig {
    readonly lowVariance: number;
    readonly perfectTiming: number;
    readonly superhumanReaction: number;
    readonly linearMovement: number;
}

/** Detection thresholds */
interface ThresholdsConfig {
    readonly minHumanReactionMs: number;
    readonly maxVarianceForBot: number;
    readonly minSampleSize: number;
    readonly suspicionScore: SuspicionScoreConfig;
    readonly botThreshold: number;
}

/** Hook return type */
export interface UseBehaviorAnalysisResult {
    /** Record an action timestamp */
    readonly recordAction: (timestamp?: number) => void;
    /** Record a reaction time */
    readonly recordReactionTime: (reactionMs: number) => void;
    /** Record a click position */
    readonly recordClickPosition: (x: number, y: number) => void;
    /** Analyze current behavior */
    readonly analyze: () => BehaviorAnalysisResult;
    /** Reset all recorded data */
    readonly reset: () => void;
    /** Current suspicion score */
    readonly suspicionScore: number;
    /** Last analysis result */
    readonly lastAnalysis: BehaviorAnalysisResult | null;
}

// ============================================
// Constants
// ============================================

/** Detection thresholds */
const THRESHOLDS: ThresholdsConfig = {
    minHumanReactionMs: 50,
    maxVarianceForBot: 10,
    minSampleSize: 5,
    suspicionScore: {
        lowVariance: 30,
        perfectTiming: 25,
        superhumanReaction: 40,
        linearMovement: 20
    },
    botThreshold: 70
} as const;

/** Maximum history sizes to prevent memory leaks */
const MAX_HISTORY = {
    actions: 20,
    reactions: 10,
    positions: 20
} as const;

// ============================================
// Pure Helper Functions
// ============================================

/**
 * Calcula la varianza de un array de números
 * WHY: Función pura para testeo y reutilización
 */
const calculateVariance = (numbers: readonly number[]): number => {
    if (numbers.length < 2) return Infinity;
    const mean = numbers.reduce((a, b) => a + b, 0) / numbers.length;
    const squareDiffs = numbers.map(n => Math.pow(n - mean, 2));
    return squareDiffs.reduce((a, b) => a + b, 0) / numbers.length;
};

/**
 * Calcula intervalos entre acciones consecutivas
 */
const calculateIntervals = (timestamps: readonly number[]): number[] => {
    const intervals: number[] = [];
    for (let i = 1; i < timestamps.length; i++) {
        intervals.push(timestamps[i] - timestamps[i - 1]);
    }
    return intervals;
};

// ============================================
// Hook Implementation
// ============================================

/**
 * Behavior analysis hook for bot detection
 * 
 * @returns Analysis controls and state
 * 
 * @example
 * const { recordAction, analyze } = useBehaviorAnalysis();
 * 
 * const handleClick = () => {
 *     recordAction();
 *     if (analyze().isBot) {
 *         // Handle potential bot
 *     }
 * };
 */
export const useBehaviorAnalysis = (): UseBehaviorAnalysisResult => {
    // Historial de acciones
    const actionTimestampsRef = useRef<number[]>([]);
    const reactionTimesRef = useRef<number[]>([]);
    const clickPositionsRef = useRef<ClickPosition[]>([]);
    const suspicionScoreRef = useRef<number>(0);
    const analysisResultRef = useRef<BehaviorAnalysisResult | null>(null);

    /**
     * Registra una acción con timestamp
     */
    const recordAction = useCallback((timestamp: number = Date.now()): void => {
        actionTimestampsRef.current.push(timestamp);

        // Mantener solo las últimas acciones
        if (actionTimestampsRef.current.length > MAX_HISTORY.actions) {
            actionTimestampsRef.current.shift();
        }
    }, []);

    /**
     * Registra un tiempo de reacción
     */
    const recordReactionTime = useCallback((reactionMs: number): void => {
        reactionTimesRef.current.push(reactionMs);

        if (reactionTimesRef.current.length > MAX_HISTORY.reactions) {
            reactionTimesRef.current.shift();
        }
    }, []);

    /**
     * Registra una posición de clic
     */
    const recordClickPosition = useCallback((x: number, y: number): void => {
        clickPositionsRef.current.push({ x, y, timestamp: Date.now() });

        if (clickPositionsRef.current.length > MAX_HISTORY.positions) {
            clickPositionsRef.current.shift();
        }
    }, []);

    /**
     * Analiza el comportamiento actual
     */
    const analyze = useCallback((): BehaviorAnalysisResult => {
        let score = 0;
        const flags: string[] = [];

        // 1. Analizar varianza de intervalos
        if (actionTimestampsRef.current.length >= THRESHOLDS.minSampleSize) {
            const intervals = calculateIntervals(actionTimestampsRef.current);
            const variance = calculateVariance(intervals);

            if (variance < THRESHOLDS.maxVarianceForBot) {
                score += THRESHOLDS.suspicionScore.lowVariance;
                flags.push('LOW_VARIANCE_INTERVALS');
                secureLog.warn(`[BehaviorAnalysis] Low variance detected: ${variance.toFixed(2)}ms`);
            }

            // Detectar tiempos exactamente iguales
            const uniqueIntervals = new Set(intervals.map(i => Math.floor(i / 10) * 10));
            if (uniqueIntervals.size === 1 && intervals.length >= 3) {
                score += THRESHOLDS.suspicionScore.perfectTiming;
                flags.push('PERFECT_TIMING');
                secureLog.warn('[BehaviorAnalysis] Perfect timing detected');
            }
        }

        // 2. Analizar tiempos de reacción
        if (reactionTimesRef.current.length >= 3) {
            const superhumanCount = reactionTimesRef.current.filter(
                t => t < THRESHOLDS.minHumanReactionMs
            ).length;

            if (superhumanCount > reactionTimesRef.current.length / 2) {
                score += THRESHOLDS.suspicionScore.superhumanReaction;
                flags.push('SUPERHUMAN_REACTION');
                secureLog.warn(`[BehaviorAnalysis] Superhuman reactions: ${superhumanCount}/${reactionTimesRef.current.length}`);
            }
        }

        // 3. Analizar movimiento del mouse (lineales perfectos)
        if (clickPositionsRef.current.length >= 5) {
            const positions = clickPositionsRef.current;
            let isLinear = true;

            for (let i = 2; i < positions.length && isLinear; i++) {
                const dx1 = positions[i - 1].x - positions[i - 2].x;
                const dy1 = positions[i - 1].y - positions[i - 2].y;
                const dx2 = positions[i].x - positions[i - 1].x;
                const dy2 = positions[i].y - positions[i - 1].y;

                // Cross product para detectar colinearidad
                const cross = Math.abs(dx1 * dy2 - dx2 * dy1);
                if (cross > 5) isLinear = false;
            }

            if (isLinear && positions.length >= 5) {
                score += THRESHOLDS.suspicionScore.linearMovement;
                flags.push('LINEAR_MOVEMENT');
                secureLog.warn('[BehaviorAnalysis] Linear movement pattern detected');
            }
        }

        // 4. Calcular resultado final
        suspicionScoreRef.current = score;
        const analysis: BehaviorAnalysisResult = {
            isBot: score >= THRESHOLDS.botThreshold,
            confidence: Math.min(100, score),
            flags
        };
        analysisResultRef.current = analysis;

        if (analysis.isBot) {
            secureLog.error(`[BehaviorAnalysis] BOT DETECTED! Score: ${score}, Flags: ${flags.join(', ')}`);
        }

        return analysis;
    }, []);

    /**
     * Resetea el análisis
     */
    const reset = useCallback((): void => {
        actionTimestampsRef.current = [];
        reactionTimesRef.current = [];
        clickPositionsRef.current = [];
        suspicionScoreRef.current = 0;
        analysisResultRef.current = null;
    }, []);

    return {
        recordAction,
        recordReactionTime,
        recordClickPosition,
        analyze,
        reset,
        suspicionScore: suspicionScoreRef.current,
        lastAnalysis: analysisResultRef.current
    };
};

export default useBehaviorAnalysis;
