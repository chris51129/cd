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

// Mock AnimatedLucideIcons - components must be inline, not referenced
jest.mock('../ui/AnimatedLucideIcons', () => {
    const MockIcon = () => <span data-testid="mock-icon">Icon</span>;
    return {
        AnimatedTrophy: MockIcon,
        AnimatedBanknote: MockIcon,
        AnimatedCoin: MockIcon,
        AnimatedFlame: MockIcon,
        AnimatedGrid: MockIcon,
        AnimatedRPS: MockIcon,
        AnimatedBrain: MockIcon,
    };
});

// Import after mocks
import ArenaHeader from './ArenaHeader';

/**
 * Create mock ArenaContextValue matching the real interface
 */
const createMockContext = (overrides = {}) => ({
    gameState: {
        phase: 'playing',
        playerChoice: null,
        opponentChoice: null,
        drawCount: 0,
        result: null,
        ...overrides.gameState,
    },
    actions: {
        makeChoice: jest.fn(),
        startGame: jest.fn(),
        resetGame: jest.fn(),
        ...overrides.actions,
    },
    gameType: overrides.gameType || 'coinflip',
    tier: {
        id: 1,
        amount: 10,
        icon: 'AnimatedTrophy',
        label: 'Gold',
        color: '#FFD700',
        ...overrides.tier,
    },
});

// Helper to wrap component with ArenaContext
const renderWithArenaContext = (ui, contextOverrides = {}) => {
    const contextValue = createMockContext(contextOverrides);
    return render(
        <ArenaContext.Provider value={contextValue}>
            {ui}
        </ArenaContext.Provider>
    );
};

describe('ArenaHeader', () => {
    test('renders without crashing', () => {
        const { container } = renderWithArenaContext(<ArenaHeader />);
        expect(container).toBeInTheDocument();
    });

    test('renders tier information', () => {
        const { container } = renderWithArenaContext(<ArenaHeader />, {
            tier: { id: 1, amount: 10, icon: 'AnimatedTrophy', label: 'Gold', color: '#FFD700' }
        });
        expect(container).toBeInTheDocument();
    });

    test('handles different game types', () => {
        const { container } = renderWithArenaContext(<ArenaHeader />, { gameType: 'rps' });
        expect(container).toBeInTheDocument();
    });

    test('handles empty tier gracefully', () => {
        const { container } = renderWithArenaContext(<ArenaHeader />, {
            tier: { id: 0, amount: 0, icon: 'AnimatedTrophy', label: '', color: '#000' }
        });
        expect(container).toBeInTheDocument();
    });

    test('handles different phases', () => {
        renderWithArenaContext(<ArenaHeader />, { gameState: { phase: 'selection' } });
        renderWithArenaContext(<ArenaHeader />, { gameState: { phase: 'result' } });
    });

    test('returns null for memory game type', () => {
        const { container } = renderWithArenaContext(<ArenaHeader />, { gameType: 'memory' });
        expect(container.firstChild).toBeNull();
    });
});
