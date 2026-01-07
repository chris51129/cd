/**
 * Tests for App component
 * Integration test for routing and layout structure
 */
import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';

// Mock child components to isolate App logic
jest.mock('./components/layout', () => ({
    Navbar: () => <div data-testid="navbar">Navbar</div>,
    Footer: () => <div data-testid="footer">Footer</div>
}));

jest.mock('./pages/Home', () => () => <div data-testid="home">Home Page</div>);
jest.mock('./pages/GamePage', () => () => <div data-testid="game-page">Game Page</div>);
jest.mock('./pages/NotFound', () => () => <div data-testid="not-found">404</div>);


// ErrorBoundary mock that just renders children
jest.mock('./components/ui/ErrorBoundary', () => {
    return function ErrorBoundary({ children }) {
        return <div data-testid="error-boundary">{children}</div>;
    };
});

// StreakManager mock
jest.mock('./components/game/StreakManager', () => () => null);

// Context mocks
jest.mock('./context/SafetyContext', () => ({
    SafetyProvider: ({ children }) => <>{children}</>
}));

jest.mock('./context/SoundContext', () => ({
    SoundProvider: ({ children }) => <>{children}</>
}));

describe('App Component', () => {
    test('renders layout and home page by default', async () => {
        render(
            <MemoryRouter initialEntries={['/']}>
                <App />
            </MemoryRouter>
        );

        expect(screen.getByTestId('error-boundary')).toBeInTheDocument();
        expect(screen.getByTestId('navbar')).toBeInTheDocument();
        expect(screen.getByTestId('footer')).toBeInTheDocument();
        expect(await screen.findByTestId('home')).toBeInTheDocument();
    });

    test('renders game page for /game/:id route', async () => {
        render(
            <MemoryRouter initialEntries={['/game/coinflip']}>
                <App />
            </MemoryRouter>
        );

        expect(await screen.findByTestId('game-page')).toBeInTheDocument();
        // Should still show layout
        expect(screen.getByTestId('navbar')).toBeInTheDocument();
        expect(screen.getByTestId('footer')).toBeInTheDocument();
    });

    test('renders not found page for invalid route', async () => {
        render(
            <MemoryRouter initialEntries={['/invalid-route']}>
                <App />
            </MemoryRouter>
        );

        expect(await screen.findByTestId('not-found')).toBeInTheDocument();
    });
});
