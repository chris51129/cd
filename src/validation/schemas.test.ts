/**
 * Tests for Zod Validation Schemas
 * 
 * WHY: Verify schema validation at I/O boundaries
 */
import {
    TierSchema,
    TierIdSchema,
    HexColorSchema,
    WalletAddressSchema,
    GameTypeSchema,
    GameRulesSchema,
    GameConfigSchema,
    MatchFoundResponseSchema,
    safeParse,
    parseOrThrow,
} from './schemas';

describe('Zod Validation Schemas', () => {
    describe('Primitive Schemas', () => {
        test('HexColorSchema accepts valid colors', () => {
            expect(HexColorSchema.safeParse('#FF0000').success).toBe(true);
            expect(HexColorSchema.safeParse('#ffffff').success).toBe(true);
        });

        test('HexColorSchema rejects invalid colors', () => {
            expect(HexColorSchema.safeParse('FF0000').success).toBe(false);
            expect(HexColorSchema.safeParse('#FFF').success).toBe(false);
        });

        test('WalletAddressSchema accepts valid addresses', () => {
            const addr = '0x742d35Cc6634C0532925a3b844Bc9e7595f77777';
            expect(WalletAddressSchema.safeParse(addr).success).toBe(true);
        });

        test('WalletAddressSchema rejects invalid addresses', () => {
            expect(WalletAddressSchema.safeParse('invalid').success).toBe(false);
            expect(WalletAddressSchema.safeParse('0x123').success).toBe(false);
        });
    });

    describe('TierSchema', () => {
        const validTier = {
            id: 1,
            amount: 10,
            icon: 'AnimatedTrophy',
            label: 'Gold',
            color: '#FFD700',
        };

        test('accepts valid tier', () => {
            expect(TierSchema.safeParse(validTier).success).toBe(true);
        });

        test('accepts tier with premium flag', () => {
            expect(TierSchema.safeParse({ ...validTier, premium: true }).success).toBe(true);
        });

        test('rejects invalid tier id', () => {
            expect(TierSchema.safeParse({ ...validTier, id: 5 }).success).toBe(false);
            expect(TierSchema.safeParse({ ...validTier, id: 0 }).success).toBe(false);
        });

        test('rejects negative amount', () => {
            expect(TierSchema.safeParse({ ...validTier, amount: -10 }).success).toBe(false);
        });

        test('rejects empty icon', () => {
            expect(TierSchema.safeParse({ ...validTier, icon: '' }).success).toBe(false);
        });

        test('rejects invalid color', () => {
            expect(TierSchema.safeParse({ ...validTier, color: 'red' }).success).toBe(false);
        });
    });

    describe('TierIdSchema', () => {
        test('accepts valid tier IDs', () => {
            expect(TierIdSchema.safeParse(1).success).toBe(true);
            expect(TierIdSchema.safeParse(2).success).toBe(true);
            expect(TierIdSchema.safeParse(3).success).toBe(true);
            expect(TierIdSchema.safeParse(4).success).toBe(true);
        });

        test('rejects invalid tier IDs', () => {
            expect(TierIdSchema.safeParse(0).success).toBe(false);
            expect(TierIdSchema.safeParse(5).success).toBe(false);
            expect(TierIdSchema.safeParse('1').success).toBe(false);
        });
    });

    describe('GameTypeSchema', () => {
        test('accepts valid game types', () => {
            expect(GameTypeSchema.safeParse('coinflip').success).toBe(true);
            expect(GameTypeSchema.safeParse('rps').success).toBe(true);
            expect(GameTypeSchema.safeParse('memory').success).toBe(true);
        });

        test('rejects invalid game types', () => {
            expect(GameTypeSchema.safeParse('invalid').success).toBe(false);
            expect(GameTypeSchema.safeParse('').success).toBe(false);
        });
    });

    describe('GameRulesSchema', () => {
        test('accepts valid rules', () => {
            const rules = {
                mechanics: 'Choose heads or tails',
                winCondition: 'Guess the coin flip',
                penalties: 'Lose bet on wrong guess',
            };
            expect(GameRulesSchema.safeParse(rules).success).toBe(true);
        });
    });

    describe('GameConfigSchema', () => {
        test('accepts valid game config', () => {
            const config = {
                id: 'coinflip',
                title: 'Coin Flip',
                icon: 'Coin',
                type: 'instant',
                category: 'probability',
                description: 'A classic 50/50 game',
                rules: {
                    mechanics: 'Choose heads or tails',
                    winCondition: 'Guess correctly',
                    penalties: 'Lose bet',
                },
            };
            expect(GameConfigSchema.safeParse(config).success).toBe(true);
        });
    });

    describe('MatchFoundResponseSchema', () => {
        test('accepts valid match response', () => {
            const response = {
                gameId: '550e8400-e29b-41d4-a716-446655440000',
                opponentId: 'opponent-123',
                tier: {
                    id: 1,
                    amount: 10,
                    icon: 'AnimatedTrophy',
                    label: 'Gold',
                    color: '#FFD700',
                },
                timestamp: Date.now(),
            };
            expect(MatchFoundResponseSchema.safeParse(response).success).toBe(true);
        });
    });

    describe('Validation Helpers', () => {
        test('safeParse returns success result', () => {
            const result = safeParse(TierIdSchema, 1);
            expect(result.success).toBe(true);
            if (result.success) {
                expect(result.value).toBe(1);
            }
        });

        test('safeParse returns error result', () => {
            const result = safeParse(TierIdSchema, 5);
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error).toBeDefined();
            }
        });

        test('parseOrThrow returns value on success', () => {
            const value = parseOrThrow(TierIdSchema, 1, 'test');
            expect(value).toBe(1);
        });

        test('parseOrThrow throws on failure', () => {
            expect(() => parseOrThrow(TierIdSchema, 5, 'test')).toThrow(/Validation Error/);
        });
    });
});
