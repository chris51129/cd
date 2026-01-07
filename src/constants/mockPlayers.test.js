/**
 * Tests for mockPlayers generator
 */
import { generateMockPlayers } from './mockPlayers';

describe('generateMockPlayers', () => {
    test('generates default 100 players', () => {
        const players = generateMockPlayers();
        expect(players.length).toBe(100);
    });

    test('generates specified number of players', () => {
        const players = generateMockPlayers(50);
        expect(players.length).toBe(50);
    });

    test('each player has required properties', () => {
        const players = generateMockPlayers(5);

        players.forEach(player => {
            expect(player).toHaveProperty('id');
            expect(player).toHaveProperty('rank');
            expect(player).toHaveProperty('name');
            expect(player).toHaveProperty('winnings');
            expect(player).toHaveProperty('wins');
            expect(player).toHaveProperty('duels');
            expect(player).toHaveProperty('winRate');
            expect(player).toHaveProperty('streak');
            expect(player).toHaveProperty('tier');
            expect(player).toHaveProperty('avatar');
        });
    });

    test('player id is unique', () => {
        const players = generateMockPlayers(10);
        const ids = players.map(p => p.id);
        const uniqueIds = new Set(ids);
        expect(uniqueIds.size).toBe(10);
    });

    test('player wins is less than or equal to duels', () => {
        const players = generateMockPlayers(10);

        players.forEach(player => {
            expect(player.wins).toBeLessThanOrEqual(player.duels);
        });
    });

    test('tier is one of valid tiers', () => {
        const validTiers = ['Rookie', 'Veteran', 'Elite', 'Legend'];
        const players = generateMockPlayers(10);

        players.forEach(player => {
            expect(validTiers).toContain(player.tier);
        });
    });

    test('avatar URL is valid dicebear format', () => {
        const players = generateMockPlayers(3);

        players.forEach(player => {
            expect(player.avatar).toMatch(/https:\/\/api\.dicebear\.com/);
        });
    });
});
