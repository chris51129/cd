/**
 * FeatureSection - Stats and games showcase
 * 
 * Ley de Miller: Los usuarios pueden mantener 7±2 elementos en memoria.
 * Agrupamos juegos por categoría para reducir la carga cognitiva.
 */
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import StatCard from './StatCard';
import GameCard from './GameCard';
import { Icons } from '../ui/Icons';

// Configuración de juegos con categorías
const GAMES_DATA = [
    {
        id: 'coinflip',
        title: 'Cara o Cruz',
        desc: 'El clásico 50/50. Probabilidad pura, verificada en cadena.',
        type: 'Instantáneo',
        Icon: Icons.Coin,
        category: 'probability',
        link: '/game/coinflip'
    },
    {
        id: 'dice',
        title: 'Duelo de Dados',
        desc: 'Tira contra un oponente. Se distribuye la recompensa al valor dominante.',
        type: 'Probabilidad',
        Icon: Icons.Dice,
        category: 'probability',
        link: '/game/dice'
    },
    {
        id: 'rps',
        title: 'Piedra, Papel o Tijera',
        desc: 'El duelo ancestral de manos. Estrategia sutil con seguridad commit-reveal.',
        type: 'Probabilidad',
        Icon: Icons.RPS,
        category: 'probability',
        link: '/game/rps'
    },
    {
        id: 'memory',
        title: 'Memoria Cripto',
        desc: 'Compite contra tiempo y oponente. Encuentra más parejas en 30 segundos.',
        type: 'Habilidad',
        Icon: Icons.Brain,
        category: 'skill',
        badge: 'NEW',
        link: '/game/memory'
    },
    {
        id: 'quickdraw',
        title: 'Duelo de Reflejos',
        desc: 'Reacción pura. Haz clic en cuanto veas la señal verde.',
        type: 'Habilidad',
        Icon: Icons.Zap,
        category: 'skill',
        badge: 'HOT',
        link: '/game/quickdraw'
    },
    {
        id: 'blockvalidation',
        title: 'Validación de Bloques',
        desc: 'Haz clic en los números del 1 al 25 en orden. Velocidad mental pura.',
        type: 'Habilidad',
        Icon: Icons.Grid,
        category: 'skill',
        badge: 'NEW',
        link: '/game/blockvalidation'
    }
];

// Configuración de tabs
const CATEGORIES = [
    { id: 'all', label: 'Todos', Icon: Icons.Layout },
    { id: 'probability', label: 'Probabilidad', Icon: Icons.Probability },
    { id: 'skill', label: 'Habilidad', Icon: Icons.Zap }
];

const FeatureSection = () => {
    const [activeCategory, setActiveCategory] = useState('all');

    // Filtrar juegos según categoría seleccionada
    const filteredGames = useMemo(() => {
        if (activeCategory === 'all') return GAMES_DATA;
        return GAMES_DATA.filter(game => game.category === activeCategory);
    }, [activeCategory]);

    return (
        <section className="feature-section" id="games">
            <div className="stats-grid">
                <StatCard label="Volumen Total" value="$12.4M+" delay={0} Icon={Icons.Trend} />
                <StatCard label="Jugadores Activos" value="8,240" delay={0.1} Icon={Icons.Activity} />
                <StatCard label="Tiempo Pago Promedio" value="2.1s" delay={0.2} Icon={Icons.CPU} />
            </div>

            <div className="games-header">
                <h2 className="section-title">Módulos de Competición</h2>
                <p className="section-subtitle">Protocolos simples, rápidos y justos. Elige tu desafío.</p>
            </div>

            {/* Tabs de Categoría - Ley de Miller */}
            <div className="category-tabs">
                {CATEGORIES.map((cat) => (
                    <button
                        key={cat.id}
                        className={`category-tab ${activeCategory === cat.id ? 'active' : ''}`}
                        onClick={() => setActiveCategory(cat.id)}
                    >
                        <span className="category-icon">
                            <cat.Icon size={16} strokeWidth={2.5} animateOnHover={activeCategory !== cat.id} />
                        </span>
                        <span className="category-label">{cat.label}</span>
                        {activeCategory === cat.id && (
                            <motion.div
                                className="category-tab-indicator"
                                layoutId="categoryIndicator"
                                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                            />
                        )}
                    </button>
                ))}
            </div>

            {/* Grid de Juegos con animación */}
            <motion.div
                className="games-grid"
                layout
            >
                <AnimatePresence mode="popLayout">
                    {filteredGames.map((game, index) => (
                        <motion.div
                            key={game.id}
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.2, delay: index * 0.05 }}
                        >
                            <GameCard
                                title={game.title}
                                desc={game.desc}
                                type={game.type}
                                Icon={game.Icon}
                                delay={0}
                                link={game.link}
                                badge={game.badge}
                            />
                        </motion.div>
                    ))}
                </AnimatePresence>
            </motion.div>
        </section>
    );
};

export default FeatureSection;
