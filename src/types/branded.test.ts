/**
 * Tests for Branded Types
 * 
 * WHY: Verify smart constructors validate correctly at boundaries
 */
import {
    UserId,
    GameId,
    TierId,
    WalletAddress,
    PositiveAmount,
    HexColor,
    isUserId,
    isGameId,
    isTierId,
    isWalletAddress,
    isPositiveAmount,
    isHexColor,
} from './branded';

describe('Branded Types', () => {
    describe('UserId', () => {
        test('parse accepts valid user ID', () => {
            const result = UserId.parse('user-123');
            expect(result.success).toBe(true);
            if (result.success) {
                expect(result.value).toBe('user-123');
            }
        });

        test('parse rejects empty string', () => {
            const result = UserId.parse('   ');
            expect(result.success).toBe(false);
        });

        test('parse rejects non-string', () => {
            const result = UserId.parse(123);
            expect(result.success).toBe(false);
        });

        test('parse rejects too long string', () => {
            const result = UserId.parse('a'.repeat(65));
            expect(result.success).toBe(false);
        });

        test('unsafe creates UserId directly', () => {
            const id = UserId.unsafe('test-id');
            expect(id).toBe('test-id');
        });

        test('isUserId type guard works', () => {
            expect(isUserId('valid-id')).toBe(true);
            expect(isUserId('')).toBe(false);
        });
    });

    describe('GameId', () => {
        test('parse accepts valid UUID v4', () => {
            const uuid = '550e8400-e29b-41d4-a716-446655440000';
            const result = GameId.parse(uuid);
            expect(result.success).toBe(true);
        });

        test('parse rejects invalid UUID', () => {
            const result = GameId.parse('not-a-uuid');
            expect(result.success).toBe(false);
        });

        test('generate creates valid UUID', () => {
            const id = GameId.generate();
            expect(GameId.parse(id).success).toBe(true);
        });

        test('isGameId type guard works', () => {
            expect(isGameId('550e8400-e29b-41d4-a716-446655440000')).toBe(true);
            expect(isGameId('invalid')).toBe(false);
        });
    });

    describe('TierId', () => {
        test('parse accepts valid tier IDs', () => {
            expect(TierId.parse(1).success).toBe(true);
            expect(TierId.parse(2).success).toBe(true);
            expect(TierId.parse(3).success).toBe(true);
            expect(TierId.parse(4).success).toBe(true);
        });

        test('parse rejects invalid tier IDs', () => {
            expect(TierId.parse(0).success).toBe(false);
            expect(TierId.parse(5).success).toBe(false);
            expect(TierId.parse('1').success).toBe(false);
        });

        test('isTierId type guard works', () => {
            expect(isTierId(1)).toBe(true);
            expect(isTierId(5)).toBe(false);
        });
    });

    describe('WalletAddress', () => {
        test('parse accepts valid Ethereum address', () => {
            const address = '0x742d35Cc6634C0532925a3b844Bc9e7595f77777';
            const result = WalletAddress.parse(address);
            expect(result.success).toBe(true);
        });

        test('parse rejects address without 0x prefix', () => {
            const result = WalletAddress.parse('742d35Cc6634C0532925a3b844Bc9e7595f77777');
            expect(result.success).toBe(false);
        });

        test('parse rejects short address', () => {
            const result = WalletAddress.parse('0x742d35Cc6634');
            expect(result.success).toBe(false);
        });

        test('isWalletAddress type guard works', () => {
            expect(isWalletAddress('0x742d35Cc6634C0532925a3b844Bc9e7595f77777')).toBe(true);
            expect(isWalletAddress('invalid')).toBe(false);
        });
    });

    describe('PositiveAmount', () => {
        test('parse accepts positive numbers', () => {
            expect(PositiveAmount.parse(10).success).toBe(true);
            expect(PositiveAmount.parse(0.01).success).toBe(true);
        });

        test('parse rejects zero', () => {
            expect(PositiveAmount.parse(0).success).toBe(false);
        });

        test('parse rejects negative', () => {
            expect(PositiveAmount.parse(-5).success).toBe(false);
        });

        test('parse rejects Infinity', () => {
            expect(PositiveAmount.parse(Infinity).success).toBe(false);
        });

        test('isPositiveAmount type guard works', () => {
            expect(isPositiveAmount(10)).toBe(true);
            expect(isPositiveAmount(-1)).toBe(false);
        });
    });

    describe('HexColor', () => {
        test('parse accepts valid hex colors', () => {
            expect(HexColor.parse('#FF0000').success).toBe(true);
            expect(HexColor.parse('#ffffff').success).toBe(true);
            expect(HexColor.parse('#123ABC').success).toBe(true);
        });

        test('parse rejects invalid formats', () => {
            expect(HexColor.parse('FF0000').success).toBe(false);  // Missing #
            expect(HexColor.parse('#FFF').success).toBe(false);    // Short format
            expect(HexColor.parse('#GGGGGG').success).toBe(false); // Invalid chars
        });

        test('isHexColor type guard works', () => {
            expect(isHexColor('#FF0000')).toBe(true);
            expect(isHexColor('red')).toBe(false);
        });
    });
});
