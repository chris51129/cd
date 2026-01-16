/**
 * ParticleSystem - Zero-allocation particle effects for game animations
 * 
 * WHY (Protocolo Optimización §3): Canvas 2D con Object Pool evita allocations
 * durante el render loop, eliminando micro-stutter causado por GC.
 * 
 * FEATURES:
 * - Object Pooling para partículas reutilizables
 * - requestAnimationFrame para 60fps sincronizado
 * - Multiple presets: victory (gold), defeat (red), confetti (multicolor)
 * - Auto-cleanup en unmount
 * 
 * SECURITY: Pool tiene maxSize para prevenir memory exhaustion
 */

import React, { useEffect, useRef, useCallback, memo } from 'react';
import { createParticlePool, type Particle, type ObjectPool } from '../../../engine';
import { useGameLoop } from '../../../hooks/useGameTimer';
import { secureRandomInt } from '../../../utils/security';

// ============================================
// Types
// ============================================

export type ParticlePreset = 'victory' | 'defeat' | 'confetti' | 'sparkle';

export interface ParticleSystemProps {
    /** Whether the particle system is active */
    readonly active: boolean;
    /** Preset determines colors and behavior */
    readonly preset: ParticlePreset;
    /** Number of particles to spawn */
    readonly count?: number;
    /** Canvas width */
    readonly width?: number;
    /** Canvas height */
    readonly height?: number;
    /** Custom CSS class */
    readonly className?: string;
}

interface ParticleConfig {
    readonly colors: readonly string[];
    readonly gravity: number;
    readonly drag: number;
    readonly initialVelocityY: [number, number];
    readonly initialVelocityX: [number, number];
    readonly lifetime: number;
    readonly sizeRange: [number, number];
    readonly spawnFromTop?: boolean;
}

// ============================================
// Preset Configurations
// ============================================

const PRESETS: Record<ParticlePreset, ParticleConfig> = {
    victory: {
        colors: ['#FFD700', '#FFA500', '#FFEC8B', '#DAA520', '#F0E68C'],
        gravity: 0.15,
        drag: 0.98,
        initialVelocityY: [-15, -25],
        initialVelocityX: [-8, 8],
        lifetime: 2500,
        sizeRange: [3, 8],
    },
    defeat: {
        colors: ['#EF4444', '#DC2626', '#B91C1C', '#991B1B', '#7F1D1D'],
        gravity: 0.3,
        drag: 0.95,
        initialVelocityY: [-10, -20],
        initialVelocityX: [-5, 5],
        lifetime: 1500,
        sizeRange: [2, 5],
    },
    confetti: {
        colors: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8'],
        gravity: 0.1,
        drag: 0.99,
        initialVelocityY: [-20, -30],
        initialVelocityX: [-10, 10],
        lifetime: 3000,
        sizeRange: [4, 10],
    },
    sparkle: {
        colors: ['#FFFFFF', '#E0E0E0', '#87CEEB', '#ADD8E6'],
        gravity: 0.05,
        drag: 0.97,
        initialVelocityY: [-5, -15],
        initialVelocityX: [-3, 3],
        lifetime: 1000,
        sizeRange: [1, 4],
    },
};

// ============================================
// Component
// ============================================

/**
 * ParticleSystem - Canvas-based particle effects
 * 
 * WHY: Uses Object Pool to avoid allocations during animation loop.
 * Particles are acquired from pool on spawn and released when dead.
 * 
 * @example
 * ```tsx
 * <ParticleSystem active={isVictory} preset="victory" count={100} />
 * ```
 */
