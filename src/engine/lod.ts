/**
 * LOD System - Level of Detail for Animations
 * 
 * WHY (Skill game-developer): Reduce FPS costs when animations are
 * less visible or important. Automatically adjusts quality based on:
 * - Viewport visibility
 * - Device performance
 * - Battery status
 * - User focus (tab visibility)
 * 
 * PATTERN: Observer + Strategy
 */

// ============================================
// Types
// ============================================

/** Quality level for animations */
export type LODLevel = 'ultra' | 'high' | 'medium' | 'low' | 'minimal';

/** LOD configuration per level */
export interface LODConfig {
    /** Target FPS for this level */
    readonly targetFPS: number;
    /** Particle count multiplier (0-1) */
    readonly particleMultiplier: number;
    /** Enable complex shaders */
    readonly complexShaders: boolean;
    /** Enable shadows */
    readonly shadows: boolean;
    /** Enable blur effects */
    readonly blur: boolean;
    /** Animation update interval (ms) */
    readonly updateInterval: number;
}

/** LOD state */
export interface LODState {
    readonly currentLevel: LODLevel;
    readonly config: LODConfig;
    readonly reason: string;
    readonly isAutomatic: boolean;
}

/** Listener callback */
export type LODChangeListener = (state: LODState) => void;

// ============================================
// Configuration per Level
// ============================================

const LOD_CONFIGS: Record<LODLevel, LODConfig> = {
    ultra: {
        targetFPS: 60,
        particleMultiplier: 1.0,
        complexShaders: true,
        shadows: true,
        blur: true,
        updateInterval: 16,
    },
    high: {
        targetFPS: 60,
        particleMultiplier: 0.75,
        complexShaders: true,
        shadows: true,
        blur: false,
        updateInterval: 16,
    },
    medium: {
        targetFPS: 30,
        particleMultiplier: 0.5,
        complexShaders: false,
        shadows: true,
        blur: false,
        updateInterval: 33,
    },
    low: {
        targetFPS: 30,
        particleMultiplier: 0.25,
        complexShaders: false,
        shadows: false,
        blur: false,
        updateInterval: 50,
    },
    minimal: {
        targetFPS: 15,
        particleMultiplier: 0.1,
        complexShaders: false,
        shadows: false,
        blur: false,
        updateInterval: 100,
    },
};

// ============================================
// LOD Controller (Singleton)
// ============================================

class LODController {
    private level: LODLevel = 'high';
    private isAutomatic = true;
    private reason = 'Initial';
    private listeners: Set<LODChangeListener> = new Set();
    private frameHistory: number[] = [];
    private batteryLevel: number | null = null;
    private isPageVisible = true;
    private performanceScore = 100;

    constructor() {
        this.initializeMonitoring();
    }

    /**
     * Initialize performance monitoring
     */
    private initializeMonitoring(): void {
        // Monitor page visibility
        if (typeof document !== 'undefined') {
            document.addEventListener('visibilitychange', () => {
                this.isPageVisible = !document.hidden;
                this.updateLevel();
            });
        }

        // Monitor battery (if available)
        if (typeof navigator !== 'undefined' && 'getBattery' in navigator) {
            (navigator as Navigator & { getBattery: () => Promise<BatteryManager> })
                .getBattery()
                .then(battery => {
                    this.batteryLevel = battery.level;
                    battery.addEventListener('levelchange', () => {
                        this.batteryLevel = battery.level;
                        this.updateLevel();
                    });
                })
                .catch(() => {
                    // Battery API not available
                });
        }
    }

    /**
     * Report a frame time for performance tracking
     */
    reportFrameTime(deltaMs: number): void {
        this.frameHistory.push(deltaMs);

        // Keep last 60 frames
        if (this.frameHistory.length > 60) {
            this.frameHistory.shift();
        }

        // Update performance score every 30 frames
        if (this.frameHistory.length % 30 === 0) {
            this.calculatePerformanceScore();
            if (this.isAutomatic) {
                this.updateLevel();
            }
        }
    }

