/**
 * Tests for VictoryCelebration component
 */
import React from 'react';
import { render, screen } from '@testing-library/react';

// Mock framer-motion
jest.mock('framer-motion', () => ({
    motion: {
        div: ({ children, ...props }) => <div {...props}>{children}</div>,
        span: ({ children, ...props }) => <span {...props}>{children}</span>,
    },
    AnimatePresence: ({ children }) => <>{children}</>,
}));

// Mock ArenaContext if needed
jest.mock('./ArenaContext', () => ({
    __esModule: true,
    default: { Provider: ({ children }) => children },
    useArena: () => ({
        isWin: true,
        tier: { amount: 100 }
    })
}));

import VictoryCelebration from './VictoryCelebration';

describe('VictoryCelebration', () => {
    test('renders celebration when visible', () => {
        render(<VictoryCelebration isVisible={true} amount={100} />);
    });

    test('renders nothing when not visible', () => {
        const { container } = render(<VictoryCelebration isVisible={false} amount={100} />);
    });

    test('displays winning amount', () => {
        render(<VictoryCelebration isVisible={true} amount={500} />);
    });

    test('handles zero amount', () => {
        render(<VictoryCelebration isVisible={true} amount={0} />);
    });

    test('handles large amount', () => {
        render(<VictoryCelebration isVisible={true} amount={10000} />);
    });
});
