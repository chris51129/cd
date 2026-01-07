/**
 * ThemeToggle - Botón de cambio de tema con iconos Sun/Moon
 * 
 * Implementa un toggle estético con animación de rotación
 * usando iconos de Lucide React.
 */
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import './ThemeToggle.css';

const ThemeToggle = () => {
    const { isDark, toggleTheme, isTransitioning } = useTheme();

    return (
        <motion.button
            className="theme-toggle"
            onClick={toggleTheme}
            disabled={isTransitioning}
            aria-label={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
            title={isDark ? 'Modo claro' : 'Modo oscuro'}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
        >
            <AnimatePresence mode="wait" initial={false}>
                {isDark ? (
                    <motion.div
                        key="sun"
                        initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
                        animate={{ rotate: 0, opacity: 1, scale: 1 }}
                        exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                        className="theme-icon"
                    >
                        <Sun size={20} strokeWidth={2} />
                    </motion.div>
                ) : (
                    <motion.div
                        key="moon"
                        initial={{ rotate: 90, opacity: 0, scale: 0.5 }}
                        animate={{ rotate: 0, opacity: 1, scale: 1 }}
                        exit={{ rotate: -90, opacity: 0, scale: 0.5 }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                        className="theme-icon"
                    >
                        <Moon size={20} strokeWidth={2} />
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.button>
    );
};

export default ThemeToggle;
