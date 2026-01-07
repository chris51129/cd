/**
 * TierSelector - Carrusel de selección de tier (commitment level)
 * 
 * Features:
 * - Swipe horizontal táctil/mouse
 * - Efecto "peek" con cards adyacentes parcialmente visibles
 * - Flechas de navegación
 * - Dots indicadores de posición
 * - Selección con clic (no automática)
 */
import React, { useState, useRef, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { TIERS } from '../../constants/tiers';
import { Card } from '../ui';
import { secureLog } from '../../utils/security';
import * as Icons from '../ui/AnimatedLucideIcons';
import './TierSelector.css';

const TierIcon = ({ iconName, color, size = 44 }) => {
    const IconComponent = Icons[iconName];
    if (!IconComponent) return null;
    return <IconComponent size={size} color={color} />;
};

// Helper to convert hex to rgb for dynamic styles
const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
};

const TierCard = ({ tier, isSelected, isCentered, onClick }) => {
    const rgb = hexToRgb(tier.color || '#2E5CFF');
    const isPopular = tier.popular === true;
    const isPremium = tier.premium === true;

    const dynamicStyle = {
        background: isSelected
            ? `linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.2) 100%)`
            : isPremium
                ? 'linear-gradient(135deg, rgba(212, 175, 55, 0.1) 0%, var(--bg-surface) 50%, rgba(212, 175, 55, 0.05) 100%)'
                : isPopular
                    ? 'linear-gradient(135deg, rgba(255, 215, 0, 0.05) 0%, var(--bg-surface) 100%)'
                    : 'var(--bg-surface)',
        border: isSelected
            ? `2px solid ${tier.color || '#2E5CFF'}`
            : isPremium
                ? '2px solid rgba(212, 175, 55, 0.5)'
                : isPopular
                    ? '2px solid rgba(255, 215, 0, 0.3)'
                    : '1px solid var(--text-muted)',
        boxShadow: isPremium && !isSelected
            ? '0 0 30px rgba(212, 175, 55, 0.2), inset 0 0 20px rgba(212, 175, 55, 0.05)'
            : isSelected
                ? `0 0 30px rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.3)`
                : isCentered
                    ? '0 8px 32px rgba(0, 0, 0, 0.15)'
                    : '0 4px 12px rgba(0, 0, 0, 0.08)',
        opacity: isCentered ? 1 : 0.6,
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
    };

    return (
        <Card
            interactive
            onClick={() => onClick(tier)}
            style={dynamicStyle}
            className={`tier-card-carousel ${isSelected ? 'selected' : ''} ${isPopular ? 'popular' : ''} ${isPremium ? 'premium' : ''}`}
            role="button"
            tabIndex={0}
            aria-label={`Seleccionar tier ${tier.label} de $${tier.amount} USDT`}
            aria-pressed={isSelected}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onClick(tier);
                }
            }}
        >
            {/* Badge PREMIUM */}
            {isPremium && (
                <div className="tier-badge tier-badge-premium">
                    👑 LEGEND
                </div>
            )}

            {/* Badge POPULAR */}
            {isPopular && (
                <div className="tier-badge tier-badge-popular">
                    ⭐ POPULAR
                </div>
            )}

            {isSelected && (
                <div className="tier-selected-glow" style={{
                    boxShadow: `inset 0 0 20px rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.1)`
                }} />
            )}

            <div className="tier-icon-wrapper">
                <TierIcon
                    iconName={tier.icon}
                    color={isSelected ? 'var(--accent-blue)' : tier.color}
                    size={48}
                />
            </div>

            <div className="tier-amount">${tier.amount}</div>

            <div className="tier-label" style={{ color: tier.color || '#2E5CFF' }}>
                {tier.label}
            </div>

            <div className="tier-players">
                <span className="status-dot"></span>
                0 esperando
            </div>
        </Card>
    );
};

