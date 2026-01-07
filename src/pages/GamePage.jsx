/**
 * GamePage - Main page for playing games
 * Handles game selection, waiting room, and game arena stages
 */
import React, { useState, useCallback, useEffect } from 'react';
import { useParams, Link, Navigate, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import { TierSelector, WaitingRoom, GameArena } from '../components/game';
import GameRules from '../components/game/GameRules';
import { getGameById, GAMES } from '../constants/games';
import ConfirmationModal from '../components/ui/ConfirmationModal';
import { createSecureActionProxy } from '../utils/securityProxy';
import { StepIndicator } from '../components/ui';
import { secureLog } from '../utils/security';
import { useSafety } from '../context/SafetyContext';

const GamePage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { handleSafeNavigation, setIsRisky, isRisky } = useSafety();
    const [gameStage, setGameStage] = useState('selection');
    const [selectedTier, setSelectedTier] = useState(null);

    // UX: Scroll to top when stage changes to keep focus on relevant content
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });

        // ACTUALIZACIÓN DINÁMICA DE SEGURIDAD
        // Solo es "arriesgado" si estamos esperando o jugando (comprobar isRisky para evitar loops)
        const shouldBeRisky = gameStage === 'playing' || gameStage === 'waiting';
        setIsRisky(shouldBeRisky);

        // Al desmontar, nos aseguramos de limpiar el estado de riesgo
        return () => setIsRisky(false);
    }, [gameStage, setIsRisky]);

    // Get game config from constants
    const gameConfig = getGameById(id);

    // Redirect to 404 if game doesn't exist
    if (!gameConfig) {
        return <Navigate to="/404" replace />;
    }

    const game = gameConfig;

    // Determinar el paso actual según el stage
    const getCurrentStep = () => {
        switch (gameStage) {
            case 'selection': return 1;
            case 'waiting': return 2;
            case 'playing':
            case 'result': return 3;
            default: return 1;
        }
    };

    const handleBackClick = (e) => {
        e.preventDefault();
        handleSafeNavigation(() => navigate('/'));
    };

    // Acción real de selección
    const baseTierSelect = (tier) => {
        setSelectedTier(tier);
        setGameStage('waiting');
    };

    // Proxified action (Patrón Proxy - Interceptación de seguridad)
    const handleTierSelect = useCallback(
        createSecureActionProxy(baseTierSelect, {
            minAmount: 0.1,
            requiredFields: ['amount', 'label']
        }),
        []
    );

    const handleCancelWait = () => {
        setSelectedTier(null);
        setGameStage('selection');
    };

    const handleMatchFound = () => {
        secureLog.info('Match found');
        setGameStage('playing');
    };

    const handleGameFinish = useCallback((result) => {
        secureLog.info('Game finished');
        setGameStage('result');
    }, []);

    return (
        <div className="game-page-container" style={{ paddingTop: '100px', minHeight: '80vh' }}>

            <div className="max-w-7xl" style={{ margin: '0 auto', padding: '0 2rem' }}>
                <div className="mb-8">
                    <Link
                        to="/"
                        className="text-secondary"
                        onClick={handleBackClick}
                    >
                        ← Volver al Inicio
                    </Link>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-panel"
                    style={{
                        padding: '3rem',
                        textAlign: 'center',
                        minHeight: '600px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '100%'
                    }}
                >
                    {/* Header only shown in selection/waiting */}
                    {gameStage !== 'playing' && gameStage !== 'result' && (
                        <>
                            {/* 📊 Ley de Hick: Indicador de progreso */}
                            <StepIndicator currentStep={getCurrentStep()} />

                            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>{game.icon}</div>
                            <h1 className="text-gradient" style={{ fontSize: '3rem', marginBottom: '1rem' }}>
                                {game.title}
                            </h1>
                        </>
                    )}

                    {gameStage === 'selection' && (
                        <>
                            <p className="text-secondary text-xl mb-4">
                                Selecciona tu nivel de compromiso
                            </p>
                            <GameRules rules={game.rules} />
                            <TierSelector onSelect={handleTierSelect} />
                        </>
                    )}

                    {gameStage === 'waiting' && selectedTier && (
                        <div className="w-full">
                            <WaitingRoom
                                tier={selectedTier}
                                onCancel={handleCancelWait}
                                onMatchFound={handleMatchFound}
                            />
                        </div>
                    )}

                    {(gameStage === 'playing' || gameStage === 'result') && selectedTier && (
                        <div className="w-full">
                            <GameArena
                                gameType={game.id}
                                tier={selectedTier}
                                onFinish={handleGameFinish}
                            />
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
};

export default GamePage;
