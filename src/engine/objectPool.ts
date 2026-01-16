/**
 * Object Pool - Zero-allocation pattern for game loops
 * 
 * WHY (Protocolo Optimización §3): El Garbage Collector es el enemigo en game loops.
 * Cada `new Object()` durante el render loop causa micro-stutter y jank.
 * 
 * PATTERN: Pre-allocate N objects at startup, reuse via acquire/release.
 * 
 * SECURITY (Protocolo Sigma §6.1):
 * - maxSize prevents memory exhaustion attacks
 * - Objects are reset before reuse to prevent state leakage
 * - Pool tracks all objects to prevent double-release
 */

import {
    type ObjectFactory,
    type ObjectReset,
    type PoolConfig,
    type ObjectPool,
} from './types';

// ============================================
// Constants
// ============================================

/** Default pool configuration */
const DEFAULT_INITIAL_SIZE = 10;
const DEFAULT_MAX_SIZE = 100;

/** Environment check for logging */
const isDevelopment = (): boolean => {
    try {
        if (typeof process !== 'undefined' && process.env?.NODE_ENV) {
            return process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test';
        }
    } catch {
        // Ignore - not in Node
    }
    return false;
};

// ============================================
// Pool Implementation
// ============================================

/**
 * Create a new object pool
 * 
 * WHY: Factory function pattern allows proper typing and encapsulation.
 * The pool is completely opaque to consumers.
 * 
 * @param config - Pool configuration
 * @returns ObjectPool instance
 * 
 * @example
 * ```typescript
 * interface Particle { x: number; y: number; alpha: number; }
 * 
 * const particlePool = createPool<Particle>({
 *     factory: () => ({ x: 0, y: 0, alpha: 1 }),
 *     reset: (p) => { p.x = 0; p.y = 0; p.alpha = 1; },
 *     initialSize: 50,
 *     maxSize: 200,
 *     name: 'particles'
 * });
 * 
 * const particle = particlePool.acquire();
 * if (particle) {
 *     particle.x = 100;
 *     // ... use particle
 *     particlePool.release(particle);
 * }
 * ```
 */
export const createPool = <T extends object>(config: PoolConfig<T>): ObjectPool<T> => {
    const {
        factory,
        reset,
        initialSize = DEFAULT_INITIAL_SIZE,
        maxSize = DEFAULT_MAX_SIZE,
        name = 'unnamed',
    } = config;

    // Validate config
    if (initialSize < 0) {
        throw new Error(`[ObjectPool:${name}] initialSize cannot be negative`);
    }
    if (maxSize < initialSize) {
        throw new Error(`[ObjectPool:${name}] maxSize (${maxSize}) must be >= initialSize (${initialSize})`);
    }
    if (maxSize > 10000) {
        throw new Error(`[ObjectPool:${name}] maxSize exceeds safety limit (10000)`);
    }

    // Internal state
    const availableObjects: T[] = [];
    const inUseObjects = new WeakSet<T>();
    let totalCreated = 0;
    let disposed = false;

    // Pre-populate pool
    for (let i = 0; i < initialSize; i++) {
        const obj = factory();
        availableObjects.push(obj);
        totalCreated++;
    }

    if (isDevelopment()) {
        console.log(`[ObjectPool:${name}] Initialized with ${initialSize} objects (max: ${maxSize})`);
    }

    /**
     * Acquire an object from the pool
     * Returns null if pool is exhausted and at max capacity
     */
    const acquire = (): T | null => {
        if (disposed) {
            console.error(`[ObjectPool:${name}] Cannot acquire from disposed pool`);
            return null;
        }

        // Try to get from available pool
        if (availableObjects.length > 0) {
            const obj = availableObjects.pop()!;
            inUseObjects.add(obj);
            return obj;
        }

        // Create new if under max
        if (totalCreated < maxSize) {
            const obj = factory();
            totalCreated++;
            inUseObjects.add(obj);

            if (isDevelopment() && totalCreated % 10 === 0) {
                console.log(`[ObjectPool:${name}] Expanded to ${totalCreated} objects`);
            }

            return obj;
        }

        // Pool exhausted
        if (isDevelopment()) {
            console.warn(`[ObjectPool:${name}] Pool exhausted at ${maxSize} objects`);
        }
        return null;
    };

    /**
     * Release an object back to the pool
     * Returns true if successfully released, false if invalid
     */
    const release = (obj: T): boolean => {
        if (disposed) {
            return false;
        }

        // Check if this object belongs to us
        if (!inUseObjects.has(obj)) {
            if (isDevelopment()) {
                console.warn(`[ObjectPool:${name}] Attempted to release unknown object`);
            }
            return false;
        }

        // Reset and return to pool
        reset(obj);
        inUseObjects.delete(obj);
        availableObjects.push(obj);
        return true;
    };

    /**
     * Get count of available objects
     */
    const available = (): number => availableObjects.length;

    /**
     * Get total pool size (created objects)
     */
    const size = (): number => totalCreated;

    /**
     * Dispose the pool - releases all references
     * WHY: Prevents memory leaks when component unmounts
     */
    const dispose = (): void => {
        if (disposed) return;

        disposed = true;
        availableObjects.length = 0;
        // WeakSet doesn't need clearing - objects will be GC'd

        if (isDevelopment()) {
            console.log(`[ObjectPool:${name}] Disposed (had ${totalCreated} objects)`);
        }
    };

    return Object.freeze({
        acquire,
        release,
        available,
        size,
        dispose,
        name,
    });
};

