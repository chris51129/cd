/**
 * HigherLowerAnimation - UI component for Higher/Lower card game
 * 
 * WHY: Displays current card, prediction buttons, scores, and lives.
 * Follows the Minimalismo Escandinavo con toques Dark Elegance Tech design.
 */
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Card, HigherLowerPhase } from '../../../games/core/gameReducer';
import CountdownOverlay from '../CountdownOverlay';

// ============================================
// Types
// ============================================

interface HigherLowerResult {
    readonly outcome: 'win' | 'loss';
    readonly playerScore: number;
    readonly opponentScore: number;
    readonly playerLives: number;
    readonly opponentLives: number;
    readonly rounds: number;
}

interface HigherLowerGameState {
    readonly hlCurrentCard: Card | null;
    readonly hlNextCard: Card | null;
    readonly hlPlayerScore: number;
    readonly hlOpponentScore: number;
    readonly hlPlayerLives: number;
    readonly hlOpponentLives: number;
    readonly hlPhase: HigherLowerPhase;
    readonly hlPlayerPrediction: 'higher' | 'lower' | null;
    readonly hlTimeLeft: number;
    readonly hlRound: number;
    readonly countdownLeft: number;
}

interface HigherLowerAnimationProps {
    readonly status: string;
    readonly result: HigherLowerResult | null;
    readonly gameState: HigherLowerGameState;
    readonly onPredict: (prediction: 'higher' | 'lower') => void;
}

// ============================================
// Helper Functions
// ============================================

const getSuitSymbol = (suit: Card['suit']): string => {
    switch (suit) {
        case 'hearts': return '♥';
        case 'diamonds': return '♦';
        case 'clubs': return '♣';
        case 'spades': return '♠';
    }
};

const getSuitColor = (suit: Card['suit']): string => {
    return suit === 'hearts' || suit === 'diamonds' ? '#ef4444' : 'var(--text-primary)';
};

const getRankDisplay = (rank: number): string => {
    // With filtered deck (2-10), no letter cards needed
    // Keeping switch for safety in case deck changes
    switch (rank) {
        case 1: return 'A';
        case 11: return 'J';
        case 12: return 'Q';
        case 13: return 'K';
        default: return rank.toString();
    }
};

/**
 * Calculate if the player's prediction was correct
 * WHY: Needed for visual feedback ✅/❌
 */
const calculatePredictionResult = (
    currentCard: Card | null,
    nextCard: Card | null,
    prediction: 'higher' | 'lower' | null
): 'correct' | 'wrong' | 'push' | 'timeout' | null => {
    if (!currentCard || !nextCard) return null;

    // Timeout case - no prediction made
    if (prediction === null) return 'timeout';

    const isHigher = nextCard.rank > currentCard.rank;
    const isSame = nextCard.rank === currentCard.rank;

    if (isSame) return 'push';

    const isCorrect = (
        (prediction === 'higher' && isHigher) ||
        (prediction === 'lower' && !isHigher)
    );

    return isCorrect ? 'correct' : 'wrong';
};

// ============================================
// Sub-Components
// ============================================

/**
 * FeedbackIndicator - Shows ✅/❌ after prediction reveal
 * WHY: Immediate visual feedback is crucial for player engagement (game-developer skill)
 */
const FeedbackIndicator: React.FC<{ result: 'correct' | 'wrong' | 'push' | 'timeout' | null }> = ({ result }) => {
    if (!result) return null;

    const config = {
        correct: { emoji: '✅', color: '#22c55e', text: '¡CORRECTO!', glow: 'rgba(34, 197, 94, 0.6)' },
        wrong: { emoji: '❌', color: '#ef4444', text: '¡INCORRECTO!', glow: 'rgba(239, 68, 68, 0.6)' },
        push: { emoji: '🔄', color: '#f59e0b', text: 'EMPATE', glow: 'rgba(245, 158, 11, 0.6)' },
        timeout: { emoji: '⏰', color: '#ef4444', text: '¡TIEMPO AGOTADO!', glow: 'rgba(239, 68, 68, 0.6)' },
    }[result];

    return (
        <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', damping: 12, stiffness: 400 }}
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '1.25rem 2rem',
                background: 'var(--bg-overlay-dark)',
                backdropFilter: 'blur(12px)',
                borderRadius: '20px',
                border: `2px solid ${config.color}`,
                boxShadow: `0 0 40px ${config.glow}, 0 0 80px ${config.glow}`,
                pointerEvents: 'auto',
            }}
        >
            <motion.span
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ repeat: Infinity, duration: 0.6 }}
                style={{ fontSize: '3rem' }}
            >
                {config.emoji}
            </motion.span>
            <span style={{
                fontSize: '1rem',
                fontWeight: 800,
                color: config.color,
                letterSpacing: '0.15em',
                textShadow: `0 0 15px ${config.glow}`,
                fontFamily: 'var(--font-heading)',
            }}>
                {config.text}
            </span>
        </motion.div>
    );
};

