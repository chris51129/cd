/**
 * WaitingRoom - Component for waiting for opponent match
 * Uses CSS classes and config constants for clean code
 */
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

import { GAME_CONFIG, ANIMATION_CONFIG, UI_CONFIG } from '../../constants/config';
import * as Icons from '../ui/AnimatedLucideIcons';
import type { Tier } from '../../constants/tiers';

/**
 * Props for TierIcon component
 */
interface TierIconProps {
    readonly iconName: keyof typeof Icons;
    readonly color: string;
    readonly size?: number;
}

/**
 * Props for WaitingRoom component
 */
interface WaitingRoomProps {
    readonly tier: Tier;
    readonly onCancel: () => void;
    readonly onMatchFound: () => void;
}

const TierIcon: React.FC<TierIconProps> = ({ iconName, color, size = 32 }) => {
    const IconComponent = Icons[iconName];
    if (!IconComponent) return null;
    return <IconComponent size={size} color={color} />;
};

const WaitingRoom: React.FC<WaitingRoomProps> = ({ tier, onCancel, onMatchFound }) => {
    // Validate tier prop
    if (!tier || typeof tier.amount !== 'number') {
        console.error('WaitingRoom: Invalid tier prop', tier);
        return (
            <div className="text-center text-secondary">
                Error: Tier no válido
            </div>
        );
    }

    const tierColor = tier.color || UI_CONFIG.COLOR_DEFAULT_ACCENT;

    // Mock simulation: find match after random delay
    useEffect(() => {
        const delay = Math.random() *
            (GAME_CONFIG.MATCHMAKING_MAX_MS - GAME_CONFIG.MATCHMAKING_MIN_MS) +
            GAME_CONFIG.MATCHMAKING_MIN_MS;

        const timeout = setTimeout(() => {
            if (onMatchFound) onMatchFound();
        }, delay);

        return () => clearTimeout(timeout);
    }, [onMatchFound]);

    return (
        <div className="waiting-room text-center">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="waiting-room-content"
            >
                <h2 className="text-secondary waiting-room-title">Buscando oponente...</h2>
                <h3 className="waiting-room-pool" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}>
                    <TierIcon iconName={(tier.icon as keyof typeof Icons) ?? 'AnimatedCoin'} color={tierColor} />
                    <span>Pool de ${tier.amount}</span>
                </h3>

                {/* Radar/Ripple Animation */}
                <div className="radar-container">
                    <div
                        className="radar-bg"
                        style={{ background: tierColor }}
                    />
                    <motion.div
                        animate={{ scale: [1, 2], opacity: [0.5, 0] }}
                        transition={{
                            duration: ANIMATION_CONFIG.RIPPLE_DURATION_S,
                            repeat: Infinity,
                            ease: 'easeOut'
                        }}
                        className="radar-ripple"
                        style={{ borderColor: tierColor }}
                    />
                    <motion.div
                        animate={{ scale: [1, 2], opacity: [0.5, 0] }}
                        transition={{
                            duration: ANIMATION_CONFIG.RIPPLE_DURATION_S,
                            repeat: Infinity,
                            ease: 'easeOut',
                            delay: ANIMATION_CONFIG.RIPPLE_DELAY_S
                        }}
                        className="radar-ripple"
                        style={{ borderColor: tierColor }}
                    />
                    <div className="radar-center-icon">⚔️</div>
                </div>

                <div className="flex flex-col items-center gap-4">
                    <div className="text-secondary text-sm">
                        Hay <span className="text-white font-bold">1</span> jugador en cola
                    </div>

                    <button
                        onClick={onCancel}
                        className="btn-secondary btn-cancel mt-8"
                    >
                        Cancelar y Salir
                    </button>
                    <p className="text-xs text-secondary mt-2">
                        Sin costo durante la fase de prueba
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default WaitingRoom;