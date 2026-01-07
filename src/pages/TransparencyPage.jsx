import React from 'react';
import { motion } from 'framer-motion';
import { Icons } from '../components/ui/Icons';

/**
 * TransparencyPage - Hub informativo sobre la integridad y seguridad de la plataforma.
 */
const TransparencyPage = () => {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
        }
    };

    return (
        <div className="transparency-container">
            <motion.header
                className="transparency-hero"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
            >
                <div className="text-secondary tracking-widest text-xs uppercase mb-4 font-bold">Web3 Integrity</div>
                <h1 className="text-gradient">Compromiso con la Transparencia</h1>
                <p>En CryptoDuels, la confianza no es una promesa, es un algoritmo verificable en la blockchain.</p>
            </motion.header>

            <motion.div
                className="transparency-grid"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {/* Seed & Hash (Provably Fair) */}
                <motion.section className="transparency-section" variants={itemVariants}>
                    <div className="info-card">
                        <div className="info-card-header">
                            <div className="info-card-icon">
                                <Icons.ShieldCheck size={32} />
                            </div>
                            <div className="info-card-title">
                                <span>Algoritmo P2P</span>
                                <h2>Criptografía de Partida</h2>
                            </div>
                        </div>
                        <div className="info-card-content">
                            <p>
                                Utilizamos un sistema de <strong>Provably Fair</strong> (Imparcialidad Demostrable). Antes de cada duelo, el servidor genera una semilla secreta cuyo hash se te presenta al inicio.
                            </p>
                            <p>
                                Al finalizar, se revela la semilla. Si aplicas el mismo algoritmo a esa semilla y al resultado de la partida, obtendrás el hash original. Esto garantiza que el resultado no pudo ser alterado sobre la marcha.
                            </p>

                            <div className="fairness-diagram">
                                <div className="diagram-step">
                                    <span style={{ color: '#94a3b8' }}>Semilla Secreta</span>
                                    <span className="diagram-arrow">→</span>
                                    <span style={{ color: 'var(--accent-blue)' }}>Generación de Hash</span>
                                </div>
                                <div className="diagram-step">
                                    <span style={{ color: '#94a3b8' }}>Resultado de Interacción</span>
                                    <span className="diagram-arrow">+</span>
                                    <span style={{ color: '#94a3b8' }}>Semilla Revelada</span>
                                    <span className="diagram-arrow">=</span>
                                    <span style={{ color: '#4ade80' }}>Verificación OK</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.section>

                {/* Smart Contracts */}
                <motion.section className="transparency-section" variants={itemVariants}>
                    <div className="info-card">
                        <div className="info-card-header">
                            <div className="info-card-icon">
                                <Icons.CPU size={32} />
                            </div>
                            <div className="info-card-title">
                                <span>Autonomía Total</span>
                                <h2>Smart Contracts Verificados</h2>
                            </div>
                        </div>
                        <div className="info-card-content">
                            <p>
                                Toda la lógica de depósitos, gestión de pools y pagos directos se ejecuta a mediante contratos inteligentes en la red <strong>Polygon</strong>. No hay una entidad central que controle tus fondos.
                            </p>
                            <p>
                                El código es público y puede ser auditado por cualquier persona en PolygonScan. Las reglas de interacción están escritas en código inmutable: si se cumplen las condiciones de éxito, el contrato distribuye los activos automáticamente.
                            </p>

                            <div className="tech-highlights">
                                <div className="tech-pill">
                                    <Icons.Activity size={14} /> Red: <strong>Polygon POS</strong>
                                </div>
                                <div className="tech-pill">
                                    <Icons.Shield size={14} /> Estado: <strong>Verificado</strong>
                                </div>
                                <div className="tech-pill">
                                    <Icons.Zap size={14} /> Ejecución: <strong>Determinista</strong>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.section>

                {/* Randomness / VRF */}
                <motion.section className="transparency-section" variants={itemVariants}>
                    <div className="info-card">
                        <div className="info-card-header">
                            <div className="info-card-icon">
                                <Icons.Probability size={32} />
                            </div>
                            <div className="info-card-title">
                                <span>Probabilidad Algorítmica</span>
                                <h2>Entropía Verificable (VRF)</h2>
                            </div>
                        </div>
                        <div className="info-card-content">
                            <p>
                                Para módulos basados en probabilidad como Coinflip o Dados, utilizamos <strong>Chainlink VRF</strong> (Verifiable Random Function). Es el estándar de la industria para generar una fuente de entropía segura on-chain.
                            </p>
                            <p>
                                A diferencia de los generadores de números estándar que pueden ser predecibles, VRF genera una prueba criptográfica que demuestra que el resultado fue generado sin sesgos y no pudo ser manipulado por el servidor ni por terceros.
                            </p>
                        </div>
                    </div>
                </motion.section>

                {/* P2P / No Middleman */}
                <motion.section className="transparency-section" variants={itemVariants}>
                    <div className="info-card">
                        <div className="info-card-header">
                            <div className="info-card-icon">
                                <Icons.Coins size={32} />
                            </div>
                            <div className="info-card-title">
                                <span>Zero-Custody</span>
                                <h2>Sin Intermediarios (P2P)</h2>
                            </div>
                        </div>
                        <div className="info-card-content">
                            <p>
                                En CryptoDuels, compites contra otros humanos, no contra el sistema. Los activos se transfieren directamente de los participantes a la pool del duelo, y de ahí al usuario con mejor desempeño tras aplicar una sutil comisión de protocolo para el mantenimiento de la red.
                            </p>
                            <p>
                                Este modelo <strong>Peer-to-Peer</strong> asegura que los incentivos estén siempre alineados con la comunidad, eliminando los conflictos de interés presentes en sistemas centralizados.
                            </p>
                        </div>
                    </div>
                </motion.section>
            </motion.div>

            <motion.footer
                className="text-center mt-20"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
            >
                <p className="text-secondary text-sm italic">
                    "Don't trust, verify." — La máxima del ecosistema descentralizado.
                </p>
            </motion.footer>
        </div>
    );
};

export default TransparencyPage;
