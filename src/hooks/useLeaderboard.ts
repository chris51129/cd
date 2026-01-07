/**
 * useLeaderboard - Hook para manejar la lógica de ordenamiento y filtrado del Ranking
 * 
 * Implementa el Patrón Strategy para los diferentes tipos de ordenamiento.
 * 
 * WHY: Encapsulates leaderboard sorting logic in a reusable hook,
 * keeping components purely presentational as per React 2026 best practices.
 */
import { useMemo, useState, useCallback } from 'react';
import { generateMockPlayers, type MockPlayer } from '../constants/mockPlayers';

// ============================================
// Types
// ============================================

/** Sortable fields */
export type SortField = 'winnings' | 'wins' | 'streak' | 'winRate';

/** Sort order */
export type SortOrder = 'asc' | 'desc';

/** Player with rank */
export interface RankedPlayer extends MockPlayer {
    readonly rank: number;
}

/** Hook return type */
export interface UseLeaderboardResult {
    readonly players: readonly RankedPlayer[];
    readonly sortBy: SortField;
    readonly order: SortOrder;
    readonly setSortBy: (field: SortField) => void;
    readonly toggleOrder: () => void;
}

// ============================================
// Constants
// ============================================

/** Default number of players to generate */
const DEFAULT_PLAYER_COUNT = 500;

// ============================================
// Hook Implementation
// ============================================

/**
 * Leaderboard management hook
 * 
 * @returns Sorted players and sorting controls
 * 
 * @example
 * const { players, sortBy, setSortBy, toggleOrder } = useLeaderboard();
 * 
 * return (
 *     <table>
 *         <thead onClick={() => setSortBy('wins')}>Wins</thead>
 *         {players.map(p => <PlayerRow key={p.address} player={p} />)}
 *     </table>
 * );
 */
export const useLeaderboard = (): UseLeaderboardResult => {
    // Generar 500 jugadores para demostrar virtualización
    const [players] = useState<MockPlayer[]>(() => generateMockPlayers(DEFAULT_PLAYER_COUNT));
    const [sortBy, setSortByState] = useState<SortField>('winnings');
    const [order, setOrder] = useState<SortOrder>('desc');

    const sortedPlayers = useMemo((): readonly RankedPlayer[] => {
        // Clonamos para no mutar el estado
        const data = [...players];

        // Algoritmo de ordenamiento O(n log n)
        data.sort((a, b) => {
            let valA: number = a[sortBy] as number;
            let valB: number = b[sortBy] as number;

            // Limpieza para valores numéricos almacenados como strings
            if (sortBy === 'winnings' || sortBy === 'winRate') {
                valA = parseFloat(String(valA));
                valB = parseFloat(String(valB));
            }

            if (order === 'desc') {
                return valB - valA;
            } else {
                return valA - valB;
            }
        });

        // Asignar el rank después de ordenar
        return data.map((player, index) => ({
            ...player,
            rank: index + 1
        }));
    }, [players, sortBy, order]);

    const setSortBy = useCallback((field: SortField): void => {
        setSortByState(field);
    }, []);

    const toggleOrder = useCallback((): void => {
        setOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    }, []);

    return {
        players: sortedPlayers,
        sortBy,
        order,
        setSortBy,
        toggleOrder
    };
};

export default useLeaderboard;
