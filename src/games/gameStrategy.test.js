/**
 * Tests for gameStrategy.js base definitions
 */
import { GAME_PHASES, GAME_STATUS, OUTCOMES } from './gameStrategy';

describe('gameStrategy constants', () => {
    describe('GAME_PHASES', () => {
        test('has SETUP phase', () => {
            expect(GAME_PHASES.SETUP).toBe('setup');
        });

        test('has SELECTION phase', () => {
            expect(GAME_PHASES.SELECTION).toBe('selection');
        });

        test('has SPIN phase', () => {
            expect(GAME_PHASES.SPIN).toBe('spin');
        });

        test('has RESULT phase', () => {
            expect(GAME_PHASES.RESULT).toBe('result');
        });
    });

    describe('GAME_STATUS', () => {
        test('has IDLE status', () => {
            expect(GAME_STATUS.IDLE).toBe('idle');
        });

        test('has SPIN status', () => {
            expect(GAME_STATUS.SPIN).toBe('spin');
        });

        test('has RESULT status', () => {
            expect(GAME_STATUS.RESULT).toBe('result');
        });
    });

    describe('OUTCOMES', () => {
        test('has WIN outcome', () => {
            expect(OUTCOMES.WIN).toBe('win');
        });

        test('has LOSS outcome', () => {
            expect(OUTCOMES.LOSS).toBe('loss');
        });

        test('has DRAW outcome', () => {
            expect(OUTCOMES.DRAW).toBe('draw');
        });
    });
});
