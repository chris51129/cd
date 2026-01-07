/**
 * Tests for DiceAnimation
 */
import React from 'react';
import { render, screen } from '@testing-library/react';
import DiceAnimation from './DiceAnimation';

// Mock framer-motion
jest.mock('framer-motion', () => ({
    motion: {
        div: ({ children, ...props }) => (
            <div data-testid="motion-div" {...props}>
                {children}
            </div>
        ),
    },
}));

describe('DiceAnimation', () => {
    test('renders spin state', () => {
        render(<DiceAnimation status="spin" />);
        expect(screen.getByText('VS')).toBeInTheDocument();
    });

    test('renders result state', () => {
        const result = { player: 4, opponent: 6 };
        render(<DiceAnimation status="result" result={result} />);
        expect(screen.getByText('VS')).toBeInTheDocument();
        expect(screen.getByText('4')).toBeInTheDocument();
        expect(screen.getByText('6')).toBeInTheDocument();
    });
});
