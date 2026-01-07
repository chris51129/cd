/**
 * ArenaBoard - Sub-componente de GameArena
 * Gestiona la visualización del juego activo.
 */
import React, { Suspense } from 'react';
import { useArena } from './ArenaContext';
import { UI_CONFIG } from '../../constants/config';
import { EtherLoader } from '../ui';
import SelectionScreen from './SelectionScreen';
import { CoinFlipAnimation, DiceAnimation, RPSAnimation, MemoryAnimation, QuickDrawAnimation, BlockValidationAnimation } from './animations';

const ArenaBoard = () => {
    const { gameState, gameType, actions } = useArena();
    const { phase, status, isChooser, playerSide, result } = gameState;

    const renderPositionContext = () => {
        if (gameType === 'rps') return null;
        if (gameType !== 'coinflip') return null;

        const sideText = playerSide === 'heads' ? 'CARA' : 'CRUZ';
        const sideIcon = playerSide === 'heads' ? '🪙' : '👑';
        const prefix = isChooser ? "ESTABLECISTE" : "POSICIÓN ASIGNADA";
        const colorClass = isChooser ? 'position-label-chooser' : 'position-label-assigned';

        return (
            <div className="position-context-row animate-fadeIn">
                <span
                    className={`position-label ${colorClass}`}
                    style={{ color: isChooser ? UI_CONFIG.COLOR_CHOOSER : UI_CONFIG.COLOR_ASSIGNED }}
                >
                    {prefix}:
                </span>
                <div className="position-pill">
                    <span className="position-pill-icon">{sideIcon}</span>
                    {sideText}
                </div>
            </div>
        );
    };

    const renderAnimation = () => {
        switch (gameType) {
            case 'coinflip':
                return (
                    <CoinFlipAnimation
                        status={status}
                        result={result}
                        gameState={{
                            selectionTimeLeft: gameState.selectionTimeLeft
                        }}
                    />
                );
            case 'dice': return <DiceAnimation status={status} result={result} />;
            case 'rps':
                return (
                    <RPSAnimation
                        status={status}
                        result={result}
                        gameState={{
                            selectionTimeLeft: gameState.selectionTimeLeft,
                            drawCount: gameState.drawCount,
                            rpsResult: gameState.rpsResult
                        }}
                    />
                );
            case 'memory':
                return (
                    <MemoryAnimation
                        status={status}
                        result={result}
                        gameState={{
                            board: gameState.board,
                            flippedIndices: gameState.flippedIndices,
                            matchedIndices: gameState.matchedIndices,
                            memoryScores: gameState.memoryScores,
                            timeLeft: gameState.timeLeft,
                            memoryPhase: gameState.memoryPhase,
                            memorizePhaseNumber: gameState.memorizePhaseNumber,
                            memorizeTimeLeft: gameState.memorizeTimeLeft,
                            revealedIndices: gameState.revealedIndices
                        }}
                        onCardClick={actions.handleMemoryCardClick}
                    />
                );
            case 'quickdraw':
                return (
                    <QuickDrawAnimation
                        status={status}
                        result={result}
                        gameState={{
                            quickDrawState: gameState.quickDrawState,
                            countdownLeft: gameState.countdownLeft,
                            hasPenalty: gameState.hasPenalty
                        }}
                        onAction={actions.handleQuickDrawClick}
                    />
                );
            case 'blockvalidation':
                return (
                    <BlockValidationAnimation
                        status={status}
                        result={result}
                        gameState={{
                            blockGrid: gameState.blockGrid,
                            blockNextTarget: gameState.blockNextTarget,
                            blockErrors: gameState.blockErrors,
                            blockState: gameState.blockState,
                            blockStartTime: gameState.blockStartTime,
                            blockTimeLeft: gameState.blockTimeLeft,
                            countdownLeft: gameState.countdownLeft
                        }}
                        onCellClick={actions.handleBlockCellClick}
                    />
                );
            default: return <div className="text-secondary">Juego no soportado</div>;
        }
    };

    return (
        <div className="arena-board-container w-full flex-center flex-col">
            {phase === 'selection' && (
                <SelectionScreen
                    gameType={gameType}
                    isChooser={isChooser}
                    selectionTimeLeft={gameState.selectionTimeLeft} // Sincronizado con el motor
                    onSelect={actions.selectSide}
                    onAssignedReady={actions.confirmAssigned}
                />
            )}

            {(phase === 'spin' || phase === 'result') && (
                <div className="flex-center flex-col w-full">
                    {renderPositionContext()}
                    <div className="arena-animation-container">
                        <Suspense fallback={<EtherLoader text="Cargando..." />}>
                            {renderAnimation()}
                        </Suspense>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ArenaBoard;
