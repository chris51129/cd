/**
 * DiceAnimation - Animación de dados
 * Componente visual para el juego Duelo de Dados
 */
import React from 'react';
import { motion } from 'framer-motion';

const DiceAnimation = ({ status, result }) => {
    // Variants for animation states
    const diceVariants = {
        idle: {
            y: [0, -10, 0], // Smooth float
            rotateX: [10, 15, 10], // Subtle tilt breathing
            rotateY: [10, -10, 10],
            transition: {
                duration: 4, // Slower duration for "floating" feel
                repeat: Infinity,
                ease: "easeInOut"
            }
        },
        spin: {
            rotateX: [0, 360, 720],
            rotateY: [0, 480, 960], // Asymmetric rotation for natural tumble
            y: [0, -20, 0], // Reduced bounce height
            scale: [1, 1.05, 1], // Subtle scale pulse
            transition: {
                duration: 1.5,
                repeat: Infinity,
                ease: "linear"
            }
        },
        result: {
            rotateX: 0,
            rotateY: 0,
            y: 0,
            scale: 1,
            transition: {
                type: "spring",
                stiffness: 150, // Softer spring
                damping: 15
            }
        }
    };

    const shadowVariants = {
        idle: {
            scale: [1, 0.8, 1],
            opacity: [0.3, 0.1, 0.3],
            transition: { duration: 4, repeat: Infinity, ease: "easeInOut" }
        },
        spin: {
            scale: [1, 0.6, 1],
            opacity: [0.3, 0.1, 0.3],
            transition: { duration: 0.75, repeat: Infinity, ease: "linear" }
        },
        result: {
            scale: 1,
            opacity: 0.3,
            transition: { duration: 0.3 }
        }
    };

    const boxSize = 65; // Increased by 8% (60 -> 65)
    const fontSize = '2rem';

    return (
        <div className="flex-center perspective-container" style={{ perspective: '800px', gap: '3.2rem' }}>
            {/* Player Dice */}
            <div className="text-center relative z-10">
                <div className="text-secondary text-xs mb-6 font-bold tracking-widest uppercase">Tú</div>
                <motion.div
                    variants={diceVariants}
                    animate={status === 'spin' ? 'spin' : (result ? 'result' : 'idle')}
                    style={{
                        width: boxSize, height: boxSize,
                        background: 'linear-gradient(145deg, #3B82F6, #2563EB)',
                        borderRadius: 14,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: fontSize, fontWeight: '800', color: 'white',
                        boxShadow: 'inset 0 0 20px rgba(0,0,0,0.1), 0 10px 20px rgba(37, 99, 235, 0.3)',
                        border: '1px solid rgba(255,255,255,0.15)',
                        transformStyle: 'preserve-3d'
                    }}
                >
                    <span style={{ filter: 'drop-shadow(0 2px 2px rgba(0,0,0,0.2))' }}>
                        {status === 'spin' ? '🎲' : result?.player}
                    </span>
                </motion.div>
                {/* Floating Shadow */}
                <motion.div
                    variants={shadowVariants}
                    animate={status === 'spin' ? 'spin' : (result ? 'result' : 'idle')}
                    style={{
                        width: boxSize, height: 12,
                        background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.4) 0%, transparent 70%)',
                        margin: '25px auto 0',
                        borderRadius: '50%'
                    }}
                />
            </div>

            <div className="text-xl font-bold text-secondary opacity-30 relative z-0" style={{ marginTop: '-15px' }}>VS</div>

            {/* Opponent Dice */}
            <div className="text-center relative z-10">
                <div className="text-secondary text-xs mb-6 font-bold tracking-widest uppercase">RIVAL</div>
                <motion.div
                    variants={diceVariants}
                    animate={status === 'spin' ? 'spin' : (result ? 'result' : 'idle')}
                    style={{
                        width: boxSize, height: boxSize,
                        background: 'linear-gradient(145deg, #EF4444, #DC2626)',
                        borderRadius: 14,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: fontSize, fontWeight: '800', color: 'white',
                        boxShadow: 'inset 0 0 20px rgba(0,0,0,0.1), 0 10px 20px rgba(220, 38, 38, 0.3)',
                        border: '1px solid rgba(255,255,255,0.15)',
                        transformStyle: 'preserve-3d'
                    }}
                >
                    <span style={{ filter: 'drop-shadow(0 2px 2px rgba(0,0,0,0.2))' }}>
                        {status === 'spin' ? '🎲' : result?.opponent}
                    </span>
                </motion.div>
                {/* Floating Shadow */}
                <motion.div
                    variants={shadowVariants}
                    animate={status === 'spin' ? 'spin' : (result ? 'result' : 'idle')}
                    style={{
                        width: boxSize, height: 12,
                        background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.4) 0%, transparent 70%)',
                        margin: '25px auto 0',
                        borderRadius: '50%'
                    }}
                />
            </div>
        </div>
    );
};

export default DiceAnimation;
