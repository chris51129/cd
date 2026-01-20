/**
 * Physics Worker Manager - Main thread API for Physics Worker
 * 
 * WHY: Provides a type-safe, Promise-based API for communicating
 * with the physics Web Worker.
 */

import type {
    ParticleData,
    ParticleResultMessage,
    CalculationItem,
    BatchResultMessage,
} from './physics.worker';

// ============================================
// Types
// ============================================

export type { ParticleData, CalculationItem };

export interface PhysicsConfig {
    readonly gravity: number;
    readonly friction: number;
}

// ============================================
// Worker Manager
// ============================================

class PhysicsWorkerManager {
    private worker: Worker | null = null;
    private pendingRequests: Map<string, {
        resolve: (value: unknown) => void;
        reject: (error: Error) => void;
    }> = new Map();
    private requestId = 0;
    private isReady = false;

    /**
     * Initialize the worker
     */
    async initialize(): Promise<void> {
        if (this.worker) return;

        // Check for worker support
        if (typeof Worker === 'undefined') {
            console.warn('[PhysicsWorker] Web Workers not supported, falling back to main thread');
            return;
        }

        try {
            // Create worker with Vite syntax
            this.worker = new Worker(
                new URL('./physics.worker.ts', import.meta.url),
                { type: 'module' }
            );

            this.worker.onmessage = this.handleMessage.bind(this);
            this.worker.onerror = this.handleError.bind(this);

            // Wait for ready signal
            await new Promise<void>((resolve, reject) => {
                const timeout = setTimeout(() => {
                    reject(new Error('Worker initialization timeout'));
                }, 5000);

                const checkReady = (e: MessageEvent) => {
                    if (e.data.type === 'READY') {
                        clearTimeout(timeout);
                        this.isReady = true;
                        resolve();
                    }
                };

                this.worker!.addEventListener('message', checkReady, { once: true });
            });
        } catch (error) {
            console.error('[PhysicsWorker] Failed to initialize:', error);
            this.worker = null;
        }
    }

    /**
     * Handle messages from worker
     */
    private handleMessage(event: MessageEvent): void {
        const { id, payload } = event.data;

        const pending = this.pendingRequests.get(id);
        if (pending) {
            pending.resolve(payload);
            this.pendingRequests.delete(id);
        }
    }

    /**
     * Handle worker errors
     */
    private handleError(error: ErrorEvent): void {
        console.error('[PhysicsWorker] Error:', error);

        // Reject all pending requests
        this.pendingRequests.forEach(({ reject }) => {
            reject(new Error('Worker error'));
        });
        this.pendingRequests.clear();
    }

    /**
     * Send message to worker and wait for response
     */
    private async send<T>(type: string, payload: unknown): Promise<T> {
        const id = `req-${++this.requestId}`;

        return new Promise((resolve, reject) => {
            if (!this.worker || !this.isReady) {
                // Fallback: process on main thread
                reject(new Error('Worker not available'));
                return;
            }

            this.pendingRequests.set(id, {
                resolve: resolve as (value: unknown) => void,
                reject
            });

            this.worker.postMessage({ type, id, payload });

            // Timeout after 1 second
            setTimeout(() => {
                if (this.pendingRequests.has(id)) {
                    this.pendingRequests.delete(id);
                    reject(new Error('Request timeout'));
                }
            }, 1000);
        });
    }

    // ============================================
    // Public API
    // ============================================

    /**
     * Update particles physics (offloaded to worker)
     */
    async updateParticles(
        particles: readonly ParticleData[],
        deltaTime: number,
        config: PhysicsConfig
    ): Promise<readonly ParticleData[]> {
        try {
            const result = await this.send<ParticleResultMessage['payload']>(
                'PARTICLE_UPDATE',
                {
                    particles,
                    deltaTime,
                    gravity: config.gravity,
                    friction: config.friction,
                }
            );
            return result.particles;
        } catch {
            // Fallback: process on main thread
            return this.updateParticlesSync(particles, deltaTime, config);
        }
    }

    /**
     * Synchronous fallback for particle updates
     */
    private updateParticlesSync(
        particles: readonly ParticleData[],
        deltaTime: number,
        config: PhysicsConfig
    ): readonly ParticleData[] {
        const dt = deltaTime / 1000;
        const { gravity, friction } = config;

        return particles
            .map(p => ({
                ...p,
                x: p.x + p.vx * dt * 60,
                y: p.y + (p.vy + gravity * dt) * dt * 60,
                vx: p.vx * (1 - friction * dt),
                vy: (p.vy + gravity * dt) * (1 - friction * dt),
                life: p.life - dt,
            }))
            .filter(p => p.life > 0);
    }

    /**
     * Batch calculate multiple operations
     */
    async batchCalculate(items: readonly CalculationItem[]): Promise<Map<string, unknown>> {
        try {
            const result = await this.send<BatchResultMessage['payload']>(
                'BATCH_CALCULATE',
                { items }
            );

            const resultMap = new Map<string, unknown>();
            result.results.forEach(r => resultMap.set(r.id, r.result));
            return resultMap;
        } catch {
            // Fallback: return empty map
            return new Map();
        }
    }

    /**
     * Check if worker is available
     */
    isAvailable(): boolean {
        return this.isReady && this.worker !== null;
    }

    /**
     * Terminate the worker
     */
    terminate(): void {
        if (this.worker) {
            this.worker.terminate();
            this.worker = null;
            this.isReady = false;
        }
    }
}

// ============================================
// Singleton Export
// ============================================

export const physicsWorker = new PhysicsWorkerManager();

// ============================================
// React Hook
// ============================================

import { useEffect, useState } from 'react';

/**
 * React hook for physics worker availability
 */
export function usePhysicsWorker(): boolean {
    const [isAvailable, setIsAvailable] = useState(false);

    useEffect(() => {
        physicsWorker.initialize().then(() => {
            setIsAvailable(physicsWorker.isAvailable());
        });

        return () => {
            // Don't terminate on unmount - keep worker alive
        };
    }, []);

    return isAvailable;
}
