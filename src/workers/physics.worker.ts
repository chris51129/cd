/**
 * Physics Worker - Offload heavy calculations to Web Worker
 * 
 * WHY (Skill game-developer): Heavy calculations like particle physics,
 * collision detection, and batch updates should run off the main thread
 * to maintain 60 FPS on the UI.
 * 
 * PATTERN: Message passing with typed interfaces
 */

// ============================================
// Message Types
// ============================================

export interface WorkerMessage {
    readonly type: string;
    readonly id: string;
    readonly payload: unknown;
}

export interface ParticleUpdateMessage extends WorkerMessage {
    readonly type: 'PARTICLE_UPDATE';
    readonly payload: {
        readonly particles: readonly ParticleData[];
        readonly deltaTime: number;
        readonly gravity: number;
        readonly friction: number;
    };
}

export interface ParticleResultMessage extends WorkerMessage {
    readonly type: 'PARTICLE_RESULT';
    readonly payload: {
        readonly particles: readonly ParticleData[];
    };
}

export interface BatchCalculationMessage extends WorkerMessage {
    readonly type: 'BATCH_CALCULATE';
    readonly payload: {
        readonly items: readonly CalculationItem[];
    };
}

export interface BatchResultMessage extends WorkerMessage {
    readonly type: 'BATCH_RESULT';
    readonly payload: {
        readonly results: readonly CalculationResult[];
    };
}

// ============================================
// Data Types
// ============================================

export interface ParticleData {
    readonly id: number;
    readonly x: number;
    readonly y: number;
    readonly vx: number;
    readonly vy: number;
    readonly life: number;
    readonly maxLife: number;
}

export interface CalculationItem {
    readonly id: string;
    readonly operation: 'distance' | 'collision' | 'interpolate';
    readonly data: unknown;
}

export interface CalculationResult {
    readonly id: string;
    readonly result: unknown;
}

// ============================================
// Worker Logic
// ============================================

/**
 * Handle incoming messages
 */
function handleMessage(event: MessageEvent<WorkerMessage>): void {
    const { type, id, payload } = event.data;

    switch (type) {
        case 'PARTICLE_UPDATE':
            handleParticleUpdate(id, payload as ParticleUpdateMessage['payload']);
            break;
        case 'BATCH_CALCULATE':
            handleBatchCalculation(id, payload as BatchCalculationMessage['payload']);
            break;
        case 'PING':
            self.postMessage({ type: 'PONG', id, payload: { timestamp: Date.now() } });
            break;
        default:
            console.warn(`[PhysicsWorker] Unknown message type: ${type}`);
    }
}

/**
 * Update particles physics (runs off main thread)
 */
function handleParticleUpdate(id: string, data: ParticleUpdateMessage['payload']): void {
    const { particles, deltaTime, gravity, friction } = data;
    const dt = deltaTime / 1000; // Convert to seconds

    const updatedParticles = particles.map(particle => {
        // Apply gravity
        let vy = particle.vy + gravity * dt;

        // Apply friction
        let vx = particle.vx * (1 - friction * dt);
        vy = vy * (1 - friction * dt);

        // Update position
        const x = particle.x + vx * dt * 60;
        const y = particle.y + vy * dt * 60;

        // Decrease life
        const life = particle.life - dt;

        return {
            ...particle,
            x,
            y,
            vx,
            vy,
            life,
        };
    }).filter(p => p.life > 0);

    const result: ParticleResultMessage = {
        type: 'PARTICLE_RESULT',
        id,
        payload: { particles: updatedParticles },
    };

    self.postMessage(result);
}

/**
 * Handle batch calculations
 */
function handleBatchCalculation(id: string, data: BatchCalculationMessage['payload']): void {
    const results: CalculationResult[] = data.items.map(item => {
        let result: unknown;

        switch (item.operation) {
            case 'distance':
                result = calculateDistance(item.data as { x1: number; y1: number; x2: number; y2: number });
                break;
            case 'collision':
                result = checkCollision(item.data as CollisionData);
                break;
            case 'interpolate':
                result = interpolate(item.data as InterpolateData);
                break;
            default:
                result = null;
        }

        return { id: item.id, result };
    });

    const response: BatchResultMessage = {
        type: 'BATCH_RESULT',
        id,
        payload: { results },
    };

    self.postMessage(response);
}

// ============================================
// Calculation Functions
// ============================================

function calculateDistance(data: { x1: number; y1: number; x2: number; y2: number }): number {
    const dx = data.x2 - data.x1;
    const dy = data.y2 - data.y1;
    return Math.sqrt(dx * dx + dy * dy);
}

interface CollisionData {
    readonly rect1: { x: number; y: number; width: number; height: number };
    readonly rect2: { x: number; y: number; width: number; height: number };
}

function checkCollision(data: CollisionData): boolean {
    const { rect1, rect2 } = data;
    return (
        rect1.x < rect2.x + rect2.width &&
        rect1.x + rect1.width > rect2.x &&
        rect1.y < rect2.y + rect2.height &&
        rect1.y + rect1.height > rect2.y
    );
}

interface InterpolateData {
    readonly start: number;
    readonly end: number;
    readonly t: number;
    readonly easing: 'linear' | 'easeIn' | 'easeOut' | 'easeInOut';
}

function interpolate(data: InterpolateData): number {
    const { start, end, t, easing } = data;
    let easedT: number;

    switch (easing) {
        case 'easeIn':
            easedT = t * t;
            break;
        case 'easeOut':
            easedT = 1 - (1 - t) * (1 - t);
            break;
        case 'easeInOut':
            easedT = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
            break;
        default:
            easedT = t;
    }

    return start + (end - start) * easedT;
}

// ============================================
// Worker Initialization
// ============================================

self.onmessage = handleMessage;

// Signal ready
self.postMessage({ type: 'READY', id: 'init', payload: { timestamp: Date.now() } });
