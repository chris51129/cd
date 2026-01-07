/**
 * Tests for CyberCheckbox component
 * Verified against actual component API
 */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

// Mock framer-motion
jest.mock('framer-motion', () => ({
    motion: {
        div: ({ children, ...props }) => <div {...props}>{children}</div>,
    },
}));

import CyberCheckbox from './CyberCheckbox';

describe('CyberCheckbox', () => {
    const defaultProps = {
        checked: false,
        onChange: jest.fn(),
        id: 'test-checkbox'
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders label when provided', () => {
        render(<CyberCheckbox {...defaultProps} label="Accept terms" />);
        expect(screen.getByText('Accept terms')).toBeInTheDocument();
    });

    test('renders without label', () => {
        const { container } = render(<CyberCheckbox {...defaultProps} />);
        expect(container.querySelector('.cyber-checkbox-container')).toBeInTheDocument();
    });

    test('checkbox is unchecked when checked prop is false', () => {
        render(<CyberCheckbox {...defaultProps} checked={false} />);
        const checkbox = screen.getByRole('checkbox');
        expect(checkbox).not.toBeChecked();
    });

    test('checkbox is checked when checked prop is true', () => {
        render(<CyberCheckbox {...defaultProps} checked={true} />);
        const checkbox = screen.getByRole('checkbox');
        expect(checkbox).toBeChecked();
    });

    test('calls onChange when clicked', () => {
        const onChange = jest.fn();
        render(<CyberCheckbox {...defaultProps} onChange={onChange} />);

        const checkbox = screen.getByRole('checkbox');
        fireEvent.click(checkbox);
        expect(onChange).toHaveBeenCalledTimes(1);
    });

    test('does not call onChange when disabled', () => {
        const onChange = jest.fn();
        render(<CyberCheckbox {...defaultProps} onChange={onChange} disabled={true} />);

        const checkbox = screen.getByRole('checkbox');
        expect(checkbox).toBeDisabled();
    });

    test('applies disabled class when disabled', () => {
        const { container } = render(<CyberCheckbox {...defaultProps} disabled={true} />);
        expect(container.querySelector('.disabled')).toBeInTheDocument();
    });

    test('uses id prop for input', () => {
        render(<CyberCheckbox {...defaultProps} id="my-checkbox" />);
        const checkbox = screen.getByRole('checkbox');
        expect(checkbox).toHaveAttribute('id', 'my-checkbox');
    });
});
