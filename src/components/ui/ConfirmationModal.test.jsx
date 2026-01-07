/**
 * Tests for ConfirmationModal component
 * Verified against actual component API
 */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

// Mock framer-motion
jest.mock('framer-motion', () => ({
    motion: {
        div: ({ children, onClick, className, ...props }) => (
            <div onClick={onClick} className={className} {...props}>{children}</div>
        ),
    },
    AnimatePresence: ({ children }) => <>{children}</>,
}));

// Mock createPortal to render content directly
jest.mock('react-dom', () => ({
    ...jest.requireActual('react-dom'),
    createPortal: (node) => node,
}));

import ConfirmationModal from './ConfirmationModal';

describe('ConfirmationModal', () => {
    const defaultProps = {
        isOpen: true,
        title: 'Confirm Action',
        message: 'Are you sure you want to proceed?',
        onConfirm: jest.fn(),
        onCancel: jest.fn()
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders when isOpen is true', () => {
        render(<ConfirmationModal {...defaultProps} />);
        expect(screen.getByText('Confirm Action')).toBeInTheDocument();
    });

    test('does not render when isOpen is false', () => {
        render(<ConfirmationModal {...defaultProps} isOpen={false} />);
        expect(screen.queryByText('Confirm Action')).not.toBeInTheDocument();
    });

    test('renders title', () => {
        render(<ConfirmationModal {...defaultProps} />);
        expect(screen.getByText('Confirm Action')).toBeInTheDocument();
    });

    test('renders message', () => {
        render(<ConfirmationModal {...defaultProps} />);
        expect(screen.getByText('Are you sure you want to proceed?')).toBeInTheDocument();
    });

    test('renders default confirm button text', () => {
        render(<ConfirmationModal {...defaultProps} />);
        expect(screen.getByText('Confirmar')).toBeInTheDocument();
    });

    test('renders default cancel button text', () => {
        render(<ConfirmationModal {...defaultProps} />);
        expect(screen.getByText('Cancelar')).toBeInTheDocument();
    });

    test('renders custom confirm button text', () => {
        render(<ConfirmationModal {...defaultProps} confirmText="Delete" />);
        expect(screen.getByText('Delete')).toBeInTheDocument();
    });

    test('renders custom cancel button text', () => {
        render(<ConfirmationModal {...defaultProps} cancelText="Go Back" />);
        expect(screen.getByText('Go Back')).toBeInTheDocument();
    });

    test('calls onConfirm when confirm button clicked', () => {
        const onConfirm = jest.fn();
        render(<ConfirmationModal {...defaultProps} onConfirm={onConfirm} />);

        fireEvent.click(screen.getByText('Confirmar'));
        expect(onConfirm).toHaveBeenCalledTimes(1);
    });

    test('calls onCancel when cancel button clicked', () => {
        const onCancel = jest.fn();
        render(<ConfirmationModal {...defaultProps} onCancel={onCancel} />);

        fireEvent.click(screen.getByText('Cancelar'));
        expect(onCancel).toHaveBeenCalledTimes(1);
    });
});
