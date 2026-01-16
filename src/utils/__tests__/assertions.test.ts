/**
 * Assertions Tests - Tests para assertion functions
 */

import {
    assertDefined,
    assertString,
    assertNumber,
    assertPositive,
    assertNonNegative,
    assertBoolean,
    assertArray,
    assertNonEmptyArray,
    assertObject,
    assertEthereumAddress,
    assertInRange,
    assert,
    assertNever,
    isDefined,
    isString,
    isNumber,
    isObject,
    isEthereumAddress,
    isLiteral,
    isOneOf,
    assertFromGuard,
} from '../assertions';

describe('Assertion Functions', () => {
    describe('assertDefined', () => {
        it('should pass for defined values', () => {
            expect(() => assertDefined('hello')).not.toThrow();
            expect(() => assertDefined(0)).not.toThrow();
            expect(() => assertDefined(false)).not.toThrow();
            expect(() => assertDefined({})).not.toThrow();
        });

        it('should throw for null or undefined', () => {
            expect(() => assertDefined(null)).toThrow();
            expect(() => assertDefined(undefined)).toThrow();
        });
    });

    describe('assertString', () => {
        it('should pass for strings', () => {
            expect(() => assertString('hello')).not.toThrow();
            expect(() => assertString('')).not.toThrow();
        });

        it('should throw for non-strings', () => {
            expect(() => assertString(123)).toThrow();
            expect(() => assertString(null)).toThrow();
        });
    });

    describe('assertNumber', () => {
        it('should pass for finite numbers', () => {
            expect(() => assertNumber(42)).not.toThrow();
            expect(() => assertNumber(0)).not.toThrow();
            expect(() => assertNumber(-5.5)).not.toThrow();
        });

        it('should throw for non-numbers or non-finite', () => {
            expect(() => assertNumber('42')).toThrow();
            expect(() => assertNumber(NaN)).toThrow();
            expect(() => assertNumber(Infinity)).toThrow();
        });
    });

    describe('assertPositive', () => {
        it('should pass for positive numbers', () => {
            expect(() => assertPositive(1)).not.toThrow();
            expect(() => assertPositive(0.001)).not.toThrow();
        });

        it('should throw for zero or negative', () => {
            expect(() => assertPositive(0)).toThrow();
            expect(() => assertPositive(-1)).toThrow();
        });
    });

    describe('assertNonNegative', () => {
        it('should pass for zero and positive', () => {
            expect(() => assertNonNegative(0)).not.toThrow();
            expect(() => assertNonNegative(100)).not.toThrow();
        });

        it('should throw for negative', () => {
            expect(() => assertNonNegative(-1)).toThrow();
        });
    });

    describe('assertBoolean', () => {
        it('should pass for booleans', () => {
            expect(() => assertBoolean(true)).not.toThrow();
            expect(() => assertBoolean(false)).not.toThrow();
        });

        it('should throw for non-booleans', () => {
            expect(() => assertBoolean(1)).toThrow();
            expect(() => assertBoolean('true')).toThrow();
        });
    });

    describe('assertArray', () => {
        it('should pass for arrays', () => {
            expect(() => assertArray([])).not.toThrow();
            expect(() => assertArray([1, 2, 3])).not.toThrow();
        });

        it('should throw for non-arrays', () => {
            expect(() => assertArray({})).toThrow();
            expect(() => assertArray('array')).toThrow();
        });
    });

    describe('assertNonEmptyArray', () => {
        it('should pass for non-empty arrays', () => {
            expect(() => assertNonEmptyArray([1])).not.toThrow();
            expect(() => assertNonEmptyArray(['a', 'b'])).not.toThrow();
        });

        it('should throw for empty arrays', () => {
            expect(() => assertNonEmptyArray([])).toThrow();
        });
    });

    describe('assertObject', () => {
        it('should pass for plain objects', () => {
            expect(() => assertObject({})).not.toThrow();
            expect(() => assertObject({ a: 1 })).not.toThrow();
        });

        it('should throw for null, arrays, primitives', () => {
            expect(() => assertObject(null)).toThrow();
            expect(() => assertObject([])).toThrow();
            expect(() => assertObject('object')).toThrow();
        });
    });

    describe('assertEthereumAddress', () => {
        it('should pass for valid addresses', () => {
            expect(() => assertEthereumAddress('0x1234567890123456789012345678901234567890')).not.toThrow();
            expect(() => assertEthereumAddress('0xABCDEF1234567890abcdef1234567890ABCDEF12')).not.toThrow();
        });

        it('should throw for invalid addresses', () => {
            expect(() => assertEthereumAddress('0x123')).toThrow();
            expect(() => assertEthereumAddress('not an address')).toThrow();
            expect(() => assertEthereumAddress('1234567890123456789012345678901234567890')).toThrow();
        });
    });

    describe('assertInRange', () => {
        it('should pass for values in range', () => {
            expect(() => assertInRange(5, 0, 10)).not.toThrow();
            expect(() => assertInRange(0, 0, 10)).not.toThrow();
            expect(() => assertInRange(10, 0, 10)).not.toThrow();
        });

        it('should throw for values out of range', () => {
            expect(() => assertInRange(-1, 0, 10)).toThrow();
            expect(() => assertInRange(11, 0, 10)).toThrow();
        });
    });

    describe('assert', () => {
        it('should pass for truthy conditions', () => {
            expect(() => assert(true)).not.toThrow();
            expect(() => assert(1 === 1)).not.toThrow();
        });

        it('should throw for falsy conditions', () => {
            expect(() => assert(false)).toThrow();
            expect(() => assert(null)).toThrow();
        });
    });

    describe('assertNever', () => {
        it('should always throw', () => {
            // Testing exhaustive check - this should never be called in real code
            expect(() => assertNever('unexpected' as never)).toThrow();
        });
    });
});

