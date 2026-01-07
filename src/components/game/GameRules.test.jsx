/**
 * Tests for GameRules component
 */
import React from 'react';
import { render, screen } from '@testing-library/react';
import GameRules from './GameRules';

// Mock framer-motion
jest.mock('framer-motion', () => ({
    motion: {
        div: ({ children, ...props }) => <div {...props}>{children}</div>,
    },
}));

// Mock AnimatedLucideIcons
jest.mock('../ui/AnimatedLucideIcons', () => ({
    AnimatedActivity: () => <span data-testid="activity-icon">Icon</span>,
}));

describe('GameRules', () => {
    const mockRules = {
        mechanics: 'Click to flip the coin',
        winCondition: 'Guess the correct side',
        penalties: 'Lose your bet if wrong'
    };

    test('renders null when rules is undefined', () => {
        const { container } = render(<GameRules />);
        expect(container.firstChild).toBeNull();
    });

    test('renders null when rules is null', () => {
        const { container } = render(<GameRules rules={null} />);
        expect(container.firstChild).toBeNull();
    });

    test('renders mechanics section', () => {
        render(<GameRules rules={mockRules} />);
        expect(screen.getByText('MECÁNICA')).toBeInTheDocument();
        expect(screen.getByText(mockRules.mechanics)).toBeInTheDocument();
    });

    test('renders win condition section', () => {
        render(<GameRules rules={mockRules} />);
        expect(screen.getByText('RESOLUCIÓN EXITOSA')).toBeInTheDocument();
        expect(screen.getByText(mockRules.winCondition)).toBeInTheDocument();
    });

    test('renders penalties section', () => {
        render(<GameRules rules={mockRules} />);
        expect(screen.getByText('CLÁUSULAS DE PENALIZACIÓN')).toBeInTheDocument();
        expect(screen.getByText(mockRules.penalties)).toBeInTheDocument();
    });

    test('renders activity icon', () => {
        render(<GameRules rules={mockRules} />);
        expect(screen.getByTestId('activity-icon')).toBeInTheDocument();
    });

    test('applies container styling', () => {
        const { container } = render(<GameRules rules={mockRules} />);
        const rulesContainer = container.querySelector('.game-rules-container');
        expect(rulesContainer).toBeInTheDocument();
    });
});
