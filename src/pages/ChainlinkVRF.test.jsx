/**
 * Tests for ChainlinkVRF page component
 * Verified against actual component API
 */
import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

// Mock framer-motion completely
jest.mock('framer-motion', () => ({
    motion: {
        div: ({ children, className, style, ...props }) => <div className={className} style={style}>{children}</div>,
        header: ({ children, className, style, ...props }) => <header className={className} style={style}>{children}</header>,
        section: ({ children, className, ...props }) => <section className={className}>{children}</section>,
    },
    AnimatePresence: ({ children }) => <>{children}</>,
}));

// Mock Icons component
jest.mock('../components/ui/Icons', () => ({
    Icons: {
        ShieldCheck: ({ className, size }) => <span className={className} data-testid="shieldcheck-icon">ShieldCheck</span>,
        Activity: ({ className, size }) => <span className={className} data-testid="activity-icon">Activity</span>,
        CPU: ({ className, size }) => <span className={className} data-testid="cpu-icon">CPU</span>,
        Zap: ({ className, size }) => <span className={className} data-testid="zap-icon">Zap</span>,
    }
}));

import ChainlinkVRF from './ChainlinkVRF';

describe('ChainlinkVRF', () => {
    const renderPage = () => {
        return render(
            <MemoryRouter>
                <ChainlinkVRF />
            </MemoryRouter>
        );
    };

    test('renders without crashing', () => {
        const { container } = renderPage();
        expect(container).toBeInTheDocument();
    });

    test('renders page title', () => {
        renderPage();
        expect(screen.getByText('Chainlink VRF')).toBeInTheDocument();
    });

    test('renders VRF explanation section', () => {
        renderPage();
        expect(screen.getByText(/¿Qué es Chainlink VRF\?/)).toBeInTheDocument();
    });

    test('renders verification cycle section', () => {
        renderPage();
        expect(screen.getByText('El Ciclo de Verificación')).toBeInTheDocument();
    });

    test('renders step 1', () => {
        renderPage();
        expect(screen.getByText('Solicitud P2P')).toBeInTheDocument();
    });

    test('renders step 2', () => {
        renderPage();
        expect(screen.getByText('Oráculo Chainlink')).toBeInTheDocument();
    });

    test('renders step 3', () => {
        renderPage();
        expect(screen.getByText('Validación On-Chain')).toBeInTheDocument();
    });

    test('renders tech specs', () => {
        renderPage();
        expect(screen.getByText('Network')).toBeInTheDocument();
        expect(screen.getByText('Polygon POS Mainnet')).toBeInTheDocument();
    });

    test('contains transparency-container class', () => {
        const { container } = renderPage();
        expect(container.querySelector('.transparency-container')).toBeInTheDocument();
    });
});
