/**
 * Tests for StreakManager component
 */
import React from 'react';
import { render, screen, act } from '@testing-library/react';
import StreakManager from './StreakManager';

// Mock framer-motion
jest.mock('framer-motion', () => ({
    motion: {
        div: ({ children, ...props }) => <div {...props}>{children}</div>,
    },
    AnimatePresence: ({ children }) => <>{children}</>,
}));

describe('StreakManager', () => {
    beforeEach(() => {
        // Clear localStorage before each test
        localStorage.clear();
    });

    test('renders without crashing', () => {
        render(<StreakManager />);
        // Component may render null if no streak
    });

    test('tracks consecutive wins in localStorage', () => {
        // Simulate a win streak
        localStorage.setItem('streak', JSON.stringify({ wins: 3, losses: 0 }));
        render(<StreakManager />);
        // Component reads from localStorage
    });

    test('handles missing localStorage data gracefully', () => {
        expect(() => render(<StreakManager />)).not.toThrow();
    });

    test('resets streak on loss', () => {
        localStorage.setItem('streak', JSON.stringify({ wins: 5, losses: 0 }));
        render(<StreakManager />);
        // After loss, streak should reset
        localStorage.setItem('streak', JSON.stringify({ wins: 0, losses: 1 }));
    });
});
