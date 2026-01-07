/**
 * useGameEvents - Hook para consumir eventos del juego
 * 
 * Simplifica la suscripción/desuscripción automática con cleanup.
 * 
 * @example
 * // Suscribirse a victoria
 * useGameEvents(GAME_EVENTS.VICTORY, (data) => {
 *   playSound('victory');
 *   showConfetti();
 * });
 * 
 * // Suscribirse a múltiples eventos
 * useGameEvents([GAME_EVENTS.VICTORY, GAME_EVENTS.DEFEAT], (data) => {
 *   logAnalytics(data._event, data);
 * });
 */
import { useEffect, useCallback, useRef } from 'react';
import { gameEvents } from './gameEvents';

/**
 * Hook para suscribirse a eventos del juego
 * @param {string|string[]} events - Evento(s) a escuchar
 * @param {Function} callback - Handler del evento
 * @param {Object} options - Opciones adicionales
 * @param {boolean} options.once - Si solo debe ejecutarse una vez
 */
export const useGameEvents = (events, callback, options = {}) => {
    const { once = false } = options;
    const callbackRef = useRef(callback);

    // Mantener referencia actualizada del callback
    useEffect(() => {
        callbackRef.current = callback;
    }, [callback]);

    useEffect(() => {
        const eventList = Array.isArray(events) ? events : [events];
        const unsubscribes = [];

        const handler = (data) => {
            callbackRef.current(data);
        };

        eventList.forEach(event => {
            if (once) {
                gameEvents.once(event, handler);
            } else {
                const unsubscribe = gameEvents.on(event, handler);
                unsubscribes.push(unsubscribe);
            }
        });

        // Cleanup al desmontar
        return () => {
            unsubscribes.forEach(unsub => unsub());
        };
    }, [events, once]);
};

/**
 * Hook para emitir eventos del juego
 * @returns {Function} Función emit memoizada
 */
export const useEmitGameEvent = () => {
    return useCallback((event, data) => {
        gameEvents.emit(event, data);
    }, []);
};

export default useGameEvents;