// Portal container for centered overlay feedback
const FeedbackPortal: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 99999,
            pointerEvents: 'none',
        }}>
            {children}
        </div>
    );
};

const CardDisplay: React.FC<{ card: Card | null; isHidden?: boolean; isRevealing?: boolean; isCurrent?: boolean }> = ({
    card,
    isHidden = false,
    isRevealing = false,
    isCurrent = false
}) => {
    if (!card) return null;

    return (
        <motion.div
            initial={isRevealing ? { rotateY: 180, scale: 0.8, opacity: 0 } : { scale: 0.9, opacity: 0 }}
            animate={{ rotateY: 0, scale: 1, opacity: 1 }}
            whileHover={isCurrent ? { scale: 1.05, boxShadow: '0 0 40px rgba(59, 130, 246, 0.4)' } : {}}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="hl-card"
            style={{
                width: '130px',
                height: '182px',
                background: isHidden
                    ? 'var(--hl-card-hidden-bg, linear-gradient(135deg, #1e293b 0%, #0f172a 100%))'
                    : 'var(--hl-card-bg, rgba(255, 255, 255, 0.03))',
                backdropFilter: 'blur(12px)',
                border: isCurrent
                    ? '2px solid var(--accent-blue)'
                    : '1px solid var(--hl-card-border, rgba(255, 255, 255, 0.1))',
                borderRadius: '16px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: isCurrent
                    ? '0 12px 48px rgba(0, 0, 0, 0.5), 0 0 20px rgba(59, 130, 246, 0.2)'
                    : '0 8px 32px rgba(0, 0, 0, 0.3)',
                position: 'relative',
                overflow: 'hidden',
                cursor: isCurrent ? 'pointer' : 'default',
            }}
        >
            {/* Glossy Overlay */}
            <div style={{
                position: 'absolute',
                top: '-50%',
                left: '-50%',
                width: '200%',
                height: '200%',
                background: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.05) 0%, transparent 60%)',
                pointerEvents: 'none'
            }} />

            {isHidden ? (
                <div style={{
                    fontSize: '2.5rem',
                    color: 'var(--hl-card-hidden-text, rgba(255, 255, 255, 0.4))',
                    fontWeight: 700,
                    fontFamily: 'var(--font-heading)',
                    textShadow: '0 2px 4px rgba(0,0,0,0.2)'
                }}>
                    ?
                </div>
            ) : (
                <>
                    <motion.span
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{
                            fontSize: '3rem',
                            fontWeight: 800,
                            color: getSuitColor(card.suit),
                            fontFamily: 'var(--font-heading)',
                            textShadow: `0 0 15px ${getSuitColor(card.suit)}44`,
                            lineHeight: 1,
                        }}
                    >
                        {getRankDisplay(card.rank)}
                    </motion.span>
                    <motion.span
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 }}
                        style={{
                            fontSize: '2.25rem',
                            color: getSuitColor(card.suit),
                            filter: 'drop-shadow(0 0 10px rgba(0,0,0,0.3))'
                        }}
                    >
                        {getSuitSymbol(card.suit)}
                    </motion.span>
                </>
            )}
        </motion.div>
    );
};

