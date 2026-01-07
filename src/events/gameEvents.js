/**
 * GameEventEmitter - Patrón Observer para eventos del juego
 * 
 * Permite comunicación desacoplada entre componentes.
 * Uso: Notificar victorias, derrotas, cambios de estado sin prop drilling.
 * 
 * @example
 * // Suscribirse a un evento
 * const unsubscribe = gameEvents.on('victory', (data) => {
 *   console.log('¡Victoria!', data);
 * });
 * 
 * // Emitir un evento
 * gameEvents.emit('victory', { amount: 100, gameType: 'coinflip' });
 * 
 * // Desuscribirse
 * unsubscribe();
 */

// Tipos de eventos disponibles
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

    // Estadísticas (preparado para futuro)
    STREAK_UPDATE: 'stats:streak',
    BALANCE_UPDATE: 'stats:balance'
};

class GameEventEmitter {
    constructor() {
        this.listeners = new Map();
        this.onceListeners = new Map();
    }

    /**
     * Suscribirse a un evento
     * @param {string} event - Nombre del evento
     * @param {Function} callback - Función a ejecutar
     * @returns {Function} Función para desuscribirse
     */
    on(event, callback) {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, new Set());
        }
        this.listeners.get(event).add(callback);

        // Retornar función de desuscripción
        return () => this.off(event, callback);
    }

    /**
     * Suscribirse a un evento solo una vez
     * @param {string} event - Nombre del evento
     * @param {Function} callback - Función a ejecutar
     */
    once(event, callback) {
        if (!this.onceListeners.has(event)) {
            this.onceListeners.set(event, new Set());
        }
        this.onceListeners.get(event).add(callback);
    }

    /**
     * Desuscribirse de un evento
     * @param {string} event - Nombre del evento
     * @param {Function} callback - Función registrada
     */
    off(event, callback) {
        if (this.listeners.has(event)) {
            this.listeners.get(event).delete(callback);
        }
        if (this.onceListeners.has(event)) {
            this.onceListeners.get(event).delete(callback);
        }
    }

    /**
     * Emitir un evento
     * @param {string} event - Nombre del evento
     * @param {any} data - Datos a enviar
     */
    emit(event, data = {}) {
        // Añadir timestamp automático
        const eventData = {
            ...data,
            _event: event,
            _timestamp: Date.now()
        };

        // Ejecutar listeners permanentes
        if (this.listeners.has(event)) {
            this.listeners.get(event).forEach(callback => {
                try {
                    callback(eventData);
                } catch (error) {
                    console.error(`[GameEvents] Error in listener for ${event}:`, error);
                }
            });
        }

        // Ejecutar listeners de una vez y limpiar
        if (this.onceListeners.has(event)) {
            this.onceListeners.get(event).forEach(callback => {
                try {
                    callback(eventData);
                } catch (error) {
                    console.error(`[GameEvents] Error in once listener for ${event}:`, error);
                }
            });
            this.onceListeners.get(event).clear();
        }
    }

    /**
     * Limpiar todos los listeners (útil para cleanup)
     */
    clear() {
        this.listeners.clear();
        this.onceListeners.clear();
    }

    /**
     * Obtener cantidad de listeners para un evento (debugging)
     * @param {string} event - Nombre del evento
     * @returns {number} Cantidad de listeners
     */
    listenerCount(event) {
        const permanent = this.listeners.has(event) ? this.listeners.get(event).size : 0;
        const once = this.onceListeners.has(event) ? this.onceListeners.get(event).size : 0;
        return permanent + once;
    }
}

// Singleton - Una única instancia global
export const gameEvents = new GameEventEmitter();

// Hook para React
export default gameEvents;
