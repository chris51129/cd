/**
 * App - Main application component with Error Boundary and routing
 */
import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Navbar, Footer } from './components/layout';
import ErrorBoundary from './components/ui/ErrorBoundary';
import { EtherLoader } from './components/ui';
import StreakManager from './components/game/StreakManager';
import ScrollToTop from './components/layout/ScrollToTop';

// Lazy loaded pages
const Home = lazy(() => import('./pages/Home'));
const GamePage = lazy(() => import('./pages/GamePage'));
const TransparencyPage = lazy(() => import('./pages/TransparencyPage'));
const LegalNotice = lazy(() => import('./pages/LegalNotice'));
const TermsOfUsage = lazy(() => import('./pages/TermsOfUsage'));
const ChainlinkVRF = lazy(() => import('./pages/ChainlinkVRF'));
const NotFound = lazy(() => import('./pages/NotFound'));

import { SafetyProvider } from './context/SafetyContext';
import { SoundProvider } from './context/SoundContext';
import { ThemeProvider } from './context/ThemeContext';

const App: React.FC = () => {
    return (
        <ThemeProvider>
            <ErrorBoundary>
                <div className="app-container">
                    <SoundProvider>
                        <SafetyProvider>
                            <ScrollToTop />
                            <Navbar />
                            <main id="main-content" style={{ minHeight: 'calc(100vh - 80px)' }}>
                                <Suspense fallback={<div className="flex-center" style={{ height: '80vh' }}><EtherLoader text="Cargando arena..." /></div>}>
                                    <Routes>
                                        <Route path="/" element={<Home />} />
                                        <Route path="/game/:id" element={<GamePage />} />
                                        <Route path="/transparencia" element={<TransparencyPage />} />
                                        <Route path="/aviso-legal" element={<LegalNotice />} />
                                        <Route path="/terminos" element={<TermsOfUsage />} />
                                        <Route path="/chainlink-vrf" element={<ChainlinkVRF />} />
                                        <Route path="*" element={<NotFound />} />
                                    </Routes>
                                </Suspense>
                            </main>
                            <Footer />
                            <StreakManager />
                        </SafetyProvider>
                    </SoundProvider>
                </div>
            </ErrorBoundary>
        </ThemeProvider>
    );
};

export default App;
