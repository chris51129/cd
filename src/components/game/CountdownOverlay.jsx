/**
 * CountdownOverlay - Overlay de Cuenta Regresiva Modular
 * 
 * Componente reutilizable para mostrar countdowns pre-juego.
 * Diseño premium con animaciones fluidas.
 * 
 * Usado en:
 * - Quick Draw (5s antes de empezar)
 * - Block Validation (5s antes de empezar)
 * - Memory (5s de memorización)
 */
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PropTypes from 'prop-types';
import './CountdownOverlay.css';

const CountdownOverlay = ({
    isActive,
    countdownValue,
    title = 'PREPARADO',
    subtitle = 'El juego comenzará en...',
    variant = 'default',
    onComplete
}) => {
    // Variantes de estilo
    const variants = {
        default: {
            bgColor: 'rgba(15, 23, 42, 0.95)',
            accentColor: '#3b82f6',
            textColor: '#ffffff'
        },
        memorize: {
            bgColor: 'rgba(15, 23, 42, 0.85)',
            accentColor: '#8b5cf6',
            textColor: '#ffffff'
        },
        danger: {
            bgColor: 'rgba(15, 23, 42, 0.95)',
            accentColor: '#ef4444',
            textColor: '#ffffff'
        }
    };

    const style = variants[variant] || variants.default;

    // Animaciones para el número
    const numberVariants = {
        initial: { scale: 0.5, opacity: 0 },
        animate: {
            scale: [1, 1.2, 1],
            opacity: 1,
            transition: {
                scale: {
                    duration: 0.5,
                    repeat: Infinity,
                    repeatDelay: 0.5
                }
            }
        },
        exit: { scale: 1.5, opacity: 0, transition: { duration: 0.3 } }
    };

    // Si countdown llegó a 0, mostrar "¡GO!" brevemente
    const displayValue = countdownValue <= 0 ? '¡GO!' : countdownValue;
    const isGo = countdownValue <= 0;

    return (
        <AnimatePresence>
            {isActive && (
                <motion.div
                    className="countdown-overlay"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    style={{
                        position: 'absolute',
                        inset: 0,
                        zIndex: 50,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: style.bgColor,
                        backdropFilter: 'blur(8px)',
                        borderRadius: '16px'
                    }}
                >
                    {/* Título */}
                    <motion.div
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        style={{
                            fontSize: '1.5rem',
                            fontWeight: 'bold',
                            color: style.accentColor,
                            textTransform: 'uppercase',
                            letterSpacing: '0.2em',
                            marginBottom: '0.5rem',
                            textShadow: `0 0 20px ${style.accentColor}40`
                        }}
                    >
                        {title}
                    </motion.div>

                    {/* Subtítulo */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.7 }}
                        transition={{ delay: 0.2 }}
                        style={{
                            fontSize: '0.875rem',
                            color: style.textColor,
                            marginBottom: '2rem'
                        }}
                    >
                        {subtitle}
                    </motion.div>

                    {/* Número del Countdown */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={countdownValue}
                            variants={numberVariants}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                            style={{
                                fontSize: isGo ? '4rem' : '6rem',
                                fontWeight: '900',
                                color: isGo ? '#22c55e' : style.textColor,
                                textShadow: isGo
                                    ? '0 0 40px rgba(34, 197, 94, 0.6)'
                                    : `0 0 30px ${style.accentColor}60`,
                                fontVariantNumeric: 'tabular-nums',
                                lineHeight: 1
                            }}
                        >
                            {displayValue}
                        </motion.div>
                    </AnimatePresence>

                    {/* Barra de progreso circular */}
                    {!isGo && (
                        <motion.div
                            style={{
                                marginTop: '2rem',
                                width: '120px',
                                height: '8px',
                                background: 'rgba(255, 255, 255, 0.1)',
                                borderRadius: '4px',
                                overflow: 'hidden'
                            }}
                        >
                            <motion.div
                                initial={{ width: '100%' }}
                                animate={{ width: '0%' }}
                                transition={{ duration: countdownValue, ease: 'linear' }}
                                style={{
                                    height: '100%',
                                    background: `linear-gradient(90deg, ${style.accentColor}, ${style.accentColor}80)`,
                                    borderRadius: '4px'
                                }}
                            />
                        </motion.div>
                    )}
                </motion.div>
            )}
        </AnimatePresence>
    );
};

CountdownOverlay.propTypes = {
    /** Si el overlay está activo/visible */
    isActive: PropTypes.bool.isRequired,
    /** Valor actual del countdown (segundos) */
    countdownValue: PropTypes.number.isRequired,
    /** Título principal del overlay */
    title: PropTypes.string,
    /** Subtítulo descriptivo */
    subtitle: PropTypes.string,
    /** Variante de estilo: 'default' | 'memorize' | 'danger' */
    variant: PropTypes.oneOf(['default', 'memorize', 'danger']),
    /** Callback cuando el countdown termina */
    onComplete: PropTypes.func
};

export default CountdownOverlay;