const TierSelector = ({ onSelect }) => {
    const [selectedTier, setSelectedTier] = useState(null);
    // Empezar en el tier Gold (index 2) si existe, sino en 0
    const popularIndex = TIERS.findIndex(t => t.popular);
    const [currentIndex, setCurrentIndex] = useState(popularIndex >= 0 ? popularIndex : 0);

    const containerRef = useRef(null);
    const trackRef = useRef(null);
    const isDragging = useRef(false);
    const startX = useRef(0);
    const scrollLeft = useRef(0);

    const CARD_WIDTH = 180; // Smaller for mobile
    const CARD_GAP = 20;

    // Smooth scroll programático (consistente con Navbar)
    const smoothScrollToTop = () => {
        const startY = window.scrollY || document.documentElement.scrollTop;
        if (startY === 0) return; // Already at top

        const targetY = 0;
        const distance = targetY - startY;
        const duration = 800; // Ligeramente más rápido que navbar (800ms vs 1000ms)
        let start = null;

        const easeInOutCubic = (t) => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;

        const step = (timestamp) => {
            if (!start) start = timestamp;
            const progress = timestamp - start;
            const percentage = Math.min(progress / duration, 1);

            const nextY = startY + (distance * easeInOutCubic(percentage));
            window.scrollTo(0, nextY);

            if (progress < duration) {
                window.requestAnimationFrame(step);
            }
        };

        window.requestAnimationFrame(step);
    };

    const handleSelect = (tier) => {
        setSelectedTier(tier);
        // Scroll automático a la zona de juego
        smoothScrollToTop();
        if (onSelect) onSelect(tier);
    };

    const goToIndex = useCallback((index) => {
        const newIndex = Math.max(0, Math.min(TIERS.length - 1, index));
        // Save scroll position before state change
        const scrollY = window.scrollY;
        setCurrentIndex(newIndex);
        // Restore scroll position after render
        requestAnimationFrame(() => {
            window.scrollTo(0, scrollY);
        });
    }, []);

    const handlePrev = useCallback((e) => {
        e?.preventDefault();
        goToIndex(currentIndex - 1);
    }, [currentIndex, goToIndex]);

    const handleNext = useCallback((e) => {
        e?.preventDefault();
        goToIndex(currentIndex + 1);
    }, [currentIndex, goToIndex]);

    // Mouse drag handlers
    const handleMouseDown = (e) => {
        isDragging.current = true;
        startX.current = e.pageX - (trackRef.current?.offsetLeft || 0);
        scrollLeft.current = currentIndex;
    };

    const handleMouseMove = (e) => {
        if (!isDragging.current) return;
        e.preventDefault();
    };

    const handleMouseUp = (e) => {
        if (!isDragging.current) return;
        isDragging.current = false;

        const endX = e.pageX - (trackRef.current?.offsetLeft || 0);
        const diff = startX.current - endX;

        if (Math.abs(diff) > 50) {
            if (diff > 0) {
                handleNext();
            } else {
                handlePrev();
            }
        }
    };

    // Touch handlers
    const handleTouchStart = (e) => {
        startX.current = e.touches[0].clientX;
    };

    const handleTouchEnd = (e) => {
        const endX = e.changedTouches[0].clientX;
        const diff = startX.current - endX;

        if (Math.abs(diff) > 50) {
            if (diff > 0) {
                handleNext();
            } else {
                handlePrev();
            }
        }
    };

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'ArrowLeft') handlePrev();
            if (e.key === 'ArrowRight') handleNext();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handlePrev, handleNext]);

    // Calculate track transform to center current card
    const getTrackTransform = () => {
        const offset = currentIndex * (CARD_WIDTH + CARD_GAP);
        return `translateX(calc(50% - ${CARD_WIDTH / 2}px - ${offset}px))`;
    };

    return (
        <div className="tier-selector-carousel">
            {/* Carousel Container */}
            <div className="carousel-wrapper" ref={containerRef}>
                {/* Navigation Arrows */}
                <button
                    className="carousel-arrow carousel-arrow-left"
                    onClick={handlePrev}
                    disabled={currentIndex === 0}
                    aria-label="Tier anterior"
                >
                    <ChevronLeft size={24} />
                </button>

                <div
                    className="carousel-viewport"
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={() => { isDragging.current = false; }}
                    onTouchStart={handleTouchStart}
                    onTouchEnd={handleTouchEnd}
                >
                    <div
                        ref={trackRef}
                        className="carousel-track"
                        style={{
                            transform: getTrackTransform(),
                            transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                        }}
                    >
                        {TIERS.map((tier, index) => (
                            <div
                                key={tier.id}
                                className="carousel-slide"
                                style={{
                                    width: CARD_WIDTH,
                                    flexShrink: 0
                                }}
                            >
                                <TierCard
                                    tier={tier}
                                    isSelected={selectedTier?.id === tier.id}
                                    isCentered={index === currentIndex}
                                    onClick={(t) => {
                                        handleSelect(t);
                                        goToIndex(index);
                                    }}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                <button
                    className="carousel-arrow carousel-arrow-right"
                    onClick={handleNext}
                    disabled={currentIndex === TIERS.length - 1}
                    aria-label="Tier siguiente"
                >
                    <ChevronRight size={24} />
                </button>
            </div>

            {/* Dot Indicators */}
            <div className="carousel-dots">
                {TIERS.map((tier, index) => (
                    <button
                        key={tier.id}
                        className={`carousel-dot ${index === currentIndex ? 'active' : ''}`}
                        onClick={() => goToIndex(index)}
                        aria-label={`Ir a ${tier.label}`}
                    />
                ))}
            </div>

            {/* Selection Info */}
            <div className="tier-selection-info">
                <AnimatePresence mode="wait">
                    {selectedTier ? (
                        <motion.div
                            key="selected"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="tier-confirmation"
                        >
                            <div className="tier-pot-info">
                                <span>Pot total: <strong>${selectedTier.amount * 2}</strong></span>
                                <span>
                                    Ganador recibe: <strong className="text-success">${(selectedTier.amount * 2 * 0.95).toFixed(2)}</strong>
                                    <span className="tier-commission">(5% comisión protocolo)</span>
                                </span>
                            </div>
                            <button
                                className="btn-primary hero-btn"
                                onClick={() => secureLog.info('Commitment confirmed', selectedTier.label)}
                            >
                                Confirmar compromiso de ${selectedTier.amount}
                            </button>
                        </motion.div>
                    ) : (
                        <motion.p
                            key="hint"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-secondary"
                        >
                            Desliza para explorar • Toca para seleccionar
                        </motion.p>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

TierSelector.propTypes = {
    onSelect: PropTypes.func,
};

export default TierSelector;
