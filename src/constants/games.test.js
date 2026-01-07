/**
 * Tests for constants/games.js
 */
import { GAMES, getGameById, getAllGames } from './games';

describe('GAMES constant', () => {
    test('should have exactly 6 games', () => {
        expect(Object.keys(GAMES)).toHaveLength(6);
    });

    test('should have all game types', () => {
        expect(GAMES).toHaveProperty('coinflip');
        expect(GAMES).toHaveProperty('dice');
        expect(GAMES).toHaveProperty('rps');
        expect(GAMES).toHaveProperty('memory');
        expect(GAMES).toHaveProperty('quickdraw');
        expect(GAMES).toHaveProperty('blockvalidation');
    });

    test('each game should have required properties', () => {
        Object.values(GAMES).forEach((game) => {
            expect(game).toHaveProperty('id');
            expect(game).toHaveProperty('title');
            expect(game).toHaveProperty('icon');
            expect(game).toHaveProperty('type');
            expect(game).toHaveProperty('description');
            expect(typeof game.id).toBe('string');
            expect(typeof game.title).toBe('string');
            expect(typeof game.icon).toBe('string');
        });
    });
});

describe('getGameById', () => {
    test('should return game for valid ID', () => {
        const game = getGameById('coinflip');
        expect(game).toBeDefined();
        expect(game.id).toBe('coinflip');
        expect(game.title).toBe('Cara o Cruz');
    });

    test('should return undefined for invalid ID', () => {
        const game = getGameById('invalid');
        expect(game).toBeUndefined();
    });

    test('should return undefined for null', () => {
        const game = getGameById(null);
        expect(game).toBeUndefined();
    });
});

describe('getAllGames', () => {
    test('should return array of games', () => {
        const games = getAllGames();
        expect(Array.isArray(games)).toBe(true);
        expect(games).toHaveLength(6);
    });

    test('returned games should have all properties', () => {
        const games = getAllGames();
        games.forEach((game) => {
            expect(game).toHaveProperty('id');
            expect(game).toHaveProperty('title');
        });
    });
});
