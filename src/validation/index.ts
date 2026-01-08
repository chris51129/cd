/**
 * Validation Module - Public API
 * 
 * Re-exports all schemas and helpers for external use.
 */

// Primitive schemas
export {
    HexColorSchema,
    WalletAddressSchema,
    PositiveNumberSchema,
} from './schemas';

// Domain schemas
export {
    TierIdSchema,
    TierSchema,
    GameTypeSchema,
    GamePhaseSchema,
    GameStatusSchema,
    OutcomeSchema,
    GameRulesSchema,
    GameConfigSchema,
} from './schemas';

// API response schemas
export {
    MatchFoundResponseSchema,
    GameResultResponseSchema,
} from './schemas';

// Inferred types
export type {
    ValidatedTier,
    ValidatedGameConfig,
    ValidatedMatchFound,
    ValidatedGameResult,
} from './schemas';

// Validation helpers
export { safeParse, parseOrThrow } from './schemas';
