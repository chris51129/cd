/**
 * Security Hardening - Prototype Pollution Defense
 * 
 * WHY (Protocolo Sigma §6.1):
 * Prototype Pollution attacks inject __proto__, constructor, prototype keys
 * into JSON inputs to modify global object prototypes.
 * 
 * DEFENSE:
 * 1. Freeze built-in prototypes at application start
 * 2. Validate JSON inputs to reject forbidden keys
 * 3. Use Object.create(null) for dictionaries
 * 
 * This module should be imported FIRST in main.tsx
 */

// ============================================
// Forbidden Keys for JSON Validation
// ============================================

/**
 * Keys that should never appear in user input
 * WHY: These keys can be exploited for prototype pollution
 */
export const FORBIDDEN_KEYS = Object.freeze([
    '__proto__',
    'constructor',
    'prototype',
] as const);

// ============================================
// Environment Detection (Jest/Vite compatible)
// ============================================

/**
 * Check if running in development mode
 * WHY: Works in both Vite (import.meta.env) and Jest (process.env)
 */
const isDevelopment = (): boolean => {
    try {
        // Node.js environment (Jest)
        if (typeof process !== 'undefined' && process.env?.NODE_ENV) {
            return process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test';
        }
    } catch {
        // Ignore - not in Node
    }
    return false;
};

/**
 * Check if running in production mode
 */
const isProduction = (): boolean => {
    try {
        if (typeof process !== 'undefined' && process.env?.NODE_ENV) {
            return process.env.NODE_ENV === 'production';
        }
    } catch {
        // Ignore - not in Node
    }
    return false;
};

// ============================================
// Prototype Freeze (Hardening)
// ============================================

/**
 * Freeze all built-in prototypes to prevent modification
 * WHY: Once frozen, attackers cannot inject properties into prototypes
 * 
 * @returns true if successful, false if already frozen or error
 */
export const freezePrototypes = (): boolean => {
    try {
        // Only freeze in browser environment
        if (typeof window === 'undefined') return false;

        // Check if already frozen
        if (Object.isFrozen(Object.prototype)) return true;

        // Freeze core prototypes
        Object.freeze(Object.prototype);
        Object.freeze(Array.prototype);
        Object.freeze(Function.prototype);
        Object.freeze(String.prototype);
        Object.freeze(Number.prototype);
        Object.freeze(Boolean.prototype);
        Object.freeze(RegExp.prototype);
        Object.freeze(Date.prototype);
        Object.freeze(Error.prototype);

        // Log success in development
        if (isDevelopment()) {
            console.log('[Security] Prototypes frozen successfully');
        }

        return true;
    } catch (error) {
        console.error('[Security] Failed to freeze prototypes:', error);
        return false;
    }
};

// ============================================
// Safe Dictionary Creation
// ============================================

/**
 * Create a prototype-free object for use as dictionary
 * WHY: Object.create(null) has no prototype chain, immune to pollution
 * 
 * @example
 * const dict = createSafeDict<string>();
 * dict['key'] = 'value';
 * dict['__proto__'] // undefined, not Object.prototype
 */
export const createSafeDict = <T>(): Record<string, T> => {
    return Object.create(null) as Record<string, T>;
};

// ============================================
// JSON Sanitization
// ============================================

/**
 * Check if a key is a forbidden prototype pollution key
 */
const isForbiddenKey = (key: string): boolean => {
    return FORBIDDEN_KEYS.includes(key as typeof FORBIDDEN_KEYS[number]);
};

/**
 * Recursively sanitize an object, removing forbidden keys
 * WHY: Parse, Don't Validate - sanitize at system boundary
 * 
 * @param obj - Object to sanitize
 * @returns Sanitized object with forbidden keys removed
 */
export const sanitizeJSON = <T>(obj: unknown): T => {
    if (obj === null || obj === undefined) {
        return obj as T;
    }

    if (typeof obj !== 'object') {
        return obj as T;
    }

    if (Array.isArray(obj)) {
        return obj.map(item => sanitizeJSON(item)) as T;
    }

    // Create prototype-free object for safety
    const result = createSafeDict<unknown>();

    for (const [key, value] of Object.entries(obj)) {
        // Skip forbidden keys
        if (isForbiddenKey(key)) {
            if (isDevelopment()) {
                console.warn(`[Security] Removed forbidden key: ${key}`);
            }
            continue;
        }

        // Recursively sanitize nested objects
        result[key] = sanitizeJSON(value);
    }

    return result as T;
};

/**
 * Safe JSON parse with prototype pollution protection
 * WHY: Every JSON.parse from external source should use this
 * 
 * @param jsonString - JSON string to parse
 * @returns Sanitized parsed object
 * @throws SyntaxError if invalid JSON
 */
export const safeJSONParse = <T>(jsonString: string): T => {
    const parsed = JSON.parse(jsonString) as unknown;
    return sanitizeJSON<T>(parsed);
};

/**
 * Validate that an object contains no forbidden keys (deep check)
 * WHY: Use for validation without modification
 * 
 * @param obj - Object to validate
 * @returns true if safe, false if contains forbidden keys
 */
export const isJSONSafe = (obj: unknown): boolean => {
    if (obj === null || obj === undefined || typeof obj !== 'object') {
        return true;
    }

    if (Array.isArray(obj)) {
        return obj.every(item => isJSONSafe(item));
    }

    for (const key of Object.keys(obj)) {
        if (isForbiddenKey(key)) {
            return false;
        }
        if (!isJSONSafe((obj as Record<string, unknown>)[key])) {
            return false;
        }
    }

    return true;
};

// ============================================
// Auto-initialize in production
// ============================================

// Freeze prototypes immediately when module is loaded in production
if (typeof window !== 'undefined' && isProduction()) {
    freezePrototypes();
}
