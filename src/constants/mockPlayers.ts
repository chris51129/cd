/**
 * mockPlayers - Base de datos simulada para el Ranking
 * 
 * WHY: Provides realistic mock data for leaderboard testing and development.
 * Statistics are generated with realistic distributions.
 */

// ============================================
// Types
// ============================================

/** Player tier levels */
export type PlayerTier = 'Rookie' | 'Veteran' | 'Elite' | 'Legend';

/** Mock player data structure */
export interface MockPlayer {
    readonly id: string;
    readonly rank: number;
    readonly name: string;
    readonly winnings: string;
    readonly wins: number;
    readonly duels: number;
    readonly winRate: string;
    readonly streak: number;
    readonly tier: PlayerTier;
    readonly avatar: string;
}

// ============================================
// Constants
// ============================================

const PLAYER_NAMES: readonly string[] = [
    'Satoshi_Vibe', 'Vitalik_Fan', 'BullRunner_99', 'DiamondHands', 'Degenerate_X',
    'MoonWalker', 'Whale_Watcher', 'Alpha_Seeker', 'YieldFarmer', 'HODL_Mastah',
    'PixelPirate', 'GasGuzzler', 'EVM_Master', 'Web3_Wanderer', 'DeFi_Ninja',
    'Solidity_God', 'Contract_Killer', 'Block_Explorer', 'Mint_Master', 'Airdrop_Hunter'
] as const;

const TIERS: readonly PlayerTier[] = ['Rookie', 'Veteran', 'Elite', 'Legend'] as const;

// ============================================
// Generator Function
// ============================================

/**
 * Genera una lista de jugadores mock con estadísticas realistas
 * 
 * @param count - Number of players to generate
 * @returns Array of mock players
 */
export const generateMockPlayers = (count: number = 100): MockPlayer[] => {
    return Array.from({ length: count }, (_, i): MockPlayer => {
        const winRate = 0.4 + Math.random() * 0.35; // 40% - 75%
        const duels = 10 + Math.floor(Math.random() * 500);
        const wins = Math.floor(duels * winRate);

        return {
            id: `player-${i}`,
            rank: 0, // Se calculará al ordenar
            name: PLAYER_NAMES[i % PLAYER_NAMES.length] + (i > 20 ? `_${i}` : ''),
            winnings: (wins * (10 + Math.random() * 90)).toFixed(2), // $10 - $100 por victoria aprox
            wins: wins,
            duels: duels,
            winRate: (winRate * 100).toFixed(1) + '%',
            streak: Math.floor(Math.random() * 12),
            tier: TIERS[Math.floor(Math.random() * TIERS.length)],
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`
        };
    });
};
