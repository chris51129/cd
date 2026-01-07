/**
 * GameArena - Componente principal de la arena de juego
 * Implementa el patró³n Compound Components para una arquitectura senior y desacoplada.
 */
import React from 'react';

import ArenaContext from './ArenaContext';
import ArenaHeader from './ArenaHeader';
import ArenaBoard from './ArenaBoard';
import ArenaResults from './ArenaResults';
import ArenaStatus from './ArenaStatus';
import { useGameEngine } from '../../hooks/useGameEngine';

const GameArena = ({ gameType, tier, onFinish }) => {
    // Orquestador del motor de juego
    const { gameState, actions } = useGameEngine({ gameType, onFinish });

    // Validación temprana
    if (!tier || typeof tier.amount !== 'number') {
        return <div className="text-center text-secondary">Error: Tier no válido</div>;
    }

    // El valor del contexto que se compartirá con los sub-componentes
    const contextValue = {
        gameState,
        actions,
        gameType,
        tier
    };

    return (
        <ArenaContext.Provider value={contextValue}>
            <div className="game-arena-wrapper w-full flex-center flex-col">
                <div className="game-arena">
                    <GameArena.Header />
                    <GameArena.Board />
                    <GameArena.Status />
                    <GameArena.Results />
                </div>
            </div>
        </ArenaContext.Provider>
    );
};

// Asignar sub-componentes para uso tipo <GameArena.Header />
GameArena.Header = ArenaHeader;
GameArena.Board = ArenaBoard;
GameArena.Results = ArenaResults;
GameArena.Status = ArenaStatus;

export default GameArena;