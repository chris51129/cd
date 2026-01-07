/**
 * Tests for ArenaStatus component
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

// Import after mocks
import ArenaStatus from './ArenaStatus';

// Helper to wrap component with ArenaContext
const renderWithArenaContext = (ui, contextValue = {}) => {
    const defaultContext = {
        phase: 'spin',
        status: 'spinning',
        gameState: {},
        isWin: false,
        ...contextValue
    };
    return render(
        <ArenaContext.Provider value={defaultContext}>
            {ui}
        </ArenaContext.Provider>
    );
};

describe('ArenaStatus', () => {
    test('renders status message from context', () => {
        const { container } = renderWithArenaContext(<ArenaStatus />, { status: 'Waiting for opponent...' });
        expect(container).toBeInTheDocument();
    });

    test('renders with spin phase', () => {
        renderWithArenaContext(<ArenaStatus />, { phase: 'spin', status: 'Spinning...' });
    });

    test('renders with result phase and win', () => {
        renderWithArenaContext(<ArenaStatus />, { phase: 'result', isWin: true, status: 'You won!' });
    });

    test('renders with result phase and loss', () => {
        renderWithArenaContext(<ArenaStatus />, { phase: 'result', isWin: false, status: 'You lost!' });
    });

    test('renders with selection phase', () => {
        renderWithArenaContext(<ArenaStatus />, { phase: 'selection', status: 'Make your choice' });
    });
});
