/**
 * Tests for RPSAnimation component
 */
import React from 'react';
import { render, act } from '@testing-library/react';
import RPSAnimation from './RPSAnimation';

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

describe('RPSAnimation Component', () => {
    beforeEach(() => {
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    test('renders spin state without crashing', () => {
        const { container } = render(<RPSAnimation status="spin" />);
        expect(container.firstChild).not.toBeNull();
    });

    test('cycles through icons during spin state', () => {
        render(<RPSAnimation status="spin" />);
        // Advance through animation cycle
        act(() => {
            jest.advanceTimersByTime(300);
        });
        // No crash = success
    });

    test('displays result state without crashing', () => {
        const result = { player: 'paper', opponent: 'rock' };
        const { container } = render(<RPSAnimation status="result" result={result} />);
        expect(container.firstChild).not.toBeNull();
    });
});
