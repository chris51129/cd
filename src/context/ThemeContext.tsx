/**
 * ThemeContext - Gestión global del tema con View Transitions API
 * 
 * Implementa el toggle de tema claro/oscuro con transiciones polygon
 * usando la View Transitions API de Chrome 111+ / Safari 18+
 * 
 * @see https://developer.chrome.com/docs/web-platform/view-transitions/
 */
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { Theme, ThemeContextValue, PropsWithChildren } from '../types';

// Extended context value with transition state
interface ExtendedThemeContextValue extends ThemeContextValue {
    readonly isDark: boolean;
    readonly isLight: boolean;
    readonly isTransitioning: boolean;
}

const ThemeContext = createContext<ExtendedThemeContextValue | undefined>(undefined);

// Constantes
const STORAGE_KEY = 'cryptoduels-theme';

/**
 * Obtiene el tema inicial basado en:
 * 1. Preferencia guardada en localStorage
 * 2. Preferencia del sistema (prefers-color-scheme)
 * 3. Dark mode por defecto
 */
const getInitialTheme = (): Theme => {
    // 1. Verificar localStorage
    if (typeof window !== 'undefined') {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored === 'light' || stored === 'dark') {
            return stored;
        }

        // 2. Verificar preferencia del sistema
        if (window.matchMedia?.('(prefers-color-scheme: light)').matches) {
            return 'light';
        }
    }

    // 3. Default: dark
    return 'dark';
};

/**
 * Aplica el tema al documento
 */
const applyTheme = (theme: Theme): void => {
    document.documentElement.setAttribute('data-theme', theme);
};

/**
 * ThemeProvider - Wrapper que provee el contexto del tema
 */
export const ThemeProvider: React.FC<PropsWithChildren> = ({ children }) => {
    const [theme, setThemeState] = useState<Theme>(getInitialTheme);
    const [isTransitioning, setIsTransitioning] = useState(false);

    // Aplicar tema al montar y cuando cambie
    useEffect(() => {
        applyTheme(theme);
        localStorage.setItem(STORAGE_KEY, theme);
    }, [theme]);

    // Escuchar cambios en la preferencia del sistema
    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: light)');

        const handleChange = (e: MediaQueryListEvent): void => {
            // Solo actualizar si no hay tema guardado
            const stored = localStorage.getItem(STORAGE_KEY);
            if (!stored) {
                setThemeState(e.matches ? 'light' : 'dark');
            }
        };

        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, []);

    /**
     * Set theme explicitly
     */
    const setTheme = useCallback((newTheme: Theme): void => {
        setThemeState(newTheme);
    }, []);

    /**
     * Toggle del tema con View Transitions API
     * Usa clip-path polygon para la animación diagonal
     */
    const toggleTheme = useCallback((): void => {
        if (isTransitioning) return;

        const newTheme: Theme = theme === 'dark' ? 'light' : 'dark';

        // Función que ejecuta el cambio real
        const switchTheme = (): void => {
            setThemeState(newTheme);
        };

        // Verificar soporte de View Transitions API
        if (!document.startViewTransition) {
            // Fallback: cambio sin animación
            switchTheme();
            return;
        }

        // Usar View Transitions API para animación polygon
        setIsTransitioning(true);

        const transition = document.startViewTransition(switchTheme);

        transition.finished.then(() => {
            setIsTransitioning(false);
        }).catch(() => {
            setIsTransitioning(false);
        });
    }, [theme, isTransitioning]);

    const value: ExtendedThemeContextValue = {
        theme,
        toggleTheme,
        setTheme,
        isDark: theme === 'dark',
        isLight: theme === 'light',
        isTransitioning
    };

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
};

/**
 * Hook para consumir el contexto del tema
 */
export const useTheme = (): ExtendedThemeContextValue => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme debe usarse dentro de un ThemeProvider');
    }
    return context;
};

export default ThemeContext;
