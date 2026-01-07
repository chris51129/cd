/**
 * StreakManager - Maneja las rachas de victorias/derrotas
 * 
 * Efecto Zeigarnik: Las tareas incompletas o metas progresivas
 * mantienen al usuario enganchado.
 * 
 * Implementado con el Patrón Observer para total desacoplamiento.
 */
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameEvents, GAME_EVENTS } from '../../events';
import { AnimatedFlame } from '../ui/Icons';
import './StreakManager.css';

const StreakManager = () => {
    // Cargar racha inicial desde localStorage
    const [streak, setStreak] = useState(() => {
        const saved = localStorage.getItem('cd_streak');
        return saved ? parseInt(saved, 10) : 0;
    });
    const [showUpdate, setShowUpdate] = useState(false);
    const [lastOutcome, setLastOutcome] = useState(null);

    // Guardar racha en localStorage cada vez que cambie
    useEffect(() => {
        localStorage.setItem('cd_streak', streak.toString());
    }, [streak]);

    // Escuchar eventos de victoria/derrota
    useGameEvents(GAME_EVENTS.VICTORY, () => {
        setStreak(prev => prev + 1);
        setLastOutcome('win');
        triggerAnimation();
    });

    useGameEvents(GAME_EVENTS.DEFEAT, () => {
        setStreak(prev => {
            if (prev > 0) {
                setLastOutcome('loss');
                triggerAnimation();
            }
            return 0;
        });
    });

    const triggerAnimation = () => {
        setShowUpdate(true);
        setTimeout(() => setShowUpdate(false), 3000);
    };

    // No mostrar nada si la racha es 0 y no hay actualización reciente
    if (streak === 0 && !showUpdate) return null;

    return (
        <div className="streak-manager">
            <AnimatePresence>
                {streak > 0 && (
                    <motion.div
                        className="streak-badge"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                    >
                        <AnimatedFlame size={20} strokeWidth={2.5} />
                        <span className="streak-count">{streak} EN RACHA</span>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {showUpdate && (
                    <motion.div
                        className={`streak-popup ${lastOutcome}`}
                        initial={{ opacity: 0, y: 10, scale: 0.8 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.8 }}
                    >
                        {lastOutcome === 'win' ? (
                            <><span>+1</span> Victoria</>
                        ) : (
                            <><span>Racha perdida</span></>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default StreakManager;
