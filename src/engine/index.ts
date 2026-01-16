/**
 * Engine Module - Public API
 * 
 * WHY: Single entry point for the engine module.
 * External code should only import from this file.
 * 
 * PATTERN: Barrel exports with explicit re-exports for tree-shaking.
 */

// ============================================
// Types
// ============================================

export type {
    Milliseconds,
    Seconds,
    HighResTimestamp,
    FrameData,
    GameLoopCallback,
    GameLoopSubscription,
    GameLoopController,
    ObjectFactory,
    ObjectReset,
    PoolConfig,
    ObjectPool,
    Phase,
    Outcome,
    BaseAction,
    TickAction,
} from './types';

export {
    ms,
    sec,
    secToMs,
    msToSec,
    now,
    PHASES,
    OUTCOMES,
    isPhase,
    isOutcome,
} from './types';

// ============================================
// Game Loop
// ============================================

export {
    createGameLoop,
    getGameLoop,
    resetGameLoop,
    createTimer,
    createCountdown,
} from './gameLoop';

// ============================================
// Object Pool
// ============================================

export {
    createPool,
    createVector2DPool,
    createParticlePool,
    createTimestampPool,
} from './objectPool';

export type {
    Vector2D,
    Particle,
    TimestampRecord,
} from './objectPool';

// ============================================
// LOD System
// ============================================

export {
    lodController,
    useLOD,
    useLODConfig,
} from './lod';

export type {
    LODLevel,
    LODConfig,
    LODState,
} from './lod';
