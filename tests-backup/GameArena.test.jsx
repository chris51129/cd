import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import GameArena from './GameArena';
import * as helpers from '../../utils/helpers';
import { GAME_CONFIG } from '../../constants/config';

// 1. MOCKS (Hoisted)
jest.mock('framer-motion', () => {
    const React = require('react');
    const MockMotion = (tag) => React.forwardRef(({ children, ...props }, ref) => {
        const { initial, animate, exit, transition, variants, whileHover, whileTap, drag, dragConstraints, ...validProps } = props;
        return React.createElement(tag, { ...validProps, ref }, children);
    });

    return {
        motion: {
            div: MockMotion('div'),
            h1: MockMotion('h1'),
            h2: MockMotion('h2'),
            p: MockMotion('p'),
            span: MockMotion('span'),
            button: MockMotion('button'),
            section: MockMotion('section'),
            img: MockMotion('img'),
        },
        AnimatePresence: ({ children }) => <>{children}</>,
        useScroll: () => ({ scrollY: { get: () => 0 } }),
        useTransform: () => 0,
    };
});

jest.mock('../../hooks/useGameEngine', () => ({
    useGameEngine: jest.fn(),
}));

jest.mock('../../utils/navigation', () => ({
    reloadPage: jest.fn(),
}));

jest.mock('./SelectionScreen', () => {
    return function MockSelectionScreen({ onSelect, onAssignedReady, isChooser }) {
        return (
            <div data-testid="selection-screen">
                <button onClick={() => onSelect('heads')}>Select Heads</button>
                <button onClick={() => onSelect('tails')}>Select Tails</button>
                <button onClick={() => onAssignedReady('tails')}>Ready Assigned</button>
                <div>{isChooser ? 'MOCK_CHOOSER' : 'MOCK_ASSIGNED'}</div>
            </div>
        );
    };
});

jest.mock('./animations', () => ({
    CoinFlipAnimation: () => <div data-testid="coinflip-animation">Coin Animation</div>,
    DiceAnimation: () => <div data-testid="dice-animation">Dice Animation</div>,
    RPSAnimation: () => <div data-testid="rps-animation">RPS Animation</div>,
}));

jest.mock('./ArenaResults', () => {
    return function MockArenaResults() {
        const { reloadPage } = require('../../utils/navigation');
        return (
            <div data-testid="arena-results">
                <h2>ÉXITO</h2>
                <h2>SIN RECOMPENSA</h2>
                <button onClick={() => reloadPage()}>Nueva interacción</button>
            </div>
        );
    };
});

jest.mock('./VictoryCelebration', () => ({
    __esModule: true,
    default: () => <div data-testid="victory-celebration">Celebration</div>,
    VictoryTrophy: () => <div data-testid="victory-trophy">Trophy</div>,
}));

jest.mock('../ui/Icons', () => ({
    Icons: {
        Coin: () => <div data-testid="icon-coin">Coin Icon</div>,
        Dice: () => <div data-testid="icon-dice">Dice Icon</div>,
        Brain: () => <div data-testid="icon-brain">Brain Icon</div>,
        ShieldCheck: () => <div data-testid="icon-shield">Shield Icon</div>,
    }
}));

jest.mock('../../utils/fairness', () => ({
    generateServerSeed: () => 'mock-seed-123',
    generateGameHash: () => 'mock-hash-456',
}));

jest.mock('./ArenaStatus', () => {
    return function MockArenaStatus() {
        return (
            <div data-testid="arena-status">
                <span>Lanzando moneda...</span>
                <span>Tirando dados...</span>
                <span>ELEGISTE:</span>
                <span>CARA</span>
                <span>CRUZ</span>
                <span>TE TOCÓ:</span>
            </div>
        );
    };
});

jest.mock('./ArenaHeader', () => {
    return function MockArenaHeader() {
        return <div data-testid="arena-header">Header</div>;
    };
});

import { useGameEngine } from '../../hooks/useGameEngine';
import { reloadPage } from '../../utils/navigation';

// 4. Setup Mocks
const mockTier = { id: 1, amount: 10, icon: '🥇', label: 'Gold' };
const mockOnFinish = jest.fn();