describe('Type Guards', () => {
    describe('isDefined', () => {
        it('should return true for defined values', () => {
            expect(isDefined('hello')).toBe(true);
            expect(isDefined(0)).toBe(true);
            expect(isDefined(false)).toBe(true);
        });

        it('should return false for null/undefined', () => {
            expect(isDefined(null)).toBe(false);
            expect(isDefined(undefined)).toBe(false);
        });
    });

    describe('isString', () => {
        it('should correctly identify strings', () => {
            expect(isString('hello')).toBe(true);
            expect(isString(123)).toBe(false);
        });
    });

    describe('isNumber', () => {
        it('should correctly identify finite numbers', () => {
            expect(isNumber(42)).toBe(true);
            expect(isNumber(NaN)).toBe(false);
            expect(isNumber(Infinity)).toBe(false);
        });
    });

    describe('isObject', () => {
        it('should correctly identify plain objects', () => {
            expect(isObject({})).toBe(true);
            expect(isObject(null)).toBe(false);
            expect(isObject([])).toBe(false);
        });
    });

    describe('isEthereumAddress', () => {
        it('should correctly identify Ethereum addresses', () => {
            expect(isEthereumAddress('0x1234567890123456789012345678901234567890')).toBe(true);
            expect(isEthereumAddress('0x123')).toBe(false);
        });
    });
});

describe('Factory Functions', () => {
    describe('isLiteral', () => {
        it('should create guard for literal values', () => {
            const isHello = isLiteral('hello');
            expect(isHello('hello')).toBe(true);
            expect(isHello('world')).toBe(false);
        });
    });

    describe('isOneOf', () => {
        it('should create guard for multiple values', () => {
            const isStatus = isOneOf(['pending', 'active', 'completed'] as const);
            expect(isStatus('pending')).toBe(true);
            expect(isStatus('unknown')).toBe(false);
        });
    });

    describe('assertFromGuard', () => {
        it('should create assertion from guard', () => {
            const assertIsString = assertFromGuard(isString, 'Not a string');
            expect(() => assertIsString('hello')).not.toThrow();
            expect(() => assertIsString(123)).toThrow('Not a string');
        });
    });
});
