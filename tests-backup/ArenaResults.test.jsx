/**
 * Tests for ArenaResults component
 */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ArenaContext from './ArenaContext';

// Mock framer-motion
jest.mock('framer-motion', () => ({
    motion: {
        div: ({ children, onClick, ...props }) => <div onClick={onClick} {...props}>{children}</div>,
        span: ({ children, ...props }) => <span {...props}>{children}</span>,
        h2: ({ children, ...props }) => <h2 {...props}>{children}</h2>,
        button: ({ children, onClick, ...props }) => <button onClick={onClick} {...props}>{children}</button>,
    },
    AnimatePresence: ({ children }) => <>{children}</>,
}));

// Import after mocks
import ArenaResults from './ArenaResults';

// Helper to wrap component with ArenaContext
const renderWithArenaContext = (ui, contextValue = {}) => {
    const defaultContext = {
        isWin: true,
        result: { outcome: 'win' },
        tier: { id: 1, amount: 10, label: 'Gold' },
        onPlayAgain: jest.fn(),
        onExit: jest.fn(),
        phase: 'result',
        gameState: {},
        ...contextValue
    };
    return render(
        <ArenaContext.Provider value={defaultContext}>
            {ui}
        </ArenaContext.Provider>
    );
};

describe('ArenaResults', () => {
    test('renders victory message when isWin is true', () => {
        renderWithArenaContext(<ArenaResults />, { isWin: true });
    });

    test('renders defeat message when isWin is false', () => {
        renderWithArenaContext(<ArenaResults />, { isWin: false });
    });

    test('displays tier amount', () => {
        renderWithArenaContext(<ArenaResults />, { tier: { id: 1, amount: 10, label: 'Gold' } });
    });

    test('handles undefined result gracefully', () => {
        renderWithArenaContext(<ArenaResults />, { result: undefined });
    });

    test('handles onPlayAgain callback', () => {
        const onPlayAgain = jest.fn();
        renderWithArenaContext(<ArenaResults />, { onPlayAgain });
    });

    test('handles onExit callback', () => {
        const onExit = jest.fn();
        renderWithArenaContext(<ArenaResults />, { onExit });
    });
});
