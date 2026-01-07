/**
 * Tests for useSound hook (re-export from SoundContext)
 */
import { useSound } from './useSound';

describe('useSound', () => {
    test('exports useSound function', () => {
        expect(useSound).toBeDefined();
        expect(typeof useSound).toBe('function');
    });
});
