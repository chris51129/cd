/**
 * MemoryAnimation - Componente de tablero para el juego Memoria Cripto
 * Orquesta el grid de 16 cartas y el sistema de puntuació³n
 */
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import MemoryCard from '../MemoryCard';
import {
    AnimatedActivity,
    AnimatedFingerprint,
    AnimatedShieldCheck,
    AnimatedCPU,
    AnimatedZap,
    AnimatedCoin,
    AnimatedDice,
    AnimatedBrain
} from '../../ui/AnimatedLucideIcons';

// Iconos premium animados (8 pares = 16 cartas)
const CRYPTO_ICONS = [
    AnimatedActivity,
    AnimatedFingerprint,
    AnimatedShieldCheck,
    AnimatedCPU,
    AnimatedZap,
    AnimatedCoin,
    AnimatedDice,
    AnimatedBrain
];

/**
 * Memory game state
 */
interface MemoryGameState {
    readonly board?: readonly number[];
    readonly flippedIndices?: readonly number[];
    readonly matchedIndices?: readonly number[];
    readonly memoryScores?: { player: number; opponent: number };
    readonly timeLeft?: number;
    readonly memoryPhase?: 'memorize' | 'playing' | 'result';
    readonly memorizePhaseNumber?: number;
    readonly memorizeTimeLeft?: number;
    readonly revealedIndices?: readonly number[];
}

/**
 * Memory result
 */
interface MemoryResult {
    readonly outcome: 'win' | 'loss' | 'draw';
    readonly player?: number;
    readonly opponent?: number;
}

/**
 * Props for MemoryAnimation component
 */
interface MemoryAnimationProps {
    readonly status: string;
    readonly result?: MemoryResult | null;
    readonly gameState?: MemoryGameState | null;
    readonly onCardClick?: (index: number) => void;
}

