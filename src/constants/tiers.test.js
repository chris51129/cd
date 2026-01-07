/**
 * Tests for constants/tiers.js
 */
import { TIERS, getTierByAmount, getTierById } from './tiers';

describe('TIERS constant', () => {
    test('should have exactly 4 tiers', () => {
        expect(TIERS).toHaveLength(4);
    });

    test('each tier should have required properties', () => {
        TIERS.forEach((tier) => {
            expect(tier).toHaveProperty('id');
            expect(tier).toHaveProperty('amount');
            expect(tier).toHaveProperty('icon');
            expect(tier).toHaveProperty('label');
            expect(tier).toHaveProperty('color');
            expect(typeof tier.id).toBe('number');
            expect(typeof tier.amount).toBe('number');
            expect(typeof tier.icon).toBe('string');
            expect(typeof tier.label).toBe('string');
            expect(typeof tier.color).toBe('string');
        });
    });

    test('tier amounts should be in ascending order', () => {
        for (let i = 1; i < TIERS.length; i++) {
            expect(TIERS[i].amount).toBeGreaterThan(TIERS[i - 1].amount);
        }
    });

    test('tier IDs should be unique', () => {
        const ids = TIERS.map((t) => t.id);
        const uniqueIds = [...new Set(ids)];
        expect(ids.length).toBe(uniqueIds.length);
    });
});

describe('getTierByAmount', () => {
    test('should return tier for valid amount', () => {
        const tier = getTierByAmount(50);
        expect(tier).toBeDefined();
        expect(tier.amount).toBe(50);
    });

    test('should return undefined for invalid amount', () => {
        const tier = getTierByAmount(999);
        expect(tier).toBeUndefined();
    });
});

describe('getTierById', () => {
    test('should return tier for valid ID', () => {
        const tier = getTierById(1);
        expect(tier).toBeDefined();
        expect(tier.id).toBe(1);
    });

    test('should return undefined for invalid ID', () => {
        const tier = getTierById(999);
        expect(tier).toBeUndefined();
    });
});