const LivesDisplay: React.FC<{ lives: number; label: string; isPlayer?: boolean }> = ({ lives, label, isPlayer = false }) => (
    <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.25rem',
    }}>
        <span style={{
            fontSize: '0.75rem',
            color: 'var(--text-secondary)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
        }}>
            {label}
        </span>
        <div style={{ display: 'flex', gap: '0.25rem' }}>
            {[1, 2, 3].map((i) => (
                <motion.span
                    key={i}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1, opacity: i <= lives ? 1 : 0.2 }}
                    transition={{ delay: i * 0.1 }}
                    style={{ fontSize: '1.25rem' }}
                >
                    ❤️
                </motion.span>
            ))}
        </div>
    </div>
);

const ScoreDisplay: React.FC<{ score: number; label: string; isPlayer?: boolean }> = ({ score, label, isPlayer = false }) => (
    <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.25rem',
    }}>
        <span style={{
            fontSize: '0.7rem',
            color: 'var(--text-secondary)',
            textTransform: 'uppercase',
            letterSpacing: '0.15em',
            fontWeight: 600,
        }}>
            {label}
        </span>
        <motion.div
            key={score}
            initial={{ y: 5, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            style={{
                fontSize: '1.75rem',
                fontWeight: 900,
                color: isPlayer ? 'var(--accent-blue)' : 'var(--text-primary)',
                fontFamily: 'var(--font-heading)',
                textShadow: isPlayer ? '0 0 15px rgba(59, 130, 246, 0.4)' : 'none',
            }}
        >
            {score}<span style={{ fontSize: '1rem', opacity: 0.5, marginLeft: '2px' }}>/5</span>
        </motion.div>
    </div>
);

// ============================================
// Main Component
// ============================================

const HigherLowerAnimation: React.FC<HigherLowerAnimationProps> = ({
    status,
    result,
    gameState,
    onPredict,
}) => {
    const {
        hlCurrentCard,
        hlNextCard,
        hlPlayerScore,
        hlOpponentScore,
        hlPlayerLives,
        hlOpponentLives,
        hlPhase,
        hlPlayerPrediction,
        hlTimeLeft,
        hlRound,
        countdownLeft,
    } = gameState;

    // Countdown overlay
    if (hlPhase === 'countdown') {
        return (
            <CountdownOverlay
                isActive={hlPhase === 'countdown'}
                countdownValue={Math.ceil(countdownLeft)}
                variant="default"
            />
        );
    }

    // Result screen
    if (status === 'result' && result) {
        const isWin = result.outcome === 'win';

        return (
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '1.5rem',
                    padding: '2rem',
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--text-muted)',
                    borderRadius: 'var(--radius-lg)',
                    boxShadow: isWin
                        ? '0 0 40px rgba(34, 197, 94, 0.2)'
                        : '0 0 40px rgba(239, 68, 68, 0.2)',
                    minWidth: '300px',
                }}
            >
                <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    style={{ fontSize: '3rem' }}
                >
                    {isWin ? '🏆' : '💀'}
                </motion.span>

                <h2 style={{
                    fontSize: '1.75rem',
                    fontWeight: 700,
                    color: isWin ? '#22c55e' : '#ef4444',
                    fontFamily: 'var(--font-heading)',
                    margin: 0,
                }}>
                    {isWin ? '¡VICTORIA!' : 'DERROTA'}
                </h2>

                <div style={{
                    display: 'flex',
                    justifyContent: 'space-around',
                    width: '100%',
                    padding: '1rem',
                    background: 'var(--bg-surface-hover)',
                    borderRadius: 'var(--radius-md)',
                }}>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Tu Puntuación</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--accent-blue)' }}>{result.playerScore}</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Oponente</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>{result.opponentScore}</div>
                    </div>
                </div>

                <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                    Rondas jugadas: {result.rounds}
                </div>
            </motion.div>
        );
    }

    // Gameplay UI
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '1.5rem',
                padding: '1rem',
                width: '100%',
                maxWidth: '400px',
            }}
        >
            {/* Header with round and timer */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                width: '100%',
                padding: '0.75rem 1.25rem',
                background: 'rgba(255, 255, 255, 0.02)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                borderRadius: '12px',
            }}>
                <span style={{
                    color: 'var(--text-secondary)',
                    fontSize: '0.85rem',
                    letterSpacing: '0.05em',
                    fontWeight: 500
                }}>
                    RONDA <span style={{ color: 'var(--text-primary)', fontWeight: 700 }}>{hlRound}</span>
                </span>
                <span style={{
                    color: hlTimeLeft <= 2 ? '#ef4444' : 'var(--accent-blue)',
                    fontWeight: 800,
                    fontFamily: 'var(--font-heading)',
                    fontSize: '1rem',
                }}>
                    {hlTimeLeft.toFixed(1)}s
                </span>
            </div>

            {/* Cards area */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '2rem',
                padding: '2rem',
                position: 'relative',
            }}>
                <CardDisplay card={hlCurrentCard} isCurrent />

                <motion.div
                    animate={{
                        x: [0, 8, 0],
                        opacity: [0.3, 0.8, 0.3]
                    }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
                    style={{
                        fontSize: '2rem',
                        color: 'var(--text-muted)',
                        fontWeight: 300
                    }}
                >
                    →
                </motion.div>

                <AnimatePresence mode="wait">
                    {(hlPhase === 'reveal' || hlPhase === 'revealed') && hlNextCard ? (
                        <CardDisplay key="revealed" card={hlNextCard} isRevealing />
                    ) : (
                        <CardDisplay key="hidden" card={hlNextCard} isHidden />
                    )}
                </AnimatePresence>
            </div>

            {/* Visual Feedback Indicator - Uses FeedbackPortal for guaranteed center */}
            <AnimatePresence>
                {hlPhase === 'revealed' && (
                    <FeedbackPortal>
                        <FeedbackIndicator
                            result={calculatePredictionResult(hlCurrentCard, hlNextCard, hlPlayerPrediction)}
                        />
                    </FeedbackPortal>
                )}
            </AnimatePresence>

            {/* Scoreboard */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-around',
                width: '100%',
                padding: '1.25rem',
                background: 'rgba(255, 255, 255, 0.02)',
                borderRadius: '16px',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                boxShadow: 'inset 0 0 20px rgba(0,0,0,0.2)'
            }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
                    <ScoreDisplay score={hlPlayerScore} label="TU" isPlayer />
                    <LivesDisplay lives={hlPlayerLives} label="" isPlayer />
                </div>
                <div style={{
                    width: '1px',
                    background: 'linear-gradient(to bottom, transparent, rgba(255,255,255,0.1), transparent)',
                    margin: '0 1rem',
                }} />
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
                    <ScoreDisplay score={hlOpponentScore} label="OPONENTE" />
                    <LivesDisplay lives={hlOpponentLives} label="" />
                </div>
            </div>

            {/* Prediction buttons */}
            <AnimatePresence>
                {hlPhase === 'waiting' && !hlPlayerPrediction && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        style={{
                            display: 'flex',
                            gap: '1rem',
                            width: '100%',
                        }}
                    >
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => onPredict('higher')}
                            style={{
                                flex: 1,
                                padding: '1rem',
                                background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                                border: 'none',
                                borderRadius: 'var(--radius-md)',
                                color: 'white',
                                fontSize: '1.25rem',
                                fontWeight: 700,
                                fontFamily: 'var(--font-sans)',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.5rem',
                            }}
                        >
                            ⬆️ HIGHER
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => onPredict('lower')}
                            style={{
                                flex: 1,
                                padding: '1rem',
                                background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                                border: 'none',
                                borderRadius: 'var(--radius-md)',
                                color: 'white',
                                fontSize: '1.25rem',
                                fontWeight: 700,
                                fontFamily: 'var(--font-sans)',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.5rem',
                            }}
                        >
                            ⬇️ LOWER
                        </motion.button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Prediction made indicator */}
            {hlPlayerPrediction && hlPhase === 'reveal' && (
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    style={{
                        padding: '0.75rem 1.5rem',
                        background: hlPlayerPrediction === 'higher' ? '#22c55e' : '#ef4444',
                        borderRadius: 'var(--radius-md)',
                        color: 'white',
                        fontWeight: 700,
                    }}
                >
                    {hlPlayerPrediction === 'higher' ? '⬆️ HIGHER' : '⬇️ LOWER'}
                </motion.div>
            )}
        </motion.div>
    );
};

export default HigherLowerAnimation;
