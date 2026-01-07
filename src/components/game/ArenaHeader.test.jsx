/**
 * Tests for ArenaHeader component
 */
import React from 'react';
import { render, screen } from '@testing-library/react';
import ArenaContext from './ArenaContext';

// Mock framer-motion
jest.mock('framer-motion', () => ({
    motion: {
        div: ({ children, ...props }) => <div {...props}>{children}</div>,
        span: ({ children, ...props }) => <span {...props}>{children}</span>,
    },
    AnimatePresence: ({ children }) => <>{children}</>,
}));

// Mock lucide-react
jest.mock('lucide-react', () => ({
    Clock: () => <span data-testid="clock-icon">Clock</span>,
    Users: () => <span data-testid="users-icon">Users</span>,
    Zap: () => <span data-testid="zap-icon">Zap</span>,
}));

// Import after mocks
import ArenaHeader from './ArenaHeader';

// Helper to wrap component with ArenaContext
const renderWithArenaContext = (ui, contextValue = {}) => {
    const defaultContext = {
        gameTitle: 'Coin Flip',
        tier: { id: 1, amount: 10, label: 'Gold' },
        timeLeft: 30,
        phase: 'spin',
        gameState: {},
        ...contextValue
    };
    return render(
        <ArenaContext.Provider value={defaultContext}>
            {ui}
        </ArenaContext.Provider>
    );
};

describe('ArenaHeader', () => {
    test('renders game title from context', () => {
        const { container } = renderWithArenaContext(<ArenaHeader />, { gameTitle: 'Coin Flip' });
        expect(container).toBeInTheDocument();
    });

    test('renders tier information', () => {
        const { container } = renderWithArenaContext(<ArenaHeader />, { tier: { id: 1, amount: 10, label: 'Gold' } });
        expect(container).toBeInTheDocument();
    });

    test('renders time left', () => {
        renderWithArenaContext(<ArenaHeader />, { timeLeft: 30 });
    });

    test('handles empty tier gracefully', () => {
        renderWithArenaContext(<ArenaHeader />, { tier: { id: 0, amount: 0, label: '' } });
    });

    test('handles zero timeLeft', () => {
        renderWithArenaContext(<ArenaHeader />, { timeLeft: 0 });
    });

    test('handles different phases', () => {
        renderWithArenaContext(<ArenaHeader />, { phase: 'selection' });
        renderWithArenaContext(<ArenaHeader />, { phase: 'result' });
    });
});
