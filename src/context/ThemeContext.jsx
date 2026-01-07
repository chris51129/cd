/**
 * ThemeContext - Gestión global del tema con View Transitions API
 * 
 * Implementa el toggle de tema claro/oscuro con transiciones polygon
 * usando la View Transitions API de Chrome 111+ / Safari 18+
 * 
 * @see https://developer.chrome.com/docs/web-platform/view-transitions/
 */
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const ThemeContext = createContext(null);

// Constantes
const STORAGE_KEY = 'cryptoduels-theme';
const THEMES = { LIGHT: 'light', DARK: 'dark' };

/**
 * Obtiene el tema inicial basado en:
 * 1. Preferencia guardada en localStorage
 * 2. Preferencia del sistema (prefers-color-scheme)
 * 3. Dark mode por defecto
 */
const getInitialTheme = () => {
    // 1. Verificar localStorage
    if (typeof window !== 'undefined') {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored === THEMES.LIGHT || stored === THEMES.DARK) {
            return stored;
        }

        // 2. Verificar preferencia del sistema
        if (window.matchMedia?.('(prefers-color-scheme: light)').matches) {
            return THEMES.LIGHT;
        }
    }

    // 3. Default: dark
    return THEMES.DARK;
};

/**
 * Aplica el tema al documento
 */
const applyTheme = (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
};

/**
 * ThemeProvider - Wrapper que provee el contexto del tema
 */
export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(getInitialTheme);
    const [isTransitioning, setIsTransitioning] = useState(false);

    // Aplicar tema al montar y cuando cambie
    useEffect(() => {
        applyTheme(theme);
        localStorage.setItem(STORAGE_KEY, theme);
    }, [theme]);

    // Escuchar cambios en la preferencia del sistema
    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: light)');

        const handleChange = (e) => {
            // Solo actualizar si no hay tema guardado
            const stored = localStorage.getItem(STORAGE_KEY);
            if (!stored) {
                setTheme(e.matches ? THEMES.LIGHT : THEMES.DARK);
            }
        };

        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, []);

    /**
     * Toggle del tema con View Transitions API
     * Usa clip-path polygon para la animación diagonal
     */
    const toggleTheme = useCallback(() => {
        if (isTransitioning) return;

        const newTheme = theme === THEMES.DARK ? THEMES.LIGHT : THEMES.DARK;

        // Función que ejecuta el cambio real
        const switchTheme = () => {
            setTheme(newTheme);
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

    const value = {
        theme,
        toggleTheme,
        isDark: theme === THEMES.DARK,
        isLight: theme === THEMES.LIGHT,
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
export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme debe usarse dentro de un ThemeProvider');
    }
    return context;
};

export { THEMES };
export default ThemeContext;
