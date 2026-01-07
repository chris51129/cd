/**
 * Security Utilities for CryptoDuels
 * OWASP Top 10:2021 Compliant
 * 
 * This module provides secure implementations for:
 * - Cryptographically secure random number generation (A02)
 * - Input validation and sanitization (A03)
 * - Secure logging (A09)
 * - Rate limiting (A04)
 */

// ============================================
// Result Types (Parse, Don't Validate Pattern)
// ============================================

/**
 * Validation result for successful validation
 */
export interface ValidationSuccess<T> {
    readonly valid: true;
    readonly value: T;
    readonly error: null;
}

/**
 * Validation result for failed validation
 */
export interface ValidationFailure {
    readonly valid: false;
    readonly value: null;
    readonly error: string;
}

/**
 * Union type for validation results
 */
export type ValidationResult<T> = ValidationSuccess<T> | ValidationFailure;

/**
 * Object validation result
 */
export interface ObjectValidationResult {
    readonly valid: boolean;
    readonly errors: readonly string[];
}

/**
 * Rate limiter result
 */
export interface RateLimitResult {
    readonly allowed: boolean;
    readonly retryAfter: number;
}

/**
 * Rate limiter function type
 */
export type RateLimiterFn = () => RateLimitResult;

/**
 * Schema type for object validation
 */
export type ObjectSchema = Record<string, string>;

// ============================================
// A02:2021 - Cryptographic Failures
// Secure Random Number Generation
// ============================================

/**
 * Generate a cryptographically secure random integer between min and max (inclusive)
 * Uses Web Crypto API instead of Math.random()
 */
export const secureRandomInt = (min: number, max: number): number => {
    if (!Number.isInteger(min) || !Number.isInteger(max)) {
        throw new Error('[Security] secureRandomInt: min and max must be integers');
    }
    if (min > max) {
        throw new Error('[Security] secureRandomInt: min must be <= max');
    }
    if (min === max) return min;

    const range = max - min + 1;

    // Use crypto.getRandomValues for secure randomness
    const randomBuffer = new Uint32Array(1);
    crypto.getRandomValues(randomBuffer);

    // Convert to number in range [0, 1) then scale to our range
    const randomValue = randomBuffer[0] / (0xFFFFFFFF + 1);
    return Math.floor(randomValue * range) + min;
};

/**
 * Securely shuffle an array using Fisher-Yates with crypto RNG
 */
export const secureShuffleArray = <T>(array: readonly T[]): T[] => {
    if (!Array.isArray(array)) {
        throw new Error('[Security] secureShuffleArray: input must be an array');
    }

    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = secureRandomInt(0, i);
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
};

// ============================================
// A03:2021 - Injection Prevention
// Input Validation & Sanitization
// ============================================

/**
 * Validate that a value is a safe integer within bounds
 */
export const validateInteger = (
    value: unknown,
    min: number = Number.MIN_SAFE_INTEGER,
    max: number = Number.MAX_SAFE_INTEGER
): ValidationResult<number> => {
    if (typeof value !== 'number' || !Number.isInteger(value)) {
        return { valid: false, value: null, error: 'Not a valid integer' };
    }
    if (value < min || value > max) {
        return { valid: false, value: null, error: `Value out of range [${min}, ${max}]` };
    }
    return { valid: true, value, error: null };
};

/**
 * Validate that a value is one of allowed options (whitelist)
 */
export const validateEnum = <T>(
    value: unknown,
    allowedValues: readonly T[]
): ValidationResult<T> => {
    if (!Array.isArray(allowedValues)) {
        throw new Error('[Security] validateEnum: allowedValues must be an array');
    }
    if (!allowedValues.includes(value as T)) {
        return { valid: false, value: null, error: 'Value not in allowed list' };
    }
    return { valid: true, value: value as T, error: null };
};

/**
 * Validate and sanitize a string (prevent XSS)
 */
