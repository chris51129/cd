/**
 * Tests for Navbar component
 */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Navbar from './Navbar';

// Mock SafetyContext
jest.mock('../../context/SafetyContext', () => ({
    useSafety: () => ({
        handleSafeNavigation: (fn) => fn(),
        isGameActive: false
    })
}));

// Mock ThemeContext
jest.mock('../../context/ThemeContext', () => ({
    useTheme: () => ({
        theme: 'dark',
        toggleTheme: jest.fn(),
        isDark: true,
        isLight: false,
        isTransitioning: false
    }),
    ThemeProvider: ({ children }) => <>{children}</>
}));

// Mock framer-motion
jest.mock('framer-motion', () => ({
    motion: {
        button: ({ children, ...props }) => <button {...props}>{children}</button>,
        div: ({ children, ...props }) => <div {...props}>{children}</div>,
        span: ({ children, ...props }) => <span {...props}>{children}</span>,
    },
    AnimatePresence: ({ children }) => <>{children}</>,
}));

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
    Sun: () => <svg data-testid="sun-icon" />,
    Moon: () => <svg data-testid="moon-icon" />,
}));

describe('Navbar Component', () => {
    test('renders desktop elements', () => {
        render(
            <MemoryRouter>
                <Navbar />
            </MemoryRouter>
        );
        // Logo is an image now, find by alt text
        expect(screen.getByAltText(/CryptoDuels/i)).toBeInTheDocument();
        expect(screen.getByText('Módulos', { selector: '.nav-links .nav-link' })).toBeInTheDocument();
        expect(screen.getByText('Conectar Wallet', { selector: '.desktop-only' })).toBeInTheDocument();
    });

    test('toggles mobile menu on click', () => {
        const { container } = render(
            <MemoryRouter>
                <Navbar />
            </MemoryRouter>
        );

        const toggleBtn = container.querySelector('.mobile-toggle');
        const mobileMenu = container.querySelector('.mobile-menu');

        expect(mobileMenu).not.toHaveClass('open');

        // Open
        fireEvent.click(toggleBtn);
        expect(mobileMenu).toHaveClass('open');

        // Close
        fireEvent.click(toggleBtn);
        expect(mobileMenu).not.toHaveClass('open');
    });

    test('mobile menu links close the menu', () => {
        const { container } = render(
            <MemoryRouter>
                <Navbar />
            </MemoryRouter>
        );

        const toggleBtn = container.querySelector('.mobile-toggle');
        const mobileMenu = container.querySelector('.mobile-menu');

        // Open menu
        fireEvent.click(toggleBtn);
        expect(mobileMenu).toHaveClass('open');

        // Click Link
        const mobileGameLink = screen.getByText('Módulos', { selector: '.mobile-link' });
        fireEvent.click(mobileGameLink);

        expect(mobileMenu).not.toHaveClass('open');
    });

    test('all desktop links are present', () => {
        render(
            <MemoryRouter>
                <Navbar />
            </MemoryRouter>
        );
        expect(screen.getByText('Módulos', { selector: '.nav-links .nav-link' })).toBeInTheDocument();
        // Cover remaining lines
        expect(screen.getByText('Transparencia', { selector: '.nav-links .nav-link' })).toBeInTheDocument();
        expect(screen.getByText('Documentación', { selector: '.nav-links .nav-link' })).toBeInTheDocument();
    });

    test('mobile wallet button is present', () => {
        render(
            <MemoryRouter>
                <Navbar />
            </MemoryRouter>
        );
        // Ensure "Conectar Wallet" in mobile menu exists
        const buttons = screen.getAllByText('Conectar Wallet');
        expect(buttons.length).toBeGreaterThanOrEqual(2);
    });

    test('ALL mobile links close the menu', () => {
        const { container } = render(
            <MemoryRouter>
                <Navbar />
            </MemoryRouter>
        );

        const toggleBtn = container.querySelector('.mobile-toggle');
        const mobileMenu = container.querySelector('.mobile-menu');

        // Helper to click link and check close
        const clickAndCheck = (linkIndex) => {
            fireEvent.click(toggleBtn); // Open
            expect(mobileMenu).toHaveClass('open');
            const links = container.querySelectorAll('.mobile-link');
            fireEvent.click(links[linkIndex]); // Click Link
            expect(mobileMenu).not.toHaveClass('open');
        };

        // Check Logic for all 3 links
        // For Link components (0), fire click on the anchor
        fireEvent.click(toggleBtn);
        expect(mobileMenu).toHaveClass('open');
        fireEvent.click(container.querySelectorAll('.mobile-link')[0]);
        expect(mobileMenu).not.toHaveClass('open');

        // For a href links (1, 2)
        fireEvent.click(toggleBtn);
        fireEvent.click(container.querySelectorAll('.mobile-link')[1]);
        expect(mobileMenu).not.toHaveClass('open');

        fireEvent.click(toggleBtn);
        fireEvent.click(container.querySelectorAll('.mobile-link')[2]);
        expect(mobileMenu).not.toHaveClass('open');
    });
});
