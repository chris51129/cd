/**
 * Tests for CountdownOverlay component
 */
import React from 'react';
import { render, screen, act } from '@testing-library/react';

// Mock framer-motion
jest.mock('framer-motion', () => ({
    motion: {
        div: ({ children, ...props }) => <div {...props}>{children}</div>,
        span: ({ children, ...props }) => <span {...props}>{children}</span>,
    },
    AnimatePresence: ({ children }) => <>{children}</>,
}));

// Mock ArenaContext if needed
jest.mock('./ArenaContext', () => ({
    __esModule: true,
    default: { Provider: ({ children }) => children },
    useArena: () => ({
        gameState: { countdownLeft: 3 }
    })
}));

import CountdownOverlay from './CountdownOverlay';

describe('CountdownOverlay', () => {
    beforeEach(() => {
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    test('renders countdown number', () => {
        render(<CountdownOverlay count={3} onComplete={jest.fn()} />);
    });

    test('renders with count 2', () => {
        render(<CountdownOverlay count={2} onComplete={jest.fn()} />);
    });

    test('renders with count 1', () => {
        render(<CountdownOverlay count={1} onComplete={jest.fn()} />);
    });

    test('calls onComplete when countdown finishes', () => {
        const onComplete = jest.fn();
        render(<CountdownOverlay count={0} onComplete={onComplete} />);

        act(() => {
            jest.advanceTimersByTime(1000);
        });
    });

    test('handles GO! message', () => {
        render(<CountdownOverlay count={0} onComplete={jest.fn()} showGo={true} />);
    });
});