const ParticleSystem: React.FC<ParticleSystemProps> = memo(({
    active,
    preset,
    count = 50,
    width = 400,
    height = 400,
    className = '',
}) => {
    // Canvas ref
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Object Pool - created once per mount
    const poolRef = useRef<ObjectPool<Particle> | null>(null);

    // Active particles array (not pooled, just references)
    const activeParticlesRef = useRef<Particle[]>([]);

    // Track if we've spawned for this activation
    const hasSpawnedRef = useRef(false);

    // Config for current preset
    const config = PRESETS[preset];

    // Initialize pool on mount
    useEffect(() => {
        poolRef.current = createParticlePool(count, count * 2);

        return () => {
            poolRef.current?.dispose();
            poolRef.current = null;
            activeParticlesRef.current = [];
        };
    }, [count]);

    /**
     * Spawn particles
     * WHY: Acquires from pool and initializes with random values
     */
    const spawnParticles = useCallback(() => {
        const pool = poolRef.current;
        if (!pool) return;

        for (let i = 0; i < count; i++) {
            const particle = pool.acquire();
            if (!particle) break; // Pool exhausted

            // Random spawn position (bottom-center area)
            particle.x = width / 2 + (Math.random() - 0.5) * (width * 0.6);
            particle.y = config.spawnFromTop ? 0 : height;

            // Random velocity
            const [minVy, maxVy] = config.initialVelocityY;
            const [minVx, maxVx] = config.initialVelocityX;
            particle.vy = minVy + Math.random() * (maxVy - minVy);
            particle.vx = minVx + Math.random() * (maxVx - minVx);

            // Random color from preset
            const colorIndex = secureRandomInt(0, config.colors.length - 1);
            particle.color = config.colors[colorIndex];

            // Random size
            const [minSize, maxSize] = config.sizeRange;
            particle.scale = minSize + Math.random() * (maxSize - minSize);

            // Random rotation and lifetime
            particle.rotation = Math.random() * Math.PI * 2;
            particle.lifetime = 0;
            particle.maxLifetime = config.lifetime * (0.8 + Math.random() * 0.4);
            particle.alpha = 1;

            activeParticlesRef.current.push(particle);
        }
    }, [count, width, height, config]);

    // Spawn on activation
    useEffect(() => {
        if (active && !hasSpawnedRef.current) {
            hasSpawnedRef.current = true;
            spawnParticles();
        } else if (!active) {
            hasSpawnedRef.current = false;
        }
    }, [active, spawnParticles]);

    /**
     * Update and render loop
     * WHY: Uses deltaTime for frame-rate independent physics
     */
    useGameLoop((frame) => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        const pool = poolRef.current;

        if (!ctx || !pool) return;

        // Clear canvas
        ctx.clearRect(0, 0, width, height);

        const particles = activeParticlesRef.current;
        const deltaScale = frame.deltaTime / 16.67; // Normalize to 60fps

        // Update and draw each particle
        for (let i = particles.length - 1; i >= 0; i--) {
            const p = particles[i];

            // Physics update
            p.vy += config.gravity * deltaScale;
            p.vx *= config.drag;
            p.vy *= config.drag;
            p.x += p.vx * deltaScale;
            p.y += p.vy * deltaScale;
            p.rotation += 0.1 * deltaScale;
            p.lifetime += frame.deltaTime;

            // Fade out
            const lifeRatio = p.lifetime / p.maxLifetime;
            p.alpha = Math.max(0, 1 - lifeRatio);

            // Draw particle
            if (p.alpha > 0.01) {
                ctx.save();
                ctx.globalAlpha = p.alpha;
                ctx.translate(p.x, p.y);
                ctx.rotate(p.rotation);
                ctx.fillStyle = p.color;

                // Draw as rounded rect for confetti, circle for others
                if (preset === 'confetti') {
                    const halfSize = p.scale / 2;
                    ctx.fillRect(-halfSize, -halfSize * 2, p.scale, p.scale * 2);
                } else {
                    ctx.beginPath();
                    ctx.arc(0, 0, p.scale, 0, Math.PI * 2);
                    ctx.fill();
                }

                ctx.restore();
            }

            // Return to pool if dead or off-screen
            if (p.lifetime >= p.maxLifetime || p.y > height + 50 || p.alpha <= 0.01) {
                pool.release(p);
                particles.splice(i, 1);
            }
        }
    }, active || activeParticlesRef.current.length > 0);

    return (
        <canvas
            ref={canvasRef}
            width={width}
            height={height}
            className={`particle-canvas ${className}`}
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                pointerEvents: 'none',
                zIndex: 100,
            }}
            aria-hidden="true"
        />
    );
});

ParticleSystem.displayName = 'ParticleSystem';

export default ParticleSystem;
export { ParticleSystem, PRESETS };
