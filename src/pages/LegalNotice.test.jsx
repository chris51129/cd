/**
 * Tests for LegalNotice page component
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

import LegalNotice from './LegalNotice';

describe('LegalNotice', () => {
    const renderPage = () => {
        return render(
            <MemoryRouter>
                <LegalNotice />
            </MemoryRouter>
        );
    };

    test('renders without crashing', () => {
        const { container } = renderPage();
        expect(container).toBeInTheDocument();
    });

    test('renders page title', () => {
        renderPage();
        expect(screen.getByText('Aviso Legal')).toBeInTheDocument();
    });

    test('renders section 1 - Naturaleza del Servicio', () => {
        renderPage();
        expect(screen.getByText('1. Naturaleza del Servicio')).toBeInTheDocument();
    });

    test('renders section 2 - Identificación', () => {
        renderPage();
        expect(screen.getByText('2. Identificación')).toBeInTheDocument();
    });

    test('renders section 3 - Exención de Responsabilidad', () => {
        renderPage();
        expect(screen.getByText('3. Exención de Responsabilidad')).toBeInTheDocument();
    });

    test('renders section 4 - Propiedad Intelectual', () => {
        renderPage();
        expect(screen.getByText('4. Propiedad Intelectual')).toBeInTheDocument();
    });

    test('renders section 5 - Ley Aplicable', () => {
        renderPage();
        expect(screen.getByText('5. Ley Aplicable y Jurisdicción')).toBeInTheDocument();
    });

    test('contains transparency-container class', () => {
        const { container } = renderPage();
        expect(container.querySelector('.transparency-container')).toBeInTheDocument();
    });
});
