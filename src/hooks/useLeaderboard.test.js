/**
 * Tests for useLeaderboard hook
 * Verified against actual hook API
 */
import { renderHook, act } from '@testing-library/react';
import { useLeaderboard } from './useLeaderboard';

// Mock generateMockPlayers
jest.mock('../constants/mockPlayers', () => ({
    generateMockPlayers: (count) => {
        return Array.from({ length: count }, (_, i) => ({
            id: i + 1,
            address: `0x${i.toString(16).padStart(40, '0')}`,
            winnings: Math.random() * 10000,
            wins: Math.floor(Math.random() * 100),
            losses: Math.floor(Math.random() * 50),
            winRate: Math.random() * 100,
            streak: Math.floor(Math.random() * 10)
        }));
    }
}));

describe('useLeaderboard', () => {
    test('returns players array', () => {
        const { result } = renderHook(() => useLeaderboard());
        expect(Array.isArray(result.current.players)).toBe(true);
    });

    test('generates 500 players', () => {
        const { result } = renderHook(() => useLeaderboard());
        expect(result.current.players.length).toBe(500);
    });

    test('initializes with sortBy winnings', () => {
        const { result } = renderHook(() => useLeaderboard());
        expect(result.current.sortBy).toBe('winnings');
    });

    test('initializes with desc order', () => {
        const { result } = renderHook(() => useLeaderboard());
        expect(result.current.order).toBe('desc');
    });

    test('provides setSortBy function', () => {
        const { result } = renderHook(() => useLeaderboard());
        expect(typeof result.current.setSortBy).toBe('function');
    });

    test('provides toggleOrder function', () => {
        const { result } = renderHook(() => useLeaderboard());
        expect(typeof result.current.toggleOrder).toBe('function');
    });

    test('setSortBy changes sort field', () => {
        const { result } = renderHook(() => useLeaderboard());

        act(() => {
            result.current.setSortBy('wins');
        });

        expect(result.current.sortBy).toBe('wins');
    });

    test('toggleOrder switches between asc and desc', () => {
        const { result } = renderHook(() => useLeaderboard());

        expect(result.current.order).toBe('desc');

        act(() => {
            result.current.toggleOrder();
        });

        expect(result.current.order).toBe('asc');

        act(() => {
            result.current.toggleOrder();
        });

        expect(result.current.order).toBe('desc');
    });

    test('players have rank property', () => {
        const { result } = renderHook(() => useLeaderboard());

        result.current.players.forEach((player, index) => {
            expect(player.rank).toBe(index + 1);
        });
    });

    test('players are sorted in correct order', () => {
        const { result } = renderHook(() => useLeaderboard());

        const players = result.current.players;
        for (let i = 1; i < players.length; i++) {
            // In descending order, previous should be >= current
            expect(players[i - 1].winnings).toBeGreaterThanOrEqual(players[i].winnings);
        }
    });
});