export const sanitizeString = (
    value: unknown,
    maxLength: number = 1000
): ValidationResult<string> => {
    if (typeof value !== 'string') {
        return { valid: false, value: null, error: 'Not a string' };
    }
    if (value.length > maxLength) {
        return { valid: false, value: null, error: `String exceeds max length of ${maxLength}` };
    }

    // Basic XSS sanitization - escape HTML special characters
    const sanitized = value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .replace(/\//g, '&#x2F;');

    return { valid: true, value: sanitized, error: null };
};

/**
 * Validate object has required properties with correct types
 */
export const validateObject = (
    obj: unknown,
    schema: ObjectSchema
): ObjectValidationResult => {
    const errors: string[] = [];

    if (typeof obj !== 'object' || obj === null) {
        return { valid: false, errors: ['Input is not an object'] };
    }

    const record = obj as Record<string, unknown>;

    for (const [key, expectedType] of Object.entries(schema)) {
        if (!(key in record)) {
            errors.push(`Missing required property: ${key}`);
            continue;
        }

        const actualType = typeof record[key];
        if (actualType !== expectedType) {
            errors.push(`Property ${key}: expected ${expectedType}, got ${actualType}`);
        }
    }

    return { valid: errors.length === 0, errors };
};

// ============================================
// A04:2021 - Insecure Design
// Rate Limiting (Client-Side)
// ============================================

/**
 * Create a rate limiter for actions
 */
export const createRateLimiter = (maxActions: number, windowMs: number): RateLimiterFn => {
    const actions: number[] = [];

    return (): RateLimitResult => {
        const now = Date.now();

        // Remove expired actions
        while (actions.length > 0 && actions[0] < now - windowMs) {
            actions.shift();
        }

        if (actions.length >= maxActions) {
            const oldestAction = actions[0];
            const retryAfter = oldestAction + windowMs - now;
            return { allowed: false, retryAfter };
        }

        actions.push(now);
        return { allowed: true, retryAfter: 0 };
    };
};

// ============================================
// A09:2021 - Security Logging and Monitoring
// Secure Logger (Development Only)
// ============================================

const isDevelopment = typeof process !== 'undefined' &&
    process.env &&
    process.env.NODE_ENV === 'development';

/**
 * Secure logger interface
 */
export interface SecureLogger {
    info: (...args: unknown[]) => void;
    warn: (...args: unknown[]) => void;
    error: (...args: unknown[]) => void;
    security: (...args: unknown[]) => void;
}

/**
 * Secure logger that only outputs in development mode
 */
export const secureLog: SecureLogger = {
    info: (...args: unknown[]): void => {
        if (isDevelopment) {
            console.log('[INFO]', ...args);
        }
    },

    warn: (...args: unknown[]): void => {
        if (isDevelopment) {
            console.warn('[WARN]', ...args);
        }
    },

    error: (...args: unknown[]): void => {
        if (isDevelopment) {
            console.error('[ERROR]', ...args);
        } else {
            console.error('[ERROR] An error occurred');
        }
    },

    security: (...args: unknown[]): void => {
        if (isDevelopment) {
            console.warn('[SECURITY]', ...args);
        }
    }
};

// ============================================
// A01:2021 - Broken Access Control
// State Protection Utilities
// ============================================

/**
 * Deep freeze an object to prevent mutation
 */
export const deepFreeze = <T extends object>(obj: T): Readonly<T> => {
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }

    Object.keys(obj).forEach(key => {
        const value = (obj as Record<string, unknown>)[key];
        if (typeof value === 'object' && value !== null) {
            deepFreeze(value as object);
        }
    });

    return Object.freeze(obj);
};

/**
 * Create a read-only proxy for an object (throws on mutation attempts)
 */
export const createReadOnlyProxy = <T extends object>(obj: T): T => {
    return new Proxy(obj, {
        set(): boolean {
            secureLog.security('Attempted to mutate read-only object');
            return false;
        },
        deleteProperty(): boolean {
            secureLog.security('Attempted to delete property from read-only object');
            return false;
        }
    });
};

// ============================================
// Exports Summary
// ============================================
export default {
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
};
