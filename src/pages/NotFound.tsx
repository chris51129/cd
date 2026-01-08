/**
 * NotFound - 404 Page for invalid routes
 */
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const NotFound = () => {
    return (
        <div className="not-found-container" style={{
            minHeight: '80vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: '2rem'
        }}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div style={{ fontSize: '6rem', marginBottom: '1rem' }}>🎲</div>
                <h1 className="text-gradient" style={{ fontSize: '4rem', marginBottom: '1rem' }}>
                    404
                </h1>
                <h2 style={{
                    fontSize: '1.5rem',
                    color: 'var(--text-secondary)',
                    marginBottom: '1rem'
                }}>
                    Página no encontrada
                </h2>
                <p style={{
                    color: 'var(--text-secondary)',
                    marginBottom: '2rem',
                    maxWidth: '400px'
                }}>
                    La página que buscas no existe o ha sido movida.
                </p>

                <Link to="/">
                    <button className="btn-primary" style={{ padding: '1rem 2rem' }}>
                        Volver al Inicio
                    </button>
                </Link>
            </motion.div>
        </div>
    );
};

export default NotFound;
