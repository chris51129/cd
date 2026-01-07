/**
 * Tests for CyberButton component
 * Verified against actual component API
 */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

// Mock framer-motion
jest.mock('framer-motion', () => ({
    motion: {
        button: ({ children, onClick, disabled, className, type, ...props }) => (
            <button onClick={onClick} disabled={disabled} className={className} type={type} {...props}>{children}</button>
        ),
    },
}));

import CyberButton from './CyberButton';

describe('CyberButton', () => {
    test('renders children', () => {
        render(<CyberButton>Cyber Button</CyberButton>);
        expect(screen.getByText('Cyber Button')).toBeInTheDocument();
    });

    test('calls onClick when clicked', () => {
        const onClick = jest.fn();
        render(<CyberButton onClick={onClick}>Click</CyberButton>);

        fireEvent.click(screen.getByRole('button'));
        expect(onClick).toHaveBeenCalledTimes(1);
    });

    test('does not call onClick when disabled', () => {
        const onClick = jest.fn();
        render(<CyberButton onClick={onClick} disabled>Click</CyberButton>);

        const button = screen.getByRole('button');
        expect(button).toBeDisabled();
    });

    test('applies primary variant class', () => {
        render(<CyberButton variant="primary">Primary</CyberButton>);
        const button = screen.getByRole('button');
        expect(button).toHaveClass('cyber-button--primary');
    });

    test('applies secondary variant class', () => {
        render(<CyberButton variant="secondary">Secondary</CyberButton>);
        const button = screen.getByRole('button');
        expect(button).toHaveClass('cyber-button--secondary');
    });

    test('applies danger variant class', () => {
        render(<CyberButton variant="danger">Danger</CyberButton>);
        const button = screen.getByRole('button');
        expect(button).toHaveClass('cyber-button--danger');
    });

    test('applies md size class by default', () => {
        render(<CyberButton>Default Size</CyberButton>);
        const button = screen.getByRole('button');
        expect(button).toHaveClass('cyber-button--md');
    });

    test('applies sm size class', () => {
        render(<CyberButton size="sm">Small</CyberButton>);
        const button = screen.getByRole('button');
        expect(button).toHaveClass('cyber-button--sm');
    });

    test('applies lg size class', () => {
        render(<CyberButton size="lg">Large</CyberButton>);
        const button = screen.getByRole('button');
        expect(button).toHaveClass('cyber-button--lg');
    });

    test('applies custom className', () => {
        render(<CyberButton className="custom">Custom</CyberButton>);
        const button = screen.getByRole('button');
        expect(button).toHaveClass('custom');
    });

    test('has base cyber-button class', () => {
        render(<CyberButton>Base</CyberButton>);
        const button = screen.getByRole('button');
        expect(button).toHaveClass('cyber-button');
    });

    test('uses button type by default', () => {
        render(<CyberButton>Default Type</CyberButton>);
        const button = screen.getByRole('button');
        expect(button).toHaveAttribute('type', 'button');
    });

    test('accepts custom type', () => {
        render(<CyberButton type="submit">Submit</CyberButton>);
        const button = screen.getByRole('button');
        expect(button).toHaveAttribute('type', 'submit');
    });

    test('renders P2P_PROT_V1 tag', () => {
        render(<CyberButton>Button</CyberButton>);
        expect(screen.getByText('P2P_PROT_V1')).toBeInTheDocument();
    });
});
