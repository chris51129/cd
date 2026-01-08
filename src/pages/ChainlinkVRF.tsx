import { motion } from 'framer-motion';
import { Icons } from '../components/ui/Icons';
import '../styles/pages/transparency.css';
import '../styles/pages/chainlink_vrf.css';

/**
 * ChainlinkVRF - Página técnica sobre la generación de aleatoriedad verificable.
 */
const ChainlinkVRF = () => {
    const sectionVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
    };

    return (
        <div className="transparency-container" style={{ paddingBottom: '5rem' }}>
            <motion.header
                className="transparency-hero"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <div className="text-secondary tracking-widest text-xs uppercase mb-4 font-bold">Verifiable Randomness</div>
                <h1 className="text-gradient">Chainlink VRF</h1>
                <p>Garantizando la imparcialidad algorítmica mediante entropía on-chain de grado institucional.</p>
            </motion.header>

            <motion.div
                className="max-w-4xl mx-auto px-6 space-y-16"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
            >
                {/* Introducción */}
                <motion.section variants={sectionVariants}>
                    <div className="info-card p-8">
                        <div className="flex flex-col items-center text-center">
                            <h2 className="text-2xl font-bold text-white mb-6 flex items-center justify-center gap-3">
                                <Icons.ShieldCheck className="text-blue-400" /> ¿Qué es Chainlink VRF?
                            </h2>
                            <div className="space-y-4 text-gray-300">
                                <p>
                                    <strong>VRF (Verifiable Random Function)</strong> es una fuente de aleatoriedad segura técnicamente y verificable criptográficamente. En CryptoDuels, utilizamos la versión v2.5 de Chainlink para asegurar que los resultados de los módulos de probabilidad (como Coinflip o Dados) sean imposibles de predecir o manipular.
                                </p>
                                <p>
                                    A diferencia de los generadores de números estándar en servidores centralizados, que pueden ser sesgados por el operador, Chainlink VRF genera un número aleatorio junto con una <strong>prueba criptográfica</strong> que se valida on-chain antes de que el contrato inteligente acepte el resultado.
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.section>

                {/* Diagrama de Flujo Vertical */}
                <motion.section variants={sectionVariants}>
                    <h2 className="text-xl font-bold text-white mb-10 text-center uppercase tracking-widest">El Ciclo de Verificación</h2>
                    <div className="vrf-flow-diagram">
                        {/* Paso 1 */}
                        <div className="vrf-step-card">
                            <div className="step-number">01</div>
                            <Icons.Activity className="mb-4 text-blue-400" size={32} />
                            <h3>Solicitud P2P</h3>
                            <p>El Smart Contract solicita entropía al iniciar la interacción mediante una llamada al coordinador.</p>
                        </div>

                        <div className="vrf-arrow-v">↓</div>

                        {/* Paso 2 */}
                        <div className="vrf-step-card">
                            <div className="step-number">02</div>
                            <Icons.CPU className="mb-4 text-purple-400" size={32} />
                            <h3>Oráculo Chainlink</h3>
                            <p>Los nodos off-chain de Chainlink generan el número aleatorio y su prueba de integridad.</p>
                        </div>

                        <div className="vrf-arrow-v">↓</div>

                        {/* Paso 3 */}
                        <div className="vrf-step-card border-accent">
                            <div className="step-number">03</div>
                            <Icons.ShieldCheck className="mb-4 text-green-400" size={32} />
                            <h3>Validación On-Chain</h3>
                            <p>El Coordinador VRF verifica la prueba en Polygon y entrega el resultado final al contrato inteligente.</p>
                        </div>
                    </div>
                </motion.section>

                {/* Especificaciones Técnicas */}
                <motion.section variants={sectionVariants}>
                    <div className="tech-spec-grid">
                        <div className="tech-spec-item">
                            <span className="spec-label">Network</span>
                            <span className="spec-value">Polygon POS Mainnet</span>
                        </div>
                        <div className="tech-spec-item">
                            <span className="spec-label">VRF Version</span>
                            <span className="spec-value">v2.5 High Stability</span>
                        </div>
                        <div className="tech-spec-item">
                            <span className="spec-label">Coordinator</span>
                            <code className="spec-value text-xs">0x3d2341780b1393d1d3211f32a...</code>
                        </div>
                        <div className="tech-spec-item">
                            <span className="spec-label">Confirmations</span>
                            <span className="spec-value">3 Blocks (Protección Reorg)</span>
                        </div>
                    </div>
                </motion.section>

                {/* Beneficios para el Usuario */}
                <motion.section variants={sectionVariants} className="bg-blue-500/5 p-8 rounded-2xl border border-blue-500/20">
                    <h2 className="text-xl font-bold text-white mb-6 text-center">Integridad Garantizada</h2>
                    <div className="max-w-2xl mx-auto space-y-4 text-gray-400">
                        <div className="flex items-start gap-3">
                            <span className="text-blue-400 mt-1">✓</span>
                            <span><strong>No Predictible:</strong> Ni siquiera los nodos de Chainlink pueden conocer el resultado antes de que se publique.</span>
                        </div>
                        <div className="flex items-start gap-3">
                            <span className="text-blue-400 mt-1">✓</span>
                            <span><strong>No Manipulable:</strong> El resultado no existe hasta que se genera la prueba combinada con el bloque actual de la blockchain.</span>
                        </div>
                        <div className="flex items-start gap-3">
                            <span className="text-blue-400 mt-1">✓</span>
                            <span><strong>Verificable:</strong> Cualquier usuario puede auditar la transacción en PolygonScan para ver la prueba VRF generada.</span>
                        </div>
                    </div>
                </motion.section>
            </motion.div>
        </div>
    );
};

export default ChainlinkVRF;
