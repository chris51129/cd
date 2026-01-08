/**
 * Test utilities for CryptoDuels
 * Provides common wrappers and mocks for testing components
 */
import React from 'react';
import { render, RenderOptions, RenderResult } from '@testing-library/react';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';

/**
 * Props for mock providers
 */
interface ProviderProps {
    readonly children: React.ReactNode;
}

/**
 * Mock SafetyContext for testing
 * Provides a no-op implementation
 */
export const MockSafetyProvider: React.FC<ProviderProps> = ({ children }) => {
    return <>{children}</>;
};

/**
 * Mock SoundContext for testing
 */
export const MockSoundProvider: React.FC<ProviderProps> = ({ children }) => {
    return <>{children}</>;
};

/**
 * Router options type
 */
interface RouterOptions extends Omit<RenderOptions, 'wrapper'> {
    readonly route?: string;
}

/**
 * Render component with Router wrapper
 * @param ui - Component to render
 * @param options - Router options
 * @returns Testing library render result
 */
export const renderWithRouter = (ui: React.ReactElement, { route = '/', ...options }: RouterOptions = {}): RenderResult => {
    return render(
        <MemoryRouter initialEntries={[route]}>
            {ui}
        </MemoryRouter>,
        options
    );
};

/**
 * Render component with real BrowserRouter
 * Use when testing components that require actual browser history API
 * @param ui - Component to render
 * @param options - Render options
 * @returns Testing library render result
 */
export const renderWithBrowserRouter = (ui: React.ReactElement, options: Omit<RenderOptions, 'wrapper'> = {}): RenderResult => {
    return render(
        <BrowserRouter>
            {ui}
        </BrowserRouter>,
        options
    );
};

/**
 * Render component with all common providers
 * @param ui - Component to render
 * @param options - Options
 * @returns Testing library render result
 */
export const renderWithProviders = (ui: React.ReactElement, { route = '/', ...options }: RouterOptions = {}): RenderResult => {
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
