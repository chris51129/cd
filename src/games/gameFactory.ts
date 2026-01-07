/**
 * Game Factory - Patrón Factory para creación de estrategias de juego
 * 
 * Este módulo centraliza la creación de estrategias de juego,
 * permitiendo añadir nuevos juegos sin modificar el código existente.
 * 
 * Pattern: Factory (GoF)
 * 
 * WHY: Centralizes strategy instantiation, making it easy to add new games
 * without modifying consumer code. Open/Closed Principle.
 * 
 * Uso:
 *   import { getGameStrategy } from './games';
 *   const strategy = getGameStrategy('coinflip');
 */
import { type GameStrategy } from './gameStrategy';
import coinflipStrategy from './coinflip.strategy';
import diceStrategy from './dice.strategy';
import rpsStrategy from './rps.strategy';
import memoryStrategy from './memory.strategy';
import quickdrawStrategy from './quickdraw.strategy';
import blockvalidationStrategy from './blockvalidation.strategy';

// ============================================
// Types
// ============================================

/** Valid game types */
export type ValidGameType = 'coinflip' | 'dice' | 'rps' | 'memory' | 'quickdraw' | 'blockvalidation';

/** Strategy registry type */
type StrategyRegistry = Record<ValidGameType, GameStrategy<Record<string, unknown>>>;

// ============================================
// Registry
// ============================================

/**
 * Registry de todas las estrategias disponibles
 */
const strategies: StrategyRegistry = {
    coinflip: coinflipStrategy as unknown as GameStrategy<Record<string, unknown>>,
    dice: diceStrategy as unknown as GameStrategy<Record<string, unknown>>,
    rps: rpsStrategy as unknown as GameStrategy<Record<string, unknown>>,
    memory: memoryStrategy as unknown as GameStrategy<Record<string, unknown>>,
    quickdraw: quickdrawStrategy as unknown as GameStrategy<Record<string, unknown>>,
    blockvalidation: blockvalidationStrategy as unknown as GameStrategy<Record<string, unknown>>,
};

// ============================================
// Factory Functions
// ============================================

/**
 * Obtiene la estrategia para un tipo de juego
 * @param gameType - Tipo de juego (coinflip, dice, rps, etc.)
 * @returns Estrategia del juego o null si no existe
 */
export const getGameStrategy = (gameType: string): GameStrategy<Record<string, unknown>> | null => {
    const strategy = strategies[gameType as ValidGameType];
    if (!strategy) {
        console.warn(`[GameFactory] Unknown game type: ${gameType}`);
        return null;
    }
    return strategy;
};

/**
 * Verifica si un tipo de juego existe
 * @param gameType - Tipo de juego a verificar
 * @returns True si el juego existe
 */
export const isValidGameType = (gameType: string): gameType is ValidGameType => {
    return Object.hasOwn(strategies, gameType);
};

/**
 * Obtiene la lista de todos los juegos disponibles
 * @returns Array de tipos de juego
 */
export const getAvailableGames = (): ValidGameType[] => {
    return Object.keys(strategies) as ValidGameType[];
};

/**
 * Obtiene el estado inicial combinado para un juego
 * @param gameType - Tipo de juego
 * @returns Estado inicial del juego
 */
export const getInitialGameState = (gameType: string): Record<string, unknown> => {
    const strategy = getGameStrategy(gameType);
    if (!strategy) return {};
    return strategy.getInitialState ? strategy.getInitialState() : {};
};

/**
 * Registra una nueva estrategia de juego
 * Útil para extensiones o juegos dinámicos
 * @param gameType - Tipo de juego
 * @param strategy - Estrategia del juego
 */
export const registerGameStrategy = (gameType: ValidGameType, strategy: GameStrategy<Record<string, unknown>>): void => {
    if (strategies[gameType]) {
        console.warn(`[GameFactory] Overwriting existing strategy: ${gameType}`);
    }
    strategies[gameType] = strategy;
};

export default {
    getGameStrategy,
    isValidGameType,
    getAvailableGames,
    getInitialGameState,
    registerGameStrategy
};
