/**
 * QuickDrawAnimation - Duelo de Reflejos
 * Foco visual absoluto. Maneja los estados visuales del juego de reacción.
 */
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import CountdownOverlay from '../CountdownOverlay';

/**
 * QuickDraw state type
 */
type QuickDrawState = 'countdown' | 'waiting' | 'signal' | 'result';

/**
 * QuickDraw game state
 */
interface QuickDrawGameState {
    readonly quickDrawState?: QuickDrawState;
    readonly countdownLeft?: number;
    readonly hasPenalty?: boolean;
}

/**
 * QuickDraw result type
 */
interface QuickDrawResult {
    readonly outcome?: 'win' | 'loss' | 'draw';
    readonly reactionTime?: number;
    readonly opponent?: number;
    readonly timeout?: boolean;
    readonly hasPenalty?: boolean;
    readonly penaltyMs?: number;
}

/**
 * Visuals config type
 */
interface Visuals {
    bg: string;
    text: string;
    sub: string;
    scale: number | number[];
    duration: number;
    showResultPanel?: boolean;
}

/**
 * Props for QuickDrawAnimation component
 */
interface QuickDrawAnimationProps {
    readonly status: string;
    readonly result?: QuickDrawResult | null;
    readonly gameState?: QuickDrawGameState | null;
    readonly onAction?: () => void;
}

const QuickDrawAnimation: React.FC<QuickDrawAnimationProps> = ({ status, result, gameState, onAction }) => {
    // gameState from hook: { quickDrawState, countdownLeft, hasPenalty }
    const {
        quickDrawState = 'countdown',
        countdownLeft = 5,
        hasPenalty = false
    } = gameState || {};

    // Visual Styles based on state
    const getVisuals = (): Visuals => {
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
                    sub: '',
                    scale: 1,
                    duration: 0,
                    showResultPanel: true
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
    // Verificar que estamos en fase activa de juego usando el status del componente
    const isGameActive = status === 'spin' || status === 'result';

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
            {isGameActive && !showCountdown && (
                <AnimatePresence mode='wait'>
                    {/* Círculo de acción (waiting/signal) */}
                    {!visuals.showResultPanel && (
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
                    )}

                    {/* Panel de Resultado - Theme-Aware */}
                    {visuals.showResultPanel && result && (
                        <motion.div
                            key="result-panel"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.4 }}
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '1.5rem',
                                padding: '2rem',
                                background: 'var(--bg-surface)',
                                borderRadius: 'var(--radius-md)',
                                border: '1px solid var(--text-muted)',
                                boxShadow: result.outcome === 'win'
                                    ? '0 0 30px rgba(34, 197, 94, 0.3)'
                                    : '0 0 30px rgba(239, 68, 68, 0.3)',
                                minWidth: '320px'
                            }}
                        >
                            {/* Título Victoria/Derrota */}
                            <h2 style={{
                                fontSize: 'var(--text-2xl)',
                                fontWeight: 'bold',
                                color: result.outcome === 'win' ? '#22c55e' : '#ef4444',
                                margin: 0,
                                fontFamily: 'var(--font-heading)'
                            }}>
                                {result.outcome === 'win' ? '¡VICTORIA!' : 'DERROTA'}
                            </h2>

                            {/* Breakdown de tiempos */}
                            <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '0.75rem',
                                width: '100%'
                            }}>
                                {/* Tu tiempo */}
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    padding: '0.75rem 1rem',
                                    background: 'var(--bg-surface-hover)',
                                    borderRadius: 'var(--radius-sm)'
                                }}>
                                    <span style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-sans)' }}>Tu tiempo</span>
                                    <span style={{
                                        color: 'var(--text-primary)',
                                        fontWeight: '600',
                                        fontFamily: 'var(--font-heading)',
                                        fontVariantNumeric: 'tabular-nums'
                                    }}>
                                        {result.reactionTime}ms
                                    </span>
                                </div>

                                {/* Penalización (si aplica) */}
                                {result.hasPenalty && (
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        padding: '0.75rem 1rem',
                                        background: 'rgba(239, 68, 68, 0.1)',
                                        borderRadius: 'var(--radius-sm)',
                                        border: '1px solid rgba(239, 68, 68, 0.3)'
                                    }}>
                                        <span style={{ color: '#ef4444' }}>⚠️ Penalización</span>
                                        <span style={{ color: '#ef4444', fontWeight: '600' }}>
                                            +{result.penaltyMs || 1000}ms
                                        </span>
                                    </div>
                                )}

                                {/* Tiempo oponente */}
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    padding: '0.75rem 1rem',
                                    background: 'var(--bg-surface-hover)',
                                    borderRadius: 'var(--radius-sm)'
                                }}>
                                    <span style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-sans)' }}>Oponente</span>
                                    <span style={{
                                        color: 'var(--text-secondary)',
                                        fontWeight: '600',
                                        fontVariantNumeric: 'tabular-nums'
                                    }}>
                                        {result.opponent}ms
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            )}
        </div>
    );
};

export default QuickDrawAnimation;
