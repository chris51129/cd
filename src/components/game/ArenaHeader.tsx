/**
 * ArenaHeader - Sub-componente de GameArena
 */
import React from 'react';
import { useArena } from './ArenaContext';
import { PLATFORM_CONFIG } from '../../constants/config';
import * as AnimatedIcons from '../ui/AnimatedLucideIcons';

/**
 * Props for TierIcon component
 */
interface TierIconProps {
    readonly iconName: keyof typeof AnimatedIcons;
    readonly color: string;
    readonly size?: number;
}

const TierIcon: React.FC<TierIconProps> = ({ iconName, color, size = 32 }) => {
    const IconComponent = AnimatedIcons[iconName];
    if (!IconComponent) return null;
    return <IconComponent size={size} color={color} />;
};

const ArenaHeader: React.FC = () => {
    const { gameState, gameType, tier } = useArena();
    const { phase } = gameState;

    if (gameType === 'memory') return null;

    const renderScoreboard = (): React.ReactNode => {
        if (gameType !== 'rps') return null;

        const drawCount = gameState.drawCount || 0;

        return (
            <div className="flex-center flex-col w-full mb-8">
                <div className="text-secondary tracking-widest text-xs uppercase mb-2 font-bold">
                    DUELO DIRECTO
                </div>
                {drawCount > 0 && (
                    <div className="flex-center gap-2 text-amber-400 text-sm">
                        <span>⚔️</span>
                        <span>Empates: {drawCount}/5</span>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="arena-header" style={{ opacity: phase === 'selection' ? 0.5 : 1 }}>
            <div className="text-secondary text-sm tracking-widest mb-2">COMPROMISO DE ENTRADA</div>
            <div className="text-2xl font-bold flex-center flex-gap-4 mb-4">
                <span className="flex-center" style={{ width: 32, height: 32, display: 'inline-flex' }}>
                    {gameType === 'rps' ? <AnimatedIcons.AnimatedRPS size={32} /> :
                        gameType === 'coinflip' ? <AnimatedIcons.AnimatedCoin size={32} /> :
                            gameType === 'dice' ? <AnimatedIcons.AnimatedDice size={32} /> :
                                <TierIcon iconName={(tier.icon ?? 'AnimatedCoin') as keyof typeof AnimatedIcons} color={tier.color ?? '#2E5CFF'} size={32} />}
                </span>
                <span>${tier.amount} {PLATFORM_CONFIG.CURRENCY}</span>
            </div>
            {renderScoreboard()}
        </div>
    );
};

export default ArenaHeader;
