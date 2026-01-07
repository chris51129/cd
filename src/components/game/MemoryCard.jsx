/**
 * MemoryCard - Componente de carta individual para el juego Memoria Cripto
 * Implementa animación de flip 3D y estados visuales
 * 
 * OPTIMIZACIÓN: Memoizado con React.memo para evitar re-renders
 * de cartas que no han cambiado de estado
 */
import React, { memo } from 'react';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';

const MemoryCard = ({ icon, state, onClick, index }) => {
    // Estados: 'hidden', 'flipped', 'matched'
    const isFlipped = state === 'flipped' || state === 'matched';
    const isMatched = state === 'matched';

    // Clases CSS según el estado para permitir overrides de light mode
    const getStateClass = () => {
        if (isMatched) return 'matched';
        if (isFlipped) return 'flipped';
        return 'hidden';
    };

    // Colores según el estado - usando var() para soporte de temas
    const getCardStyle = () => {
        if (isMatched) {
            return {
                background: 'var(--memory-card-matched-bg, linear-gradient(135deg, rgba(74, 222, 128, 0.2), rgba(34, 197, 94, 0.1)))',
                border: '2px solid var(--memory-card-matched-border, rgba(74, 222, 128, 0.4))',
                boxShadow: '0 0 20px rgba(74, 222, 128, 0.3)',
            };
        }
        if (isFlipped) {
            return {
                background: 'var(--memory-card-flipped-bg, linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(37, 99, 235, 0.1)))',
                border: '2px solid var(--memory-card-flipped-border, rgba(59, 130, 246, 0.4))',
            };
        }
        return {
            background: 'var(--memory-card-hidden-bg, linear-gradient(135deg, rgba(30, 41, 59, 0.8), rgba(15, 23, 42, 0.9)))',
            border: '2px solid var(--memory-card-hidden-border, rgba(71, 85, 105, 0.3))',
        };
    };

    return (
        <motion.div
            className="memory-card"
            onClick={() => !isMatched && onClick(index)}
            style={{
                position: 'relative',
                width: '100%',
                paddingTop: '100%', // Aspect ratio 1:1
                cursor: isMatched ? 'default' : 'pointer',
                perspective: '1000px',
            }}
            whileHover={!isMatched ? { scale: 1.05 } : {}}
            whileTap={!isMatched ? { scale: 0.95 } : {}}
            role="button"
            tabIndex={isMatched ? -1 : 0}
            aria-label={isMatched ? `Carta ${index + 1} emparejada` : isFlipped ? `Carta ${index + 1} revelada` : `Carta ${index + 1} oculta, presiona para revelar`}
            aria-pressed={isFlipped}
            onKeyDown={(e) => {
                if ((e.key === 'Enter' || e.key === ' ') && !isMatched) {
                    e.preventDefault();
                    onClick(index);
                }
            }}
        >
            <motion.div
                className="card-inner"
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    transformStyle: 'preserve-3d',
                    transition: 'transform 0.6s',
                }}
                animate={{ rotateY: isFlipped ? 180 : 0 }}
            >
                {/* Cara trasera (oculta) */}
                <div
                    className="card-face card-back"
                    style={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        backfaceVisibility: 'hidden',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '12px',
                        ...getCardStyle(),
                    }}
                >
                    <div
                        style={{
                            fontSize: '2rem',
                            opacity: 0.3,
                            fontWeight: 'bold',
                            color: '#64748b',
                        }}
                    >
                        ?
                    </div>
                </div>

                {/* Cara frontal (icono) */}
                <div
                    className="card-face card-front"
                    style={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        backfaceVisibility: 'hidden',
                        transform: 'rotateY(180deg)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '12px',
                        ...getCardStyle(),
                    }}
                >
                    <div
                        style={{
                            fontSize: '2.5rem',
                            filter: isMatched ? 'brightness(1.2)' : 'none',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        {typeof icon === 'function' || typeof icon === 'object' ? (
                            React.createElement(icon, {
                                size: 40,
                                animateOnHover: false,
                                color: isMatched ? '#4ade80' : 'currentColor'
                            })
                        ) : (
                            icon
                        )}
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

// Comparador personalizado: solo re-renderizar si cambia el state o icon
const areEqual = (prevProps, nextProps) => {
    return (
        prevProps.state === nextProps.state &&
        prevProps.icon === nextProps.icon &&
        prevProps.index === nextProps.index
    );
};

const MemoizedMemoryCard = memo(MemoryCard, areEqual);
MemoizedMemoryCard.displayName = 'MemoryCard';

MemoizedMemoryCard.propTypes = {
    icon: PropTypes.oneOfType([PropTypes.string, PropTypes.elementType, PropTypes.object]).isRequired,
    state: PropTypes.oneOf(['hidden', 'flipped', 'matched']).isRequired,
    onClick: PropTypes.func.isRequired,
    index: PropTypes.number.isRequired,
};

export default MemoizedMemoryCard;
