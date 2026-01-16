/**
 * BlockValidationAnimation - Schulte Table 5x5
 * Juego de velocidad de procesamiento visual.
 * El jugador debe hacer clic en números del 1 al 25 en orden secuencial.
 * 
 * OPTIMIZATION (Protocolo Optimización):
 * - requestAnimationFrame con delta time en lugar de setInterval
 * - Estilos estáticos fuera del render
 */
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import type { CSSProperties } from 'react';

import CountdownOverlay from '../CountdownOverlay';
import './BlockValidation.css';

/**
 * BlockValidation game state
 */
interface BlockValidationGameState {
    readonly blockGrid?: readonly number[];
    readonly blockNextTarget?: number;
    readonly blockErrors?: number;
    readonly blockState?: 'countdown' | 'playing' | 'result';
    readonly blockStartTime?: number;
    readonly blockTimeLeft?: number;
    readonly countdownLeft?: number;
}

/**
 * BlockValidation result
 */
interface BlockValidationResult {
    readonly outcome: 'win' | 'loss' | 'draw';
    readonly playerTime?: number;
    readonly opponentTime?: number;
    readonly errors?: number;
    readonly timeout?: boolean;
}

/**
 * Props for BlockValidationAnimation component
 */
interface BlockValidationAnimationProps {
    readonly status: string;
    readonly result?: BlockValidationResult | null;
    readonly gameState?: BlockValidationGameState | null;
    readonly onCellClick?: (number: number) => void;
}

// ============================================
// Static Styles (no GC pressure)
// ============================================

