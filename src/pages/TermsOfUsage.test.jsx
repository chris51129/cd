/**
 * Tests for TermsOfUsage page component
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

import TermsOfUsage from './TermsOfUsage';

describe('TermsOfUsage', () => {
    const renderPage = () => {
        return render(
            <MemoryRouter>
                <TermsOfUsage />
            </MemoryRouter>
        );
    };

    test('renders without crashing', () => {
        const { container } = renderPage();
        expect(container).toBeInTheDocument();
    });

    test('renders page title', () => {
        renderPage();
        expect(screen.getByText('Términos de Uso')).toBeInTheDocument();
    });

    test('renders section 1 - Aceptación de Términos', () => {
        renderPage();
        expect(screen.getByText('1. Aceptación de Términos')).toBeInTheDocument();
    });

    test('renders section 2 - Naturaleza de la Competición', () => {
        renderPage();
        expect(screen.getByText('2. Naturaleza de la Competición')).toBeInTheDocument();
    });

    test('renders section 3 - Compromiso de Entrada', () => {
        renderPage();
        expect(screen.getByText('3. Compromiso de Entrada y Distribución')).toBeInTheDocument();
    });

    test('renders section 4 - Restricción de Edad', () => {
        renderPage();
        expect(screen.getByText('4. Restricción de Edad y Jurisdicción')).toBeInTheDocument();
    });

    test('renders section 5 - Inexistencia de Asesoramiento', () => {
        renderPage();
        expect(screen.getByText('5. Inexistencia de Asesoramiento')).toBeInTheDocument();
    });

    test('contains transparency-container class', () => {
        const { container } = renderPage();
        expect(container.querySelector('.transparency-container')).toBeInTheDocument();
    });

    test('mentions P2P Protocol Terms', () => {
        renderPage();
        expect(screen.getByText('P2P Protocol Terms')).toBeInTheDocument();
    });
});
