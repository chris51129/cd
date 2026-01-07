/**
 * Tests for CoinFlipAnimation
 */
import React from 'react';
import { render, screen } from '@testing-library/react';
import CoinFlipAnimation from './CoinFlipAnimation';

// Mock framer-motion
jest.mock('framer-motion', () => ({
    motion: {
        div: ({ children, ...props }) => <div data-testid="motion-div" {...props}>{children}</div>,
    },
    AnimatePresence: ({ children }) => <>{children}</>,
}));

describe('CoinFlipAnimation', () => {
    test('renders spin state', () => {
        render(<CoinFlipAnimation status="spin" />);
        expect(screen.getByText('$')).toBeInTheDocument();
        expect(screen.queryByText('CARA')).not.toBeInTheDocument();
    });

    test('renders result heads', () => {
        render(<CoinFlipAnimation status="result" result="heads" />);
        expect(screen.getByText('CARA')).toBeInTheDocument();
        expect(screen.queryByText('$')).not.toBeInTheDocument();
    });

    test('renders result tails', () => {
        render(<CoinFlipAnimation status="result" result="tails" />);
        expect(screen.getByText('CRUZ')).toBeInTheDocument();
    });
});
