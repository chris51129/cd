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
        return '#ffffff'; // Blanco inicial (más de 20s)
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
                                    Â¡MEMORIZA! {memorizeTimeLeft.toFixed(1)}s
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
            <div className="text-center" style={{ padding: '2rem' }}>
                <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <div
                        className="text-6xl mb-4"
                        style={{
                            color: playerWins ? '#4ade80' : '#f87171',
                            textShadow: '0 0 20px rgba(0,0,0,0.5)',
                        }}
                    >
                        {playerWins ? 'ðŸŽ‰' : 'ðŸ˜”'}
                    </div>
                    <h2
                        className="text-4xl font-bold mb-4"
                        style={{ color: playerWins ? '#4ade80' : '#f87171' }}
                    >
                        {playerWins ? 'Â¡VICTORIA!' : 'DERROTA'}
                    </h2>
                    <div className="text-xl text-secondary mb-8">
                        <span style={{ color: '#4ade80' }}>Tú: {result.player}</span>
                        {' vs '}
                        <span style={{ color: '#f87171' }}>Oponente: {result.opponent}</span>
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