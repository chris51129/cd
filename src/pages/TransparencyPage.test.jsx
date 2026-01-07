/**
 * Tests for TransparencyPage component
 */
import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

// Mock framer-motion
jest.mock('framer-motion', () => ({
    motion: {
        div: ({ children, ...props }) => <div {...props}>{children}</div>,
        h1: ({ children, ...props }) => <h1 {...props}>{children}</h1>,
        section: ({ children, ...props }) => <section {...props}>{children}</section>,
        header: ({ children, ...props }) => <header {...props}>{children}</header>,
        footer: ({ children, ...props }) => <footer {...props}>{children}</footer>,
    },
    AnimatePresence: ({ children }) => <>{children}</>,
}));

// Mock Icons component
jest.mock('../components/ui/Icons', () => ({
    Icons: {
        ShieldCheck: () => <span>ShieldCheck</span>,
        CPU: () => <span>CPU</span>,
        Probability: () => <span>Probability</span>,
        Coins: () => <span>Coins</span>,
        Activity: () => <span>Activity</span>,
        Shield: () => <span>Shield</span>,
        Zap: () => <span>Zap</span>,
    }
}));

import TransparencyPage from './TransparencyPage';

describe('TransparencyPage', () => {
    const renderPage = () => {
        return render(
            <MemoryRouter>
                <TransparencyPage />
            </MemoryRouter>
        );
    };

    test('renders without crashing', () => {
        const { container } = renderPage();
        expect(container).toBeInTheDocument();
    });

    test('renders transparency title', () => {
        const { container } = renderPage();
        expect(container.querySelector('.transparency-container')).toBeInTheDocument();
    });

    test('renders info cards', () => {
        const { container } = renderPage();
        const infoCards = container.querySelectorAll('.info-card');
        expect(infoCards.length).toBeGreaterThan(0);
    });

    test('renders transparency hero section', () => {
        const { container } = renderPage();
        expect(container.querySelector('.transparency-hero')).toBeInTheDocument();
    });

    test('renders transparency grid', () => {
        const { container } = renderPage();
        expect(container.querySelector('.transparency-grid')).toBeInTheDocument();
    });
});
