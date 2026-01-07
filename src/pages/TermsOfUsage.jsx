import React from 'react';
import { motion } from 'framer-motion';

/**
 * TermsOfUsage - Condiciones de Uso del Protocolo (Spanish)
 */
const TermsOfUsage = () => {
    return (
        <div className="transparency-container" style={{ paddingBottom: '5rem' }}>
            <motion.header
                className="transparency-hero"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <div className="text-secondary tracking-widest text-xs uppercase mb-4 font-bold">P2P Protocol Terms</div>
                <h1 className="text-gradient">Términos de Uso</h1>
                <p>Reglas de interacción y compromiso con el protocolo descentralizado.</p>
            </motion.header>

            <motion.div
                className="max-w-4xl mx-auto px-6 space-y-12 text-gray-300 leading-relaxed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                style={{ maxWidth: '800px', margin: '0 auto' }}
            >
                <section>
                    <h2 className="text-2xl font-bold text-white mb-4">1. Aceptación de Términos</h2>
                    <p>
                        Al conectar su wallet y firmar transacciones mediante esta interfaz, el usuario declara haber comprendido la naturaleza técnica de CryptoDuels y acepta quedar vinculado por las presentes condiciones de uso del protocolo.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-white mb-4">2. Naturaleza de la Competición</h2>
                    <p>
                        Las interacciones facilitadas por el protocolo se basan en la <strong>competición de habilidades cognitivas, reflejos y estrategia</strong>, así como en el uso de entropía verificable on-chain. Usted reconoce que el resultado de las interacciones depende del cumplimiento de parámetros técnicos y de su propio desempeño comparativo con otros participantes ("Duelos P2P").
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-white mb-4">3. Compromiso de Entrada y Distribución</h2>
                    <p>
                        El "Compromiso de Entrada" (Entry Commitment) se deposita voluntariamente en una pool de ejecución gestionada por un Smart Contract. El protocolo distribuirá el pool resultante al participante que cumpla la condición de éxito definida por el algoritmo, una vez deducida la comisión técnica de mantenimiento (Protocol Fee). No existen "apuestas contra la casa".
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-white mb-4">4. Restricción de Edad y Jurisdicción</h2>
                    <p>
                        El uso de esta interfaz está restringido a personas mayores de 18 años con capacidad legal plena. Es responsabilidad exclusiva del usuario asegurarse de que el uso de protocolos DeFi y la posesión de criptoactivos son legales en su jurisdicción de residencia.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-white mb-4">5. Inexistencia de Asesoramiento</h2>
                    <p>
                        Nada de lo contenido en esta web constituye asesoramiento financiero, legal o de inversión. La participación en pools de liquidez o interacción con Smart Contracts conlleva el riesgo de pérdida parcial o total de los activos debido a fallos técnicos, ataques externos o congestión de la red.
                    </p>
                </section>
            </motion.div>
        </div>
    );
};

export default TermsOfUsage;