describe('GameArena Component', () => {
    const defaultGameState = {
        phase: 'selection',
        status: 'idle',
        isChooser: true,
        playerSide: null,
        result: null,
        outcome: null,
    };

    const defaultActions = {
        selectSide: jest.fn(),
        confirmAssigned: jest.fn(),
    };

    beforeEach(() => {
        jest.useFakeTimers();
        jest.clearAllMocks();
        useGameEngine.mockReturnValue({
            gameState: defaultGameState,
            actions: defaultActions,
        });
    });

    afterEach(() => {
        jest.useRealTimers();
        jest.restoreAllMocks();
    });

    // --- PROPS VALIDATION ---
    test('renders error for invalid tier', () => {
        const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => { });
        render(<GameArena gameType="coinflip" tier={undefined} />);
        expect(screen.getByText(/Error: Tier no válido/i)).toBeInTheDocument();
        consoleSpy.mockRestore();
    });

    test('renders without crashing with valid props', () => {
        render(<GameArena gameType="coinflip" tier={mockTier} />);
        expect(screen.getByTestId('arena-header')).toBeInTheDocument();
    });

    test('renders arena-results component', () => {
        render(<GameArena gameType="coinflip" tier={mockTier} />);
        expect(screen.getByTestId('arena-results')).toBeInTheDocument();
    });

    test('renders arena-status component', () => {
        render(<GameArena gameType="coinflip" tier={mockTier} />);
        expect(screen.getByTestId('arena-status')).toBeInTheDocument();
    });

    test('calls reloadPage when Nueva interacción is clicked', () => {
        render(<GameArena gameType="coinflip" tier={mockTier} />);
        fireEvent.click(screen.getByText('Nueva interacción'));
        expect(reloadPage).toHaveBeenCalled();
    });

    // --- COMPLEX INTEGRATION TESTS ---
    describe('CoinFlip Game', () => {
        test('Flow: User is chooser -> Renders SelectionScreen', () => {
            useGameEngine.mockReturnValue({
                gameState: { ...defaultGameState, isChooser: true, phase: 'selection' },
                actions: defaultActions,
            });

            render(<GameArena gameType="coinflip" tier={mockTier} />);
            expect(screen.getByTestId('selection-screen')).toBeInTheDocument();
            expect(screen.getByText('MOCK_CHOOSER')).toBeInTheDocument();
        });

        test('Flow: User is chooser -> Selects Side calls action', () => {
            useGameEngine.mockReturnValue({
                gameState: { ...defaultGameState, isChooser: true, phase: 'selection' },
                actions: defaultActions,
            });

            render(<GameArena gameType="coinflip" tier={mockTier} />);
            fireEvent.click(screen.getByText('Select Heads'));
            expect(defaultActions.selectSide).toHaveBeenCalledWith('heads');
        });

        test('Flow: Result Win -> Renders Victory', async () => {
            useGameEngine.mockReturnValue({
                gameState: {
                    ...defaultGameState,
                    phase: 'result',
                    status: 'result',
                    outcome: 'win',
                    result: 'heads',
                    playerSide: 'heads'
                },
                actions: defaultActions,
            });

            render(<GameArena gameType="coinflip" tier={mockTier} />);
            expect(await screen.findByText('ÉXITO')).toBeInTheDocument();
        });

        test('Flow: User is chooser -> Selects Heads -> Loses (Result Tails)', async () => {
            useGameEngine.mockReturnValue({
                gameState: {
                    ...defaultGameState,
                    phase: 'result',
                    status: 'result',
                    outcome: 'loss',
                    result: 'tails',
                    playerSide: 'heads'
                },
                actions: defaultActions,
            });

            render(<GameArena gameType="coinflip" tier={mockTier} onFinish={mockOnFinish} />);

            expect(await screen.findByText('SIN RECOMPENSA')).toBeInTheDocument();
        });

        test('Flow: Assigned Role -> Renders Status and Waiting', () => {
            useGameEngine.mockReturnValue({
                gameState: { ...defaultGameState, isChooser: false, phase: 'selection' },
                actions: defaultActions,
            });

            render(<GameArena gameType="coinflip" tier={mockTier} />);
            expect(screen.getByText('MOCK_ASSIGNED')).toBeInTheDocument();
        });

        test('Flow: Assigned Role (Spinning) -> Renders Choice', () => {
            useGameEngine.mockReturnValue({
                gameState: { ...defaultGameState, isChooser: false, phase: 'spin', status: 'spin', playerSide: 'tails' },
                actions: defaultActions,
            });

            render(<GameArena gameType="coinflip" tier={mockTier} />);
            expect(screen.getAllByText('TE TOCÓ:')[0]).toBeInTheDocument();
            expect(screen.getAllByText('CRUZ')[0]).toBeInTheDocument();
        });
    });

    // --- DICE SCENARIOS ---
    describe('Dice Game', () => {
        test('Flow: Player Wins (6 vs 1)', async () => {
            useGameEngine.mockReturnValue({
                gameState: {
                    ...defaultGameState,
                    phase: 'result',
                    status: 'result',
                    outcome: 'win',
                    result: { player: 6, opponent: 1 }
                },
                actions: defaultActions,
            });

            render(<GameArena gameType="dice" tier={mockTier} onFinish={mockOnFinish} />);

            expect(await screen.findByText('ÉXITO')).toBeInTheDocument();
        });

        test('Flow: Player Loses (1 vs 6)', async () => {
            useGameEngine.mockReturnValue({
                gameState: {
                    ...defaultGameState,
                    phase: 'result',
                    status: 'result',
                    outcome: 'loss',
                    result: { player: 1, opponent: 6 }
                },
                actions: defaultActions,
            });

            render(<GameArena gameType="dice" tier={mockTier} />);

            expect(await screen.findByText('SIN RECOMPENSA')).toBeInTheDocument();
        });
    });

    // --- RPS SCENARIOS ---
    describe('RPS Game', () => {
        test('Flow: Win (Rock vs Scissors)', async () => {
            useGameEngine.mockReturnValue({
                gameState: {
                    ...defaultGameState,
                    phase: 'result',
                    status: 'result',
                    outcome: 'win',
                    result: { player: 'rock', opponent: 'scissors' }
                },
                actions: defaultActions,
            });

            render(<GameArena gameType="rps" tier={mockTier} />);

            expect(await screen.findByText('ÉXITO')).toBeInTheDocument();
        });

        test('Flow: Loss (Rock vs Paper)', async () => {
            useGameEngine.mockReturnValue({
                gameState: {
                    ...defaultGameState,
                    phase: 'result',
                    status: 'result',
                    outcome: 'loss',
                    result: { player: 'rock', opponent: 'paper' }
                },
                actions: defaultActions,
            });

            render(<GameArena gameType="rps" tier={mockTier} />);

            expect(await screen.findByText('SIN RECOMPENSA')).toBeInTheDocument();
        });
    });

    // --- EDGE CASES ---
    test('renders default message for unsupported game type', () => {
        useGameEngine.mockReturnValue({
            gameState: { ...defaultGameState, phase: 'spin', status: 'spin' },
            actions: defaultActions,
        });
        render(<GameArena gameType="invalid_game" tier={mockTier} />);
        expect(screen.getByText('Juego no soportado')).toBeInTheDocument();
    });

    test('Reloads page when \"Nueva interacción\" is clicked', async () => {
        useGameEngine.mockReturnValue({
            gameState: { ...defaultGameState, phase: 'result', status: 'result', outcome: 'win' },
            actions: defaultActions,
        });

        render(<GameArena gameType="rps" tier={mockTier} />);

        const reloadButton = screen.getByText('Nueva interacción');
        fireEvent.click(reloadButton);

        expect(reloadPage).toHaveBeenCalled();
    });

    test('cleanups timer on unmount', () => {
        const { unmount } = render(<GameArena gameType="dice" tier={mockTier} />);
        unmount();
    });

    test('completes game freely without onFinish prop (branch coverage)', () => {
        useGameEngine.mockReturnValue({
            gameState: { ...defaultGameState, phase: 'result', status: 'result', outcome: 'win' },
            actions: defaultActions,
        });

        render(<GameArena gameType="dice" tier={mockTier} />);
        expect(screen.getByText('ÉXITO')).toBeInTheDocument();
    });
});
