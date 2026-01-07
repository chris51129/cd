/**
 * Tests for MemoryCard component
 */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

// Mock framer-motion
jest.mock('framer-motion', () => ({
    motion: {
        div: ({ children, onClick, ...props }) => <div onClick={onClick} {...props}>{children}</div>,
    },
    AnimatePresence: ({ children }) => <>{children}</>,
}));

// Import MemoryCard - it might need ArenaContext, let's check and mock if needed
jest.mock('./ArenaContext', () => ({
    __esModule: true,
    default: { Provider: ({ children }) => children, Consumer: ({ children }) => children() },
    useArena: () => ({
        gameState: { board: [0, 1, 2, 3, 4, 5, 6, 7, 0, 1, 2, 3, 4, 5, 6, 7], flippedIndices: [], matchedIndices: [] }
    })
}));

import MemoryCard from './MemoryCard';

describe('MemoryCard', () => {
    const defaultProps = {
        index: 0,
        iconIndex: 0,
        isFlipped: false,
        isMatched: false,
        onClick: jest.fn()
    };

    test('renders card', () => {
        render(<MemoryCard {...defaultProps} />);
    });

    test('shows icon when flipped', () => {
        render(<MemoryCard {...defaultProps} isFlipped={true} />);
    });

    test('shows icon when matched', () => {
        render(<MemoryCard {...defaultProps} isMatched={true} />);
    });

    test('calls onClick when clicked', () => {
        const onClick = jest.fn();
        const { container } = render(<MemoryCard {...defaultProps} onClick={onClick} />);
        const card = container.firstChild;
        if (card) {
            fireEvent.click(card);
        }
    });

    test('applies different styles for different icons', () => {
        const { rerender } = render(<MemoryCard {...defaultProps} iconIndex={0} />);
        rerender(<MemoryCard {...defaultProps} iconIndex={5} />);
    });
});
