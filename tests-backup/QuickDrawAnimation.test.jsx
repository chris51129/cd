/**
 * Tests for QuickDrawAnimation component
 */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

// Mock framer-motion
jest.mock('framer-motion', () => ({
    motion: {
        div: ({ children, className, onClick, style, ...props }) => <div className={className} onClick={onClick} style={style}>{children}</div>,
        button: ({ children, className, onClick, disabled, style, ...props }) => <button className={className} onClick={onClick} disabled={disabled} style={style}>{children}</button>,
        span: ({ children, ...props }) => <span>{children}</span>,
    },
    AnimatePresence: ({ children }) => <>{children}</>,
}));

// Mock CountdownOverlay
jest.mock('../CountdownOverlay', () => ({ isActive, countdownValue, title, subtitle }) =>
    isActive ? <div data-testid="countdown">{title} - {countdownValue}</div> : null
);

import QuickDrawAnimation from './QuickDrawAnimation';

describe('QuickDrawAnimation', () => {
    const defaultProps = {
        status: 'spin',
        result: null,
        gameState: {
            quickDrawState: 'waiting',
            countdownLeft: 3,
            hasPenalty: false
        },
        onAction: jest.fn()
    };

    test('renders without crashing', () => {
        const { container } = render(<QuickDrawAnimation {...defaultProps} />);
        expect(container.firstChild).toBeInTheDocument();
    });

    test('renders countdown during countdown state', () => {
        render(
            <QuickDrawAnimation
                {...defaultProps}
                gameState={{ ...defaultProps.gameState, quickDrawState: 'countdown', countdownLeft: 3 }}
            />
        );
        expect(screen.getByTestId('countdown')).toBeInTheDocument();
    });

    test('renders ESPERA text during waiting state', () => {
        render(<QuickDrawAnimation {...defaultProps} />);
        expect(screen.getByText('ESPERA...')).toBeInTheDocument();
    });

    test('renders ¡AHORA! during signal state', () => {
        render(
            <QuickDrawAnimation
                {...defaultProps}
                gameState={{ ...defaultProps.gameState, quickDrawState: 'signal' }}
            />
        );
        expect(screen.getByText('¡AHORA!')).toBeInTheDocument();
    });

    test('shows penalty message when hasPenalty is true', () => {
        render(
            <QuickDrawAnimation
                {...defaultProps}
                gameState={{ ...defaultProps.gameState, hasPenalty: true }}
            />
        );
        expect(screen.getByText('⚠️ Penalización activa')).toBeInTheDocument();
    });

    test('calls onAction when button is clicked', () => {
        const onAction = jest.fn();
        render(<QuickDrawAnimation {...defaultProps} onAction={onAction} />);

        const button = screen.getByRole('button');
        fireEvent.click(button);
        expect(onAction).toHaveBeenCalled();
    });
});
