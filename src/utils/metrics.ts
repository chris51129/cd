/**
 * Business Metrics - Protocolo Omega Observabilidad
 * 
 * WHY: Métricas técnicas (CPU/RAM) no son suficientes.
 * Necesitamos métricas de NEGOCIO para entender el comportamiento del usuario.
 * 
 * ARQUITECTURA:
 * - Type-safe metric names
 * - Tags para dimensionalidad
 * - Integración con logger
 */

import { logger } from './logger';

/**
 * Metric names para eventos de negocio
 * WHY: Type-safe, autocomplete, refactor-safe
 */
export type MetricName =
    // Game lifecycle
    | 'game.started'
    | 'game.completed'
    | 'game.abandoned'

    // Game outcomes
    | 'game.outcome.win'
    | 'game.outcome.loss'
    | 'game.outcome.draw'

    // User actions
    | 'user.selection.made'
    | 'user.tier.changed'

    // Performance
    | 'game.latency'
    | 'animation.duration'

    // Errors
    | 'error.state_validation'
    | 'error.crypto_failure'
    | 'error.rate_limit_exceeded';

/**
 * Metric tags for dimensionality
 * WHY: Permite análisis multidimensional (por tier, por game, etc.)
 */
export interface MetricTags {
    readonly gameId?: string;
    readonly tierId?: string;
    readonly outcome?: 'win' | 'loss' | 'draw';
    readonly errorType?: string;
    readonly [key: string]: string | undefined;
}

/**
 * Metrics interface
 */
export interface Metrics {
    increment(metric: MetricName, tags?: MetricTags): void;
    timing(metric: MetricName, durationMs: number, tags?: MetricTags): void;
}

/**
 * Metrics implementation
 * 
 * WHY: Por ahora usa logger estructurado.
 * En producción, se enviaría a DataDog/New Relic/Prometheus.
 * 
 * USAGE:
 * ```typescript
 * import { metrics } from '@/utils/metrics';
 * 
 * metrics.increment('game.started', { gameId: 'dice', tierId: 'bronze' });
 * metrics.increment('game.outcome.win', { gameId: 'dice' });
 * metrics.timing('game.latency', 150, { gameId: 'dice' });
 * ```
 */
export const metrics: Metrics = {
    increment(metric: MetricName, tags: MetricTags = {}): void {
        logger.info('[METRIC] Increment', {
            metric,
            value: 1,
            tags,
            type: 'counter',
        });
    },

    timing(metric: MetricName, durationMs: number, tags: MetricTags = {}): void {
        logger.info('[METRIC] Timing', {
            metric,
            value: durationMs,
            unit: 'ms',
            tags,
            type: 'timer',
        });
    },
};

/**
 * Helper: Track game lifecycle
 */
export function trackGameStarted(gameId: string, tierId: string): void {
    metrics.increment('game.started', { gameId, tierId });
}

export function trackGameCompleted(
    gameId: string,
    outcome: 'win' | 'loss' | 'draw',
    tierId: string
): void {
    metrics.increment('game.completed', { gameId, outcome, tierId });
    metrics.increment(`game.outcome.${outcome}` as MetricName, { gameId, tierId });
}

export function trackGameAbandoned(gameId: string, tierId: string): void {
    metrics.increment('game.abandoned', { gameId, tierId });
}
