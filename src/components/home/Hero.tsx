/**
 * Hero - Main hero section for home page
 */
import { motion, useScroll, useTransform } from 'framer-motion';


const NoiseOverlay = () => (
    <div className="noise-overlay"></div>
);

const ScrollIndicator = () => (
    <motion.div
        className="scroll-indicator"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity, delay: 1 }}
    >
        <div className="mouse-icon">
            <div className="wheel"></div>
        </div>
        <span className="scroll-text">DESLIZA</span>
    </motion.div>
);

const Hero = () => {
    const { scrollY } = useScroll();
    const y = useTransform(scrollY, [0, 500], [0, 100]);
    const opacity = useTransform(scrollY, [0, 300], [1, 0]);

    return (
        <section className="hero-section">
            <NoiseOverlay />
            <div className="ambient-light blue"></div>
            <div className="ambient-light gold"></div>

            <motion.div style={{ y, opacity }} className="hero-content">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="hero-badge"
                >
                    PROTOCOLOS DE COMPETICIÓN P2P
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                    className="hero-title text-gradient"
                >
                    Confía en el Código.<br />
                    Domina mediante tu Habilidad.
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                    className="hero-subtitle"
                    style={{ marginBottom: 'var(--spacing-md)' }}
                >
                    Una arena descentralizada de ejecución determinista.
                    Justicia verificable, resultados criptográficos, cero custodia.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
                    className="hero-actions"
                >
                    <button
                        className="btn-primary hero-btn"
                        onClick={() => {
                            const element = document.querySelector('.games-header');
                            if (!element) return;

                            const startY = window.scrollY;
                            const elementRect = element.getBoundingClientRect();
                            // Target the header specifically and account for navbar (approx 110px)
                            const targetY = elementRect.top + startY - 110;
                            const distance = targetY - startY;
                            const duration = 1200;
                            let start: number | null = null;

                            const easeInOutCubic = (t: number): number => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;

                            const step = (timestamp: number): void => {
                                if (!start) start = timestamp;
                                const progress = timestamp - start;
                                const percentage = Math.min(progress / duration, 1);

                                window.scrollTo(0, startY + (distance * easeInOutCubic(percentage)));

                                if (progress < duration) {
                                    window.requestAnimationFrame(step);
                                }
                            };

                            window.requestAnimationFrame(step);
                        }}
                    >
                        Entrar a la Arena
                    </button>
                    <button className="btn-secondary hero-btn">
                        Ver Contratos
                    </button>
                </motion.div>
            </motion.div>
            <ScrollIndicator />
        </section>
    );
};

export default Hero;
