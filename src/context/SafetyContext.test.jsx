/**
 * Tests for SafetyContext
 * Navigation safety and game state management
 */
import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import { SafetyProvider, useSafety } from './SafetyContext';

// Mock react-router-dom navigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
}));

// Test component that exposes the context
const TestConsumer = ({ onContextReady }) => {
    const context = useSafety();
    React.useEffect(() => {
        if (onContextReady) onContextReady(context);
    }, [context, onContextReady]);

    return (
        <div>
            <span data-testid="isRisky">{context.isRisky.toString()}</span>
            <button onClick={() => context.setIsRisky(true)}>Set Risky</button>
            <button onClick={() => context.setIsRisky(false)}>Set Safe</button>
            <button onClick={() => context.handleSafeNavigation(() => mockNavigate('/test'))}>
                Navigate
            </button>
        </div>
    );
};

describe('SafetyProvider', () => {
    beforeEach(() => {
        mockNavigate.mockClear();
    });

    test('provides default context values', () => {
        render(
            <MemoryRouter>
                <SafetyProvider>
                    <TestConsumer />
                </SafetyProvider>
            </MemoryRouter>
        );

        expect(screen.getByTestId('isRisky')).toHaveTextContent('false');
    });

    test('allows setting isRisky to true', () => {
        render(
            <MemoryRouter>
                <SafetyProvider>
                    <TestConsumer />
                </SafetyProvider>
            </MemoryRouter>
        );

        fireEvent.click(screen.getByText('Set Risky'));
        expect(screen.getByTestId('isRisky')).toHaveTextContent('true');
    });

    test('allows setting isRisky to false', () => {
        render(
            <MemoryRouter>
                <SafetyProvider>
                    <TestConsumer />
                </SafetyProvider>
            </MemoryRouter>
        );

        fireEvent.click(screen.getByText('Set Risky'));
        fireEvent.click(screen.getByText('Set Safe'));
        expect(screen.getByTestId('isRisky')).toHaveTextContent('false');
    });

    test('handleSafeNavigation executes callback when not risky', () => {
        render(
            <MemoryRouter>
                <SafetyProvider>
                    <TestConsumer />
                </SafetyProvider>
            </MemoryRouter>
        );

        fireEvent.click(screen.getByText('Navigate'));
        expect(mockNavigate).toHaveBeenCalledWith('/test');
    });

    test('handleSafeNavigation shows modal when risky', async () => {
        render(
            <MemoryRouter>
                <SafetyProvider>
                    <TestConsumer />
                </SafetyProvider>
            </MemoryRouter>
        );

        // Set risky state
        fireEvent.click(screen.getByText('Set Risky'));

        // Try to navigate
        fireEvent.click(screen.getByText('Navigate'));

        // Navigation should be blocked, modal might show
        // The mock navigate should NOT be called immediately
        expect(mockNavigate).not.toHaveBeenCalled();
    });
});

describe('useSafety hook', () => {
    test('throws error when used outside provider', () => {
        // Suppress console.error for this test
        const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => { });

        const BrokenComponent = () => {
            useSafety();
            return null;
        };

        expect(() => {
            render(<BrokenComponent />);
        }).toThrow('useSafety must be used within a SafetyProvider');

        consoleSpy.mockRestore();
    });
});
