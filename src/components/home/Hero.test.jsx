/**
 * Tests for Hero component - Testing behavior, not implementation
 */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

// Mock framer-motion
jest.mock('framer-motion', () => ({
    motion: {
        div: ({ children, className, style, ...props }) => <div className={className} style={style}>{children}</div>,
        h1: ({ children, className, ...props }) => <h1 className={className}>{children}</h1>,
        p: ({ children, className, style, ...props }) => <p className={className} style={style}>{children}</p>,
    },
    useScroll: () => ({ scrollY: { get: () => 0 } }),
    useTransform: () => 0,
}));

// Mock requestAnimationFrame
let rafCallback = null;
Object.defineProperty(window, 'requestAnimationFrame', {
    value: (cb) => { rafCallback = cb; return 1; },
    writable: true
});

Object.defineProperty(window, 'scrollTo', {
    value: jest.fn(),
    writable: true
});

import Hero from './Hero';

describe('Hero', () => {
    beforeEach(() => {
        rafCallback = null;
        window.scrollTo.mockClear();
    });

    test('renders without crashing', () => {
        const { container } = render(<Hero />);
        expect(container).toBeInTheDocument();
    });

    test('renders hero section', () => {
        const { container } = render(<Hero />);
        expect(container.querySelector('.hero-section')).toBeInTheDocument();
    });

    test('renders badge text', () => {
        render(<Hero />);
        expect(screen.getByText('PROTOCOLOS DE COMPETICIÓN P2P')).toBeInTheDocument();
    });

    test('renders main title', () => {
        render(<Hero />);
        expect(screen.getByText(/Confía en el Código/)).toBeInTheDocument();
    });

    test('renders subtitle', () => {
        render(<Hero />);
        expect(screen.getByText(/arena descentralizada/)).toBeInTheDocument();
    });

    test('renders arena button', () => {
        render(<Hero />);
        expect(screen.getByText('Entrar a la Arena')).toBeInTheDocument();
    });

    test('renders contracts button', () => {
        render(<Hero />);
        expect(screen.getByText('Ver Contratos')).toBeInTheDocument();
    });

    test('renders scroll indicator', () => {
        render(<Hero />);
        expect(screen.getByText('DESLIZA')).toBeInTheDocument();
    });

    test('has hero-content class', () => {
        const { container } = render(<Hero />);
        expect(container.querySelector('.hero-content')).toBeInTheDocument();
    });
});