const MemoryAnimation: React.FC<MemoryAnimationProps> = ({ status, result = null, gameState = null, onCardClick = () => { } }) => {
    const {
        board = [],
        flippedIndices = [],
        matchedIndices = [],
        memoryScores = { player: 0, opponent: 0 },
        timeLeft = 30,
        memoryPhase = 'memorize',
        memorizePhaseNumber = 1,
        memorizeTimeLeft = 2.5,
        revealedIndices = []
    } = gameState || {};

    // Usar memoryScores directamente como scores para compatibilidad
    const scores = memoryScores;

    // Determinar si estamos en fase de memorización
    const isMemorizing = memoryPhase === 'memorize';

    // Determinar el estado de cada carta (ANTI-CHEAT: solo mostrar las reveladas)
    const getCardState = (index: number): 'flipped' | 'hidden' | 'matched' => {
        if (isMemorizing) {
            // Solo mostrar las cartas que están en revealedIndices
            return revealedIndices.includes(index) ? 'flipped' : 'hidden';
        }
        if (matchedIndices.includes(index)) return 'matched';
        if (flippedIndices.includes(index)) return 'flipped';
        return 'hidden';
    };

    // Color del timer según tiempo restante
    const getTimerColor = (): string => {
        if (timeLeft <= 10) return '#ef4444'; // Rojo crítico (10s o menos)
        if (timeLeft <= 20) return '#facc15'; // Amarillo advertencia (20s o menos)
        return 'var(--text-primary)'; // Theme-aware inicial (más de 20s)
    };

    // Renderizar el tablero durante el juego
    if (status === 'spin' || status === 'round_result') {
        return (
            <div className="memory-game-container" style={{
                width: '100%',
                maxWidth: '500px',
                margin: '0 auto',
                paddingTop: '1rem',
            }}>
                {/* Badge de Memorizació³n - ARRIBA del scoreboard */}
                <AnimatePresence>
                    {isMemorizing && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="memory-memorize-badge"
                            style={{
                                textAlign: 'center',
                                marginBottom: '1rem',
                                padding: '0.75rem 1.5rem',
                                background: 'var(--bg-surface)',
                                borderRadius: '12px',
                                border: '2px solid var(--accent-blue)',
                                boxShadow: '0 0 20px rgba(46, 92, 255, 0.2)',
                            }}
                        >
                            <motion.div
                                animate={{ scale: [1, 1.02, 1] }}
                                transition={{ duration: 1, repeat: Infinity }}
                            >
                                <div style={{
                                    fontSize: '0.7rem',
                                    color: 'var(--text-secondary)',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.1em',
                                    marginBottom: '0.25rem'
                                }}>
                                    FASE {memorizePhaseNumber}/2
                                </div>
                                <div style={{
                                    fontSize: '1.25rem',
                                    fontWeight: 'bold',
                                    color: 'var(--accent-blue)'
                                }}>
                                    ¡MEMORIZA! {memorizeTimeLeft.toFixed(1)}s
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Scoreboard con Timer */}
                <div className="memory-scoreboard" style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '1.5rem',
                    padding: '1rem',
                    background: 'var(--bg-surface)',
                    borderRadius: '12px',
                    border: '1px solid rgba(71, 85, 105, 0.3)',
                }}>
                    {/* Score Jugador */}
                    <div style={{ flex: 1, textAlign: 'center' }}>
                        <div style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', marginBottom: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Tú</div>
                        <motion.div
                            style={{ fontSize: '2rem', fontWeight: 'bold', color: '#4ade80' }}
                            animate={{ scale: scores.player > 0 ? [1, 1.2, 1] : 1 }}
                        >
                            {scores.player}
                        </motion.div>
                    </div>

                    {/* Timer Central - CENTRADO */}
                    <div style={{ flex: 1, textAlign: 'center' }}>
                        <div style={{ color: 'var(--text-secondary)', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.25rem' }}>
                            Tiempo
                        </div>
                        <motion.div
                            style={{
                                fontSize: '2rem',
                                fontWeight: 'bold',
                                color: getTimerColor(),
                                fontVariantNumeric: 'tabular-nums',
                            }}
                            animate={timeLeft <= 10 ? { scale: [1, 1.1, 1] } : {}}
                            transition={timeLeft <= 10 ? { duration: 0.5, repeat: Infinity } : {}}
                        >
                            {timeLeft}s
                        </motion.div>
                    </div>

                    {/* Score Oponente */}
                    <div style={{ flex: 1, textAlign: 'center' }}>
                        <div style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', marginBottom: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Oponente</div>
                        <motion.div
                            style={{ fontSize: '2rem', fontWeight: 'bold', color: '#f87171' }}
                            animate={{ scale: scores.opponent > 0 ? [1, 1.2, 1] : 1 }}
                        >
                            {scores.opponent}
                        </motion.div>
                    </div>
                </div>

                {/* Grid de cartas 4x4 - SIN overlay encima */}
                <div
                    className="memory-grid"
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(4, 1fr)',
                        gap: '0.75rem',
                        padding: '0.5rem',
                    }}
                >
                    {board.map((iconIndex, index) => (
                        <MemoryCard
                            key={index}
                            icon={CRYPTO_ICONS[iconIndex]}
                            state={getCardState(index)}
                            onClick={onCardClick}
                            index={index}
                        />
                    ))}
                </div>
            </div>
        );
    }

    // Pantalla de resultado final
    if (status === 'result' && result) {
        const playerWins = (result.player ?? 0) > (result.opponent ?? 0);
        return (
            <div className="flex flex-col items-center justify-center p-8 w-full" style={{ minHeight: '400px' }}>
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                    style={{
                        background: 'var(--bg-surface)',
                        border: '1px solid var(--text-muted)',
                        borderRadius: 'var(--radius-lg)',
                        padding: '3rem',
                        boxShadow: playerWins
                            ? '0 0 40px rgba(34, 197, 94, 0.2)'
                            : '0 0 40px rgba(239, 68, 68, 0.2)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '1.5rem',
                        maxWidth: '400px',
                        width: '100%'
                    }}
                >
                    {/* Icon / Status */}
                    <div style={{
                        fontSize: '4rem',
                        marginBottom: '0.5rem',
                        filter: playerWins ? 'drop-shadow(0 0 10px rgba(34, 197, 94, 0.5))' : 'drop-shadow(0 0 10px rgba(239, 68, 68, 0.5))'
                    }}>
                        {playerWins ? '🏆' : '💀'}
                    </div>

                    <h2 style={{
                        fontSize: 'var(--text-2xl)',
                        fontWeight: 'bold',
                        color: playerWins ? '#22c55e' : '#ef4444',
                        margin: 0,
                        fontFamily: 'var(--font-heading)',
                        letterSpacing: '-0.02em'
                    }}>
                        {playerWins ? '¡VICTORIA!' : 'DERROTA'}
                    </h2>

                    {/* Score Breakdown */}
                    <div style={{
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.75rem',
                        marginTop: '1rem'
                    }}>
                        {/* Player Score */}
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            padding: '1rem 1.25rem',
                            background: 'var(--bg-surface-hover)',
                            borderRadius: 'var(--radius-md)',
                            border: '1px solid var(--text-muted)'
                        }}>
                            <span style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-sans)', fontWeight: 500 }}>
                                Tu Puntuación
                            </span>
                            <span style={{
                                color: playerWins ? '#22c55e' : 'var(--text-primary)',
                                fontWeight: '700',
                                fontFamily: 'var(--font-heading)',
                                fontSize: '1.25rem'
                            }}>
                                {result.player}
                            </span>
                        </div>

                        {/* Opponent Score */}
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            padding: '1rem 1.25rem',
                            background: 'var(--bg-surface-hover)',
                            borderRadius: 'var(--radius-md)',
                            border: '1px solid var(--text-muted)'
                        }}>
                            <span style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-sans)', fontWeight: 500 }}>
                                Oponente
                            </span>
                            <span style={{
                                color: !playerWins ? '#ef4444' : 'var(--text-primary)',
                                fontWeight: '700',
                                fontFamily: 'var(--font-heading)',
                                fontSize: '1.25rem'
                            }}>
                                {result.opponent}
                            </span>
                        </div>
                    </div>
                </motion.div>
            </div>
        );
    }

    // Estado por defecto (esperando inicio)
    return (
        <div className="text-center text-secondary">
            <p>Preparando tablero...</p>
        </div>
    );
};

export default MemoryAnimation;