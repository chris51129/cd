/**
 * Tests for ErrorBoundary
 */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ErrorBoundary from './ErrorBoundary';
import * as navigation from '../../utils/navigation';

// Mock navigation utils
jest.mock('../../utils/navigation', () => ({
    reloadPage: jest.fn(),
    navigateTo: jest.fn()
}));

// Component that throws error
const Bomb = ({ shouldThrow }) => {
    if (shouldThrow) {
        throw new Error('Boom!');
    }
    return <div>Safe</div>;
};

describe('ErrorBoundary', () => {
    // Mock console.error to avoid noise
    const originalError = console.error;
    beforeAll(() => {
        console.error = jest.fn();
    });
    afterAll(() => {
        console.error = originalError;
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders children when no error', () => {
        render(
            <ErrorBoundary>
                <Bomb shouldThrow={false} />
            </ErrorBoundary>
        );
        expect(screen.getByText('Safe')).toBeInTheDocument();
    });

    test('renders fallback UI when error occurs', () => {
        render(
            <ErrorBoundary>
                <Bomb shouldThrow={true} />
            </ErrorBoundary>
        );

        expect(screen.getByText('Algo salió mal')).toBeInTheDocument();
        expect(screen.getByText('Reintentar')).toBeInTheDocument();
        expect(screen.getByText('Ir al Inicio')).toBeInTheDocument();
    });

    test('handleReload reloads page', () => {
        render(
            <ErrorBoundary>
                <Bomb shouldThrow={true} />
            </ErrorBoundary>
        );

        fireEvent.click(screen.getByText('Reintentar'));
        expect(navigation.reloadPage).toHaveBeenCalled();
    });

    test('handleGoHome redirects to home', () => {
        render(
            <ErrorBoundary>
                <Bomb shouldThrow={true} />
            </ErrorBoundary>
        );

        fireEvent.click(screen.getByText('Ir al Inicio'));
        expect(navigation.navigateTo).toHaveBeenCalledWith('/');
    });

    test('shows details in development', () => {
        // Enforce DEVEOPMENT env
        const originalEnv = process.env.NODE_ENV;
        process.env.NODE_ENV = 'development';

        render(
            <ErrorBoundary>
                <Bomb shouldThrow={true} />
            </ErrorBoundary>
        );

        expect(screen.getByText(/Detalles del error/)).toBeInTheDocument();
        expect(screen.getByText(/Boom!/)).toBeInTheDocument();

        // Restore env
        process.env.NODE_ENV = originalEnv;
    });
});
