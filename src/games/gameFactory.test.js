/**
 * Tests for gameFactory.js
 */
import { getGameStrategy, isValidGameType, getAvailableGames, getInitialGameState, registerGameStrategy } from './gameFactory';

describe('gameFactory', () => {
    describe('getGameStrategy', () => {
        test('returns coinflip strategy', () => {
            const strategy = getGameStrategy('coinflip');
            expect(strategy).toBeDefined();
            expect(strategy.type).toBe('coinflip');
        });

        test('returns dice strategy', () => {
            const strategy = getGameStrategy('dice');
            expect(strategy).toBeDefined();
            expect(strategy.type).toBe('dice');
        });

        test('returns rps strategy', () => {
            const strategy = getGameStrategy('rps');
            expect(strategy).toBeDefined();
            expect(strategy.type).toBe('rps');
        });

        test('returns memory strategy', () => {
            const strategy = getGameStrategy('memory');
            expect(strategy).toBeDefined();
            expect(strategy.type).toBe('memory');
        });

        test('returns quickdraw strategy', () => {
            const strategy = getGameStrategy('quickdraw');
            expect(strategy).toBeDefined();
            expect(strategy.type).toBe('quickdraw');
        });

        test('returns blockvalidation strategy', () => {
            const strategy = getGameStrategy('blockvalidation');
            expect(strategy).toBeDefined();
            expect(strategy.type).toBe('blockvalidation');
        });

        test('returns null for unknown game type', () => {
            const strategy = getGameStrategy('unknowngame');
            expect(strategy).toBeNull();
        });
    });

    describe('isValidGameType', () => {
        test('returns true for valid game types', () => {
            expect(isValidGameType('coinflip')).toBe(true);
            expect(isValidGameType('dice')).toBe(true);
            expect(isValidGameType('rps')).toBe(true);
        });

        test('returns false for invalid game types', () => {
            expect(isValidGameType('unknowngame')).toBe(false);
        });
    });

    describe('getAvailableGames', () => {
        test('returns array of game types', () => {
            const games = getAvailableGames();
            expect(Array.isArray(games)).toBe(true);
            expect(games.length).toBeGreaterThan(0);
        });

        test('includes all game types', () => {
            const games = getAvailableGames();
            expect(games).toContain('coinflip');
            expect(games).toContain('dice');
            expect(games).toContain('rps');
            expect(games).toContain('memory');
            expect(games).toContain('quickdraw');
            expect(games).toContain('blockvalidation');
        });
    });

    describe('getInitialGameState', () => {
        test('returns initial state for coinflip', () => {
            const state = getInitialGameState('coinflip');
            expect(state).toBeDefined();
        });

        test('returns empty object for unknown game', () => {
            const state = getInitialGameState('unknowngame');
            expect(state).toEqual({});
        });
    });
});
