/**
 * Tests for securityProxy.js
 * Patrón Proxy para validación de acciones
 */
import { createSecureActionProxy } from './securityProxy';

// Mock secureLog
jest.mock('./security', () => ({
    secureLog: {
        info: jest.fn(),
        error: jest.fn(),
        warn: jest.fn(),
        security: jest.fn()
    }
}));

import { secureLog } from './security';

describe('createSecureActionProxy', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('calls target function with valid data', () => {
        const targetFn = jest.fn((data) => data.amount * 2);
        const proxy = createSecureActionProxy(targetFn, {
            minAmount: 1,
            requiredFields: ['amount']
        });

        const result = proxy({ amount: 10 });

        expect(targetFn).toHaveBeenCalledWith({ amount: 10 });
        expect(result).toBe(20);
    });

    test('logs attempt before calling function', () => {
        const targetFn = jest.fn();
        const proxy = createSecureActionProxy(targetFn);

        proxy({ data: 'test' });

        expect(secureLog.info).toHaveBeenCalled();
    });

    test('returns null for non-object data when requiredFields is set', () => {
        const targetFn = jest.fn();
        const proxy = createSecureActionProxy(targetFn, {
            requiredFields: ['field1']
        });

        const result = proxy('not an object');

        expect(result).toBeNull();
        expect(targetFn).not.toHaveBeenCalled();
        expect(secureLog.error).toHaveBeenCalled();
    });

    test('returns null for null data when requiredFields is set', () => {
        const targetFn = jest.fn();
        const proxy = createSecureActionProxy(targetFn, {
            requiredFields: ['field1']
        });

        const result = proxy(null);

        expect(result).toBeNull();
        expect(targetFn).not.toHaveBeenCalled();
    });

    test('returns null when required field is missing', () => {
        const targetFn = jest.fn();
        const proxy = createSecureActionProxy(targetFn, {
            requiredFields: ['amount', 'label']
        });

        const result = proxy({ amount: 10 }); // missing 'label'

        expect(result).toBeNull();
        expect(targetFn).not.toHaveBeenCalled();
        expect(secureLog.error).toHaveBeenCalledWith(
            expect.stringContaining('Missing required field: label')
        );
    });

    test('returns null when amount is below minimum', () => {
        const targetFn = jest.fn();
        const proxy = createSecureActionProxy(targetFn, {
            minAmount: 10,
            requiredFields: ['amount']
        });

        const result = proxy({ amount: 5 });

        expect(result).toBeNull();
        expect(targetFn).not.toHaveBeenCalled();
        expect(secureLog.error).toHaveBeenCalledWith(
            expect.stringContaining('Amount below minimum')
        );
    });

    test('passes when amount equals minimum', () => {
        const targetFn = jest.fn((data) => 'success');
        const proxy = createSecureActionProxy(targetFn, {
            minAmount: 10,
            requiredFields: ['amount']
        });

        const result = proxy({ amount: 10 });

        expect(result).toBe('success');
        expect(targetFn).toHaveBeenCalled();
    });

    test('works with no rules (default)', () => {
        const targetFn = jest.fn(() => 'result');
        const proxy = createSecureActionProxy(targetFn);

        const result = proxy({ any: 'data' });

        expect(result).toBe('result');
    });

    test('checks all required fields', () => {
        const targetFn = jest.fn();
        const proxy = createSecureActionProxy(targetFn, {
            requiredFields: ['a', 'b', 'c']
        });

        const result = proxy({ a: 1, c: 3 }); // missing 'b'

        expect(result).toBeNull();
        expect(secureLog.error).toHaveBeenCalledWith(
            expect.stringContaining('Missing required field: b')
        );
    });

    test('logs success when checks pass', () => {
        const targetFn = jest.fn();
        const proxy = createSecureActionProxy(targetFn, {
            requiredFields: ['name']
        });

        proxy({ name: 'test' });

        expect(secureLog.info).toHaveBeenCalledWith(
            expect.stringContaining('Checks passed')
        );
    });
});
