/**
 * SelectionScreen - Pantalla de selección de lado
 * Permite al jugador elegir Cara o Cruz (o simula espera del oponente)
 */
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { secureRandomInt, secureLog } from '../../utils/security';
import { GAME_CONFIG } from '../../constants/config';

const SelectionScreen = ({ gameType, isChooser, selectionTimeLeft, onSelect, onAssignedReady }) => {
    // Usamos el tiempo del motor si está disponible, si no, fallback al config
    const timeLeft = selectionTimeLeft !== undefined ? selectionTimeLeft : (GAME_CONFIG.SELECTION_TIMEOUT_MS / 1000);
    const hasSelected = React.useRef(false);

    let titleText = isChooser ? "ESTABLECER POSICIÓN" : "OPONENTE VALIDANDO...";

    // 1. Logic for Assigned Role (Simulate opponent choice)
    useEffect(() => {
        if (!isChooser) {
            // Use crypto-secure random for delay
            const delay = secureRandomInt(2000, 3000);
            const timer = setTimeout(() => {
                if (gameType === 'rps') {
                    // For RPS, we just simulate readiness
                    onAssignedReady('ready');
                } else {
                    // Use crypto-secure random for opponent choice
                    const opponentChoice = secureRandomInt(0, 1) === 1 ? 'heads' : 'tails';
                    const playerAssigned = opponentChoice === 'heads' ? 'tails' : 'heads';
                    onAssignedReady(playerAssigned);
                }
            }, delay);
            return () => clearTimeout(timer);
        }
    }, [isChooser, onAssignedReady, gameType]);

    // La lógica de auto-selección reside en el motor (useGameEngine)
    // Este componente solo se encarga de mostrar el contador visual y manejar el clic manual.

    const handleSelect = (choice) => {
        if (!hasSelected.current) {
            hasSelected.current = true;
            onSelect(choice);
        }
    };

    if (!isChooser) {
        return (
            <div className="flex-center flex-col" style={{ height: 'var(--arena-height)' }}>
                <div className="arena-status-text mb-4 text-2xl font-bold">
                    {titleText}
                </div>
                <div className="flex-center" style={{ gap: 'var(--spacing-sm)' }}>
                    <span className="status-dot animate-pulse"></span>
                    <span className="status-dot animate-pulse" style={{ animationDelay: '0.2s' }}></span>
                    <span className="status-dot animate-pulse" style={{ animationDelay: '0.4s' }}></span>
                </div>
            </div>
        );
    }

    // Helper calculate progress percentage (100% full at start, 0% at end)
    const progressPercent = (timeLeft / (GAME_CONFIG.SELECTION_TIMEOUT_MS / 1000)) * 100;
    // Color transition from Green -> Yellow -> Red based on time
    const getTimerColor = () => {
        if (timeLeft > 6) return '#22c55e'; // Green
        if (timeLeft > 3) return '#eab308'; // Yellow
        return '#ef4444'; // Red
    };

    return (
        <div className="w-full flex flex-col items-center" style={{ padding: 'var(--spacing-md) 0' }}>
            <h3 className="section-subtitle mb-2 text-center text-xl font-bold tracking-widest uppercase">
                {titleText}
            </h3>

            {/* Timer Progress Bar */}
            <div className="w-full max-w-md mb-8 px-4" style={{ maxWidth: '400px', width: '100%', padding: '0 var(--spacing-sm)', marginBottom: 'var(--spacing-md)' }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '0.5rem',
                    fontSize: '0.875rem',
                    fontWeight: '700',
                    color: 'var(--text-secondary)',
                    letterSpacing: '0.05em'
                }}>
                    <span>TIEMPO RESTANTE</span>
                    <span style={{
                        color: getTimerColor(),
                        fontVariantNumeric: 'tabular-nums', // Prevents jumping width
                        fontSize: '1rem'
                    }}>
                        {Math.ceil(timeLeft)}s
                    </span>
                </div>

                <div style={{
                    width: '100%',
                    height: '8px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '999px',
                    overflow: 'hidden',
                    border: '1px solid rgba(255, 255, 255, 0.05)'
                }}>
                    <motion.div
                        initial={{ width: '100%' }}
                        animate={{
                            width: `${progressPercent}%`,
                            backgroundColor: getTimerColor()
                        }}
                        transition={{ duration: 1, ease: "linear" }}
                        style={{
                            height: '100%',
                            borderRadius: '999px',
                            backgroundColor: getTimerColor(),
                            boxShadow: `0 0 10px ${getTimerColor()}40` // Add subtle glow
                        }}
                    />
                </div>
            </div>

            <div className="flex-center" style={{ gap: 'var(--spacing-sm)', flexWrap: 'wrap', width: '100%', maxWidth: '800px' }}>
                {gameType === 'coinflip' && (
                    <>
                        <motion.div
                            className="choice-card heads"
                            whileHover={{ y: -5 }}
                            onClick={() => handleSelect('heads')}
                            role="button"
                            tabIndex={0}
                            aria-label="Seleccionar Cara"
                            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), handleSelect('heads'))}
                        >
                            <div className="choice-icon">🪙</div>
                            <div>
                                <div className="choice-label">CARA</div>
                                <div className="choice-sub">OPCIÓN A</div>
                            </div>
                        </motion.div>

                        <motion.div
                            className="choice-card tails"
                            whileHover={{ y: -5 }}
                            onClick={() => handleSelect('tails')}
                            role="button"
                            tabIndex={0}
                            aria-label="Seleccionar Cruz"
                            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), handleSelect('tails'))}
                        >
                            <div className="choice-icon">👑</div>
                            <div>
                                <div className="choice-label">CRUZ</div>
                                <div className="choice-sub">OPCIÓN B</div>
                            </div>
                        </motion.div>
                    </>
                )}

                {gameType === 'rps' && (
                    <>
                        <motion.div
                            className="choice-card rock"
                            whileHover={{ y: -5 }}
                            onClick={() => handleSelect('rock')}
                            role="button"
                            tabIndex={0}
                            aria-label="Seleccionar Piedra"
                            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), handleSelect('rock'))}
                        >
                            <div className="choice-icon">✊</div>
                            <div>
                                <div className="choice-label">PIEDRA</div>
                                <div className="choice-sub">ROCA SÓLIDA</div>
                            </div>
                        </motion.div>

                        <motion.div
                            className="choice-card paper"
                            whileHover={{ y: -5 }}
                            onClick={() => handleSelect('paper')}
                            role="button"
                            tabIndex={0}
                            aria-label="Seleccionar Papel"
                            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), handleSelect('paper'))}
                        >
                            <div className="choice-icon">✋</div>
                            <div>
                                <div className="choice-label">PAPEL</div>
                                <div className="choice-sub">ESTRATEGIA</div>
                            </div>
                        </motion.div>

                        <motion.div
                            className="choice-card scissors"
                            whileHover={{ y: -5 }}
                            onClick={() => handleSelect('scissors')}
                            role="button"
                            tabIndex={0}
                            aria-label="Seleccionar Tijera"
                            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), handleSelect('scissors'))}
                        >
                            <div className="choice-icon">✌️</div>
                            <div>
                                <div className="choice-label">TIJERA</div>
                                <div className="choice-sub">CORTE LIMPIO</div>
                            </div>
                        </motion.div>
                    </>
                )}
            </div>
        </div>
    );
};

SelectionScreen.propTypes = {
    gameType: PropTypes.oneOf(['coinflip', 'rps']).isRequired,
    isChooser: PropTypes.bool.isRequired,
    selectionTimeLeft: PropTypes.number,
    onSelect: PropTypes.func.isRequired,
    onAssignedReady: PropTypes.func.isRequired,
};

export default SelectionScreen;
