/**
 * BlockValidationAnimation - Schulte Table 5x5
 * Juego de velocidad de procesamiento visual.
 * El jugador debe hacer clic en números del 1 al 25 en orden secuencial.
 */
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PropTypes from 'prop-types';
import CountdownOverlay from '../CountdownOverlay';
import './BlockValidation.css';

const BlockValidationAnimation = ({ status, result, gameState, onCellClick }) => {
    const {
        blockGrid = [],
        blockNextTarget = 1,
        blockErrors = 0,
        blockState = 'countdown',
        blockStartTime = 0,
        blockTimeLeft = 60,
        countdownLeft = 5
    } = gameState || {};

    // Timer en vivo (elapsed time - for internal logs/stats if needed)
    const [elapsedTime, setElapsedTime] = useState(0);

    useEffect(() => {
        if (blockState === 'playing' && blockStartTime > 0) {
            const interval = setInterval(() => {
                setElapsedTime(Math.floor(performance.now() - blockStartTime));
            }, 50); // Actualizar cada 50ms para fluidez
            return () => clearInterval(interval);
        }
    }, [blockState, blockStartTime]);

    // Formatear tiempo (segundos)
    const formatSeconds = (s) => `${s}s`;

    // Estado visual de cada celda
    const [clickedCells, setClickedCells] = useState({});
    const [errorCell, setErrorCell] = useState(null);

    const handleClick = (number, index) => {
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
            <div className="block-validation-container" style={{
                width: '100%',
                maxWidth: '400px',
                margin: '1.5rem auto 0',
                minedHeight: '400px',
                position: 'relative'
            }}>
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
                {/* Header: Timer + Errores */}
                <div className="block-validation-header">
                    {/* Timer (Countdown) */}
                    <div style={{ textAlign: 'center' }}>
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
                    </div >

                    {/* Errores */}
                    < div style={{ textAlign: 'center' }}>
                        <div className="block-stat-label">
                            Errores
                        </div>
                        <div className={`block-stat-value ${blockErrors > 0 ? 'error' : 'neutral'}`}>
                            {blockErrors}
                        </div >
                    </div >
                </div >

                {/* Grid 5x5 */}
                <div className="block-grid">
                    {blockGrid.map((number, index) => {
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
                    })
                    }
                </div >
            </div >
        );
    }

    // Pantalla de resultado
    if (status === 'result' && result) {
        const isWin = result.outcome === 'win';
        const penalty = (result.errors || 0) * 500;
        const totalTime = (result.playerTime || 0) + penalty;

        // Formateador de precisión para el resultado final
        const formatResultTime = (ms) => {
            const seconds = Math.floor(ms / 1000);
            const millis = Math.floor((ms % 1000) / 10);
            return `${seconds}.${millis.toString().padStart(2, '0')}s`;
        };

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
                            color: isWin ? '#22c55e' : '#ef4444',
                            textShadow: '0 0 20px rgba(0,0,0,0.5)',
                        }}
                    >
                        {isWin ? '🎉' : '😔'}
                    </div>
                    <h2
                        className="text-4xl font-bold mb-4"
                        style={{ color: isWin ? '#22c55e' : '#ef4444' }}
                    >
                        {isWin ? '¡VICTORIA!' : (result.timeout ? '¡TIEMPO AGOTADO!' : 'DERROTA')}
                    </h2>

                    {/* Desglose de tiempos */}
                    <div className="result-breakdown-panel" style={{
                        borderRadius: '12px',
                        padding: '1rem',
                        marginBottom: '1rem',
                        fontFamily: 'monospace',
                    }}>
                        <div className="result-label">
                            Tu tiempo: <span className="result-value">{formatResultTime(result.playerTime)}</span>
                        </div>
                        {penalty > 0 && (
                            <div className="result-penalty">
                                Penalización ({result.errors} errores): +{formatResultTime(penalty)}
                            </div>
                        )}
                        <div className="result-total" style={{ color: isWin ? '#22c55e' : '#ef4444' }}>
                            Total: {formatResultTime(totalTime)}
                        </div>
                        <div className="result-opponent">
                            Oponente: {formatResultTime(result.opponentTime)}
                        </div>
                    </div>
                </motion.div>
            </div>
        );
    }

    // Estado por defecto (preparando)
    return (
        <div className="block-validation-container" style={{
            width: '100%',
            maxWidth: '400px',
            margin: '1.5rem auto 0',
            padding: '1rem',
            minHeight: '400px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            <div className="text-center text-secondary">
                <p>Preparando tablero...</p>
            </div>
        </div>
    );
};

BlockValidationAnimation.propTypes = {
    status: PropTypes.string,
    result: PropTypes.object,
    gameState: PropTypes.object,
    onCellClick: PropTypes.func
};

export default BlockValidationAnimation;
