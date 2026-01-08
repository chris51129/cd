/**
 * Footer - Main footer component
 * 
 * Ley de Jakob: Usar patrones familiares que los usuarios ya conocen.
 * Incluye: Logo, enlaces legales, redes sociales, contratos verificados.
 */
import { useNavigate, useLocation } from 'react-router-dom';
import { useSafety } from '../../context/SafetyContext';

// Iconos de redes sociales (inline SVG para evitar dependencias)
const TwitterIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
);

const DiscordIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
    </svg>
);

const TelegramIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
    </svg>
);

const PolygonIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.405 14.044c-.396-.231-.895-.231-1.348 0l-3.152 1.792-2.126 1.213-3.152 1.792c-.396.23-.895.23-1.348 0l-2.475-1.445c-.396-.23-.66-.635-.66-1.097v-2.775c0-.462.264-.867.66-1.098l2.475-1.387c.396-.23.895-.23 1.348 0l2.475 1.387c.396.231.66.636.66 1.098v1.792l2.126-1.213v-1.85c0-.461-.264-.867-.66-1.097l-4.543-2.6c-.396-.231-.895-.231-1.348 0l-4.658 2.6c-.396.23-.66.636-.66 1.097v5.258c0 .462.264.867.66 1.098l4.6 2.6c.396.23.895.23 1.348 0l3.152-1.734 2.126-1.213 3.152-1.734c.396-.231.895-.231 1.348 0l2.475 1.387c.396.23.66.636.66 1.098v2.774c0 .462-.264.867-.66 1.098l-2.418 1.387c-.396.23-.895.23-1.348 0l-2.475-1.387c-.396-.23-.66-.636-.66-1.098v-1.734l-2.126 1.213v1.792c0 .462.264.867.66 1.098l4.6 2.6c.396.23.895.23 1.348 0l4.6-2.6c.396-.231.66-.636.66-1.098v-5.258c0-.462-.264-.867-.66-1.098l-4.658-2.658z" />
    </svg>
);

const Footer = () => {
    const { handleSafeNavigation } = useSafety();
    const navigate = useNavigate();
    const location = useLocation();

    // BULLETPROOF: Programmatic smooth scroll logic (matching Navbar/Hero)
    const easeInOutCubic = (t: number): number => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;

    const performSmoothScroll = (targetY: number, duration: number = 1000): void => {
        const startY = window.scrollY;
        const distance = targetY - startY;
        let start: number | null = null;

        const step = (timestamp: number): void => {
            if (!start) start = timestamp;
            const progress = timestamp - start;
            const percentage = Math.min(progress / duration, 1);
            window.scrollTo(0, startY + (distance * easeInOutCubic(percentage)));
            if (progress < duration) window.requestAnimationFrame(step);
        };
        window.requestAnimationFrame(step);
    };

    const goHomeTop = () => {
        if (location.pathname === '/') {
            performSmoothScroll(0, 1000);
        } else {
            navigate('/');
            setTimeout(() => performSmoothScroll(0, 1000), 100);
        }
    };

    const goGamesSection = () => {
        const navigateAndScroll = () => {
            const element = document.querySelector('.games-header');
            if (element) {
                const elementRect = element.getBoundingClientRect();
                const targetY = elementRect.top + window.scrollY - 110;
                performSmoothScroll(targetY, 1200);
            }
        };

        if (location.pathname === '/') {
            navigateAndScroll();
        } else {
            navigate('/');
            setTimeout(navigateAndScroll, 150);
        }
    };

    const goLink = (url: string): void => {
        if (url === '/') {
            handleSafeNavigation(goHomeTop);
            return;
        }
        if (url === '#games') {
            handleSafeNavigation(goGamesSection);
            return;
        }

        if (url.startsWith('#')) {
            if (location.pathname !== '/') {
                navigate('/');
                setTimeout(() => {
                    window.location.hash = url;
                }, 100);
            } else {
                window.location.hash = url;
            }
        } else {
            window.open(url, '_blank', 'noopener,noreferrer');
        }
    };

    return (
        <footer className="footer">
            <div className="footer-content">
                {/* Logo y descripción */}
                <div className="footer-brand">
                    <div className="footer-logo">
                        <span className="text-gradient" style={{ fontSize: 'var(--text-lg)', fontWeight: 700 }}>
                            CryptoDuels
                        </span>
                    </div>
                    <p className="footer-tagline">
                        Duelos P2P descentralizados en Polygon
                    </p>
                </div>

                {/* Links principales */}
                <div className="footer-nav">
                    <div className="footer-nav-group">
                        <h4 className="footer-nav-title">Plataforma</h4>
                        <span onClick={() => goLink('/')} className="footer-link" style={{ cursor: 'pointer' }}>Inicio</span>
                        <span onClick={() => goLink('#games')} className="footer-link" style={{ cursor: 'pointer' }}>Módulos</span>
                        <span className="footer-link footer-link-disabled">Ranking (Próximamente)</span>
                    </div>

                    <div className="footer-nav-group">
                        <h4 className="footer-nav-title">Legal</h4>
                        <span onClick={() => handleSafeNavigation(() => { navigate('/terminos'); window.scrollTo(0, 0); })} className="footer-link" style={{ cursor: 'pointer' }}>
                            Términos de Uso
                        </span>
                        <span onClick={() => handleSafeNavigation(() => { navigate('/aviso-legal'); window.scrollTo(0, 0); })} className="footer-link" style={{ cursor: 'pointer' }}>
                            Aviso Legal
                        </span>
                        <span onClick={() => handleSafeNavigation(() => { navigate('/transparencia'); window.scrollTo(0, 0); })} className="footer-link" style={{ cursor: 'pointer' }}>
                            Uso Responsable
                        </span>
                    </div>

                    <div className="footer-nav-group">
                        <h4 className="footer-nav-title">Transparencia</h4>
                        <span onClick={() => handleSafeNavigation(() => {
                            navigate('/transparencia');
                            window.scrollTo(0, 0);
                        })} className="footer-link" style={{ cursor: 'pointer' }}>
                            <PolygonIcon /> Integridad del Sistema
                        </span>
                        <span onClick={() => handleSafeNavigation(() => {
                            navigate('/transparencia');
                            window.scrollTo(0, 0);
                        })} className="footer-link" style={{ cursor: 'pointer' }}>
                            Auditoría de Seguridad
                        </span>
                        <span onClick={() => handleSafeNavigation(() => {
                            navigate('/chainlink-vrf');
                            window.scrollTo(0, 0);
                        })} className="footer-link" style={{ cursor: 'pointer' }}>
                            Chainlink VRF (Probabilidad)
                        </span>
                    </div>
                </div>

                {/* Redes sociales */}
                <div className="footer-social">
                    <h4 className="footer-nav-title">Comunidad</h4>
                    <div className="footer-social-icons">
                        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="footer-social-link" aria-label="Twitter">
                            <TwitterIcon />
                        </a>
                        <a href="https://discord.com" target="_blank" rel="noopener noreferrer" className="footer-social-link" aria-label="Discord">
                            <DiscordIcon />
                        </a>
                        <a href="https://telegram.org" target="_blank" rel="noopener noreferrer" className="footer-social-link" aria-label="Telegram">
                            <TelegramIcon />
                        </a>
                    </div>
                </div>
            </div>

            {/* Copyright */}
            <div className="footer-bottom">
                <div className="copyright">
                    © {new Date().getFullYear()} CryptoDuels. Todos los derechos reservados.
                </div>
                <div className="footer-disclaimer">
                    Construido en Polygon • Verificado por Chainlink VRF
                </div>
            </div>
        </footer>
    );
};

export default Footer;
