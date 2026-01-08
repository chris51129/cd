/**
 * Property-Based Tests for Fairness Utilities
 * 
 * WHY: Test properties of provably fair algorithms that must hold
 * for ALL inputs, ensuring cryptographic properties are maintained.
 * 
 * Properties tested:
 * - generateGameHash is deterministic (same input = same output)
 * - generateGameHash produces hex format
 * - generateServerSeed produces unique values
 */
import fc from 'fast-check';
import { generateGameHash, generateServerSeed } from './fairness';

describe('Fairness Utilities - Property-Based Tests', () => {
    describe('generateGameHash Determinism', () => {
        test('same inputs always produce same hash', () => {
            fc.assert(
                fc.property(
                    fc.string({ minLength: 1, maxLength: 50 }),
                    fc.oneof(
                        fc.string(),
                        fc.integer(),
                        fc.boolean(),
                        fc.constant(null)
                    ),
                    (seed, result) => {
                        const hash1 = generateGameHash(seed, result);
                        const hash2 = generateGameHash(seed, result);
                        return hash1 === hash2;
                    }
                ),
                { numRuns: 200 }
            );
        });

        test('different seeds produce different hashes (usually)', () => {
            // Collect unique hashes from different seeds
            const hashes = new Set<string>();
            const seeds = Array.from({ length: 100 }, (_, i) => `seed-${i}`);

            seeds.forEach(seed => {
                hashes.add(generateGameHash(seed, 'result'));
            });

            // At least 95% should be unique (collision rate < 5%)
            expect(hashes.size).toBeGreaterThanOrEqual(95);
        });
    });

    describe('generateGameHash Format', () => {
        test('output always starts with 0x', () => {
            fc.assert(
                fc.property(
                    fc.string({ minLength: 1, maxLength: 50 }),
                    fc.string(),
                    (seed, result) => {
                        const hash = generateGameHash(seed, result);
                        return hash.startsWith('0x');
                    }
                ),
                { numRuns: 100 }
            );
        });

        test('output is valid hex format', () => {
            fc.assert(
                fc.property(
                    fc.string({ minLength: 1, maxLength: 50 }),
                    fc.oneof(fc.string(), fc.integer()),
                    (seed, result) => {
                        const hash = generateGameHash(seed, result);
                        const hexRegex = /^0x[0-9a-f]+$/;
                        return hexRegex.test(hash);
                    }
                ),
                { numRuns: 100 }
            );
        });

        test('output has consistent length', () => {
            fc.assert(
                fc.property(
                    fc.string({ minLength: 1, maxLength: 50 }),
                    fc.string(),
                    (seed, result) => {
                        const hash = generateGameHash(seed, result);
                        // 0x + 64 hex chars = 66 total
                        return hash.length === 66;
                    }
                ),
                { numRuns: 100 }
            );
        });
    });

    describe('generateServerSeed', () => {
        test('generates 32 hex character strings', () => {
            for (let i = 0; i < 50; i++) {
                const seed = generateServerSeed();
                expect(seed).toMatch(/^[0-9a-f]{32}$/);
            }
        });

        test('generates unique values', () => {
            const seeds = new Set<string>();
            for (let i = 0; i < 100; i++) {
                seeds.add(generateServerSeed());
            }
            // All should be unique
            expect(seeds.size).toBe(100);
        });

        test('no predictable patterns', () => {
            const seed1 = generateServerSeed();
            const seed2 = generateServerSeed();

            // Should not be sequential or have common prefix
            expect(seed1).not.toBe(seed2);
            expect(seed1.slice(0, 8)).not.toBe(seed2.slice(0, 8));
        });
    });
});
