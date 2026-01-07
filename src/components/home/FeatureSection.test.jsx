/**
 * Tests for FeatureSection component
 */
import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

// Mock child components that use useCountUp
jest.mock('./StatCard', () => {
    return function MockStatCard({ label }) {
        return <div data-testid="stat-card">{label}</div>;
    };
});

jest.mock('./GameCard', () => {
    return function MockGameCard({ title }) {
        return <div data-testid="game-card">{title}</div>;
    };
});

import FeatureSection from './FeatureSection';

const renderWithRouter = (component) => {
    return render(
        <BrowserRouter>
            {component}
        </BrowserRouter>
    );
};

describe('FeatureSection Component', () => {
    test('renders without crashing', () => {
        renderWithRouter(<FeatureSection />);
        expect(document.body).toBeInTheDocument();
    });

    test('renders game cards', () => {
        renderWithRouter(<FeatureSection />);
        const gameCards = screen.getAllByTestId('game-card');
        expect(gameCards.length).toBe(6); // Updated: coinflip, dice, rps, memory, quickdraw, blockvalidation
    });
});
