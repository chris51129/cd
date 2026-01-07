/**
 * Tests for Footer component - Testing behavior, not implementation
 */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

// Mock react-router-dom
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
    useLocation: () => ({ pathname: '/' }),
}));

// Mock SafetyContext
jest.mock('../../context/SafetyContext', () => ({
    useSafety: () => ({
        handleSafeNavigation: (callback) => callback()
    })
}));

// Mock window methods
Object.defineProperty(window, 'scrollTo', { value: jest.fn(), writable: true });
Object.defineProperty(window, 'requestAnimationFrame', { value: (cb) => 1, writable: true });

import Footer from './Footer';

describe('Footer', () => {
    beforeEach(() => {
        mockNavigate.mockClear();
    });

    const renderFooter = () => {
        return render(
            <MemoryRouter>
                <Footer />
            </MemoryRouter>
        );
    };

    test('renders without crashing', () => {
        const { container } = renderFooter();
        expect(container).toBeInTheDocument();
    });

    test('renders CryptoDuels brand', () => {
        renderFooter();
        expect(screen.getByText('CryptoDuels')).toBeInTheDocument();
    });

    test('renders tagline', () => {
        renderFooter();
        expect(screen.getByText('Duelos P2P descentralizados en Polygon')).toBeInTheDocument();
    });

    test('renders Plataforma section', () => {
        renderFooter();
        expect(screen.getByText('Plataforma')).toBeInTheDocument();
    });

    test('renders Legal section', () => {
        renderFooter();
        expect(screen.getByText('Legal')).toBeInTheDocument();
    });

    test('renders Transparencia section', () => {
        renderFooter();
        expect(screen.getByText('Transparencia')).toBeInTheDocument();
    });

    test('renders Comunidad section', () => {
        renderFooter();
        expect(screen.getByText('Comunidad')).toBeInTheDocument();
    });

    test('renders copyright', () => {
        renderFooter();
        const year = new Date().getFullYear();
        expect(screen.getByText(new RegExp(`© ${year} CryptoDuels`))).toBeInTheDocument();
    });

    test('renders disclaimer', () => {
        renderFooter();
        expect(screen.getByText(/Construido en Polygon/)).toBeInTheDocument();
    });

    test('renders social links with aria-labels', () => {
        renderFooter();
        expect(screen.getByLabelText('Twitter')).toBeInTheDocument();
        expect(screen.getByLabelText('Discord')).toBeInTheDocument();
        expect(screen.getByLabelText('Telegram')).toBeInTheDocument();
    });

    test('navigates to terminos on click', () => {
        renderFooter();
        const termsLink = screen.getByText('Términos de Uso');
        fireEvent.click(termsLink);
        expect(mockNavigate).toHaveBeenCalledWith('/terminos');
    });

    test('navigates to aviso-legal on click', () => {
        renderFooter();
        const legalLink = screen.getByText('Aviso Legal');
        fireEvent.click(legalLink);
        expect(mockNavigate).toHaveBeenCalledWith('/aviso-legal');
    });
});
