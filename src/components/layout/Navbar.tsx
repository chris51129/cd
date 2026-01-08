import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import logo from '../../assets/logo.png';
import { useSafety } from '../../context/SafetyContext';
import { secureLog } from '../../utils/security';
import GameDropdown from './GameDropdown';
import ThemeToggle from '../ui/ThemeToggle';

const Navbar: React.FC = () => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [isGamesDropdownOpen, setIsGamesDropdownOpen] = useState<boolean>(false);
    const navigate = useNavigate();
    const location = useLocation();

    // consume global safety context
    const { handleSafeNavigation } = useSafety();

    // BULLETPROOF: Programmatic smooth scroll to bypass CSS inconsistencies
    const smoothScrollToTop = (): void => {
        const startY = window.scrollY || document.documentElement.scrollTop;
        if (startY === 0) return; // Already at top

        const targetY = 0;
        const distance = targetY - startY;
        const duration = 1000;
        let start: number | null = null;

        const easeInOutCubic = (t: number): number => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;

        const step = (timestamp: number): void => {
            if (!start) start = timestamp;
            const progress = timestamp - start;
            const percentage = Math.min(progress / duration, 1);

            const nextY = startY + (distance * easeInOutCubic(percentage));
            window.scrollTo(0, nextY);

            if (progress < duration) {
                window.requestAnimationFrame(step);
            }
        };

        window.requestAnimationFrame(step);
    };

    // Specific Action Creators
    const goHome = (): void => {
        if (location.pathname === '/') {
            smoothScrollToTop();
        } else {
            navigate('/');
            setTimeout(smoothScrollToTop, 100);
        }
        setIsOpen(false);
    };

    const goExternal = (url: string): void => {
        secureLog.info('Navigation to', url);
        // For anchors, we must ensure we are on the Home page first
        if (url.startsWith('#')) {
            if (location.pathname !== '/') {
                navigate('/');
                // Delay hash scroll slightly to allow home render
                setTimeout(() => {
                    window.location.hash = url;
                    // Optional: scroll to it manually if hash isn't picked up
                    const element = document.querySelector(url);
                    if (element) element.scrollIntoView({ behavior: 'smooth' });
                }, 100);
            } else {
                window.location.hash = url;
            }
        } else {
            window.location.href = url;
        }
        setIsOpen(false);
    };

    return (
        <>
            {/* Skip to content link for keyboard/screen reader users */}
            <a href="#main-content" className="skip-to-content">
                Saltar al contenido principal
            </a>
            <nav className="navbar glass-panel">
                <div className="nav-brand">
                    {/* Logo uses generic safety handler */}
                    <div
                        className="brand-logo-link"
                        onClick={() => handleSafeNavigation(goHome)}
                        role="button"
                        tabIndex={0}
                        aria-label="Ir a inicio"
                        onKeyDown={(e) => e.key === 'Enter' && handleSafeNavigation(goHome)}
                        style={{ cursor: 'pointer' }}
                    >
                        <img src={logo} alt="CryptoDuels - Página de inicio" className="brand-logo" />
                    </div>
                </div>

                {/* Desktop Menu */}
                <div className="nav-links">
                    {/* "Juegos" -> Hover Dropdown */}
                    <div
                        className="nav-link-container"
                        onMouseEnter={() => setIsGamesDropdownOpen(true)}
                        onMouseLeave={() => setIsGamesDropdownOpen(false)}
                        style={{ position: 'relative' }}
                    >
                        <div
                            className={`nav-link ${isGamesDropdownOpen ? 'active' : ''}`}
                            role="button"
                            tabIndex={0}
                            aria-label="Ver módulos disponibles"
                            style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                        >
                            Módulos
                            <motion.span
                                animate={{ rotate: isGamesDropdownOpen ? 180 : 0 }}
                                transition={{ duration: 0.2 }}
                                style={{ fontSize: '0.6rem', opacity: 0.5 }}
                            >
                                ▼
                            </motion.span>
                        </div>
                        <GameDropdown
                            isOpen={isGamesDropdownOpen}
                            onClose={() => setIsGamesDropdownOpen(false)}
                        />
                    </div>

                    {/* "Transparencia" -> External/Placeholder */}
                    <div
                        className="nav-link"
                        onClick={() => handleSafeNavigation(() => {
                            navigate('/transparencia');
                            setIsOpen(false);
                        })}
                        style={{ cursor: 'pointer' }}
                    >
                        Transparencia
                    </div>

                    {/* "Documentación" -> External/Placeholder */}
                    <div
                        className="nav-link"
                        onClick={() => handleSafeNavigation(() => goExternal('#docs'))}
                        style={{ cursor: 'pointer' }}
                    >
                        Documentación
                    </div>
                </div>

                <div className="nav-actions">
                    <ThemeToggle />
                    <button className="btn-primary nav-btn">
                        Conectar Wallet
                    </button>

                    {/* Mobile Toggle */}
                    <button
                        className="mobile-toggle"
                        onClick={() => setIsOpen(!isOpen)}
                        aria-label={isOpen ? 'Cerrar menú' : 'Abrir menú'}
                        aria-expanded={isOpen}
                        aria-controls="mobile-menu"
                    >
                        <div className={`hamburger ${isOpen ? 'open' : ''}`}>
                            <span></span>
                            <span></span>
                        </div>
                    </button>
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            <div
                id="mobile-menu"
                className={`mobile-menu ${isOpen ? 'open' : ''}`}
                role="dialog"
                aria-label="Menú de navegación móvil"
            >
                <div className="mobile-links">
                    <div
                        className="mobile-link"
                        onClick={() => handleSafeNavigation(goHome)}
                        style={{ cursor: 'pointer' }}
                    >
                        Módulos
                    </div>

                    <div
                        className="mobile-link"
                        onClick={() => handleSafeNavigation(() => {
                            navigate('/transparencia');
                            setIsOpen(false);
                        })}
                        style={{ cursor: 'pointer' }}
                    >
                        Transparencia
                    </div>

                    <div
                        className="mobile-link"
                        onClick={() => handleSafeNavigation(() => goExternal('#docs'))}
                        style={{ cursor: 'pointer' }}
                    >
                        Documentación
                    </div>

                    <div className="mobile-actions-row">
                        <ThemeToggle />
                        <button className="btn-primary nav-btn mt-8">Conectar Wallet</button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Navbar;
