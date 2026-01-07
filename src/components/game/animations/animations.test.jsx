/**
 * Tests for game animation components
 * Uses global framer-motion mock from __mocks__
 */
import React from 'react';
import { render, screen } from '@testing-library/react';
import CoinFlipAnimation from './CoinFlipAnimation';
import DiceAnimation from './DiceAnimation';
import RPSAnimation from './RPSAnimation';

describe('CoinFlipAnimation', () => {
    test('renders without crashing', () => {
        const { container } = render(<CoinFlipAnimation status="spin" result={null} />);
        // Verify component renders without errors
        expect(container.firstChild).not.toBeNull();
    });
});

describe('DiceAnimation', () => {
    test('renders without crashing', () => {
        render(<DiceAnimation status="result" result={{ player: 6, opponent: 3 }} />);
        expect(screen.getByText('VS')).toBeInTheDocument();
    });

    test('shows result values', () => {
        render(<DiceAnimation status="result" result={{ player: 6, opponent: 3 }} />);
        expect(screen.getByText('6')).toBeInTheDocument();
        expect(screen.getByText('3')).toBeInTheDocument();
    });
});

describe('RPSAnimation', () => {
    test('renders without crashing', () => {
        const { container } = render(<RPSAnimation status="result" result={{ player: 'rock', opponent: 'scissors' }} />);
        // Just verify component renders - container has content
        expect(container.firstChild).not.toBeNull();
    });
});
