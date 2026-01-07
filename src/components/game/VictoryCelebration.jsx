/**
 * SuccessCelebration - Componente de celebración de ejecución exitosa
 * 
 * Implementa la Peak-End Rule: Las personas juzgan una experiencia
 * por su punto álgido y su momento final.
 * 
 * Este componente crea un momento memorable tras una resolución positiva.
 */
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Configuración de partículas de confeti
const CONFETTI_COLORS = ['#FFD700', '#4ADE80', '#60A5FA', '#F472B6', '#A78BFA', '#FBBF24'];
const CONFETTI_COUNT = 50;

// Genera una partícula de confeti aleatoria
const generateConfetti = (index) => ({
    id: index,
    x: Math.random() * 100, // Posición X inicial (%)
    color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
    size: Math.random() * 8 + 4, // 4-12px
    delay: Math.random() * 0.5,
    duration: Math.random() * 2 + 2, // 2-4s
    rotation: Math.random() * 360,
    shape: Math.random() > 0.5 ? 'circle' : 'square'
});

// Componente de partícula individual
const ConfettiParticle = ({ particle }) => (
    <motion.div
        key={particle.id}
        initial={{
            y: -20,
            x: `${particle.x}vw`,
            opacity: 1,
            rotate: 0,
            scale: 0
        }}
        animate={{
            y: '110vh',
            opacity: [1, 1, 0],
            rotate: particle.rotation * 3,
            scale: [0, 1, 1, 0.5]
        }}
        transition={{
            duration: particle.duration,
            delay: particle.delay,
            ease: 'easeOut'
        }}
        style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: particle.size,
            height: particle.size,
            backgroundColor: particle.color,
            borderRadius: particle.shape === 'circle' ? '50%' : '2px',
            pointerEvents: 'none',
            zIndex: 1000
        }}
    />
);

// Componente de rayos de luz
const LightRays = () => (
    <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: [0, 0.3, 0], scale: [0.5, 1.5, 2] }}
        transition={{ duration: 1.5, ease: 'easeOut' }}
        style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '200%',
            height: '200%',
            background: 'radial-gradient(circle, rgba(74, 222, 128, 0.4) 0%, transparent 50%)',
            pointerEvents: 'none',
            zIndex: 0
        }}
    />
);

// Componente de anillo expansivo
const ExplosionRing = ({ delay = 0, color = 'rgba(74, 222, 128, 0.5)' }) => (
    <motion.div
        initial={{ scale: 0, opacity: 1 }}
        animate={{ scale: 3, opacity: 0 }}
        transition={{ duration: 1, delay, ease: 'easeOut' }}
        style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 100,
            height: 100,
            borderRadius: '50%',
            border: `3px solid ${color}`,
            pointerEvents: 'none',
            zIndex: 0
        }}
    />
);

// Componente de estrella brillante
const Sparkle = ({ x, y, delay, size = 20 }) => (
    <motion.div
        initial={{ scale: 0, opacity: 0, rotate: 0 }}
        animate={{
            scale: [0, 1, 0],
            opacity: [0, 1, 0],
            rotate: 180
        }}
        transition={{ duration: 0.8, delay }}
        style={{
            position: 'absolute',
            left: `${x}%`,
            top: `${y}%`,
            width: size,
            height: size,
            pointerEvents: 'none',
            zIndex: 2
        }}
    >
        <svg viewBox="0 0 24 24" fill="white">
            <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
        </svg>
    </motion.div>
);

/**
 * SuccessTrophy - Componente animado de hito/reconocimiento
 */
export const SuccessTrophy = ({ size = '4rem' }) => (
    <motion.div
        animate={{
            y: [0, -10, 0],
            rotate: [0, -5, 5, 0]
        }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        style={{ fontSize: size, textAlign: 'center' }}
    >
        🏆
    </motion.div>
);

/**
 * SuccessCelebration - Componente principal de celebración
 */
const SuccessCelebration = ({
    isActive = false,
    amount = '0.00',
    onComplete
}) => {
    const [confetti, setConfetti] = useState([]);
    const [sparkles, setSparkles] = useState([]);

    // Generar confeti cuando se activa
    useEffect(() => {
        if (isActive) {
            const newConfetti = Array.from({ length: CONFETTI_COUNT }, (_, i) => generateConfetti(i));
            setConfetti(newConfetti);

            // Generar sparkles aleatorios
            const newSparkles = Array.from({ length: 8 }, (_, i) => ({
                id: i,
                x: 20 + Math.random() * 60,
                y: 20 + Math.random() * 60,
                delay: Math.random() * 0.5,
                size: 15 + Math.random() * 20
            }));
            setSparkles(newSparkles);

            // Limpiar después de la animación
            const timer = setTimeout(() => {
                setConfetti([]);
                setSparkles([]);
                if (onComplete) onComplete();
            }, 4000);

            return () => clearTimeout(timer);
        }
    }, [isActive, onComplete]);

    if (!isActive) return null;

    return (
        <AnimatePresence>
            <div
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    pointerEvents: 'none',
                    zIndex: 999,
                    overflow: 'hidden'
                }}
            >
                {/* Rayos de luz de fondo */}
                <LightRays />

                {/* Anillos de explosión */}
                <ExplosionRing delay={0} color="rgba(74, 222, 128, 0.5)" />
                <ExplosionRing delay={0.15} color="rgba(255, 215, 0, 0.4)" />
                <ExplosionRing delay={0.3} color="rgba(96, 165, 250, 0.3)" />

                {/* Sparkles */}
                {sparkles.map(sparkle => (
                    <Sparkle key={sparkle.id} {...sparkle} />
                ))}

                {/* Confeti */}
                {confetti.map(particle => (
                    <ConfettiParticle key={particle.id} particle={particle} />
                ))}
            </div>
        </AnimatePresence>
    );
};

export default SuccessCelebration;
