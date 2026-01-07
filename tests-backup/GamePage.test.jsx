import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

// 1. MOCKS (Hoisted)
jest.mock('framer-motion', () => ({
    motion: {
        div: ({ children, ...props }) => <div {...props}>{children}</div>,
        h1: ({ children, ...props }) => <h1 {...props}>{children}</h1>,
    },
    AnimatePresence: ({ children }) => <>{children}</>,
}));

jest.mock('../context/SafetyContext', () => ({
    useSafety: () => ({
        handleSafeNavigation: (fn) => fn(),
        isRisky: false,
        setIsRisky: jest.fn()
    }),
    SafetyProvider: ({ children }) => <>{children}</>
}));

jest.mock('../components/game/GameRules', () => {
    return function MockGameRules() { return <div data-testid="game-rules" />; };
});

jest.mock('../context/SoundContext', () => ({
    useSound: () => ({ play: jest.fn() }),
    SoundProvider: ({ children }) => <>{children}</>
}));

jest.mock('../utils/security', () => ({
    secureLog: {
        info: jest.fn(),
        error: jest.fn((...args) => console.error(...args)),
        warn: jest.fn(),
    },
    secureRandomInt: jest.fn((min, max) => min)
}));

jest.mock('../utils/securityProxy', () => ({
    createSecureActionProxy: (fn) => (data) => {
        if (!data) {
            require('../utils/security').secureLog.error('Invalid tier');
            return null;
        }
        return fn(data);
    },
}));

jest.mock('../components/game', () => ({
    TierSelector: ({ onSelect }) => (
        <div data-testid="tier-selector">
            <button onClick={() => onSelect({ id: 1, amount: 10, label: 'Gold' })}>Select Tier</button>
            <button onClick={() => onSelect(null)}>Invalid Tier</button>
        </div>
    ),
    WaitingRoom: ({ onCancel, onMatchFound }) => (
        <div data-testid="waiting-room">
            <button onClick={onCancel}>Cancel</button>
            <button onClick={onMatchFound}>Match Found</button>
        </div>
    ),
    GameArena: ({ onFinish }) => (
        <div data-testid="game-arena">
            <button onClick={() => onFinish({ result: 'victory' })}>Finish Game</button>
        </div>
    )
}));

jest.mock('../components/ui', () => ({
    __esModule: true,
    StepIndicator: () => <div data-testid="step-indicator" />,
    Button: ({ children, onClick }) => <button onClick={onClick}>{children}</button>,
}));

jest.mock('../components/ui/ConfirmationModal', () => {
    return function MockModal() { return <div data-testid="mock-modal" />; };
});

jest.mock('../components/layout', () => ({
    Navbar: () => null,
    Footer: () => null
}));

// 2. IMPORT COMPONENT
import GamePage from './GamePage';

describe('GamePage', () => {
    test('redirects to 404 for invalid game id', () => {
        render(
            <MemoryRouter initialEntries={['/game/invalid']}>
                <Routes>
                    <Route path="/game/:id" element={<GamePage />} />
                    <Route path="/404" element={<div>404 Page</div>} />
                </Routes>
            </MemoryRouter>
        );
        expect(screen.getByText('404 Page')).toBeInTheDocument();
    });

    describe('Integration Tests (Reactivated)', () => {
        test('renders selection screen for valid game', () => {
            render(
                <MemoryRouter initialEntries={['/game/coinflip']}>
                    <Routes>
                        <Route path="/game/:id" element={<GamePage />} />
                    </Routes>
                </MemoryRouter>
            );

            expect(screen.getByText(/Cara o Cruz/i)).toBeInTheDocument();
            expect(screen.getByTestId('tier-selector')).toBeInTheDocument();
        });

        test('handles valid tier selection and navigation to waiting room', () => {
            render(
                <MemoryRouter initialEntries={['/game/coinflip']}>
                    <Routes>
                        <Route path="/game/:id" element={<GamePage />} />
                    </Routes>
                </MemoryRouter>
            );

            fireEvent.click(screen.getByText('Select Tier'));
            expect(screen.getByTestId('waiting-room')).toBeInTheDocument();
        });

        test('handles invalid tier selection (logs error)', () => {
            const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => { });
            render(
                <MemoryRouter initialEntries={['/game/coinflip']}>
                    <Routes>
                        <Route path="/game/:id" element={<GamePage />} />
                    </Routes>
                </MemoryRouter>
            );

            fireEvent.click(screen.getByText('Invalid Tier'));

            expect(consoleSpy).toHaveBeenCalled();
            expect(screen.getByTestId('tier-selector')).toBeInTheDocument();
            expect(screen.queryByTestId('waiting-room')).not.toBeInTheDocument();

            consoleSpy.mockRestore();
        });

        test('handles cancel wait', () => {
            render(
                <MemoryRouter initialEntries={['/game/coinflip']}>
                    <Routes>
                        <Route path="/game/:id" element={<GamePage />} />
                    </Routes>
                </MemoryRouter>
            );

            fireEvent.click(screen.getByText('Select Tier'));
            fireEvent.click(screen.getByText('Cancel'));

            expect(screen.getByTestId('tier-selector')).toBeInTheDocument();
        });

        test('handles match found and finishes game', () => {
            render(
                <MemoryRouter initialEntries={['/game/coinflip']}>
                    <Routes>
                        <Route path="/game/:id" element={<GamePage />} />
                    </Routes>
                </MemoryRouter>
            );

            fireEvent.click(screen.getByText('Select Tier'));
            fireEvent.click(screen.getByText('Match Found'));

            expect(screen.getByTestId('game-arena')).toBeInTheDocument();

            fireEvent.click(screen.getByText('Finish Game'));
            expect(screen.getByTestId('game-arena')).toBeInTheDocument();
        });
    });
});
