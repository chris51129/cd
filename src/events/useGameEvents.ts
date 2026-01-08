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
import { gameEvents, GameEventData, EventCallback, UnsubscribeFn } from './gameEvents';

/**
 * Options for useGameEvents hook
 */
interface UseGameEventsOptions {
    readonly once?: boolean;
}

/**
 * Hook para suscribirse a eventos del juego
 * @param events - Evento(s) a escuchar
 * @param callback - Handler del evento
 * @param options - Opciones adicionales
 */
export const useGameEvents = (
    events: string | readonly string[],
    callback: EventCallback,
    options: UseGameEventsOptions = {}
): void => {
    const { once = false } = options;
    const callbackRef = useRef<EventCallback>(callback);

    // Mantener referencia actualizada del callback
    useEffect(() => {
        callbackRef.current = callback;
    }, [callback]);

    useEffect(() => {
        const eventList = Array.isArray(events) ? events : [events];
        const unsubscribes: UnsubscribeFn[] = [];

        const handler: EventCallback = (data: GameEventData) => {
            callbackRef.current(data);
        };

        eventList.forEach((event: string) => {
            if (once) {
                gameEvents.once(event, handler);
            } else {
                const unsubscribe = gameEvents.on(event, handler);
                unsubscribes.push(unsubscribe);
            }
        });

        // Cleanup al desmontar
        return () => {
            unsubscribes.forEach((unsub: UnsubscribeFn) => unsub());
        };
    }, [events, once]);
};

/**
 * Hook para emitir eventos del juego
 * @returns Función emit memoizada
 */
export const useEmitGameEvent = (): ((event: string, data?: Record<string, unknown>) => void) => {
    return useCallback((event: string, data?: Record<string, unknown>): void => {
        gameEvents.emit(event, data);
    }, []);
};

export default useGameEvents;
