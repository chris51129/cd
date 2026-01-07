/**
 * Tests for MemoryAnimation component
 */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

// Mock framer-motion
jest.mock('framer-motion', () => ({
    motion: {
        div: ({ children, className, onClick, style, ...props }) => <div className={className} onClick={onClick} style={style}>{children}</div>,
        span: ({ children, ...props }) => <span>{children}</span>,
    },
    AnimatePresence: ({ children }) => <>{children}</>,
}));

// Mock MemoryCard
jest.mock('../MemoryCard', () => ({ icon: Icon, state, onClick, index }) => (
    <div
        data-testid={`memory-card-${index}`}
        data-state={state}
        onClick={() => onClick && onClick(index)}
        className="memory-card-mock"
    >
        Card {index}
    </div>
));

// Mock CountdownOverlay
jest.mock('../CountdownOverlay', () => () => <div data-testid="countdown">Countdown</div>);

// Mock AnimatedLucideIcons
jest.mock('../../ui/AnimatedLucideIcons', () => ({
    AnimatedActivity: () => <span>Activity</span>,
    AnimatedFingerprint: () => <span>Fingerprint</span>,
    AnimatedShieldCheck: () => <span>ShieldCheck</span>,
    AnimatedCPU: () => <span>CPU</span>,
    AnimatedZap: () => <span>Zap</span>,
    AnimatedCoin: () => <span>Coin</span>,
    AnimatedDice: () => <span>Dice</span>,
    AnimatedBrain: () => <span>Brain</span>,
}));

import MemoryAnimation from './MemoryAnimation';

describe('MemoryAnimation', () => {
    const defaultProps = {
        status: 'spin',
        result: null,
        gameState: {
            board: [0, 1, 2, 3, 4, 5, 6, 7, 0, 1, 2, 3, 4, 5, 6, 7],
            flippedIndices: [],
            matchedIndices: [],
            memoryScores: { player: 0, opponent: 0 },
            timeLeft: 60,
            memoryPhase: 'playing',
            memorizeTimeLeft: 5
        },
        onCardClick: jest.fn()
    };

    test('renders memory board', () => {
        const { container } = render(<MemoryAnimation {...defaultProps} />);
        expect(container.firstChild).toBeInTheDocument();
    });

    test('renders 16 cards', () => {
        render(<MemoryAnimation {...defaultProps} />);
        const cards = screen.getAllByTestId(/memory-card-/);
        expect(cards.length).toBe(16);
    });

    test('calls onCardClick when card is clicked', () => {
        const onCardClick = jest.fn();
        render(<MemoryAnimation {...defaultProps} onCardClick={onCardClick} />);

        const card = screen.getByTestId('memory-card-0');
        fireEvent.click(card);
        expect(onCardClick).toHaveBeenCalledWith(0);
    });

    test('renders time left in timer', () => {
        render(<MemoryAnimation {...defaultProps} />);
        expect(screen.getByText('60s')).toBeInTheDocument();
    });

    test('renders player and opponent scores', () => {
        render(<MemoryAnimation {...defaultProps} />);
        expect(screen.getByText('Tú')).toBeInTheDocument();
        expect(screen.getByText('Oponente')).toBeInTheDocument();
    });

    test('shows memorize overlay during memorize phase', () => {
        render(
            <MemoryAnimation
                {...defaultProps}
                gameState={{ ...defaultProps.gameState, memoryPhase: 'memorize', memorizeTimeLeft: 3 }}
            />
        );
        expect(screen.getByText(/¡MEMORIZA!/)).toBeInTheDocument();
    });

    test('renders default state when status is not spin or result', () => {
        render(<MemoryAnimation {...defaultProps} status="idle" />);
        expect(screen.getByText('Preparando tablero...')).toBeInTheDocument();
    });

    test('renders result screen on win', () => {
        render(
            <MemoryAnimation
                {...defaultProps}
                status="result"
                result={{ player: 5, opponent: 3 }}
            />
        );
        expect(screen.getByText('¡VICTORIA!')).toBeInTheDocument();
    });

    test('renders result screen on loss', () => {
        render(
            <MemoryAnimation
                {...defaultProps}
                status="result"
                result={{ player: 2, opponent: 6 }}
            />
        );
        expect(screen.getByText('DERROTA')).toBeInTheDocument();
    });
});