const STYLES: Readonly<Record<string, CSSProperties>> = Object.freeze({
    countdownContainer: {
        width: '100%',
        maxWidth: '400px',
        margin: '1.5rem auto 0',
        minHeight: '400px',
        position: 'relative',
    },
    textCenter: { textAlign: 'center' },
    tabularNums: { fontVariantNumeric: 'tabular-nums' },
    resultPadding: { padding: '2rem' },
    resultPanel: {
        borderRadius: '12px',
        padding: '1rem',
        marginBottom: '1rem',
        fontFamily: 'monospace',
    },
    defaultContainer: {
        width: '100%',
        maxWidth: '400px',
        margin: '1.5rem auto 0',
        padding: '1rem',
        minHeight: '400px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
});

// Dynamic style creators (memoized outside component)
const createResultIconStyle = (isWin: boolean): CSSProperties => ({
    color: isWin ? '#22c55e' : '#ef4444',
    textShadow: '0 0 20px rgba(0,0,0,0.5)',
});

const createResultTotalStyle = (isWin: boolean): CSSProperties => ({
    color: isWin ? '#22c55e' : '#ef4444',
});

// Timer update interval
const TIMER_UPDATE_MS = 50;

const BlockValidationAnimation: React.FC<BlockValidationAnimationProps> = ({ status, result, gameState, onCellClick }) => {
    const {
        blockGrid = [],
        blockNextTarget = 1,
        blockErrors = 0,
        blockState = 'countdown',
        blockStartTime = 0,
        blockTimeLeft = 60,
        countdownLeft = 5
    } = gameState || {};

    // Timer en vivo (elapsed time) - usando requestAnimationFrame
    const [elapsedTime, setElapsedTime] = useState(0);
    const frameIdRef = useRef<number | null>(null);
    const lastUpdateRef = useRef(0);

    useEffect(() => {
        if (blockState !== 'playing' || blockStartTime <= 0) {
            setElapsedTime(0);
            return;
        }

        const animate = (time: number): void => {
            // Actualizar cada TIMER_UPDATE_MS para fluidez
            if (time - lastUpdateRef.current >= TIMER_UPDATE_MS) {
                setElapsedTime(Math.floor(performance.now() - blockStartTime));
                lastUpdateRef.current = time;
            }
            frameIdRef.current = requestAnimationFrame(animate);
        };

        lastUpdateRef.current = performance.now();
        frameIdRef.current = requestAnimationFrame(animate);

        return () => {
            if (frameIdRef.current !== null) {
                cancelAnimationFrame(frameIdRef.current);
                frameIdRef.current = null;
            }
        };
    }, [blockState, blockStartTime]);

    // Formatear tiempo (segundos)
    const formatSeconds = (s: number): string => `${s}s`;

    // Estado visual de cada celda
    const [clickedCells, setClickedCells] = useState<Record<number, string>>({});
    const [errorCell, setErrorCell] = useState<number | null>(null);

    const handleClick = (number: number, index: number): void => {
        if (blockState !== 'playing') return;

        if (number === blockNextTarget) {
            // Correcto: marcar como validado
            setClickedCells(prev => ({ ...prev, [index]: 'valid' }));
            onCellClick && onCellClick(number);
        } else {
            // Error: flash rojo temporal
            setErrorCell(index);
            setTimeout(() => setErrorCell(null), 300);
            onCellClick && onCellClick(number);
        }
    };

    // Mostrar countdown overlay
    const showCountdown = blockState === 'countdown';

    // ========== COUNTDOWN PHASE ==========
    if (status === 'spin' && showCountdown) {
        return (
            <div className="block-validation-container" style={STYLES.countdownContainer}>
                <CountdownOverlay
                    isActive={true}
                    countdownValue={countdownLeft}
                    title="VALIDACIÓN DE BLOQUES"
                    subtitle="Prepárate para ordenar del 1 al 25..."
                    variant="default"
                />
            </div>
        );
    }

    // ========== PLAYING PHASE ==========
    if (status === 'spin' && blockState === 'playing') {
        const isUrgent = blockTimeLeft <= 10;

        return (
            <div className="block-validation-container">
                {/* Header: Timer + Errores (Dark Tech Elegance) */}
                <div className="block-validation-header">
                    {/* Timer (Countdown) */}
                    <div style={STYLES.textCenter}>
                        <div className="block-stat-label">
                            Tiempo
                        </div>
                        <motion.div
                            animate={{ scale: isUrgent ? [1, 1.1, 1] : 1 }}
                            transition={{ duration: 0.5, repeat: isUrgent ? Infinity : 0 }}
                            className={`block-stat-value ${isUrgent ? 'urgent' : ''}`}
                        >
                            {formatSeconds(blockTimeLeft)}
                        </motion.div>
                    </div>

                    {/* Errores */}
                    <div style={STYLES.textCenter}>
                        <div className="block-stat-label">
                            Errores
                        </div>
                        <div className={`block-stat-value ${blockErrors > 0 ? 'error' : 'neutral'}`}>
                            {blockErrors}
                        </div>
                    </div>
                </div>

                {/* Grid 5x5 */}
                <div className="block-grid">
                    {blockGrid.map((number: number, index: number) => {
                        const isValidated = clickedCells[index] === 'valid';
                        const isError = errorCell === index;

                        return (
                            <button
                                key={index}
                                onClick={() => handleClick(number, index)}
                                disabled={isValidated}
                                className={`block-cell ${isValidated ? 'validated' : ''} ${isError ? 'error' : ''}`}
                            >
                                {number}
                            </button>
                        );
                    })}
                </div>
            </div>
        );
    }

    // Pantalla de resultado
    if (status === 'result' && result) {
        const isWin = result.outcome === 'win';
        const penalty = (result.errors || 0) * 500;
        const totalTime = (result.playerTime || 0) + penalty;

        // Formateador de precisión para el resultado final
        const formatResultTime = (ms: number): string => {
            const seconds = Math.floor(ms / 1000);
            const millis = Math.floor((ms % 1000) / 10);
            return `${seconds}.${millis.toString().padStart(2, '0')}s`;
        };

        return (
            <div className="text-center" style={STYLES.resultPadding}>
                <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <div
                        className="text-6xl mb-4"
                        style={createResultIconStyle(isWin)}
                    >
                        {isWin ? '🎉' : '😔'}
                    </div>
                    <h2
                        className="text-4xl font-bold mb-4"
                        style={createResultTotalStyle(isWin)}
                    >
                        {isWin ? '¡VICTORIA!' : (result.timeout ? '¡TIEMPO AGOTADO!' : 'DERROTA')}
                    </h2>

                    {/* Desglose de tiempos */}
                    <div className="result-breakdown-panel" style={STYLES.resultPanel}>
                        <div className="result-label">
                            Tu tiempo: <span className="result-value">{formatResultTime(result.playerTime ?? 0)}</span>
                        </div>
                        {penalty > 0 && (
                            <div className="result-penalty">
                                Penalización ({result.errors} errores): +{formatResultTime(penalty)}
                            </div>
                        )}
                        <div className="result-total" style={createResultTotalStyle(isWin)}>
                            Total: {formatResultTime(totalTime)}
                        </div>
                        <div className="result-opponent">
                            Oponente: {formatResultTime(result.opponentTime ?? 0)}
                        </div>
                    </div>
                </motion.div>
            </div>
        );
    }

    // Estado por defecto (preparando)
    return (
        <div className="block-validation-container" style={STYLES.defaultContainer}>
            <div className="text-center text-secondary">
                <p>Preparando tablero...</p>
            </div>
        </div>
    );
};

export default BlockValidationAnimation;
