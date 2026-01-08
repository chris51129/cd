/**
 * GameEventEmitter - Patrón Observer para eventos del juego
 * 
 * WHY: Permite comunicación desacoplada entre componentes (Event Bus in-memory).
 * Siguiendo Protocolo Omega - Modulith con límites estrictos.
 * 
 * ARQUITECTURA:
 * - Type-safe event names
 * - Generic callback types
 * - Automatic cleanup
 * 
 * @example
 * ```typescript
 * // Suscribirse a un evento
 * const unsubscribe = gameEvents.on('victory', (data) => {
 *   logger.info('Victory event received', data);
 * });
 * 
 * // Emitir un evento
 * gameEvents.emit('victory', { amount: 100, gameType: 'coinflip' });
 * 
 * // Desuscribirse
 * unsubscribe();
 * ```
 */

/**
 * Tipos de eventos disponibles
 * WHY: Type-safe event names, autocomplete, refactor-safe
 */
export const GAME_EVENTS = {
    // Ciclo de vida del juego
    GAME_START: 'game:start',
    GAME_END: 'game:end',
    ROUND_START: 'round:start',
    ROUND_END: 'round:end',

    // Resultados
    VICTORY: 'result:victory',
    DEFEAT: 'result:defeat',
    DRAW: 'result:draw',

    // Acciones del jugador
    PLAYER_ACTION: 'player:action',
    PLAYER_CHOICE: 'player:choice',

    // Estados de espera
    MATCH_SEARCHING: 'match:searching',
    MATCH_FOUND: 'match:found',
    MATCH_CANCELLED: 'match:cancelled',

    // UI/UX
    ANIMATION_START: 'animation:start',
    ANIMATION_END: 'animation:end',

    // Estadísticas
    STREAK_UPDATE: 'stats:streak',
    BALANCE_UPDATE: 'stats:balance'
} as const;

/**
 * Event names type
 */
export type GameEventName = typeof GAME_EVENTS[keyof typeof GAME_EVENTS];

/**
 * Event data structure
 * WHY: Todos los eventos llevan metadata estándar
 */
export interface GameEventData<_T = Record<string, unknown>> { // _T reserved for future typed payloads
    readonly _event: string;
    readonly _timestamp: number;
    readonly [key: string]: unknown;
}

/**
 * Event callback type
 */
export type EventCallback<T = unknown> = (data: GameEventData<T>) => void;

/**
 * Unsubscribe function type
 */
export type UnsubscribeFn = () => void;

/**
 * GameEventEmitter class
 * 
 * WHY: In-memory event bus para comunicación desacoplada
 * Evita prop drilling y mantiene componentes independientes
 */
class GameEventEmitter {
    private readonly listeners: Map<string, Set<EventCallback>>;
    private readonly onceListeners: Map<string, Set<EventCallback>>;

    constructor() {
        this.listeners = new Map();
        this.onceListeners = new Map();
    }

    /**
     * Suscribirse a un evento
     * WHY: Retorna función de cleanup para facilitar desuscripción
     */
    on(event: string, callback: EventCallback): UnsubscribeFn {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, new Set());
        }
        this.listeners.get(event)!.add(callback);

        // Retornar función de desuscripción
        return () => this.off(event, callback);
    }

    /**
     * Suscribirse a un evento solo una vez
     * WHY: Útil para eventos one-shot (ej. victoria)
     */
    once(event: string, callback: EventCallback): void {
        if (!this.onceListeners.has(event)) {
            this.onceListeners.set(event, new Set());
        }
        this.onceListeners.get(event)!.add(callback);
    }

    /**
     * Desuscribirse de un evento
     */
    off(event: string, callback: EventCallback): void {
        if (this.listeners.has(event)) {
            this.listeners.get(event)!.delete(callback);
        }
        if (this.onceListeners.has(event)) {
            this.onceListeners.get(event)!.delete(callback);
        }
    }

    /**
     * Emitir un evento
     * WHY: Añadimos timestamp automático para debugging
     */
    emit(event: string, data: Record<string, unknown> = {}): void {
        // Añadir timestamp automático
        const eventData: GameEventData = {
            ...data,
            _event: event,
            _timestamp: Date.now()
        };

        // Ejecutar listeners permanentes
        if (this.listeners.has(event)) {
            this.listeners.get(event)!.forEach((callback: EventCallback) => {
                try {
                    callback(eventData);
                } catch (error) {
                    console.error(`[GameEvents] Error in listener for ${event}:`, error);
                }
            });
        }

        // Ejecutar listeners de una vez y limpiar
        if (this.onceListeners.has(event)) {
            this.onceListeners.get(event)!.forEach((callback: EventCallback) => {
                try {
                    callback(eventData);
                } catch (error) {
                    console.error(`[GameEvents] Error in once listener for ${event}:`, error);
                }
            });
            this.onceListeners.get(event)!.clear();
        }
    }

    /**
     * Limpiar todos los listeners
     * WHY: Útil para cleanup en tests o unmount
     */
    clear(): void {
        this.listeners.clear();
        this.onceListeners.clear();
    }

    /**
     * Obtener cantidad de listeners para un evento
     * WHY: Debugging, detectar memory leaks
     */
    listenerCount(event: string): number {
        const permanent = this.listeners.has(event) ? this.listeners.get(event)!.size : 0;
        const once = this.onceListeners.has(event) ? this.onceListeners.get(event)!.size : 0;
        return permanent + once;
    }
}

/**
 * Singleton - Una única instancia global
 * WHY: Event bus debe ser único para toda la app
 */
export const gameEvents = new GameEventEmitter();

export default gameEvents;
