/**
 * Structured Logger - Protocolo Omega Observabilidad
 * 
 * WHY: Console.log no es suficiente para producción.
 * Necesitamos logging estructurado con trace_id, span_id y contexto.
 * 
 * ARQUITECTURA:
 * - JSON estructurado (parseable por agregadores de logs)
 * - Correlación via trace_id/span_id
 * - Métricas de negocio integradas
 * - Type-safe log levels
 */

/**
 * Log levels (siguiendo severidad estándar)
 */
export type LogLevel = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR' | 'FATAL';

/**
 * Structured log entry
 * WHY: Todo log debe ser JSON parseable con campos consistentes
 */
export interface LogEntry {
    readonly timestamp: string;
    readonly level: LogLevel;
    readonly trace_id: string;
    readonly span_id: string;
    readonly service: string;
    readonly message: string;
    readonly context: Readonly<Record<string, unknown>>;
    readonly error?: {
        readonly name: string;
        readonly message: string;
        readonly stack?: string;
    };
}

/**
 * Logger interface
 */
export interface Logger {
    debug(message: string, context?: Record<string, unknown>): void;
    info(message: string, context?: Record<string, unknown>): void;
    warn(message: string, context?: Record<string, unknown>): void;
    error(message: string, error?: Error, context?: Record<string, unknown>): void;
    fatal(message: string, error?: Error, context?: Record<string, unknown>): void;
}

/**
 * Context storage for trace/span IDs
 * WHY: Mantener correlación entre logs relacionados
 */
let currentTraceId: string | null = null;
let _currentSpanId: string | null = null; // Reserved for future span correlation
void _currentSpanId; // Mark as intentionally unused for now

// IE11 polyfill type
interface WindowWithMsCrypto extends Window {
    readonly msCrypto?: Crypto;
}

/**
 * Generate unique trace ID
 * WHY: Usar crypto para IDs únicos
 */
function generateTraceId(): string {
    const crypto = window.crypto || (window as WindowWithMsCrypto).msCrypto;
    const bytes = new Uint8Array(16);
    crypto.getRandomValues(bytes);
    return Array.from(bytes, byte => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Generate unique span ID
 */
function generateSpanId(): string {
    const crypto = window.crypto || (window as WindowWithMsCrypto).msCrypto;
    const bytes = new Uint8Array(8);
    crypto.getRandomValues(bytes);
    return Array.from(bytes, byte => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Get or create current trace ID
 */
function getTraceId(): string {
    if (!currentTraceId) {
        currentTraceId = generateTraceId();
    }
    return currentTraceId;
}

/**
 * Create log entry
 * WHY: Centralizar creación de logs con formato consistente
 */
function createLogEntry(
    level: LogLevel,
    message: string,
    context: Record<string, unknown> = {},
    error?: Error
): LogEntry {
    const entry: LogEntry = {
        timestamp: new Date().toISOString(),
        level,
        trace_id: getTraceId(),
        span_id: generateSpanId(),
        service: 'cryptoduels',
        message,
        context: Object.freeze({ ...context }),
    };

    if (error) {
        return {
            ...entry,
            error: {
                name: error.name,
                message: error.message,
                stack: error.stack,
            },
        };
    }

    return entry;
}

/**
 * Output log entry
 * WHY: En producción, esto iría a un servicio de agregación (DataDog, etc.)
 * Por ahora, usamos console con JSON estructurado
 */
function outputLog(entry: LogEntry): void {
    const jsonLog = JSON.stringify(entry);

    switch (entry.level) {
        case 'DEBUG':
        case 'INFO':
            console.log(jsonLog);
            break;
        case 'WARN':
            console.warn(jsonLog);
            break;
        case 'ERROR':
        case 'FATAL':
            console.error(jsonLog);
            break;
    }
}

/**
 * Structured logger implementation
 * 
 * USAGE:
 * ```typescript
 * import { logger } from '@/utils/logger';
 * 
 * logger.info('Game started', { gameId: 'dice', playerId: '123' });
 * logger.error('Payment failed', error, { amount: 100 });
 * ```
 */
export const logger: Logger = {
    debug(message: string, context: Record<string, unknown> = {}): void {
        const entry = createLogEntry('DEBUG', message, context);
        outputLog(entry);
    },

    info(message: string, context: Record<string, unknown> = {}): void {
        const entry = createLogEntry('INFO', message, context);
        outputLog(entry);
    },

    warn(message: string, context: Record<string, unknown> = {}): void {
        const entry = createLogEntry('WARN', message, context);
        outputLog(entry);
    },

    error(message: string, error?: Error, context: Record<string, unknown> = {}): void {
        const entry = createLogEntry('ERROR', message, context, error);
        outputLog(entry);
    },

    fatal(message: string, error?: Error, context: Record<string, unknown> = {}): void {
        const entry = createLogEntry('FATAL', message, context, error);
        outputLog(entry);
    },
};

/**
 * Set trace ID for current request/session
 * WHY: Permitir correlación de logs cross-component
 */
export function setTraceId(traceId: string): void {
    currentTraceId = traceId;
}

/**
 * Reset trace context (útil para tests)
 */
export function resetTraceContext(): void {
    currentTraceId = null;
    _currentSpanId = null;
}

/**
 * Get current trace ID (useful for propagation)
 */
export function getCurrentTraceId(): string {
    return getTraceId();
}
