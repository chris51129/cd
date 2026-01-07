/**
 * GameCard - Card for displaying game options on home page
 * 
 * Von Restorff Effect: Lo diferente se recuerda mejor.
 * Los badges NEW/HOT destacan juegos para mejorar memorabilidad.
 */
import React, { useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

// Mapa de preloaders para animaciones de cada juego
// Esto permite precargar la animación cuando el usuario hace hover
const animationPreloaders = {
    coinflip: () => import('../game/animations/CoinFlipAnimation'),
    dice: () => import('../game/animations/DiceAnimation'),
    rps: () => import('../game/animations/RPSAnimation'),
    memory: () => import('../game/animations/MemoryAnimation'),
    quickdraw: () => import('../game/animations/QuickDrawAnimation'),
    blockvalidation: () => import('../game/animations/BlockValidationAnimation'),
};

// Configuración de badges según tipo
const BADGE_CONFIG = {
    NEW: { label: 'NUEVO', className: 'badge-new', icon: '✨' },
    HOT: { label: 'HOT', className: 'badge-hot', icon: '🔥' },
};

const GameCard = ({ title, desc, type, Icon, delay, link, badge }) => {
    const cardRef = useRef(null);

    // Extraer el tipo de juego del link (ej: /game/coinflip -> coinflip)
    const getGameTypeFromLink = (linkPath) => {
        if (!linkPath) return null;
        const match = linkPath.match(/\/game\/(\w+)/);
        return match ? match[1] : null;
    };

    // Handler para el efecto de iluminación de cursor
    const handleMouseMove = useCallback((e) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        cardRef.current.style.setProperty('--mouse-x', `${x}px`);
        cardRef.current.style.setProperty('--mouse-y', `${y}px`);
    }, []);

    // OPTIMIZACIÓN: Precargar la animación del juego en hover
    const handleMouseEnter = useCallback(() => {
        const gameType = getGameTypeFromLink(link);
        if (gameType && animationPreloaders[gameType]) {
            // Preload en background - no bloqueamos el render
            animationPreloaders[gameType]();
        }
    }, [link]);

    // Obtener configuración del badge si existe
    const badgeInfo = badge ? BADGE_CONFIG[badge] : null;

    return (
        <Link to={link || "#"} style={{ display: 'block' }}>
            <motion.div
                ref={cardRef}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className={`game-card-wrapper glass-panel ${badge ? 'has-badge' : ''}`}
                onMouseMove={handleMouseMove}
                onMouseEnter={handleMouseEnter}
            >
                <div className="game-card-inner">
                    {/* Badge Von Restorff */}
                    {badgeInfo && (
                        <div className={`game-badge ${badgeInfo.className}`}>
                            <span className="badge-icon">{badgeInfo.icon}</span>
                            <span className="badge-label">{badgeInfo.label}</span>
                        </div>
                    )}

                    <div className="game-status">
                        <div className="status-dot"></div>
                    </div>

                    <div className="game-icon-container">
                        <div className="game-icon">
                            <Icon />
                        </div>
                    </div>

                    <div className="game-type">{type}</div>
                    <h3 className="game-title">{title}</h3>
                    <p className="game-desc">{desc}</p>
                </div>
            </motion.div>
        </Link>
    );
};

export default GameCard;
