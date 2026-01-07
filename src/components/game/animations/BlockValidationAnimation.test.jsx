/**
 * Tests for BlockValidationAnimation component
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

import BlockValidationAnimation from './BlockValidationAnimation';

describe('BlockValidationAnimation', () => {
    const defaultProps = {
        status: 'spin',
        result: null,
        gameState: {
            blockGrid: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25],
            blockNextTarget: 1,
            blockErrors: 0,
            blockState: 'playing',
            blockStartTime: Date.now(),
            blockTimeLeft: 30,
            countdownLeft: 3
        },
        onCellClick: jest.fn()
    };

    test('renders without crashing', () => {
        const { container } = render(<BlockValidationAnimation {...defaultProps} />);
        expect(container.firstChild).toBeInTheDocument();
    });

    test('renders countdown during countdown state', () => {
        render(
            <BlockValidationAnimation
                {...defaultProps}
                gameState={{ ...defaultProps.gameState, blockState: 'countdown' }}
            />
        );
        expect(screen.getByTestId('countdown')).toBeInTheDocument();
    });

    test('renders 25 cells during playing state', () => {
        render(<BlockValidationAnimation {...defaultProps} />);
        // Each number 1-25 should be present
        for (let i = 1; i <= 25; i++) {
            expect(screen.getByText(i.toString())).toBeInTheDocument();
        }
    });

    test('renders time left', () => {
        render(<BlockValidationAnimation {...defaultProps} />);
        expect(screen.getByText('30s')).toBeInTheDocument();
    });

    test('renders error count', () => {
        render(<BlockValidationAnimation {...defaultProps} />);
        expect(screen.getByText('Errores')).toBeInTheDocument();
    });

    test('calls onCellClick when cell is clicked', () => {
        const onCellClick = jest.fn();
        render(<BlockValidationAnimation {...defaultProps} onCellClick={onCellClick} />);

        const cell = screen.getByText('1');
        fireEvent.click(cell);
        expect(onCellClick).toHaveBeenCalledWith(1);
    });

    test('renders default state when status is not spin', () => {
        render(<BlockValidationAnimation {...defaultProps} status="idle" />);
        expect(screen.getByText('Preparando tablero...')).toBeInTheDocument();
    });
});
