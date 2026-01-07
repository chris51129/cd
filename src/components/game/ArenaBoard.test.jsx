/**
 * Tests for ArenaBoard component
 * Verified against actual component API
 */
import React from 'react';
import { render, screen } from '@testing-library/react';
import ArenaContext from './ArenaContext';

// Mock framer-motion
jest.mock('framer-motion', () => ({
    motion: {
        div: ({ children, className, ...props }) => <div className={className}>{children}</div>,
    },
    AnimatePresence: ({ children }) => <>{children}</>,
}));

// Mock animations
jest.mock('./animations', () => ({
    CoinFlipAnimation: () => <div data-testid="coinflip-animation">CoinFlip</div>,
    DiceAnimation: () => <div data-testid="dice-animation">Dice</div>,
    RPSAnimation: () => <div data-testid="rps-animation">RPS</div>,
    MemoryAnimation: () => <div data-testid="memory-animation">Memory</div>,
    QuickDrawAnimation: () => <div data-testid="quickdraw-animation">QuickDraw</div>,
    BlockValidationAnimation: () => <div data-testid="blockvalidation-animation">BlockValidation</div>,
}));

// Mock SelectionScreen
jest.mock('./SelectionScreen', () => () => <div data-testid="selection-screen">Selection</div>);

// Mock EtherLoader
jest.mock('../ui', () => ({
    EtherLoader: () => <div data-testid="loader">Loading...</div>,
}));

import ArenaBoard from './ArenaBoard';

const renderWithContext = (contextValue) => {
    const defaultContext = {
        gameType: 'coinflip',
        gameState: {
            phase: 'spin',
            status: 'spinning',
            isChooser: true,
            playerSide: 'heads',
            result: null,
            selectionTimeLeft: 10
        },
        actions: {
            selectSide: jest.fn(),
            confirmAssigned: jest.fn(),
            handleMemoryCardClick: jest.fn(),
            handleQuickDrawClick: jest.fn(),
            handleBlockCellClick: jest.fn()
        },
        ...contextValue
    };

    return render(
        <ArenaContext.Provider value={defaultContext}>
            <ArenaBoard />
        </ArenaContext.Provider>
    );
};

describe('ArenaBoard', () => {
    test('renders without crashing', () => {
        const { container } = renderWithContext({});
        expect(container).toBeInTheDocument();
    });

    test('renders SelectionScreen during selection phase', () => {
        renderWithContext({
            gameState: {
                phase: 'selection',
                status: 'idle',
                isChooser: true,
                playerSide: 'heads',
                selectionTimeLeft: 10
            }
        });
        expect(screen.getByTestId('selection-screen')).toBeInTheDocument();
    });

    test('renders CoinFlipAnimation for coinflip game', () => {
        renderWithContext({ gameType: 'coinflip' });
        expect(screen.getByTestId('coinflip-animation')).toBeInTheDocument();
    });

    test('renders DiceAnimation for dice game', () => {
        renderWithContext({ gameType: 'dice' });
        expect(screen.getByTestId('dice-animation')).toBeInTheDocument();
    });

    test('renders RPSAnimation for rps game', () => {
        renderWithContext({ gameType: 'rps' });
        expect(screen.getByTestId('rps-animation')).toBeInTheDocument();
    });

    test('renders MemoryAnimation for memory game', () => {
        renderWithContext({ gameType: 'memory' });
        expect(screen.getByTestId('memory-animation')).toBeInTheDocument();
    });

    test('renders QuickDrawAnimation for quickdraw game', () => {
        renderWithContext({ gameType: 'quickdraw' });
        expect(screen.getByTestId('quickdraw-animation')).toBeInTheDocument();
    });

    test('renders BlockValidationAnimation for blockvalidation game', () => {
        renderWithContext({ gameType: 'blockvalidation' });
        expect(screen.getByTestId('blockvalidation-animation')).toBeInTheDocument();
    });

    test('renders fallback for unsupported game', () => {
        renderWithContext({ gameType: 'unknowngame' });
        expect(screen.getByText('Juego no soportado')).toBeInTheDocument();
    });

    test('renders position context for coinflip', () => {
        const { container } = renderWithContext({
            gameType: 'coinflip',
            gameState: {
                phase: 'spin',
                status: 'spinning',
                isChooser: true,
                playerSide: 'heads'
            }
        });
        expect(container.querySelector('.position-context-row')).toBeInTheDocument();
    });
});
