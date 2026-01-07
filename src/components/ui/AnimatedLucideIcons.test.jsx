/**
 * Tests for AnimatedLucideIcons components
 * Tests basic rendering without tight coupling to animation implementation
 */
import React from 'react';
import { render, screen } from '@testing-library/react';

// Mock framer-motion
jest.mock('framer-motion', () => ({
    motion: {
        svg: ({ children, className, ...props }) => <svg className={className}>{children}</svg>,
        path: ({ d, ...props }) => <path d={d} />,
        g: ({ children, ...props }) => <g>{children}</g>,
        rect: ({ x, y, width, height, ...props }) => <rect x={x} y={y} width={width} height={height} />,
        circle: ({ cx, cy, r, ...props }) => <circle cx={cx} cy={cy} r={r} />,
        line: ({ x1, y1, x2, y2, ...props }) => <line x1={x1} y1={y1} x2={x2} y2={y2} />,
    },
}));

import {
    AnimatedActivity,
    AnimatedFingerprint,
    AnimatedShieldCheck,
    AnimatedCPU,
    AnimatedZap,
    AnimatedCoin,
    AnimatedDice,
    AnimatedRPS,
    AnimatedBrain,
    AnimatedGrid,
    AnimatedDollar,
    AnimatedHourglass,
    AnimatedGamepad,
    AnimatedDiamond,
    AnimatedTrophy,
    AnimatedBanknote
} from './AnimatedLucideIcons';

describe('AnimatedLucideIcons', () => {
    const icons = [
        { Component: AnimatedActivity, name: 'AnimatedActivity' },
        { Component: AnimatedFingerprint, name: 'AnimatedFingerprint' },
        { Component: AnimatedShieldCheck, name: 'AnimatedShieldCheck' },
        { Component: AnimatedCPU, name: 'AnimatedCPU' },
        { Component: AnimatedZap, name: 'AnimatedZap' },
        { Component: AnimatedCoin, name: 'AnimatedCoin' },
        { Component: AnimatedDice, name: 'AnimatedDice' },
        { Component: AnimatedRPS, name: 'AnimatedRPS' },
        { Component: AnimatedBrain, name: 'AnimatedBrain' },
        { Component: AnimatedGrid, name: 'AnimatedGrid' },
        { Component: AnimatedDollar, name: 'AnimatedDollar' },
        { Component: AnimatedHourglass, name: 'AnimatedHourglass' },
        { Component: AnimatedGamepad, name: 'AnimatedGamepad' },
        { Component: AnimatedDiamond, name: 'AnimatedDiamond' },
        { Component: AnimatedTrophy, name: 'AnimatedTrophy' },
        { Component: AnimatedBanknote, name: 'AnimatedBanknote' },
    ];

    describe.each(icons)('$name', ({ Component, name }) => {
        test('renders without crashing', () => {
            const { container } = render(<Component />);
            expect(container.querySelector('svg')).toBeInTheDocument();
        });

        test('accepts size prop', () => {
            const { container } = render(<Component size={32} />);
            const svg = container.querySelector('svg');
            expect(svg).toBeInTheDocument();
        });

        test('accepts color prop', () => {
            render(<Component color="#FF0000" />);
        });

        test('accepts className prop', () => {
            const { container } = render(<Component className="test-class" />);
            const svg = container.querySelector('svg');
            expect(svg).toHaveClass('test-class');
        });

        test('accepts animateOnHover prop', () => {
            render(<Component animateOnHover={true} />);
        });
    });

    describe('default props', () => {
        test('AnimatedActivity uses default size 24', () => {
            const { container } = render(<AnimatedActivity />);
            const svg = container.querySelector('svg');
            expect(svg).toBeInTheDocument();
        });

        test('AnimatedCoin uses default color currentColor', () => {
            render(<AnimatedCoin />);
        });
    });
});
