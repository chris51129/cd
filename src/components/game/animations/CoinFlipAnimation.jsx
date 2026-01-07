/**
 * CoinFlipAnimation - Animación de lanzamiento de moneda
 * Componente visual para el juego Cara o Cruz
 */
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CoinFlipAnimation = ({ status, result }) => (
    <div className="flex-center w-full h-full">
        <AnimatePresence mode='wait'>
            {status === 'spin' && (
                <motion.div
                    key="coin-spin"
                    initial={{ rotateY: 0 }}
                    animate={{ rotateY: 1800 }}
                    transition={{ duration: 5, ease: "easeInOut" }}
                    style={{
                        width: 150, height: 150,
                        borderRadius: '50%',
                        // Double-sided gradient simulaton (spinning rapidly, so mix gold/silver tones)
                        background: 'linear-gradient(135deg, #FFD700, #E5E7EB, #DAA520)',
                        border: '4px solid #B8860B',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '4rem', color: '#6B4C02', fontWeight: 'bold',
                        boxShadow: '0 0 50px rgba(255, 215, 0, 0.4), inset 0 0 20px rgba(0,0,0,0.3)',
                        perspective: '1000px',
                        transformStyle: 'preserve-3d'
                    }}
                >
                    <div style={{ transform: 'scale(0.8)' }}>$</div>
                </motion.div>
            )}

            {status === 'result' && (
                <motion.div
                    key="result-reveal"
                    initial={{ scale: 0, opacity: 0, rotateY: -180 }}
                    animate={{ scale: 1.1, opacity: 1, rotateY: 0 }}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                    style={{
                        position: 'relative',
                        width: 180, height: 180,
                        perspective: '1000px'
                    }}
                >
                    {/* Coin Visual */}
                    <div style={{
                        width: '100%', height: '100%',
                        borderRadius: '50%',
                        background: result === 'heads'
                            ? 'radial-gradient(135deg, #FFD700 0%, #B8860B 100%)' // Gold for Heads
                            : 'radial-gradient(135deg, #E5E7EB 0%, #9CA3AF 100%)', // Silver for Tails
                        border: `8px solid ${result === 'heads' ? '#DAA520' : '#6B7280'}`,
                        boxShadow: `
                            inset 0 0 20px rgba(0,0,0,0.3),
                            0 10px 30px rgba(0,0,0,0.5),
                            0 0 50px ${result === 'heads' ? 'rgba(255, 215, 0, 0.3)' : 'rgba(255, 255, 255, 0.2)'}
                        `,
                        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
                    }}>
                        <span style={{
                            fontSize: '4rem',
                            lineHeight: 1,
                            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
                        }}>
                            {result === 'heads' ? '🪙' : '👑'}
                        </span>
                        <span style={{
                            marginTop: '0.5rem',
                            fontSize: '1.25rem',
                            fontWeight: '900',
                            color: result === 'heads' ? '#713F12' : '#1F2937',
                            textTransform: 'uppercase',
                            letterSpacing: '0.1em',
                            textShadow: '0 1px 0 rgba(255,255,255,0.4)'
                        }}>
                            {result === 'heads' ? 'CARA' : 'CRUZ'}
                        </span>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    </div>
);

export default CoinFlipAnimation;
