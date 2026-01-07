/**
 * RPSAnimation - Animación de Piedra, Papel o Tijera
 * Componente visual para el juego RPS
 */
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const RPSAnimation = ({ status, result }) => {
    const icons = { rock: '✊', paper: '✋', scissors: '✌️' };
    const [cycle, setCycle] = useState('rock');

    useEffect(() => {
        if (status === 'spin') {
            const interval = setInterval(() => {
                setCycle(prev => prev === 'rock' ? 'paper' : prev === 'paper' ? 'scissors' : 'rock');
            }, 100);
            return () => clearInterval(interval);
        }
    }, [status]);

    return (
        <div className="flex-center flex-gap-4" style={{ gap: '3rem' }}>
            {/* Player Hand */}
            <div className="text-center">
                <div className="text-secondary text-xs mb-4">TÚ</div>
                <motion.div
                    animate={status === 'spin' ? { y: [0, -20, 0] } : { scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.5, repeat: status === 'spin' ? Infinity : 0 }}
                    style={{ fontSize: '5rem' }}
                >
                    {status === 'spin' ? icons[cycle] : icons[result?.player]}
                </motion.div>
            </div>

            {/* Opponent Hand */}
            <div className="text-center">
                <div className="text-secondary text-xs mb-4">OPONENTE</div>
                <motion.div
                    animate={status === 'spin' ? { y: [0, -20, 0] } : { scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.5, repeat: status === 'spin' ? Infinity : 0, delay: 0.1 }}
                    style={{ fontSize: '5rem', transform: 'scaleX(-1)' }}
                >
                    {status === 'spin' ? icons[cycle] : icons[result?.opponent]}
                </motion.div>
            </div>
        </div>
    );
};

export default RPSAnimation;
