/**
 * Property-Based Tests for Security Utilities
 * 
 * WHY: Test properties that should hold for ALL inputs, not just examples.
 * Property-based testing finds edge cases humans miss.
 * 
 * Properties tested:
 * - secureRandomInt is always within bounds
 * - secureRandomInt returns integers
 * - Distribution is reasonably uniform (chi-square-like)
 */
import fc from 'fast-check';
import { secureRandomInt } from './security';

describe('secureRandomInt - Property-Based Tests', () => {
    describe('Bounds Property', () => {
        test('result is always >= min and <= max', () => {
            fc.assert(
                fc.property(
                    fc.integer({ min: 0, max: 1000 }),
                    fc.integer({ min: 0, max: 1000 }),
                    (a, b) => {
                        const min = Math.min(a, b);
                        const max = Math.max(a, b);
                        const result = secureRandomInt(min, max);
                        return result >= min && result <= max;
                    }
                ),
                { numRuns: 500 }
            );
        });

        test('result is always an integer', () => {
            fc.assert(
                fc.property(
                    fc.integer({ min: 0, max: 100 }),
                    fc.integer({ min: 0, max: 100 }),
                    (a, b) => {
                        const min = Math.min(a, b);
                        const max = Math.max(a, b);
                        const result = secureRandomInt(min, max);
                        return Number.isInteger(result);
                    }
                ),
                { numRuns: 200 }
            );
        });

        test('single value range returns that value', () => {
            fc.assert(
                fc.property(
                    fc.integer({ min: 0, max: 1000 }),
                    (n) => {
                        const result = secureRandomInt(n, n);
                        return result === n;
                    }
                ),
                { numRuns: 100 }
            );
        });
    });

    describe('Distribution Property', () => {
        test('covers full range over many samples', () => {
            // For a small range, all values should appear eventually
            const min = 1;
            const max = 10;
            const samples = new Set<number>();

            for (let i = 0; i < 500; i++) {
                samples.add(secureRandomInt(min, max));
            }

            // Should hit most values (at least 80%)
            const coverage = samples.size / (max - min + 1);
            expect(coverage).toBeGreaterThanOrEqual(0.8);
        });

        test('no strong bias towards min or max', () => {
            const min = 0;
            const max = 9;
            const counts: Record<number, number> = {};
            const runs = 1000;

            for (let i = 0; i < runs; i++) {
                const result = secureRandomInt(min, max);
                counts[result] = (counts[result] || 0) + 1;
            }

            const expected = runs / (max - min + 1);
            const tolerance = expected * 0.5; // 50% tolerance

            // No value should have more than expected + tolerance
            for (let i = min; i <= max; i++) {
                const count = counts[i] || 0;
                expect(count).toBeLessThan(expected + tolerance);
            }
        });
    });

    describe('Edge Cases', () => {
        test('handles large ranges', () => {
            const result = secureRandomInt(0, 1000000);
            expect(result).toBeGreaterThanOrEqual(0);
            expect(result).toBeLessThanOrEqual(1000000);
        });

        test('handles negative numbers', () => {
            fc.assert(
                fc.property(
                    fc.integer({ min: -100, max: 0 }),
                    fc.integer({ min: -100, max: 0 }),
                    (a, b) => {
                        const min = Math.min(a, b);
                        const max = Math.max(a, b);
                        const result = secureRandomInt(min, max);
                        return result >= min && result <= max;
                    }
                ),
                { numRuns: 100 }
            );
        });
    });
});
