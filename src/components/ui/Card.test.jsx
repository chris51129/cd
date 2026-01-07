/**
 * Tests for Card component
 * Verified against actual component API
 */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

// Mock framer-motion
jest.mock('framer-motion', () => ({
    motion: {
        div: ({ children, className, onClick, ...props }) => (
            <div className={className} onClick={onClick} {...props}>{children}</div>
        ),
    },
}));

import Card from './Card';

describe('Card', () => {
    test('renders children', () => {
        render(<Card>Card content</Card>);
        expect(screen.getByText('Card content')).toBeInTheDocument();
    });

    test('applies default variant class', () => {
        const { container } = render(<Card>Default</Card>);
        expect(container.firstChild).toHaveClass('card-default');
    });

    test('applies glass variant class', () => {
        const { container } = render(<Card variant="glass">Glass card</Card>);
        expect(container.firstChild).toHaveClass('card-glass');
    });

    test('applies elevated variant class', () => {
        const { container } = render(<Card variant="elevated">Elevated card</Card>);
        expect(container.firstChild).toHaveClass('card-elevated');
    });

    test('applies outline variant class', () => {
        const { container } = render(<Card variant="outline">Outline card</Card>);
        expect(container.firstChild).toHaveClass('card-outline');
    });

    test('applies custom className', () => {
        const { container } = render(<Card className="custom">Custom</Card>);
        expect(container.firstChild).toHaveClass('custom');
    });

    test('calls onClick when clicked', () => {
        const onClick = jest.fn();
        render(<Card onClick={onClick}>Clickable</Card>);

        fireEvent.click(screen.getByText('Clickable'));
        expect(onClick).toHaveBeenCalledTimes(1);
    });

    test('applies cursor-pointer class when interactive', () => {
        const { container } = render(<Card interactive>Interactive</Card>);
        expect(container.firstChild).toHaveClass('cursor-pointer');
    });

    test('applies cursor-pointer class when has onClick', () => {
        const { container } = render(<Card onClick={() => { }}>Clickable</Card>);
        expect(container.firstChild).toHaveClass('cursor-pointer');
    });

    test('has base card class', () => {
        const { container } = render(<Card>Card</Card>);
        expect(container.firstChild).toHaveClass('card');
    });
});
