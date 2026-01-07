/**
 * Tests for gameStateValidator.js
 * Validates game state integrity
 */
import {
    validateCoinflipState,
    validateDiceState,
    validateRPSState,
    validateMemoryState,
    validateQuickDrawState,
    validateBlockValidationState,
    validateGameState
} from './gameStateValidator';

describe('validateCoinflipState', () => {
    test('validates valid coinflip state', () => {
        const state = {
            phase: 'selection',
            playerSide: 'heads',
            selectionTimeLeft: 10
        };
        const result = validateCoinflipState(state);
        expect(result.isValid).toBe(true);
    });

    test('rejects invalid phase', () => {
        const state = { phase: 'invalid_phase', playerSide: 'heads' };
        const result = validateCoinflipState(state);
        expect(result.isValid).toBe(false);
        expect(result.errors).toContain('Invalid phase: invalid_phase');
    });

    test('rejects invalid playerSide', () => {
        const state = { phase: 'selection', playerSide: 'invalid_side' };
        const result = validateCoinflipState(state);
        expect(result.isValid).toBe(false);
        expect(result.errors).toContain('Invalid playerSide: invalid_side');
    });

    test('rejects invalid selectionTimeLeft', () => {
        const state = { phase: 'selection', playerSide: null, selectionTimeLeft: 20 };
        const result = validateCoinflipState(state);
        expect(result.isValid).toBe(false);
        expect(result.errors[0]).toContain('selectionTimeLeft');
    });

    test('allows null playerSide', () => {
        const state = { phase: 'setup', playerSide: null };
        const result = validateCoinflipState(state);
        expect(result.isValid).toBe(true);
    });
});

describe('validateDiceState', () => {
    test('validates valid dice state', () => {
        const state = { phase: 'spin' };
        const result = validateDiceState(state);
        expect(result.isValid).toBe(true);
    });

    test('validates dice result within range', () => {
        const state = {
            phase: 'result',
            result: { player: 6, opponent: 3 }
        };
        const result = validateDiceState(state);
        expect(result.isValid).toBe(true);
    });

    test('rejects invalid player roll', () => {
        const state = {
            phase: 'result',
            result: { player: 15, opponent: 3 }
        };
        const result = validateDiceState(state);
        expect(result.isValid).toBe(false);
        expect(result.errors[0]).toContain('Invalid player roll');
    });

    test('rejects invalid opponent roll', () => {
        const state = {
            phase: 'result',
            result: { player: 5, opponent: 0 }
        };
        const result = validateDiceState(state);
        expect(result.isValid).toBe(false);
        expect(result.errors[0]).toContain('Invalid opponent roll');
    });
});

describe('validateRPSState', () => {
    test('validates valid RPS state', () => {
        const state = {
            phase: 'selection',
            playerSide: 'rock',
            scores: { player: 1, opponent: 0 }
        };
        const result = validateRPSState(state);
        expect(result.isValid).toBe(true);
    });

    test('validates all RPS choices', () => {
        ['rock', 'paper', 'scissors', null].forEach(choice => {
            const state = { phase: 'selection', playerSide: choice };
            const result = validateRPSState(state);
            expect(result.isValid).toBe(true);
        });
    });

    test('rejects invalid scores', () => {
        const state = {
            phase: 'result',
            playerSide: null,
            scores: { player: 5, opponent: 0 }
        };
        const result = validateRPSState(state);
        expect(result.isValid).toBe(false);
        expect(result.errors[0]).toContain('Invalid player score');
    });
});

describe('validateMemoryState', () => {
    test('validates valid memory state', () => {
        const state = {
            phase: 'spin',
            memoryPhase: 'playing',
            board: new Array(16).fill(0),
            memoryScores: { player: 4, opponent: 3 },
            timeLeft: 20
        };
        const result = validateMemoryState(state);
        expect(result.isValid).toBe(true);
    });

    test('rejects invalid board size', () => {
        const state = {
            phase: 'spin',
            board: new Array(10).fill(0)
        };
        const result = validateMemoryState(state);
        expect(result.isValid).toBe(false);
        expect(result.errors[0]).toContain('Invalid board size');
    });

    test('rejects invalid memoryPhase', () => {
        const state = {
            phase: 'spin',
            memoryPhase: 'invalid'
        };
        const result = validateMemoryState(state);
        expect(result.isValid).toBe(false);
        expect(result.errors[0]).toContain('Invalid memoryPhase');
    });

    test('rejects invalid pair count', () => {
        const state = {
            phase: 'spin',
            memoryScores: { player: 10, opponent: 0 }
        };
        const result = validateMemoryState(state);
        expect(result.isValid).toBe(false);
        expect(result.errors[0]).toContain('Invalid player pairs');
    });
});

