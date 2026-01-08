import React from 'react';
import { motion } from 'framer-motion';
import './EtherLoader.css';

/**
 * Props for EtherLoader component
 */
interface EtherLoaderProps {
    /** Primary prop name */
    readonly message?: string;
    /** Alias for message - for backwards compatibility */
    readonly text?: string;
}

/**
 * EtherLoader - A premium particle-based loader.
 * Inspired by "data floating in the ether" aesthetic from Uiverse.io.
 */
const EtherLoader: React.FC<EtherLoaderProps> = ({ message, text }) => {
    // Support both 'text' and 'message' props (text is alias)
    const displayMessage = message ?? text ?? "VALIDANDO PROTOCOLO...";
    return (
        <div className="ether-loader-container">
            <div className="ether-core">
                {[...Array(8)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="ether-particle"
                        animate={{
                            scale: [1, 1.5, 1],
                            opacity: [0.3, 0.8, 0.3],
                            rotate: [0, 180, 360],
                            y: [0, -20, 0],
                            x: [0, (i % 2 === 0 ? 10 : -10), 0]
                        }}
                        transition={{
                            duration: 2 + i * 0.2,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    />
                ))}
                <div className="ether-center-glow"></div>
            </div>
            {displayMessage && (
                <motion.div
                    className="ether-message"
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                >
                    {displayMessage}
                </motion.div>
            )}
            <div className="ether-scanline"></div>
        </div>
    );
};

export default EtherLoader;
