/**
 * Tests for config.js constants
 * Validates configuration values and structure
 */
import {
    GAME_CONFIG,
    ANIMATION_CONFIG,
    PLATFORM_CONFIG,
    UI_CONFIG
} from './config';

describe('GAME_CONFIG', () => {
    test('should have valid spin duration', () => {
        expect(GAME_CONFIG.SPIN_DURATION_MS).toBeGreaterThan(0);
        expect(GAME_CONFIG.SPIN_DURATION_MS).toBe(5000);
    });

    test('should have valid result delay', () => {
        expect(GAME_CONFIG.RESULT_DELAY_MS).toBeGreaterThan(0);
    });

    test('should have valid matchmaking range', () => {
        expect(GAME_CONFIG.MATCHMAKING_MIN_MS).toBeLessThan(GAME_CONFIG.MATCHMAKING_MAX_MS);
        expect(GAME_CONFIG.MATCHMAKING_MIN_MS).toBeGreaterThan(0);
    });
});

describe('ANIMATION_CONFIG', () => {
    test('should have coin flip settings', () => {
        expect(ANIMATION_CONFIG.COIN_FLIP_DURATION_S).toBeGreaterThan(0);
        expect(ANIMATION_CONFIG.COIN_FLIP_ROTATIONS).toBeGreaterThan(0);
    });

    test('should have dice settings', () => {
        expect(ANIMATION_CONFIG.DICE_ROLL_DURATION_S).toBeGreaterThan(0);
    });

    test('should have RPS settings', () => {
        expect(ANIMATION_CONFIG.RPS_CYCLE_DURATION_S).toBeGreaterThan(0);
    });

    test('should have ripple settings', () => {
        expect(ANIMATION_CONFIG.RIPPLE_DURATION_S).toBeGreaterThan(0);
        expect(ANIMATION_CONFIG.RIPPLE_DELAY_S).toBeGreaterThanOrEqual(0);
    });
});

describe('PLATFORM_CONFIG', () => {
    test('should have valid fee percentage', () => {
        expect(PLATFORM_CONFIG.PROTOCOL_FEE_PERCENTAGE).toBe(5);
        expect(PLATFORM_CONFIG.PROTOCOL_FEE_PERCENTAGE).toBeGreaterThan(0);
        expect(PLATFORM_CONFIG.PROTOCOL_FEE_PERCENTAGE).toBeLessThan(100);
    });

    test('should have valid payout multiplier', () => {
        expect(PLATFORM_CONFIG.REWARD_MULTIPLIER).toBe(1.95);
        expect(PLATFORM_CONFIG.REWARD_MULTIPLIER).toBeGreaterThan(1);
    });

    test('should have currency and network defined', () => {
        expect(PLATFORM_CONFIG.CURRENCY).toBe('USDT');
        expect(PLATFORM_CONFIG.NETWORK).toBe('Polygon');
    });
});

describe('UI_CONFIG', () => {
    test('should have icon sizes', () => {
        expect(UI_CONFIG.ICON_SIZE_LARGE).toBeDefined();
        expect(UI_CONFIG.ICON_SIZE_MEDIUM).toBeDefined();
        expect(UI_CONFIG.ICON_SIZE_SMALL).toBeDefined();
    });

    test('should have valid color formats', () => {
        const hexColorRegex = /^#[0-9A-Fa-f]{6}$/;
        expect(UI_CONFIG.COLOR_WIN).toMatch(hexColorRegex);
        expect(UI_CONFIG.COLOR_LOSS).toMatch(hexColorRegex);
        expect(UI_CONFIG.COLOR_CHOOSER).toMatch(hexColorRegex);
        expect(UI_CONFIG.COLOR_ASSIGNED).toMatch(hexColorRegex);
    });
});
