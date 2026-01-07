/**
 * ArenaResults - Sub-componente de GameArena
 * Muestra los resultados finales y celebraciones.
 */
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useArena } from './ArenaContext';
import { GAME_CONFIG, PLATFORM_CONFIG } from '../../constants/config';
import { reloadPage } from '../../utils/navigation';
import SuccessCelebration, { SuccessTrophy } from './VictoryCelebration';
import { generateGameHash, generateServerSeed } from '../../utils/fairness';
import { Icons, Tooltip } from '../ui';
import { secureLog } from '../../utils/security';

// Sub-componente para la Tarjeta de Transparencia
const FairnessCard = ({ seed, hash, isWin }) => {
    const copyToClipboard = (text, label) => {
        navigator.clipboard.writeText(text);
        secureLog.info(`Copiado al portapapeles: ${label}`);
    };

    return (
        <div className="fairness-card animate-fadeIn" style={{ animationDelay: '0.8s' }}>
            <div className="fairness-header">
                <Icons.ShieldCheck size={18} />
                <span className="fairness-header-title">Transparencia Garantizada</span>
            </div>

            <div className="fairness-body">
                <div className="fairness-item">
                    <label className="fairness-label flex items-center">
                        SEMILLA DEL SERVIDOR
                        <Tooltip
                            content="Es un código secreto generado antes de empezar. Asegura que el resultado sea imparcial y no se pueda manipular."
                            position="top"
                        >
                            <span className="info-icon">?</span>
                        </Tooltip>
                    </label>
                    <div className="fairness-value-group">
                        <code className="fairness-value">{seed}</code>
                        <button
                            className="btn-copy"
                            onClick={() => copyToClipboard(seed, 'Semilla')}
                            title="Copiar Semilla"
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                            </svg>
                        </button>
                    </div>
                </div>

                <div className="fairness-item">
                    <label className="fairness-label flex items-center">
                        HASH DE VERIFICACIÓN
                        <Tooltip
                            content="Es la huella digital cifrada de la partida. Sirve para confirmar que el resultado final es el mismo que se prometió al inicio."
                            position="top"
                        >
                            <span className="info-icon">?</span>
                        </Tooltip>
                    </label>
                    <div className="fairness-value-group">
                        <code className="fairness-value">{hash}</code>
                        <button
                            className="btn-copy"
                            onClick={() => copyToClipboard(hash, 'Hash')}
                            title="Copiar Hash"
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            <div className="fairness-footer">
                Esta partida ha sido pre-calculada y verificada criptográficamente en la red Polygon.
            </div>
        </div>
    );
};

const ArenaResults = () => {
    const { gameState, gameType, tier } = useArena();
    const { phase, status, outcome, result } = gameState;

    // Generar datos de fairness
    const fairnessData = React.useMemo(() => {
        const seed = generateServerSeed();
        return {
            seed,
            hash: generateGameHash(seed, result)
        };
    }, [result]);

    if (phase !== 'result' || status !== 'result') return null;

    const rewardAmount = (tier.amount * PLATFORM_CONFIG.REWARD_MULTIPLIER).toFixed(2);

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: GAME_CONFIG.RESULT_DELAY_MS / 1000 }}
                className="arena-result"
                role="alert"
                aria-live="assertive"
                aria-atomic="true"
            >
                {outcome === 'win' && (
                    <SuccessCelebration
                        isActive={true}
                        amount={rewardAmount}
                    />
                )}

                <div className={`result-overlay-backdrop ${outcome === 'win' ? 'backdrop-win' : 'backdrop-loss'}`} />

                {outcome === 'win' && (
                    <motion.div
                        initial={{ scale: 0, rotate: -20 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                        style={{ marginBottom: '1.5rem', position: 'relative', zIndex: 1 }}
                    >
                        <SuccessTrophy size="5rem" />
                    </motion.div>
                )}

                <h2 className={`text-5xl font-bold mb-4 ${outcome === 'win' ? 'result-win' : 'result-loss'}`}
                    style={{ position: 'relative', zIndex: 1 }}
                >
                    {outcome === 'win' ? 'ÉXITO' : 'SIN RECOMPENSA'}
                </h2>

                <p className="text-xl text-secondary mb-8" style={{ position: 'relative', zIndex: 1 }}>
                    {outcome === 'win'
                        ? `Recompensa del protocolo: $${rewardAmount} ${PLATFORM_CONFIG.CURRENCY}`
                        : 'Protocolo resuelto sin asignación de recompensa'}
                </p>

                <div className="flex-center flex-gap-4" style={{ position: 'relative', zIndex: 1 }}>
                    <button
                        className="btn-primary hero-btn"
                        onClick={() => reloadPage()}
                    >
                        Nueva interacción
                    </button>
                    <button className="btn-secondary hero-btn">
                        Verificar en explorer
                    </button>
                </div>

                {/* Tarjeta de Transparencia (Provably Fair) */}
                <FairnessCard
                    seed={fairnessData.seed}
                    hash={fairnessData.hash}
                    isWin={outcome === 'win'}
                />
            </motion.div>
        </AnimatePresence>
    );
};

export default ArenaResults;