describe('validateQuickDrawState', () => {
    test('validates valid quickdraw state', () => {
        const state = {
            phase: 'spin',
            quickDrawState: 'signal',
            countdownLeft: 3,
            reactionTime: 250
        };
        const result = validateQuickDrawState(state);
        expect(result.isValid).toBe(true);
    });

    test('validates all quickdraw states', () => {
        ['countdown', 'waiting', 'signal', 'result'].forEach(qState => {
            // Use a valid phase for each state
            const phase = qState === 'result' ? 'result' : 'spin';
            const state = { phase, quickDrawState: qState, reactionTime: null };
            const result = validateQuickDrawState(state);
            expect(result.isValid).toBe(true);
        });
    });

    test('rejects invalid countdown', () => {
        const state = {
            phase: 'spin',
            countdownLeft: 10
        };
        const result = validateQuickDrawState(state);
        expect(result.isValid).toBe(false);
        expect(result.errors[0]).toContain('Invalid countdownLeft');
    });

    test('allows null reactionTime', () => {
        const state = {
            phase: 'spin',
            quickDrawState: 'waiting',
            reactionTime: null
        };
        const result = validateQuickDrawState(state);
        expect(result.isValid).toBe(true);
    });
});

describe('validateBlockValidationState', () => {
    test('validates valid blockvalidation state', () => {
        const state = {
            phase: 'spin',
            blockState: 'playing',
            blockGrid: new Array(25).fill(0),
            blockNextTarget: 15,
            blockTimeLeft: 45
        };
        const result = validateBlockValidationState(state);
        expect(result.isValid).toBe(true);
    });

    test('rejects invalid grid size', () => {
        const state = {
            phase: 'spin',
            blockGrid: new Array(16).fill(0)
        };
        const result = validateBlockValidationState(state);
        expect(result.isValid).toBe(false);
        expect(result.errors[0]).toContain('Invalid grid size');
    });

    test('rejects invalid target', () => {
        const state = {
            phase: 'spin',
            blockNextTarget: 30
        };
        const result = validateBlockValidationState(state);
        expect(result.isValid).toBe(false);
        expect(result.errors[0]).toContain('Invalid blockNextTarget');
    });
});

describe('validateGameState (main validator)', () => {
    test('routes to correct validator for coinflip', () => {
        const state = { phase: 'setup', playerSide: null };
        const result = validateGameState('coinflip', state);
        expect(result.isValid).toBe(true);
    });

    test('routes to correct validator for dice', () => {
        const state = { phase: 'spin' };
        const result = validateGameState('dice', state);
        expect(result.isValid).toBe(true);
    });

    test('routes to correct validator for rps', () => {
        const state = { phase: 'selection', playerSide: 'rock' };
        const result = validateGameState('rps', state);
        expect(result.isValid).toBe(true);
    });

    test('routes to correct validator for memory', () => {
        const state = { phase: 'spin' };
        const result = validateGameState('memory', state);
        expect(result.isValid).toBe(true);
    });

    test('routes to correct validator for quickdraw', () => {
        const state = { phase: 'spin', quickDrawState: 'countdown', reactionTime: null };
        const result = validateGameState('quickdraw', state);
        expect(result.isValid).toBe(true);
    });

    test('routes to correct validator for blockvalidation', () => {
        const state = { phase: 'spin' };
        const result = validateGameState('blockvalidation', state);
        expect(result.isValid).toBe(true);
    });

    test('returns error for unknown game type', () => {
        const result = validateGameState('unknown_game', {});
        expect(result.isValid).toBe(false);
        expect(result.errors[0]).toContain('Unknown game type');
    });
});
