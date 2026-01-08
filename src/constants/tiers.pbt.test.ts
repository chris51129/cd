/**
 * Property-Based Tests for Tier Constants
 * 
 * WHY: Verify invariants that must hold for the tier system:
 * - IDs are unique
 * - Amounts are positive and ordered
 * - All required fields are valid
 */
import fc from 'fast-check';
import { TIERS, getTierById } from './tiers';

describe('Tier Constants - Property-Based Tests', () => {
    describe('TIERS Array Invariants', () => {
        test('all tier IDs are unique', () => {
            const ids = TIERS.map(t => t.id);
            const uniqueIds = new Set(ids);
            expect(uniqueIds.size).toBe(TIERS.length);
        });

        test('all tier amounts are positive', () => {
            TIERS.forEach(tier => {
                expect(tier.amount).toBeGreaterThan(0);
            });
        });

        test('tier amounts are strictly increasing', () => {
            for (let i = 1; i < TIERS.length; i++) {
                expect(TIERS[i].amount).toBeGreaterThan(TIERS[i - 1].amount);
            }
        });

        test('all tiers have valid hex colors', () => {
            const hexColorRegex = /^#[0-9A-Fa-f]{6}$/;
            TIERS.forEach(tier => {
                expect(tier.color).toMatch(hexColorRegex);
            });
        });

        test('all tiers have non-empty labels', () => {
            TIERS.forEach(tier => {
                expect(tier.label.length).toBeGreaterThan(0);
            });
        });

        test('all tiers have non-empty icons', () => {
            TIERS.forEach(tier => {
                expect(tier.icon.length).toBeGreaterThan(0);
            });
        });
    });

    describe('getTierById', () => {
        test('returns correct tier for valid IDs', () => {
            TIERS.forEach(tier => {
                const result = getTierById(tier.id);
                expect(result).toEqual(tier);
            });
        });

        test('returns undefined for invalid IDs', () => {
            fc.assert(
                fc.property(
                    fc.integer().filter(n => n < 1 || n > 4),
                    (invalidId) => {
                        const result = getTierById(invalidId as 1 | 2 | 3 | 4);
                        return result === undefined;
                    }
                ),
                { numRuns: 50 }
            );
        });

        test('returned tier ID matches requested ID', () => {
            [1, 2, 3, 4].forEach(id => {
                const tier = getTierById(id as 1 | 2 | 3 | 4);
                if (tier) {
                    expect(tier.id).toBe(id);
                }
            });
        });
    });

    describe('Tier Schema Consistency', () => {
        test('every tier has all required fields', () => {
            const requiredFields = ['id', 'amount', 'icon', 'label', 'color'];

            TIERS.forEach(tier => {
                requiredFields.forEach(field => {
                    expect(tier).toHaveProperty(field);
                });
            });
        });

        test('field types are correct', () => {
            TIERS.forEach(tier => {
                expect(typeof tier.id).toBe('number');
                expect(typeof tier.amount).toBe('number');
                expect(typeof tier.icon).toBe('string');
                expect(typeof tier.label).toBe('string');
                expect(typeof tier.color).toBe('string');
            });
        });
    });
});
