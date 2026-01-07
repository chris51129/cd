import React from 'react';
import { motion } from 'framer-motion';

/**
 * LegalNotice - Aviso Legal (Spanish Law Compliance)
 */
const LegalNotice = () => {
    return (
        <div className="transparency-container" style={{ paddingBottom: '5rem' }}>
            <motion.header
                className="transparency-hero"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <div className="text-secondary tracking-widest text-xs uppercase mb-4 font-bold">Información Legal</div>
                <h1 className="text-gradient">Aviso Legal</h1>
                <p>Cumplimiento normativo y marco jurídico del protocolo.</p>
            </motion.header>

            <motion.div
                className="max-w-4xl mx-auto px-6 space-y-12 text-gray-300 leading-relaxed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                style={{ maxWidth: '800px', margin: '0 auto' }}
            >
                <section>
                    <h2 className="text-2xl font-bold text-white mb-4">1. Naturaleza del Servicio</h2>
                    <p>
                        CryptoDuels (en adelante, "la Plataforma") constituye una interfaz de usuario técnica que facilita la interacción con protocolos descentralizados en la red blockchain Polygon. La Plataforma no es un operador de juegos de azar, casino, ni entidad financiera. Se define estrictamente como un <strong>proveedor de soluciones tecnológicas y arquitecturas P2P (Peer-to-Peer)</strong>.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-white mb-4">2. Identificación</h2>
                    <p>
                        En cumplimiento con la Ley 34/2002, de 11 de julio, de servicios de la sociedad de la información y de comercio electrónico (LSSI-CE), se informa que la presente interfaz es operada de forma descentralizada. Para comunicaciones técnicas, los usuarios pueden dirigirse a los canales oficiales del protocolo establecidos en el repositorio oficial y redes sociales.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-white mb-4">3. Exención de Responsabilidad</h2>
                    <p>
                        La ejecución de las interacciones se realiza de forma autónoma mediante Smart Contracts inmutables. La Plataforma no tiene custodia de los activos de los usuarios en ningún momento. El uso del protocolo conlleva riesgos inherentes a la tecnología blockchain y a la volatilidad de los criptoactivos, los cuales el usuario asume íntegramente al interactuar con la interfaz.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-white mb-4">4. Propiedad Intelectual</h2>
                    <p>
                        Todos los algoritmos, interfaces visuales, nombres y códigos fuente son propiedad del protocolo o se rigen bajo licencias de software libre/código abierto. Queda prohibida la reproducción total o parcial con fines comerciales fuera de los mecanismos previstos por el propio protocolo descentralizado.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-white mb-4">5. Ley Aplicable y Jurisdicción</h2>
                    <p>
                        Para cualquier controversia relacionada con el uso de la interfaz, las partes se someten a la legislación española, salvo que la normativa de protección de consumidores y usuarios establezca lo contrario.
                    </p>
                </section>
            </motion.div>
        </div>
    );
};

export default LegalNotice;
