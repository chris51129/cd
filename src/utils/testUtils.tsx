/**
 * Test utilities for CryptoDuels
 * Provides common wrappers and mocks for testing components
 */
import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';

/**
 * Mock SafetyContext for testing
 * Provides a no-op implementation
 */
export const MockSafetyProvider = ({ children }) => {
    return <>{children}</>;
};

/**
 * Mock SoundContext for testing
 */
export const MockSoundProvider = ({ children }) => {
    return <>{children}</>;
};

/**
 * Render component with Router wrapper
 * @param {React.ReactElement} ui - Component to render
 * @param {Object} options - Router options
 * @returns {Object} Testing library render result
 */
export const renderWithRouter = (ui, { route = '/', ...options } = {}) => {
    return render(
        <MemoryRouter initialEntries={[route]}>
            {ui}
        </MemoryRouter>,
        options
    );
};

/**
 * Render component with all common providers
 * @param {React.ReactElement} ui - Component to render
 * @param {Object} options - Options
 * @returns {Object} Testing library render result
 */
export const renderWithProviders = (ui, { route = '/', ...options } = {}) => {
    return render(
        <MemoryRouter initialEntries={[route]}>
            <MockSafetyProvider>
                <MockSoundProvider>
                    {ui}
                </MockSoundProvider>
            </MockSafetyProvider>
        </MemoryRouter>,
        options
    );
};

// Re-export everything from testing-library
export * from '@testing-library/react';
