/**
 * Entry commitment tier constants for CryptoDuels
 * These are the 4 fixed commitment amounts available in the protocol
 */

/**
 * Tier configuration type
 */
export interface Tier {
    readonly id: number;
    readonly amount: number;
    readonly icon: string;
    readonly label: string;
    readonly color: string;
    readonly popular?: boolean;
}

/**
 * All available tiers as readonly array
 */
export const TIERS: readonly Tier[] = [
    { id: 1, amount: 1, icon: 'AnimatedTrophy', label: 'Bronze', color: '#CD7F32' },
    { id: 2, amount: 5, icon: 'AnimatedTrophy', label: 'Silver', color: '#C0C0C0' },
    { id: 3, amount: 10, icon: 'AnimatedTrophy', label: 'Gold', color: '#FFD700', popular: true },
    { id: 4, amount: 50, icon: 'AnimatedBanknote', label: 'Platoon', color: '#85bb65' }
] as const;

/**
 * Get tier by commitment amount
 * @param amount - Commitment amount in USDT
 * @returns Tier object or undefined if not found
 */
export const getTierByAmount = (amount: number): Tier | undefined => {
    return TIERS.find(tier => tier.amount === amount);
};

/**
 * Get tier by ID
 * @param id - Tier ID
 * @returns Tier object or undefined if not found
 */
export const getTierById = (id: number): Tier | undefined => {
    return TIERS.find(tier => tier.id === id);
};

/**
 * Type guard to check if value is a valid tier ID
 */
export const isValidTierId = (id: unknown): id is number => {
    return typeof id === 'number' && TIERS.some(tier => tier.id === id);
};

/**
 * Type guard to check if value is a valid tier amount
 */
export const isValidTierAmount = (amount: unknown): amount is number => {
    return typeof amount === 'number' && TIERS.some(tier => tier.amount === amount);
};
