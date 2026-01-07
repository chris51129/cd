/**
 * Tests for StatCard component - Absolute Coverage
 */
import React from 'react';
import { render, screen, act } from '@testing-library/react';
import StatCard from './StatCard';

// Mock framer-motion
jest.mock('framer-motion', () => ({
    motion: {
        div: ({ children, ...props }) => <div {...props}>{children}</div>,
    },
}));

describe('StatCard Component', () => {
    beforeEach(() => {
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    test('renders standard number with formatted value', () => {
        render(<StatCard label="Total Players" value="1,234" />);
        act(() => jest.advanceTimersByTime(5000));

        expect(screen.getByText("Total Players")).toBeInTheDocument();
        const valueEl = document.querySelector('.stat-value-scandi');
        expect(valueEl).toHaveTextContent(/1.234|1,234|1234/);
    });

    test('renders currency formatted value with M & $ suffix', () => {
        render(<StatCard label="Revenue" value="$1.5M" />);
        act(() => jest.advanceTimersByTime(5000));

        const card = screen.getByText('Revenue').closest('div').parentElement;
        expect(card).toHaveTextContent('$');
        expect(card).toHaveTextContent('M');
    });

    test('renders plus suffix', () => {
        render(<StatCard label="Growth" value="+500" />);
        act(() => jest.advanceTimersByTime(5000));

        const card = screen.getByText('Growth').closest('div').parentElement;
        expect(card).toHaveTextContent('+');
    });

    test('renders seconds suffix', () => {
        render(<StatCard label="Time" value="30s" />);
        act(() => jest.advanceTimersByTime(5000));

        const card = screen.getByText('Time').closest('div').parentElement;
        expect(card).toHaveTextContent('s');
    });

    test('renders explicit suffix prop', () => {
        render(<StatCard label="Custom" value="100" suffix="%" />);
        act(() => jest.advanceTimersByTime(5000));

        const card = screen.getByText('Custom').closest('div').parentElement;
        expect(card).toHaveTextContent('%');
    });

    test('renders non-numeric value directly', () => {
        render(<StatCard label="Info" value="Coming Soon" />);
        // Advance timers just in case
        act(() => jest.advanceTimersByTime(5000));
        expect(screen.getByText('Coming Soon')).toBeInTheDocument();
    });
});
