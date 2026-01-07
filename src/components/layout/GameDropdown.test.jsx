/**
 * Tests for GameDropdown component
 */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

// Mock framer-motion
jest.mock('framer-motion', () => ({
    motion: {
        div: ({ children, className, onClick, style, ...props }) => <div className={className} onClick={onClick} style={style}>{children}</div>,
    },
    AnimatePresence: ({ children }) => <>{children}</>,
}));

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
}));

// Mock SafetyContext
jest.mock('../../context/SafetyContext', () => ({
    useSafety: () => ({
        handleSafeNavigation: (callback) => callback()
    })
}));

// Mock AnimatedLucideIcons
jest.mock('../ui/AnimatedLucideIcons', () => ({
    AnimatedCoin: () => <span>Coin</span>,
    AnimatedDice: () => <span>Dice</span>,
    AnimatedRPS: () => <span>RPS</span>,
    AnimatedBrain: () => <span>Brain</span>,
    AnimatedZap: () => <span>Zap</span>,
    AnimatedGrid: () => <span>Grid</span>,
}));

import GameDropdown from './GameDropdown';

describe('GameDropdown', () => {
    beforeEach(() => {
        mockNavigate.mockClear();
    });

    test('renders when isOpen is true', () => {
        render(
            <MemoryRouter>
                <GameDropdown isOpen={true} onClose={jest.fn()} />
            </MemoryRouter>
        );
        expect(screen.getByText('Probabilidad')).toBeInTheDocument();
        expect(screen.getByText('Habilidad')).toBeInTheDocument();
    });

    test('does not render when isOpen is false', () => {
        render(
            <MemoryRouter>
                <GameDropdown isOpen={false} onClose={jest.fn()} />
            </MemoryRouter>
        );
        expect(screen.queryByText('Probabilidad')).not.toBeInTheDocument();
    });

    test('renders game items', () => {
        render(
            <MemoryRouter>
                <GameDropdown isOpen={true} onClose={jest.fn()} />
            </MemoryRouter>
        );
        expect(screen.getByText('Cara o Cruz')).toBeInTheDocument();
        expect(screen.getByText('Duelo de Dados')).toBeInTheDocument();
        expect(screen.getByText('Memoria Cripto')).toBeInTheDocument();
    });

    test('navigates to game on click', () => {
        const onClose = jest.fn();
        render(
            <MemoryRouter>
                <GameDropdown isOpen={true} onClose={onClose} />
            </MemoryRouter>
        );

        const coinflipItem = screen.getByText('Cara o Cruz');
        fireEvent.click(coinflipItem.closest('.dropdown-item'));

        expect(mockNavigate).toHaveBeenCalledWith('/game/coinflip');
        expect(onClose).toHaveBeenCalled();
    });
});
