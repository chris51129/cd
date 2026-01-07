/**
 * Tests for NotFound page
 */
import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import NotFound from './NotFound';

const renderWithRouter = (component) => {
    return render(
        <BrowserRouter>
            {component}
        </BrowserRouter>
    );
};

describe('NotFound Page', () => {
    test('renders without crashing', () => {
        renderWithRouter(<NotFound />);
        expect(screen.getByText('404')).toBeInTheDocument();
    });

    test('displays 404 error code', () => {
        renderWithRouter(<NotFound />);
        expect(screen.getByText('404')).toBeInTheDocument();
    });

    test('displays not found message', () => {
        renderWithRouter(<NotFound />);
        expect(screen.getByText(/no encontrada/i)).toBeInTheDocument();
    });

    test('displays home button', () => {
        renderWithRouter(<NotFound />);
        expect(screen.getByText(/Volver al Inicio/i)).toBeInTheDocument();
    });
});
