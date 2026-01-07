/**
 * Tests for ThemeContext
 */
import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { ThemeProvider, useTheme, THEMES } from './ThemeContext';

describe('ThemeContext', () => {
    // Mock localStorage
    const localStorageMock = (() => {
        let store = {};
        return {
            getItem: jest.fn(key => store[key] || null),
            setItem: jest.fn((key, value) => { store[key] = value; }),
            clear: jest.fn(() => { store = {}; }),
            removeItem: jest.fn(key => { delete store[key]; })
        };
    })();

    beforeEach(() => {
        Object.defineProperty(window, 'localStorage', { value: localStorageMock });
        localStorageMock.clear();
        document.documentElement.removeAttribute('data-theme');
    });

    describe('THEMES', () => {
        test('exports LIGHT theme', () => {
            expect(THEMES.LIGHT).toBe('light');
        });

        test('exports DARK theme', () => {
            expect(THEMES.DARK).toBe('dark');
        });
    });

    describe('ThemeProvider', () => {
        test('provides theme context', () => {
            const wrapper = ({ children }) => <ThemeProvider>{children}</ThemeProvider>;
            const { result } = renderHook(() => useTheme(), { wrapper });

            expect(result.current.theme).toBeDefined();
            expect(result.current.toggleTheme).toBeDefined();
        });

        test('defaults to dark theme', () => {
            const wrapper = ({ children }) => <ThemeProvider>{children}</ThemeProvider>;
            const { result } = renderHook(() => useTheme(), { wrapper });

            expect(result.current.isDark).toBe(true);
            expect(result.current.isLight).toBe(false);
        });

        test('toggleTheme switches theme', () => {
            const wrapper = ({ children }) => <ThemeProvider>{children}</ThemeProvider>;
            const { result } = renderHook(() => useTheme(), { wrapper });

            expect(result.current.isDark).toBe(true);

            act(() => {
                result.current.toggleTheme();
            });

            expect(result.current.isLight).toBe(true);
        });

        test('persists theme to localStorage', () => {
            const wrapper = ({ children }) => <ThemeProvider>{children}</ThemeProvider>;
            renderHook(() => useTheme(), { wrapper });

            expect(localStorageMock.setItem).toHaveBeenCalledWith('cryptoduels-theme', 'dark');
        });

        test('applies theme to document', () => {
            const wrapper = ({ children }) => <ThemeProvider>{children}</ThemeProvider>;
            renderHook(() => useTheme(), { wrapper });

            expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
        });
    });

    describe('useTheme', () => {
        test('throws error when used outside provider', () => {
            expect(() => {
                renderHook(() => useTheme());
            }).toThrow('useTheme debe usarse dentro de un ThemeProvider');
        });

        test('returns isTransitioning state', () => {
            const wrapper = ({ children }) => <ThemeProvider>{children}</ThemeProvider>;
            const { result } = renderHook(() => useTheme(), { wrapper });

            expect(result.current.isTransitioning).toBe(false);
        });
    });
});