// ============================================
// Pre-built Pool Factories
// ============================================

/**
 * Vector2D for position calculations
 */
export interface Vector2D {
    x: number;
    y: number;
}

/**
 * Create a pool of 2D vectors
 * WHY: Positions are calculated every frame - avoid allocations
 */
export const createVector2DPool = (
    initialSize: number = 20,
    maxSize: number = 100
): ObjectPool<Vector2D> => {
    return createPool<Vector2D>({
        factory: () => ({ x: 0, y: 0 }),
        reset: (v) => {
            v.x = 0;
            v.y = 0;
        },
        initialSize,
        maxSize,
        name: 'Vector2D',
    });
};

/**
 * Particle for visual effects
 */
export interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    alpha: number;
    scale: number;
    rotation: number;
    lifetime: number;
    maxLifetime: number;
    color: string;
}

/**
 * Create a pool of particles for animations
 * WHY: Victory/defeat animations spawn many particles
 */
export const createParticlePool = (
    initialSize: number = 50,
    maxSize: number = 200
): ObjectPool<Particle> => {
    return createPool<Particle>({
        factory: () => ({
            x: 0,
            y: 0,
            vx: 0,
            vy: 0,
            alpha: 1,
            scale: 1,
            rotation: 0,
            lifetime: 0,
            maxLifetime: 1000,
            color: '#ffffff',
        }),
        reset: (p) => {
            p.x = 0;
            p.y = 0;
            p.vx = 0;
            p.vy = 0;
            p.alpha = 1;
            p.scale = 1;
            p.rotation = 0;
            p.lifetime = 0;
            p.maxLifetime = 1000;
            p.color = '#ffffff';
        },
        initialSize,
        maxSize,
        name: 'Particle',
    });
};

/**
 * Timestamp record for history tracking
 */
export interface TimestampRecord {
    timestamp: number;
    event: string;
    data: Record<string, unknown> | null;
}

/**
 * Create a pool of timestamp records
 * WHY: Memory game tracks pair timestamps per click
 */
export const createTimestampPool = (
    initialSize: number = 20,
    maxSize: number = 50
): ObjectPool<TimestampRecord> => {
    return createPool<TimestampRecord>({
        factory: () => ({
            timestamp: 0,
            event: '',
            data: null,
        }),
        reset: (t) => {
            t.timestamp = 0;
            t.event = '';
            t.data = null;
        },
        initialSize,
        maxSize,
        name: 'TimestampRecord',
    });
};

// ============================================
// Exports
// ============================================

export type { ObjectFactory, ObjectReset, PoolConfig, ObjectPool };
