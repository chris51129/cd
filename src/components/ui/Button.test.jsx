/**
 * Tests for Button component
 * Verified against actual component API
 */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

// Mock framer-motion - filter out motion-specific props
jest.mock('framer-motion', () => ({
    motion: {
        button: ({ children, onClick, disabled, className, type, style, whileHover, whileTap, initial, ...props }) => (
            <button onClick={onClick} disabled={disabled} className={className} type={type} style={style} {...props}>{children}</button>
        ),
    },
}));

import Button from './Button';

describe('Button', () => {
    test('renders children', () => {
        render(<Button>Click me</Button>);
        expect(screen.getByText('Click me')).toBeInTheDocument();
    });

    test('calls onClick when clicked', () => {
        const onClick = jest.fn();
        render(<Button onClick={onClick}>Click</Button>);

        fireEvent.click(screen.getByText('Click'));
        expect(onClick).toHaveBeenCalledTimes(1);
    });

    test('does not call onClick when disabled', () => {
        const onClick = jest.fn();
        render(<Button onClick={onClick} disabled>Click</Button>);

        const button = screen.getByRole('button');
        fireEvent.click(button);
        expect(onClick).not.toHaveBeenCalled();
    });

    test('does not call onClick when loading', () => {
        const onClick = jest.fn();
        render(<Button onClick={onClick} loading>Click</Button>);

        const button = screen.getByRole('button');
        fireEvent.click(button);
        expect(onClick).not.toHaveBeenCalled();
    });

    test('applies variant class', () => {
        render(<Button variant="primary">Primary</Button>);
        const button = screen.getByRole('button');
        expect(button).toHaveClass('btn-primary');
    });

    test('applies secondary variant class', () => {
        render(<Button variant="secondary">Secondary</Button>);
        const button = screen.getByRole('button');
        expect(button).toHaveClass('btn-secondary');
    });

    test('shows loading indicator when loading', () => {
        render(<Button loading>Loading</Button>);
        expect(screen.getByText('Cargando...')).toBeInTheDocument();
    });

    test('applies custom className', () => {
        render(<Button className="custom">Custom</Button>);
        const button = screen.getByRole('button');
        expect(button).toHaveClass('custom');
    });

    test('applies disabled attribute when disabled', () => {
        render(<Button disabled>Disabled</Button>);
        const button = screen.getByRole('button');
        expect(button).toBeDisabled();
    });

    test('uses button type by default', () => {
        render(<Button>Default Type</Button>);
        const button = screen.getByRole('button');
        expect(button).toHaveAttribute('type', 'button');
    });

    test('accepts custom type', () => {
        render(<Button type="submit">Submit</Button>);
        const button = screen.getByRole('button');
        expect(button).toHaveAttribute('type', 'submit');
    });
});
