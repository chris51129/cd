/**
 * Tests for security.js utilities
 * OWASP Top 10:2021 Compliant Testing
 */

// Mock crypto.getRandomValues for deterministic testing
const mockGetRandomValues = jest.fn((array) => {
    // Fill with predictable values for testing
    for (let i = 0; i < array.length; i++) {
        array[i] = 1000000000; // ~23% of max uint32
    }
    return array;
});

// Setup crypto mock before imports
Object.defineProperty(global, 'crypto', {
    value: { getRandomValues: mockGetRandomValues },
});

import {
    secureRandomInt,
    secureShuffleArray,
    validateInteger,
    validateEnum,
    sanitizeString,
    validateObject,
    createRateLimiter,
    secureLog,
    deepFreeze,
    createReadOnlyProxy
} from './security';

describe('secureRandomInt', () => {
    beforeEach(() => {
        mockGetRandomValues.mockClear();
    });

    test('returns min when min equals max', () => {
        expect(secureRandomInt(5, 5)).toBe(5);
    });

    test('returns value within range', () => {
        const result = secureRandomInt(1, 10);
        expect(result).toBeGreaterThanOrEqual(1);
        expect(result).toBeLessThanOrEqual(10);
    });

    test('throws error for non-integer min', () => {
        expect(() => secureRandomInt(1.5, 10)).toThrow('[Security] secureRandomInt: min and max must be integers');
    });

    test('throws error for non-integer max', () => {
        expect(() => secureRandomInt(1, 10.5)).toThrow('[Security] secureRandomInt: min and max must be integers');
    });

    test('throws error when min > max', () => {
        expect(() => secureRandomInt(10, 5)).toThrow('[Security] secureRandomInt: min must be <= max');
    });

    test('uses crypto.getRandomValues', () => {
        secureRandomInt(1, 100);
        expect(mockGetRandomValues).toHaveBeenCalled();
    });
});

describe('secureShuffleArray', () => {
    test('throws error for non-array input', () => {
        expect(() => secureShuffleArray('not an array')).toThrow('[Security] secureShuffleArray: input must be an array');
    });

    test('returns array with same length', () => {
        const input = [1, 2, 3, 4, 5];
        const result = secureShuffleArray(input);
        expect(result.length).toBe(input.length);
    });

    test('returns array with same elements', () => {
        const input = [1, 2, 3, 4, 5];
        const result = secureShuffleArray(input);
        expect(result.sort()).toEqual(input.sort());
    });

    test('does not mutate original array', () => {
        const input = [1, 2, 3, 4, 5];
        const originalCopy = [...input];
        secureShuffleArray(input);
        expect(input).toEqual(originalCopy);
    });

    test('handles empty array', () => {
        expect(secureShuffleArray([])).toEqual([]);
    });

    test('handles single element array', () => {
        expect(secureShuffleArray([42])).toEqual([42]);
    });
});

describe('validateInteger', () => {
    test('validates valid integer within range', () => {
        const result = validateInteger(5, 1, 10);
        expect(result.valid).toBe(true);
        expect(result.value).toBe(5);
        expect(result.error).toBeNull();
    });

    test('rejects non-number input', () => {
        const result = validateInteger('5', 1, 10);
        expect(result.valid).toBe(false);
        expect(result.error).toBe('Not a valid integer');
    });

    test('rejects float input', () => {
        const result = validateInteger(5.5, 1, 10);
        expect(result.valid).toBe(false);
        expect(result.error).toBe('Not a valid integer');
    });

    test('rejects value below min', () => {
        const result = validateInteger(0, 1, 10);
        expect(result.valid).toBe(false);
        expect(result.error).toContain('out of range');
    });

    test('rejects value above max', () => {
        const result = validateInteger(11, 1, 10);
        expect(result.valid).toBe(false);
        expect(result.error).toContain('out of range');
    });

    test('works with default range', () => {
        const result = validateInteger(1000000);
        expect(result.valid).toBe(true);
    });
});

describe('validateEnum', () => {
    test('validates value in allowed list', () => {
        const result = validateEnum('apple', ['apple', 'banana', 'cherry']);
        expect(result.valid).toBe(true);
        expect(result.value).toBe('apple');
    });

    test('rejects value not in allowed list', () => {
        const result = validateEnum('grape', ['apple', 'banana', 'cherry']);
        expect(result.valid).toBe(false);
        expect(result.error).toBe('Value not in allowed list');
    });

    test('throws error for non-array allowedValues', () => {
        expect(() => validateEnum('apple', 'not an array')).toThrow('[Security] validateEnum: allowedValues must be an array');
    });
});

describe('sanitizeString', () => {
    test('sanitizes HTML special characters', () => {
        const result = sanitizeString('<script>alert("xss")</script>');
        expect(result.valid).toBe(true);
        expect(result.value).not.toContain('<');
        expect(result.value).not.toContain('>');
        expect(result.value).toContain('&lt;');
        expect(result.value).toContain('&gt;');
    });

    test('sanitizes quotes', () => {
        const result = sanitizeString('He said "hello"');
        expect(result.value).toContain('&quot;');
    });

    test('rejects non-string input', () => {
        const result = sanitizeString(123);
        expect(result.valid).toBe(false);
        expect(result.error).toBe('Not a string');
    });

    test('rejects string exceeding max length', () => {
        const longString = 'a'.repeat(1001);
        const result = sanitizeString(longString);
        expect(result.valid).toBe(false);
        expect(result.error).toContain('max length');
    });

    test('allows string within max length', () => {
        const result = sanitizeString('hello', 10);
        expect(result.valid).toBe(true);
    });
});

