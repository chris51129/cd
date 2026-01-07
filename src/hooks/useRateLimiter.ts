/**
 * useRateLimiter - Hook de Rate Limiting para Seguridad OWASP
 * 
 * Previene acciones excesivamente rápidas que podrían indicar:
 * - Bots automatizados
 * - Scripts de click rápido
 * - Ataques de spam
 * 
 * WHY: Implementa rate limiting client-side como primera línea de defensa.
 * La protección real viene del smart contract (gas fees, cooldowns on-chain).
 * 
 * Configuración por juego:
 * - Memory: 100ms (permite clics rápidos pero controlados)
 * - Quick Draw: 50ms (reacciones humanas legítimas)
 * - Block Validation: 50ms (clics rápidos de secuencia)
 * - Selection: 500ms (evita spam de selección)
 */
import { useRef, useCallback } from 'react';
import { secureLog } from '../utils/security';

// ============================================
// Types
// ============================================

/** Action types that can be rate limited */
export type ActionType = 'memory' | 'quickdraw' | 'blockvalidation' | 'selection' | 'default';

/** Rate limiter hook return type */
export interface UseRateLimiterResult {
    /** Check if action can be performed */
    readonly canAct: () => boolean;
    /** Record an action without checking */
    readonly recordAction: () => void;
    /** Get milliseconds until ready */
    readonly getTimeUntilReady: () => number;
    /** Reset the rate limiter state */
    readonly reset: () => void;
    /** Whether suspicious activity has been detected */
    readonly isSuspicious: boolean;
    /** Current cooldown in milliseconds */
    readonly cooldown: number;
}

// ============================================
// Constants
// ============================================

/** Cooldown configuration per action type (milliseconds) */
const RATE_LIMITS: Record<ActionType, number> = {
    memory: 100,
    quickdraw: 50,
    blockvalidation: 50,
    selection: 500,
    default: 100
} as const;

/** Bot detection configuration */
const BOT_DETECTION = {
    /** Maximum actions allowed per second */
    maxActionsPerSecond: 15,
    /** Time window for tracking (milliseconds) */
    windowMs: 1000,
    /** Consecutive violations before flagging as bot */
    suspicionThreshold: 3
} as const;

// ============================================
// Hook Implementation
// ============================================

/**
 * Rate limiter hook for preventing spam and bot-like behavior
 * 
 * @param actionType - Type of action to rate limit
 * @returns Rate limiter controls and state
 * 
 * @example
 * const { canAct, recordAction } = useRateLimiter('memory');
 * 
 * const handleClick = () => {
 *     if (!canAct()) return;
 *     // Process click...
 * };
 */
export const useRateLimiter = (actionType: ActionType = 'default'): UseRateLimiterResult => {
    // Referencias para tracking
    const lastActionTimeRef = useRef<number>(0);
    const actionHistoryRef = useRef<number[]>([]);
    const suspicionCountRef = useRef<number>(0);
    const isSuspiciousRef = useRef<boolean>(false);

    /**
     * Limpia acciones antiguas del historial
     */
    const cleanOldActions = useCallback((): void => {
        const now = Date.now();
        actionHistoryRef.current = actionHistoryRef.current.filter(
            timestamp => now - timestamp < BOT_DETECTION.windowMs
        );
    }, []);

    /**
     * Verifica si una acción puede ejecutarse
     * @returns true si la acción está permitida
     */
    const canAct = useCallback((): boolean => {
        const now = Date.now();
        const cooldown = RATE_LIMITS[actionType] || RATE_LIMITS.default;

        // 1. Verificar cooldown básico
        if (now - lastActionTimeRef.current < cooldown) {
            secureLog.warn(`[RateLimiter] Action blocked: ${actionType} (cooldown: ${cooldown}ms)`);
            return false;
        }

        // 2. Verificar patrón de bot
        cleanOldActions();
        if (actionHistoryRef.current.length >= BOT_DETECTION.maxActionsPerSecond) {
            suspicionCountRef.current++;
            secureLog.warn(`[RateLimiter] Suspicious activity detected: ${actionHistoryRef.current.length} actions/s`);

            if (suspicionCountRef.current >= BOT_DETECTION.suspicionThreshold) {
                isSuspiciousRef.current = true;
                secureLog.error('[RateLimiter] Bot behavior flagged!');
            }
            return false;
        }

        // 3. Registrar acción exitosa
        lastActionTimeRef.current = now;
        actionHistoryRef.current.push(now);

        return true;
    }, [actionType, cleanOldActions]);

    /**
     * Registra una acción sin verificar (para tracking)
     */
    const recordAction = useCallback((): void => {
        const now = Date.now();
        lastActionTimeRef.current = now;
        actionHistoryRef.current.push(now);
        cleanOldActions();
    }, [cleanOldActions]);

    /**
     * Obtiene el tiempo restante hasta que se pueda actuar
     * @returns Milisegundos restantes (0 si puede actuar)
     */
    const getTimeUntilReady = useCallback((): number => {
        const now = Date.now();
        const cooldown = RATE_LIMITS[actionType] || RATE_LIMITS.default;
        const elapsed = now - lastActionTimeRef.current;
        return Math.max(0, cooldown - elapsed);
    }, [actionType]);

    /**
     * Resetea el estado del rate limiter
     */
    const reset = useCallback((): void => {
        lastActionTimeRef.current = 0;
        actionHistoryRef.current = [];
        suspicionCountRef.current = 0;
        isSuspiciousRef.current = false;
    }, []);

    return {
        canAct,
        recordAction,
        getTimeUntilReady,
        reset,
        isSuspicious: isSuspiciousRef.current,
        cooldown: RATE_LIMITS[actionType] || RATE_LIMITS.default
    };
};

export default useRateLimiter;