    /**
     * Calculate performance score from frame history
     */
    private calculatePerformanceScore(): void {
        if (this.frameHistory.length < 10) return;

        const avgFrameTime = this.frameHistory.reduce((a, b) => a + b, 0) / this.frameHistory.length;
        const targetFrameTime = 16.67; // 60 FPS target

        // Score: 100 = perfect, 0 = terrible
        this.performanceScore = Math.max(0, Math.min(100,
            100 - ((avgFrameTime - targetFrameTime) / targetFrameTime) * 100
        ));
    }

    /**
     * Update LOD level based on current conditions
     */
    private updateLevel(): void {
        if (!this.isAutomatic) return;

        const previousLevel = this.level;
        let newLevel: LODLevel;
        let reason: string;

        // Priority 1: Page not visible -> minimal
        if (!this.isPageVisible) {
            newLevel = 'minimal';
            reason = 'Page not visible';
        }
        // Priority 2: Low battery -> reduce quality
        else if (this.batteryLevel !== null && this.batteryLevel < 0.15) {
            newLevel = 'low';
            reason = 'Battery saving mode';
        }
        else if (this.batteryLevel !== null && this.batteryLevel < 0.30) {
            newLevel = 'medium';
            reason = 'Low battery';
        }
        // Priority 3: Performance-based
        else if (this.performanceScore >= 90) {
            newLevel = 'ultra';
            reason = 'Excellent performance';
        }
        else if (this.performanceScore >= 70) {
            newLevel = 'high';
            reason = 'Good performance';
        }
        else if (this.performanceScore >= 50) {
            newLevel = 'medium';
            reason = 'Moderate performance';
        }
        else if (this.performanceScore >= 30) {
            newLevel = 'low';
            reason = 'Poor performance';
        }
        else {
            newLevel = 'minimal';
            reason = 'Critical performance';
        }

        // Only notify if changed
        if (newLevel !== previousLevel) {
            this.level = newLevel;
            this.reason = reason;
            this.notifyListeners();
        }
    }

    /**
     * Notify all listeners of LOD change
     */
    private notifyListeners(): void {
        const state = this.getState();
        this.listeners.forEach(listener => listener(state));
    }

    // ============================================
    // Public API
    // ============================================

    /**
     * Get current LOD state
     */
    getState(): LODState {
        return {
            currentLevel: this.level,
            config: LOD_CONFIGS[this.level],
            reason: this.reason,
            isAutomatic: this.isAutomatic,
        };
    }

    /**
     * Get current config
     */
    getConfig(): LODConfig {
        return LOD_CONFIGS[this.level];
    }

    /**
     * Subscribe to LOD changes
     */
    subscribe(listener: LODChangeListener): () => void {
        this.listeners.add(listener);
        // Immediately notify with current state
        listener(this.getState());

        return () => {
            this.listeners.delete(listener);
        };
    }

    /**
     * Manually set LOD level (disables automatic)
     */
    setLevel(level: LODLevel): void {
        this.isAutomatic = false;
        this.level = level;
        this.reason = 'Manual override';
        this.notifyListeners();
    }

    /**
     * Enable automatic LOD adjustment
     */
    enableAutomatic(): void {
        this.isAutomatic = true;
        this.updateLevel();
    }

    /**
     * Get particle count based on current LOD
     */
    getParticleCount(baseCount: number): number {
        return Math.floor(baseCount * LOD_CONFIGS[this.level].particleMultiplier);
    }

    /**
     * Check if a feature should be enabled
     */
    shouldEnable(feature: 'shadows' | 'blur' | 'complexShaders'): boolean {
        return LOD_CONFIGS[this.level][feature];
    }
}

// Battery API type
interface BatteryManager extends EventTarget {
    readonly level: number;
    readonly charging: boolean;
}

// ============================================
// Singleton Export
// ============================================

export const lodController = new LODController();

// ============================================
// React Hook
// ============================================

import { useState, useEffect } from 'react';

/**
 * React hook for LOD state
 */
export function useLOD(): LODState {
    const [state, setState] = useState<LODState>(lodController.getState());

    useEffect(() => {
        return lodController.subscribe(setState);
    }, []);

    return state;
}

/**
 * React hook for LOD config only
 */
export function useLODConfig(): LODConfig {
    const state = useLOD();
    return state.config;
}
