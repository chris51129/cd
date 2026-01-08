import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import * as Icons from '../ui/AnimatedLucideIcons';

// Game data categories for the menu
const DROPDOWN_GAMES = [
    {
        category: 'Probabilidad',
        icon: 'AnimatedCoin',
        items: [
            { id: 'coinflip', title: 'Cara o Cruz', desc: '50/50 Probabilidad', icon: 'AnimatedCoin' },
            { id: 'dice', title: 'Duelo de Dados', desc: 'Suma y domina', icon: 'AnimatedDice' },
            { id: 'rps', title: 'Piedra, Papel o Tijera', desc: 'Duelo Ancestral', icon: 'AnimatedRPS' }
        ]
    },
    {
        category: 'Habilidad',
        icon: 'AnimatedBrain',
        items: [
            { id: 'memory', title: 'Memoria Cripto', desc: 'Velocidad mental', icon: 'AnimatedBrain' },
            { id: 'quickdraw', title: 'Reflejos', desc: 'Reacción rápida', icon: 'AnimatedZap' },
            { id: 'blockvalidation', title: 'Validación', desc: 'Secuencia lógica', icon: 'AnimatedGrid' }
        ]
    }
];

import { useSafety } from '../../context/SafetyContext';

/**
 * Props for GameDropdown component
 */
interface GameDropdownProps {
    readonly isOpen: boolean;
    readonly onClose: () => void;
}

const GameDropdown: React.FC<GameDropdownProps> = ({ isOpen, onClose }) => {
    const navigate = useNavigate();
    const { handleSafeNavigation } = useSafety();

    const handleGameClick = (gameId: string): void => {
        handleSafeNavigation(() => {
            navigate(`/game/${gameId}`);
            onClose();
        });
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, y: 15, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="game-dropdown-root"
                >
                    {DROPDOWN_GAMES.map((cat, _idx) => (
                        <div key={cat.category} className="dropdown-column">
                            <h4 className="dropdown-category-title">
                                {cat.category}
                            </h4>
                            <div className="dropdown-items">
                                {cat.items.map((game) => {
                                    const IconsMap = Icons as Record<string, React.FC<{ size?: number }>>;
                                    const IconComponent = IconsMap[game.icon];
                                    return (
                                        <motion.div
                                            key={game.id}
                                            whileHover={{ x: 5 }}
                                            onClick={() => handleGameClick(game.id)}
                                            className="dropdown-item"
                                        >
                                            <div className="dropdown-item-icon">
                                                {IconComponent && <IconComponent size={18} />}
                                            </div>
                                            <div>
                                                <div className="dropdown-item-title">{game.title}</div>
                                                <div className="dropdown-item-desc">{game.desc}</div>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default GameDropdown;
