/**
 * Tests for Leaderboard component
 */
import React from 'react';
import { render, screen } from '@testing-library/react';

// Mock framer-motion
jest.mock('framer-motion', () => ({
    motion: {
        div: ({ children, className, style, ...props }) => <div className={className} style={style}>{children}</div>,
    },
}));

// Mock useLeaderboard
jest.mock('../../hooks/useLeaderboard', () => ({
    useLeaderboard: () => ({
        players: [],
        sortBy: 'winnings',
        order: 'desc',
        setSortBy: jest.fn(),
        toggleOrder: jest.fn()
    })
}));

// Mock Icons
jest.mock('../ui/Icons', () => ({
    Icons: {
        ShieldCheck: ({ size, strokeWidth, className }) => <span className={className}>ShieldCheck</span>,
        Fingerprint: ({ size, strokeWidth, className }) => <span className={className}>Fingerprint</span>,
    }
}));

import Leaderboard from './Leaderboard';

describe('Leaderboard', () => {
    test('renders without crashing', () => {
        const { container } = render(<Leaderboard />);
        expect(container).toBeInTheDocument();
    });

    test('renders ranking title', () => {
        render(<Leaderboard />);
        expect(screen.getByText('RANKING DE COMPETICIÓN')).toBeInTheDocument();
    });

    test('renders subtitle', () => {
        render(<Leaderboard />);
        expect(screen.getByText('Ecosistema de Validación Activa')).toBeInTheDocument();
    });

    test('renders protocol syncing status', () => {
        render(<Leaderboard />);
        expect(screen.getByText('PROTOCOL SYNCING...')).toBeInTheDocument();
    });

    test('renders sync info message', () => {
        render(<Leaderboard />);
        expect(screen.getByText(/Sincronizando datos on-chain/)).toBeInTheDocument();
    });

    test('renders footer text', () => {
        render(<Leaderboard />);
        expect(screen.getByText(/BLOCKCHAIN INDEXING ARCHITECTURE/)).toBeInTheDocument();
    });

    test('renders ShieldCheck icon', () => {
        render(<Leaderboard />);
        expect(screen.getByText('ShieldCheck')).toBeInTheDocument();
    });

    test('has leaderboard-section class', () => {
        const { container } = render(<Leaderboard />);
        expect(container.querySelector('.leaderboard-section')).toBeInTheDocument();
    });
});
