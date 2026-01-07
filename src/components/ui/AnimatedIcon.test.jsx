/**
 * Tests for AnimatedIcon component
 * Verified against actual component API
 */
import React from 'react';
import { render } from '@testing-library/react';

// Mock framer-motion
jest.mock('framer-motion', () => ({
    motion: {
        div: ({ children, className, style, ...props }) => (
            <div className={className} style={style} {...props}>{children}</div>
        ),
    },
}));

import AnimatedIcon from './AnimatedIcon';

// Mock icon component
const MockIcon = ({ size, color, strokeWidth }) => (
    <svg width={size} height={size} data-testid="mock-icon" style={{ color }}>
        <circle cx="12" cy="12" r="10" strokeWidth={strokeWidth} />
    </svg>
);

describe('AnimatedIcon', () => {
    test('renders without crashing', () => {
        const { container } = render(<AnimatedIcon icon={MockIcon} />);
        expect(container.firstChild).toBeInTheDocument();
    });

    test('renders the icon component', () => {
        const { getByTestId } = render(<AnimatedIcon icon={MockIcon} />);
        expect(getByTestId('mock-icon')).toBeInTheDocument();
    });

    test('accepts size prop', () => {
        const { container } = render(<AnimatedIcon icon={MockIcon} size={48} />);
        expect(container.firstChild).toBeInTheDocument();
    });

    test('accepts color prop', () => {
        const { container } = render(<AnimatedIcon icon={MockIcon} color="#ff0000" />);
        expect(container.firstChild).toBeInTheDocument();
    });

    test('accepts strokeWidth prop', () => {
        const { container } = render(<AnimatedIcon icon={MockIcon} strokeWidth={3} />);
        expect(container.firstChild).toBeInTheDocument();
    });

    test('applies pulse preset by default', () => {
        const { container } = render(<AnimatedIcon icon={MockIcon} />);
        expect(container.querySelector('.animated-icon-wrapper')).toBeInTheDocument();
    });

    test('accepts flame preset', () => {
        const { container } = render(<AnimatedIcon icon={MockIcon} preset="flame" />);
        expect(container.firstChild).toBeInTheDocument();
    });

    test('accepts spin preset', () => {
        const { container } = render(<AnimatedIcon icon={MockIcon} preset="spin" />);
        expect(container.firstChild).toBeInTheDocument();
    });

    test('accepts bounce preset', () => {
        const { container } = render(<AnimatedIcon icon={MockIcon} preset="bounce" />);
        expect(container.firstChild).toBeInTheDocument();
    });

    test('accepts draw preset', () => {
        const { container } = render(<AnimatedIcon icon={MockIcon} preset="draw" />);
        expect(container.firstChild).toBeInTheDocument();
    });

    test('applies className', () => {
        const { container } = render(<AnimatedIcon icon={MockIcon} className="custom" />);
        expect(container.querySelector('.custom')).toBeInTheDocument();
    });
});
