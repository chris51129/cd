/**
 * Game configuration constants for CryptoDuels
 */

/**
 * Game category types
 */
export type GameCategory = 'probability' | 'skill';

/**
 * Game rules interface
 */
export interface GameRules {
    readonly mechanics: string;
    readonly winCondition: string;
    readonly penalties: string;
}

/**
 * Complete game configuration interface
 */
export interface Game {
    readonly id: string;
    readonly title: string;
    readonly icon: string;
    readonly type: string;
    readonly category: GameCategory;
    readonly description: string;
    readonly rules: GameRules;
    readonly badge?: string;
}

/**
 * Valid game IDs (union type for type safety)
 */
export type GameId = 'coinflip' | 'dice' | 'rps' | 'memory' | 'quickdraw' | 'blockvalidation' | 'higherlower';

/**
 * Games record type (maps GameId to Game)
 */
export type GamesRecord = Record<GameId, Game>;

/**
 * All available games
 */
export const GAMES: GamesRecord = {
    coinflip: {
        id: 'coinflip',
        title: 'Cara o Cruz',
        icon: '🪙',
        type: 'Instantáneo',
        category: 'probability',
        description: 'El clásico 50/50. Probabilidad pura, verificada en cadena.',
        rules: {
            mechanics: 'Establece una posición (Cara o Cruz). El sistema resolverá la entropía de forma verificable.',
            winCondition: 'Si el resultado coincide con tu posición, se asigna la recompensa del pool (menos comisión).',
            penalties: 'Si abandonas el módulo tras confirmar el compromiso, se ejecuta la cláusula de penalización total.'
        }
    },
    dice: {
        id: 'dice',
        title: 'Duelo de Dados',
        icon: '🎲',
        type: 'Probabilidad',
        category: 'probability',
        description: 'Interacción contra un oponente. El valor dominante accede a la recompensa.',
        rules: {
            mechanics: 'Cada participante activa una fuente de entropía de 6 estados simultáneamente.',
            winCondition: 'Se asigna el éxito al participante con el valor más alto. En caso de igualdad, se reinicia la secuencia.',
            penalties: 'Salir de la sala con un compromiso activo implica la resolución fallida inmediata.'
        }
    },
    rps: {
        id: 'rps',
        title: 'Piedra, Papel o Tijera',
        icon: '✂️',
        type: 'Probabilidad',
        category: 'probability',
        description: 'Duelo directo de una ronda. Elige tu arma y enfrenta al oponente.',
        rules: {
            mechanics: 'Elige piedra, papel o tijera. El ganador se decide en una ronda.',
            winCondition: 'Piedra gana a tijera, tijera a papel, papel a piedra. Si hay empate, se repite (máx. 5 veces).',
            penalties: 'Si no eliges en 10 segundos, el sistema elige automáticamente. Tras 5 empates, resolución automática.'
        }
    },
    memory: {
        id: 'memory',
        title: 'Memoria Cripto',
        icon: '🧠',
        type: 'Habilidad',
        category: 'skill',
        badge: 'NEW',
        description: 'Competición cognitiva P2P. Identifica las secuencias en el menor tiempo.',
        rules: {
            mechanics: 'Fase de memorización progresiva: 2 secuencias de 4 ítems (2.5s cada una, de corrido). Posteriormente, vincula los ítems idénticos en el tablero.',
            winCondition: 'El participante con mayor número de validaciones exitosas accede a la recompensa.',
            penalties: 'Inactividad prolongada (más de 10s) otorga la resolución al oponente. El abandono activa la penalización.'
        }
    },
    quickdraw: {
        id: 'quickdraw',
        title: 'Duelo de Reflejos',
        icon: '⚡',
        type: 'Habilidad',
        category: 'skill',
        badge: 'HOT',
        description: 'Módulo de latencia humana. Interactúa en el momento de la señal.',
        rules: {
            mechanics: 'Espera el cambio de estado visual del sistema. La interacción más veloz obtiene el pool.',
            winCondition: 'Se cuantifica la latencia de respuesta. El tiempo inferior obtiene la asignación.',
            penalties: 'Una interacción anticipada (false start) conlleva penalización o resolución negativa en tiers altos.'
        }
    },
    blockvalidation: {
        id: 'blockvalidation',
        title: 'Validación de Bloques',
        icon: '🔢',
        type: 'Habilidad',
        category: 'skill',
        badge: 'NEW',
        description: 'Valida la secuencia numérica del 1 al 25. Ejercicio de precisión operativa.',
        rules: {
            mechanics: 'Cuadrícula de 5x5 con estados desordenados: vincula del 1 al 25 en orden ascendente.',
            winCondition: 'El participante con la validación completa más veloz obtiene la recompensa.',
            penalties: 'Un error de validación suspende la interactividad por 1 segundo (cláusula de error operativo).'
        }
    },
    higherlower: {
        id: 'higherlower',
        title: 'Mayor o Menor',
        icon: '🃏',
        type: 'Probabilidad',
        category: 'probability',
        badge: 'NEW',
        description: 'Predice si la siguiente carta será mayor o menor. Duelo de intuición y suerte.',
        rules: {
            mechanics: 'Se muestra una carta del 2 al 10. Predice si la siguiente será MAYOR o MENOR. Tienes 5 segundos para decidir.',
            winCondition: 'Acierto = +1 punto. Gana quien llegue a 5 puntos o elimine al oponente. Ejemplo: si ves un 5 y predices MAYOR, ganas si sale 6, 7, 8, 9 o 10.',
            penalties: 'Error = -1 vida (tienes 3). Sin predicción a tiempo = fallo automático. A 0 vidas pierdes inmediatamente.'
        }
    }
} as const;

/**
 * Get game config by ID
 * @param gameId - Game identifier
 * @returns Game configuration or undefined
 */
export const getGameById = (gameId: string): Game | undefined => {
    return GAMES[gameId as GameId];
};

/**
 * Get all games as array
 * @returns Array of game configurations
 */
export const getAllGames = (): Game[] => {
    return Object.values(GAMES);
};

/**
 * Type guard to check if value is a valid game ID
 */
export const isValidGameId = (id: unknown): id is GameId => {
    return typeof id === 'string' && id in GAMES;
};
