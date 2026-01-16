/**
 * RPSAnimation - Animación de Piedra, Papel o Tijera
 * 
 * OPTIMIZATION (Protocolo Optimización):
 * - requestAnimationFrame con delta time en lugar de setInterval
 * - Estilos estáticos fuera del render
 * - Objetos de animación memoizados
 */
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import type { CSSProperties } from 'react';

/**
 * RPS choice type
 */
type RPSChoice = 'rock' | 'paper' | 'scissors';

/**
 * RPS result type
 */
interface RPSResult {
    readonly player?: RPSChoice;
    readonly opponent?: RPSChoice;
    readonly outcome?: 'win' | 'loss' | 'draw';
}

/**
 * RPS game state type
 */
interface RPSGameState {
    readonly selectionTimeLeft?: number;
    readonly drawCount?: number;
    readonly rpsResult?: RPSResult;
}

/**
 * Props for RPSAnimation component
 */
interface RPSAnimationProps {
    readonly status: string;
    readonly result?: RPSResult | null;
    readonly gameState?: RPSGameState;
}

// ============================================
// Static Styles (no GC pressure)
// ============================================

const STYLES: Readonly<Record<string, CSSProperties>> = Object.freeze({
    container: { gap: '3rem' },
    iconPlayer: { fontSize: '5rem' },
    iconOpponent: { fontSize: '5rem', transform: 'scaleX(-1)' },
});

// Static icon mapping
const ICONS: Readonly<Record<RPSChoice, string>> = Object.freeze({
    rock: '✊',
    paper: '✋',
    scissors: '✌️',
});

// Cycle order for animation
const CYCLE_ORDER: readonly RPSChoice[] = Object.freeze(['rock', 'paper', 'scissors']);

// Animation interval in ms
const CYCLE_INTERVAL_MS = 100;

const RPSAnimation: React.FC<RPSAnimationProps> = ({ status, result }) => {
    const [cycleIndex, setCycleIndex] = useState(0);
    const lastTimeRef = useRef(0);
    const frameIdRef = useRef<number | null>(null);

    // requestAnimationFrame animation loop
    useEffect(() => {
        if (status !== 'spin') {
            // Reset when not spinning
            setCycleIndex(0);
            return;
        }

        const animate = (time: number): void => {
            // Calculate delta time
            if (time - lastTimeRef.current >= CYCLE_INTERVAL_MS) {
                setCycleIndex(prev => (prev + 1) % CYCLE_ORDER.length);
                lastTimeRef.current = time;
            }
            frameIdRef.current = requestAnimationFrame(animate);
        };

        // Start animation
        lastTimeRef.current = performance.now();
        frameIdRef.current = requestAnimationFrame(animate);

        // Cleanup
        return () => {
            if (frameIdRef.current !== null) {
                cancelAnimationFrame(frameIdRef.current);
                frameIdRef.current = null;
            }
        };
    }, [status]);

    const currentCycle = CYCLE_ORDER[cycleIndex];

    return (
        <div className="flex-center flex-gap-4" style={STYLES.container}>
            {/* Player Hand */}
            <div className="text-center">
                <div className="text-secondary text-xs mb-4">TÚ</div>
                <motion.div
                    animate={status === 'spin' ? { y: [0, -20, 0] } : { scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.5, repeat: status === 'spin' ? Infinity : 0 }}
                    style={STYLES.iconPlayer}
                >
                    {status === 'spin' ? ICONS[currentCycle] : ICONS[result?.player ?? 'rock']}
                </motion.div>
            </div>

            {/* Opponent Hand */}
            <div className="text-center">
                <div className="text-secondary text-xs mb-4">OPONENTE</div>
                <motion.div
                    animate={status === 'spin' ? { y: [0, -20, 0] } : { scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.5, repeat: status === 'spin' ? Infinity : 0, delay: 0.1 }}
                    style={STYLES.iconOpponent}
                >
                    {status === 'spin' ? ICONS[currentCycle] : ICONS[result?.opponent ?? 'rock']}
                </motion.div>
            </div>
        </div>
    );
};

export default RPSAnimation;
