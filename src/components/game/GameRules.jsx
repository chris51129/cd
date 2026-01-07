import React from 'react';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import { AnimatedActivity } from '../ui/AnimatedLucideIcons';

/**
 * GameRules - displays mechanics, win conditions and penalties for a game
 */
const GameRules = ({ rules }) => {
    if (!rules) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="game-rules-container"
            style={{
                maxWidth: '800px',
                width: '100%',
                margin: '1rem auto 2rem',
                textAlign: 'center',
                background: 'rgba(255, 255, 255, 0.015)',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                borderRadius: '20px',
                padding: 'clamp(1rem, 3vw, 2rem)',
                position: 'relative',
                overflow: 'hidden',
                backdropFilter: 'blur(4px)'
            }}
        >
            {/* Top decorative glow */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: '50%',
                transform: 'translateX(-50%)',
                width: '60%',
                height: '1px',
                background: 'linear-gradient(90deg, transparent, rgba(46, 92, 255, 0.4), transparent)'
            }} />

            {/* Grid for main rules */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(min(280px, 100%), 1fr))',
                gap: 'clamp(1rem, 3vw, 2rem)',
                marginBottom: '1.5rem'
            }}>
                {/* Mechanics */}
                <div className="rule-item" style={{ textAlign: 'left', padding: '0 0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem' }}>
                        <AnimatedActivity size={16} color="var(--accent-blue)" />
                        <span style={{ fontSize: '0.75rem', fontWeight: '800', letterSpacing: '0.08em', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                            MECÁNICA
                        </span>
                    </div>
                    <p style={{ fontSize: 'clamp(0.85rem, 2vw, 0.95rem)', color: 'var(--text-primary)', lineHeight: '1.6', margin: 0, wordWrap: 'break-word', overflowWrap: 'break-word' }}>
                        {rules.mechanics}
                    </p>
                </div>

                {/* Win Condition */}
                <div className="rule-item" style={{ textAlign: 'left', padding: '0 0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem' }}>
                        <div style={{ width: 14, height: 14, borderRadius: '50%', border: '2px solid #FFD700', boxShadow: '0 0 8px rgba(255, 215, 0, 0.3)', flexShrink: 0 }} />
                        <span style={{ fontSize: '0.75rem', fontWeight: '800', letterSpacing: '0.08em', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                            RESOLUCIÓN EXITOSA
                        </span>
                    </div>
                    <p style={{ fontSize: 'clamp(0.85rem, 2vw, 0.95rem)', color: 'var(--text-primary)', lineHeight: '1.6', margin: 0, wordWrap: 'break-word', overflowWrap: 'break-word' }}>
                        {rules.winCondition}
                    </p>
                </div>
            </div>

            {/* Penalties Divider */}
            <div style={{ height: '1px', background: 'rgba(255,255,255,0.05)', margin: '1.5rem 0' }} />

            {/* Penalties */}
            <div className="rule-item" style={{ textAlign: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
                    <span style={{ color: '#ef4444', fontSize: '1rem' }}>⚠️</span>
                    <span style={{ fontSize: '0.7rem', fontWeight: '800', letterSpacing: '0.08em', color: 'rgba(239, 68, 68, 0.9)', textTransform: 'uppercase' }}>
                        CLÁUSULAS DE PENALIZACIÓN
                    </span>
                </div>
                <p style={{ fontSize: '0.9rem', color: 'rgba(239, 68, 68, 0.7)', lineHeight: '1.5', maxWidth: '600px', margin: '0 auto' }}>
                    {rules.penalties}
                </p>
            </div>
        </motion.div>
    );
};

GameRules.propTypes = {
    rules: PropTypes.shape({
        mechanics: PropTypes.string,
        winCondition: PropTypes.string,
        penalties: PropTypes.string
    })
};

export default GameRules;
