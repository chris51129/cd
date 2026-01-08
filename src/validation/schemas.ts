/**
 * Zod Validation Schemas - Parse, Don't Validate at I/O Boundaries
 * 
 * WHY: Validate all external inputs (API responses, user input, form data)
 * at the system boundary, then convert to domain types.
 * 
 * Pattern: Border Validation
 * - API responses → parse with Zod → domain types
 * - User input → parse with Zod → domain types
 * - Never trust external data
 */

import { z } from 'zod';

// ============================================
// Primitive Schemas
// ============================================

/**
 * Hex color schema - validates #RRGGBB format
 */
export const HexColorSchema = z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, 'Must be a valid hex color (#RRGGBB)');

/**
 * Ethereum wallet address schema
 */
export const WalletAddressSchema = z
    .string()
    .regex(/^0x[a-fA-F0-9]{40}$/, 'Must be a valid Ethereum address');

/**
 * Positive number schema
 */
export const PositiveNumberSchema = z
    .number()
    .positive('Must be a positive number')
    .finite('Must be a finite number');

// ============================================
// Domain Schemas
// ============================================

/**
 * Tier ID schema - 1 | 2 | 3 | 4
 */
export const TierIdSchema = z.union([
    z.literal(1),
    z.literal(2),
    z.literal(3),
    z.literal(4),
]);

/**
 * Complete Tier schema matching constants/tiers.ts
 */
export const TierSchema = z.object({
    id: TierIdSchema,
    amount: PositiveNumberSchema,
    icon: z.string().min(1, 'Icon name is required'),
    label: z.string().min(1, 'Label is required'),
    color: HexColorSchema,
    premium: z.boolean().optional(),
});

/**
 * Game type schema
 */
export const GameTypeSchema = z.enum([
    'coinflip',
    'dice',
    'rps',
    'memory',
    'quickdraw',
    'blockvalidation',
]);

/**
 * Game phase schema
 */
export const GamePhaseSchema = z.enum([
    'setup',
    'selection',
    'spin',
    'round_result',
    'result',
]);

/**
 * Game status schema
 */
export const GameStatusSchema = z.enum([
    'idle',
    'spin',
    'round_result',
    'result',
]);

/**
 * Outcome schema
 */
export const OutcomeSchema = z.enum(['win', 'loss', 'draw']);

/**
 * Game rules schema
 */
export const GameRulesSchema = z.object({
    mechanics: z.string(),
    winCondition: z.string(),
    penalties: z.string(),
});

/**
 * Complete game configuration schema
 */
export const GameConfigSchema = z.object({
    id: z.string().min(1),
    title: z.string().min(1),
    icon: z.string().min(1),
    type: z.string().min(1),
    category: z.enum(['probability', 'skill']),
    description: z.string(),
    rules: GameRulesSchema,
    badge: z.string().optional(),
});

// ============================================
// API Response Schemas
// ============================================

/**
 * Match found response from matchmaking
 */
export const MatchFoundResponseSchema = z.object({
    gameId: z.string().uuid(),
    opponentId: z.string().min(1),
    tier: TierSchema,
    timestamp: z.number().int().positive(),
});

/**
 * Game result response
 */
export const GameResultResponseSchema = z.object({
    gameId: z.string().uuid(),
    outcome: OutcomeSchema,
    playerResult: z.unknown(),
    opponentResult: z.unknown(),
    hash: z.string().regex(/^0x[a-fA-F0-9]+$/),
    timestamp: z.number().int().positive(),
});

// ============================================
// Inferred Types (from Zod schemas)
// ============================================

export type ValidatedTier = z.infer<typeof TierSchema>;
export type ValidatedGameConfig = z.infer<typeof GameConfigSchema>;
export type ValidatedMatchFound = z.infer<typeof MatchFoundResponseSchema>;
export type ValidatedGameResult = z.infer<typeof GameResultResponseSchema>;

// ============================================
// Validation Helpers
// ============================================

/**
 * Safe parse with Result type integration
 * WHY: Convert Zod result to our Result<T,E> type for consistency
 */
export const safeParse = <T>(
    schema: z.ZodType<T>,
    data: unknown
): { success: true; value: T } | { success: false; error: string } => {
    const result = schema.safeParse(data);
    if (result.success) {
        return { success: true, value: result.data };
    }
    const errorMessage = result.error.issues
        .map((e: z.ZodIssue) => `${e.path.join('.')}: ${e.message}`)
        .join('; ');
    return { success: false, error: errorMessage };
};

/**
 * Parse or throw with detailed error
 * WHY: Use at I/O boundaries where we want to fail fast
 */
export const parseOrThrow = <T>(
    schema: z.ZodType<T>,
    data: unknown,
    context: string
): T => {
    const result = schema.safeParse(data);
    if (!result.success) {
        const errorMessage = result.error.issues
            .map((e: z.ZodIssue) => `${e.path.join('.')}: ${e.message}`)
            .join('; ');
        throw new Error(`[Validation Error] ${context}: ${errorMessage}`);
    }
    return result.data;
};
