/**
 * ErrorBoundary - Catches JavaScript errors in child components
 * Displays a fallback UI instead of crashing the whole app
 */
import React from 'react';
import { reloadPage, navigateTo } from '../../utils/navigation';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        // Update state so the next render shows the fallback UI
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        // Log the error to console (could send to monitoring service)
        console.error('ErrorBoundary caught an error:', error, errorInfo);
        this.setState({ error, errorInfo });
    }

    handleReload = () => {
        reloadPage();
    };

    handleGoHome = () => {
        navigateTo('/');
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="error-boundary-container" style={{
                    minHeight: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'var(--bg-deep, #020408)',
                    color: 'var(--text-primary, #F5F5F7)',
                    padding: '2rem',
                    textAlign: 'center'
                }}>
                    <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>⚠️</div>
                    <h1 style={{
                        fontSize: '2rem',
                        fontWeight: 'bold',
                        marginBottom: '1rem',
                        fontFamily: 'var(--font-heading, Manrope, sans-serif)'
                    }}>
                        Algo salió mal
                    </h1>
                    <p style={{
                        color: 'var(--text-secondary, #86868B)',
                        marginBottom: '2rem',
                        maxWidth: '400px'
                    }}>
                        Ha ocurrido un error inesperado. Nuestro equipo ha sido notificado.
                    </p>

                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button
                            onClick={this.handleReload}
                            className="btn-primary"
                            style={{ padding: '0.75rem 1.5rem' }}
                        >
                            Reintentar
                        </button>
                        <button
                            onClick={this.handleGoHome}
                            className="btn-secondary"
                            style={{ padding: '0.75rem 1.5rem' }}
                        >
                            Ir al Inicio
                        </button>
                    </div>

                    {/* Show error details in development */}
                    {process.env.NODE_ENV === 'development' && this.state.error && (
                        <details style={{
                            marginTop: '2rem',
                            padding: '1rem',
                            backgroundColor: 'rgba(239, 68, 68, 0.1)',
                            borderRadius: '0.5rem',
                            border: '1px solid rgba(239, 68, 68, 0.3)',
                            maxWidth: '600px',
                            textAlign: 'left'
                        }}>
                            <summary style={{ cursor: 'pointer', color: '#ef4444' }}>
                                Detalles del error (solo desarrollo)
                            </summary>
                            <pre style={{
                                marginTop: '1rem',
                                fontSize: '0.75rem',
                                overflow: 'auto',
                                whiteSpace: 'pre-wrap'
                            }}>
                                {this.state.error && this.state.error.toString()}
                                {this.state.errorInfo && this.state.errorInfo.componentStack}
                            </pre>
                        </details>
                    )}
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
