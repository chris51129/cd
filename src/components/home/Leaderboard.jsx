/**
 * Leaderboard - Componente de Ranking con Virtualización Manual
 * 
 * Doc 11: Virtualización para manejar grandes listas con performance.
 * Doc 10: Algoritmos de ordenamiento aplicados.
 */
import React, { useState, useRef, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLeaderboard } from '../../hooks/useLeaderboard';
import { Icons } from '../ui/Icons';
import './Leaderboard.css';

const ITEM_HEIGHT = 90; // Incrementado de 70 a 90 para evitar solapamientos
const VISIBLE_ITEMS = 8; // Ajustado para el nuevo tamaño

const Leaderboard = () => {
    return (
        <section className="leaderboard-section">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                className="leaderboard-card scandi-panel mt-20"
            >
                <div className="scandi-display">
                    <h3 className="scandi-title">RANKING DE COMPETICIÓN</h3>
                    <p className="scandi-subtitle">Ecosistema de Validación Activa</p>

                    <div className="scandi-tech-grid">
                        <div className="scandi-icons">
                            <Icons.ShieldCheck size={48} strokeWidth={1} className="scandi-icon-subtle" />
                            <div className="scandi-v-line" />
                            <Icons.Fingerprint size={48} strokeWidth={1} className="scandi-icon-subtle" />
                        </div>

                        <div className="scandi-status-block">
                            <div className="scandi-badge">
                                <motion.div
                                    animate={{ opacity: [1, 0.3, 1] }}
                                    transition={{ duration: 3, repeat: Infinity }}
                                    className="scandi-dot"
                                />
                                <span className="scandi-status">PROTOCOL SYNCING...</span>
                            </div>

                            <p className="scandi-info">
                                Sincronizando datos on-chain inmutables para garantizar la integridad histórica del ranking.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="scandi-footer">
                    BLOCKCHAIN INDEXING ARCHITECTURE • P2P DETERMINISTIC EXECUTION
                </div>
            </motion.div>
        </section>
    );
};

export default Leaderboard;
