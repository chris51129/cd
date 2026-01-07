/**
 * Tests for WaitingRoom component
 */
import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import WaitingRoom from './WaitingRoom';
import { GAME_CONFIG } from '../../constants/config';

// Mock framer-motion
jest.mock('framer-motion', () => ({
    motion: {
        div: ({ children, ...props }) => <div {...props}>{children}</div>,
    },
}));

describe('WaitingRoom Component', () => {
    const mockTier = { id: 1, amount: 10, icon: '🥇', label: 'Gold' };

    beforeEach(() => {
        jest.useFakeTimers();
        jest.spyOn(console, 'error').mockImplementation(() => { });
        jest.spyOn(Math, 'random').mockReturnValue(0.5);
    });

    afterEach(() => {
        jest.useRealTimers();
        jest.restoreAllMocks();
    });

    test('renders with valid tier', () => {
        render(<WaitingRoom tier={mockTier} onCancel={jest.fn()} onMatchFound={jest.fn()} />);
        expect(screen.getByText('Buscando oponente...')).toBeInTheDocument();
    });

    test('shows error for null tier', () => {
        render(<WaitingRoom tier={null} onCancel={jest.fn()} onMatchFound={jest.fn()} />);
        expect(screen.getByText(/Error: Tier no válido/)).toBeInTheDocument();
        expect(console.error).toHaveBeenCalled();
    });

    test('shows error for invalid tier amount type', () => {
        render(<WaitingRoom tier={{ ...mockTier, amount: "10" }} onCancel={jest.fn()} onMatchFound={jest.fn()} />);
        expect(screen.getByText(/Error: Tier no válido/)).toBeInTheDocument();
    });

    test('triggers onMatchFound callback', () => {
        const onMatchFound = jest.fn();
        render(<WaitingRoom tier={mockTier} onCancel={jest.fn()} onMatchFound={onMatchFound} />);

        act(() => {
            jest.advanceTimersByTime(GAME_CONFIG.MATCHMAKING_MAX_MS);
        });

        expect(onMatchFound).toHaveBeenCalled();
    });

    test('handles missing onMatchFound gracefully', () => {
        // Validation propType warning might fire, but logic should hold
        render(<WaitingRoom tier={mockTier} onCancel={jest.fn()} />); // No onMatchFound

        act(() => {
            jest.advanceTimersByTime(GAME_CONFIG.MATCHMAKING_MAX_MS);
        });

        // Should not crash
    });
});
