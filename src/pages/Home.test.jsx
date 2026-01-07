/**
 * Tests for Home page
 */
import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

// Mock home components
jest.mock('../components/home', () => ({
    Hero: () => <div data-testid="hero">Hero Section</div>,
    FeatureSection: () => <div data-testid="feature-section">Feature Section</div>,
    Leaderboard: () => <div data-testid="leaderboard">Leaderboard</div>,
}));

import Home from './Home';

const renderWithRouter = (component) => {
    return render(
        <MemoryRouter>
            {component}
        </MemoryRouter>
    );
};

describe('Home Page', () => {
    test('renders without crashing', () => {
        renderWithRouter(<Home />);
        expect(screen.getByTestId('hero')).toBeInTheDocument();
    });

    test('renders Hero component', () => {
        renderWithRouter(<Home />);
        expect(screen.getByTestId('hero')).toBeInTheDocument();
    });

    test('renders FeatureSection component', () => {
        renderWithRouter(<Home />);
        expect(screen.getByTestId('feature-section')).toBeInTheDocument();
    });

    test('renders Leaderboard component', () => {
        renderWithRouter(<Home />);
        expect(screen.getByTestId('leaderboard')).toBeInTheDocument();
    });
});
