/**
 * Tests for ArenaContext
 */
import React from 'react';
import { renderHook } from '@testing-library/react';
import ArenaContext, { useArena } from './ArenaContext';

describe('ArenaContext', () => {
    test('exports ArenaContext', () => {
        expect(ArenaContext).toBeDefined();
    });

    test('exports useArena hook', () => {
        expect(useArena).toBeDefined();
        expect(typeof useArena).toBe('function');
    });

    test('useArena throws error when used outside provider', () => {
        expect(() => {
            renderHook(() => useArena());
        }).toThrow('useArena debe usarse dentro de un GameArena');
    });

    test('useArena returns context value when inside provider', () => {
        const mockValue = { gameState: {}, actions: {} };

        const wrapper = ({ children }) => (
            <ArenaContext.Provider value={mockValue}>
                {children}
            </ArenaContext.Provider>
        );

        const { result } = renderHook(() => useArena(), { wrapper });

        expect(result.current).toBe(mockValue);
    });
});
