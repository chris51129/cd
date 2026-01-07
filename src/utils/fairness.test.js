/**
 * Tests for fairness.js - Provable Fairness Utilities
 */
import { generateGameHash, generateServerSeed } from './fairness';

// Mock crypto.getRandomValues
Object.defineProperty(global, 'crypto', {
    value: {
        getRandomValues: jest.fn((array) => {
            for (let i = 0; i < array.length; i++) {
                array[i] = i + 100;
            }
            return array;
        })
    },
});

describe('generateGameHash', () => {
    test('returns a hex string starting with 0x', () => {
        const hash = generateGameHash('seed123', { result: 'heads' });
        expect(hash.startsWith('0x')).toBe(true);
    });

    test('returns a 66-character string (0x + 64 hex chars)', () => {
        const hash = generateGameHash('seed', { data: 'test' });
        expect(hash.length).toBe(66);
    });

    test('produces consistent hash for same inputs', () => {
        const hash1 = generateGameHash('seed', { result: 'heads' });
        const hash2 = generateGameHash('seed', { result: 'heads' });
        expect(hash1).toBe(hash2);
    });

    test('produces different hash for different seeds', () => {
        const hash1 = generateGameHash('seed1', { result: 'heads' });
        const hash2 = generateGameHash('seed2', { result: 'heads' });
        expect(hash1).not.toBe(hash2);
    });

    test('produces different hash for different results', () => {
        const hash1 = generateGameHash('seed', { result: 'heads' });
        const hash2 = generateGameHash('seed', { result: 'tails' });
        expect(hash1).not.toBe(hash2);
    });

    test('handles complex result objects', () => {
        const hash = generateGameHash('seed', {
            player: 'rock',
            opponent: 'scissors',
            winner: 'player'
        });
        expect(hash).toBeDefined();
        expect(hash.length).toBe(66);
    });
});

describe('generateServerSeed', () => {
    test('returns a 32-character hex string', () => {
        const seed = generateServerSeed();
        expect(seed.length).toBe(32);
    });

    test('returns only hex characters', () => {
        const seed = generateServerSeed();
        expect(/^[0-9a-f]+$/.test(seed)).toBe(true);
    });

    test('uses crypto.getRandomValues', () => {
        generateServerSeed();
        expect(crypto.getRandomValues).toHaveBeenCalled();
    });
});
