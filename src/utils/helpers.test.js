/**
 * Tests for utils/helpers.js
 */
import { getRandomInt } from './helpers';

describe('getRandomInt', () => {
    test('should return a number within the specified range', () => {
        for (let i = 0; i < 100; i++) {
            const result = getRandomInt(1, 6);
            expect(result).toBeGreaterThanOrEqual(1);
            expect(result).toBeLessThanOrEqual(6);
        }
    });

    test('should return min when min equals max', () => {
        const result = getRandomInt(5, 5);
        expect(result).toBe(5);
    });

    test('should handle zero as min', () => {
        for (let i = 0; i < 50; i++) {
            const result = getRandomInt(0, 2);
            expect(result).toBeGreaterThanOrEqual(0);
            expect(result).toBeLessThanOrEqual(2);
        }
    });

    test('should return integer values', () => {
        for (let i = 0; i < 50; i++) {
            const result = getRandomInt(1, 100);
            expect(Number.isInteger(result)).toBe(true);
        }
    });
});
