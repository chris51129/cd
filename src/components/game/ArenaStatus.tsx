/**
 * ArenaStatus - Sub-componente de GameArena
 */
import React from 'react';
import { motion } from 'framer-motion';
import { useArena } from './ArenaContext';
import { EtherLoader } from '../ui';

const ArenaStatus = () => {
    const { gameState, gameType } = useArena();
    const { status, outcome } = gameState;

    const renderRoundResult = () => {
        if (gameType !== 'rps' || status !== 'round_result') return null;
        return (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center" style={{ zIndex: 20 }}>
                <motion.h2
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-4xl font-bold mb-2 uppercase"
                    style={{
                        color: outcome === 'win' ? '#4ADE80' : outcome === 'loss' ? '#F87171' : '#FCD34D',
                        textShadow: '0 0 20px rgba(0,0,0,0.5)'
                    }}
                >
                    {outcome === 'win' ? '¡GANASTE RONDA!' : outcome === 'loss' ? 'RONDA PERDIDA' : 'EMPATE'}
                </motion.h2>
            </div>
        );
    };

    const renderLoader = () => {
        if (status !== 'spin') return null;
        return (
            <div className="arena-status-container mt-8">
                <EtherLoader
                    message={
                        gameType === 'coinflip' ? "LANZANDO MONEDA..." :
                            gameType === 'dice' ? "PROCESANDO DADOS..." :
                                gameType === 'rps' ? "CALCULANDO JUGADA..." :
                                    "CUIDADO CON EL RIVAL..."
                    }
                />
            </div>
        );
    };

    return (
        <>
            {renderRoundResult()}
            {renderLoader()}
        </>
    );
};

export default ArenaStatus;