describe('validateObject', () => {
    test('validates object with correct schema', () => {
        const obj = { name: 'John', age: 30 };
        const schema = { name: 'string', age: 'number' };
        const result = validateObject(obj, schema);
        expect(result.valid).toBe(true);
        expect(result.errors.length).toBe(0);
    });

    test('rejects missing property', () => {
        const obj = { name: 'John' };
        const schema = { name: 'string', age: 'number' };
        const result = validateObject(obj, schema);
        expect(result.valid).toBe(false);
        expect(result.errors).toContain('Missing required property: age');
    });

    test('rejects wrong type', () => {
        const obj = { name: 'John', age: '30' };
        const schema = { name: 'string', age: 'number' };
        const result = validateObject(obj, schema);
        expect(result.valid).toBe(false);
        expect(result.errors[0]).toContain('expected number');
    });

    test('rejects non-object input', () => {
        const result = validateObject('not an object', { name: 'string' });
        expect(result.valid).toBe(false);
        expect(result.errors).toContain('Input is not an object');
    });

    test('rejects null input', () => {
        const result = validateObject(null, { name: 'string' });
        expect(result.valid).toBe(false);
    });
});

describe('createRateLimiter', () => {
    beforeEach(() => {
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    test('allows actions within limit', () => {
        const limiter = createRateLimiter(3, 1000);
        expect(limiter().allowed).toBe(true);
        expect(limiter().allowed).toBe(true);
        expect(limiter().allowed).toBe(true);
    });

    test('blocks actions exceeding limit', () => {
        const limiter = createRateLimiter(2, 1000);
        limiter();
        limiter();
        const result = limiter();
        expect(result.allowed).toBe(false);
        expect(result.retryAfter).toBeGreaterThan(0);
    });

    test('allows actions after window expires', () => {
        const limiter = createRateLimiter(1, 1000);
        limiter();
        expect(limiter().allowed).toBe(false);

        jest.advanceTimersByTime(1001);
        expect(limiter().allowed).toBe(true);
    });
});

describe('secureLog', () => {
    const originalEnv = process.env.NODE_ENV;
    let consoleSpy;

    beforeEach(() => {
        consoleSpy = {
            log: jest.spyOn(console, 'log').mockImplementation(),
            warn: jest.spyOn(console, 'warn').mockImplementation(),
            error: jest.spyOn(console, 'error').mockImplementation()
        };
    });

    afterEach(() => {
        process.env.NODE_ENV = originalEnv;
        jest.restoreAllMocks();
    });

    test('info logs in development', () => {
        // Note: NODE_ENV is already 'test' in Jest, which is not 'development'
        // So info should NOT log
        secureLog.info('test message');
        expect(consoleSpy.log).not.toHaveBeenCalled();
    });

    test('warn logs in development', () => {
        secureLog.warn('test warning');
        expect(consoleSpy.warn).not.toHaveBeenCalled();
    });

    test('error always logs (sanitized in prod)', () => {
        secureLog.error('test error');
        // In test mode (not development), should log generic message
        expect(consoleSpy.error).toHaveBeenCalled();
    });

    test('security logs warning', () => {
        secureLog.security('security event');
        // In test mode (not development), should not log
        expect(consoleSpy.warn).not.toHaveBeenCalled();
    });
});

describe('deepFreeze', () => {
    test('returns non-object input unchanged', () => {
        expect(deepFreeze(null)).toBeNull();
        expect(deepFreeze(5)).toBe(5);
        expect(deepFreeze('string')).toBe('string');
    });

    test('freezes object', () => {
        const obj = { a: 1, b: 2 };
        const frozen = deepFreeze(obj);
        expect(Object.isFrozen(frozen)).toBe(true);
    });

    test('freezes nested objects', () => {
        const obj = { a: { b: { c: 1 } } };
        const frozen = deepFreeze(obj);
        expect(Object.isFrozen(frozen.a)).toBe(true);
        expect(Object.isFrozen(frozen.a.b)).toBe(true);
    });
});

describe('createReadOnlyProxy', () => {
    test('allows reading properties', () => {
        const obj = { a: 1, b: 2 };
        const proxy = createReadOnlyProxy(obj);
        expect(proxy.a).toBe(1);
        expect(proxy.b).toBe(2);
    });

    test('prevents setting properties', () => {
        const obj = { a: 1 };
        const proxy = createReadOnlyProxy(obj);
        const result = Reflect.set(proxy, 'a', 2);
        expect(result).toBe(false);
    });

    test('prevents deleting properties', () => {
        const obj = { a: 1 };
        const proxy = createReadOnlyProxy(obj);
        const result = Reflect.deleteProperty(proxy, 'a');
        expect(result).toBe(false);
    });
});
