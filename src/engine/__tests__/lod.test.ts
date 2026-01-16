/**
 * LOD System Tests - Tests para Level of Detail controller
 */

import { lodController } from '../lod';

describe('LOD System', () => {
    describe('Initial State', () => {
        it('should have default high level', () => {
            const state = lodController.getState();

            expect(state.currentLevel).toBeDefined();
            expect(['ultra', 'high', 'medium', 'low', 'minimal']).toContain(state.currentLevel);
        });

        it('should start in automatic mode', () => {
            const state = lodController.getState();
            expect(state.isAutomatic).toBe(true);
        });

        it('should have valid config', () => {
            const config = lodController.getConfig();

            expect(config.targetFPS).toBeGreaterThan(0);
            expect(config.particleMultiplier).toBeGreaterThanOrEqual(0);
            expect(config.particleMultiplier).toBeLessThanOrEqual(1);
            expect(config.updateInterval).toBeGreaterThan(0);
        });
    });

    describe('Manual Override', () => {
        afterEach(() => {
            // Reset to automatic after each test
            lodController.enableAutomatic();
        });

        it('should allow manual level setting', () => {
            lodController.setLevel('low');
            const state = lodController.getState();

            expect(state.currentLevel).toBe('low');
            expect(state.isAutomatic).toBe(false);
            expect(state.reason).toBe('Manual override');
        });

        it('should return to automatic when enabled', () => {
            lodController.setLevel('minimal');
            lodController.enableAutomatic();

            expect(lodController.getState().isAutomatic).toBe(true);
        });
    });

    describe('Configuration per Level', () => {
        const levels = ['ultra', 'high', 'medium', 'low', 'minimal'] as const;

        afterEach(() => {
            lodController.enableAutomatic();
        });

        levels.forEach(level => {
            it(`should have valid config for ${level}`, () => {
                lodController.setLevel(level);
                const config = lodController.getConfig();

                expect(config.targetFPS).toBeGreaterThan(0);
                expect(config.particleMultiplier).toBeGreaterThanOrEqual(0);
                expect(config.particleMultiplier).toBeLessThanOrEqual(1);
                expect(typeof config.complexShaders).toBe('boolean');
                expect(typeof config.shadows).toBe('boolean');
                expect(typeof config.blur).toBe('boolean');
            });
        });

        it('should have decreasing quality from ultra to minimal', () => {
            const configs = levels.map(level => {
                lodController.setLevel(level);
                return lodController.getConfig();
            });

            // Particle multiplier should decrease
            for (let i = 1; i < configs.length; i++) {
                expect(configs[i].particleMultiplier).toBeLessThanOrEqual(configs[i - 1].particleMultiplier);
            }

            // Update interval should increase (less frequent updates = lower quality)
            for (let i = 1; i < configs.length; i++) {
                expect(configs[i].updateInterval).toBeGreaterThanOrEqual(configs[i - 1].updateInterval);
            }
        });
    });

    describe('Particle Count Helper', () => {
        afterEach(() => {
            lodController.enableAutomatic();
        });

        it('should calculate particle count based on multiplier', () => {
            lodController.setLevel('ultra');
            expect(lodController.getParticleCount(100)).toBe(100); // 1.0 multiplier

            lodController.setLevel('medium');
            expect(lodController.getParticleCount(100)).toBe(50); // 0.5 multiplier

            lodController.setLevel('minimal');
            expect(lodController.getParticleCount(100)).toBe(10); // 0.1 multiplier
        });
    });

    describe('Feature Checks', () => {
        afterEach(() => {
            lodController.enableAutomatic();
        });

        it('should enable all features at ultra', () => {
            lodController.setLevel('ultra');

            expect(lodController.shouldEnable('shadows')).toBe(true);
            expect(lodController.shouldEnable('blur')).toBe(true);
            expect(lodController.shouldEnable('complexShaders')).toBe(true);
        });

        it('should disable features at minimal', () => {
            lodController.setLevel('minimal');

            expect(lodController.shouldEnable('shadows')).toBe(false);
            expect(lodController.shouldEnable('blur')).toBe(false);
            expect(lodController.shouldEnable('complexShaders')).toBe(false);
        });
    });

    describe('Subscription', () => {
        it('should notify on level change', () => {
            const listener = jest.fn();
            const unsubscribe = lodController.subscribe(listener);

            // Should be called immediately with current state
            expect(listener).toHaveBeenCalledTimes(1);

            lodController.setLevel('low');
            expect(listener).toHaveBeenCalledTimes(2);

            unsubscribe();
            lodController.setLevel('high');
            // Should not be called after unsubscribe
            expect(listener).toHaveBeenCalledTimes(2);

            lodController.enableAutomatic();
        });
    });

    describe('Frame Time Reporting', () => {
        it('should accept frame time reports without error', () => {
            expect(() => {
                for (let i = 0; i < 60; i++) {
                    lodController.reportFrameTime(16.67);
                }
            }).not.toThrow();
        });
    });
});
