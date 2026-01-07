/**
 * QuickDrawAnimation - Duelo de Reflejos
 * Foco visual absoluto. Maneja los estados visuales del juego de reacción.
 */
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import CountdownOverlay from '../CountdownOverlay';

const QuickDrawAnimation = ({ status, result, gameState, onAction }) => {
    // gameState from hook: { quickDrawState, countdownLeft, hasPenalty }
    const {
        quickDrawState = 'countdown',
        countdownLeft = 5,
        hasPenalty = false
    } = gameState || {};

    // Visual Styles based on state
    const getVisuals = () => {
        switch (quickDrawState) {
            case 'countdown':
                return {
                    bg: '#1e293b', // Slate oscuro durante countdown
                    text: 'PREPARANDO...',
                    sub: 'Concéntrate',
                    scale: 1,
                    duration: 0
                };
            case 'waiting':
                return {
                    bg: '#ef4444', // Red
                    text: 'ESPERA...',
                    sub: hasPenalty ? '⚠️ Penalización activa' : 'No hagas clic todavía',
                    scale: [1, 1.05, 1],
                    duration: 0.8 // Heartbeat
                };
            case 'signal':
                return {
                    bg: '#22c55e', // Green neon
                    text: '¡AHORA!',
                    sub: '¡Haz clic rápido!',
                    scale: [1, 1.2, 1],
                    duration: 0.2 // Explosive
                };
            case 'result':
                const win = result?.outcome === 'win';
                return {
                    bg: win ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                    text: win ? '¡VICTORIA!' : 'DERROTA',
                    sub: win
                        ? `Tiempo: ${result.reactionTime}ms`
                        : result?.timeout
                            ? '¡Tiempo agotado!'
                            : result?.hasPenalty
                                ? `Penalizado: ${result.reactionTime}ms`
                                : `Muy lento: ${result?.reactionTime}ms`,
                    scale: 1,
                    duration: 0
                };
            default:
                return {
                    bg: '#334155', // Slate
                    text: 'PREPARADO',
                    sub: 'Espera la señal verde',
                    scale: 1,
                    duration: 0
                };
        }
    };

    const visuals = getVisuals();
    const isClickable = quickDrawState === 'waiting' || quickDrawState === 'signal';
    const showCountdown = quickDrawState === 'countdown';

    return (
        <div className="quickdraw-container" style={{
            width: '100%',
            height: '400px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
        }}>
            {/* ========== COUNTDOWN PHASE ========== */}
            <CountdownOverlay
                isActive={showCountdown}
                countdownValue={countdownLeft}
                title="DUELO DE REFLEJOS"
                subtitle="Prepárate para reaccionar..."
                variant="default"
            />

            {/* ========== GAMEPLAY / RESULT PHASE ========== */}
            {!showCountdown && (
                <AnimatePresence mode='wait'>
                    <motion.button
                        key={quickDrawState}
                        className="trigger-button"
                        onClick={() => isClickable && onAction && onAction()}
                        disabled={!isClickable}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{
                            scale: visuals.scale,
                            opacity: 1,
                            backgroundColor: visuals.bg,
                            boxShadow: quickDrawState === 'signal' ? '0 0 50px #22c55e' : '0 0 20px rgba(0,0,0,0.5)'
                        }}
                        transition={{
                            duration: visuals.duration,
                            repeat: quickDrawState === 'waiting' ? Infinity : 0
                        }}
                        style={{
                            width: '300px',
                            height: '300px',
                            borderRadius: '50%',
                            border: 'none',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: isClickable ? 'pointer' : 'default',
                            color: '#fff',
                            outline: 'none',
                            WebkitTapHighlightColor: 'transparent'
                        }}
                    >
                        <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: 0, textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
                            {visuals.text}
                        </h2>
                        <p style={{ fontSize: '1rem', opacity: 0.9, marginTop: '0.5rem' }}>
                            {visuals.sub}
                        </p>
                    </motion.button>
                </AnimatePresence>
            )}
        </div>
    );
};
export default QuickDrawAnimation;
