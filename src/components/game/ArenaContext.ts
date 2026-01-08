/**
 * ArenaContext - Contexto para el patrón Compound Components en GameArena
 * 
 * WHY: Provides typed shared state between GameArena sub-components
 * following the Compound Components pattern.
 */
import { createContext, useContext } from 'react';
import type { GameState, GameActions, GameType } from '../../hooks/useGameEngine';
import type { Tier } from '../../constants/tiers';

/**
 * Arena context value type
 * Uses canonical Tier type from constants/tiers.ts for DDD consistency
 */
export interface ArenaContextValue {
    readonly gameState: GameState;
    readonly actions: GameActions;
    readonly gameType: GameType;
    readonly tier: Tier;
}

/**
 * Default context value (used for type inference and as fallback)
 */
const defaultContextValue: ArenaContextValue | null = null;

/**
 * Arena context for compound components
 */
const ArenaContext = createContext<ArenaContextValue | null>(defaultContextValue);

/**
 * Hook to access arena context
 * @throws Error if used outside of a GameArena component
 */
export const useArena = (): ArenaContextValue => {
    const context = useContext(ArenaContext);
    if (!context) {
        throw new Error('useArena debe usarse dentro de un GameArena');
    }
    return context;
};

export default ArenaContext;
