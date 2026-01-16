/**
 * Assertion Functions - Runtime type assertions with TypeScript narrowing
 * 
 * WHY (Skill typescript-advanced-types): Las assertion functions
 * combinan validación runtime con narrowing de tipos en compile-time.
 * 
 * PATTERN: asserts value is T
 */

// ============================================
// Basic Assertions
// ============================================

/**
 * Assert value is defined (not null or undefined)
 */
export function assertDefined<T>(
    value: T | null | undefined,
    message = 'Value is null or undefined'
): asserts value is T {
    if (value === null || value === undefined) {
        throw new Error(`[Assertion] ${message}`);
    }
}

/**
 * Assert value is a string
 */
export function assertString(
    value: unknown,
    message = 'Value is not a string'
): asserts value is string {
    if (typeof value !== 'string') {
        throw new Error(`[Assertion] ${message}`);
    }
}

/**
 * Assert value is a number
 */
export function assertNumber(
    value: unknown,
    message = 'Value is not a number'
): asserts value is number {
    if (typeof value !== 'number' || !Number.isFinite(value)) {
        throw new Error(`[Assertion] ${message}`);
    }
}

/**
 * Assert value is a positive number
 */
export function assertPositive(
    value: unknown,
    message = 'Value is not a positive number'
): asserts value is number {
    assertNumber(value, message);
    if (value <= 0) {
        throw new Error(`[Assertion] ${message}: ${value}`);
    }
}

/**
 * Assert value is a non-negative number
 */
export function assertNonNegative(
    value: unknown,
    message = 'Value is negative'
): asserts value is number {
    assertNumber(value, message);
    if (value < 0) {
        throw new Error(`[Assertion] ${message}: ${value}`);
    }
}

/**
 * Assert value is a boolean
 */
export function assertBoolean(
    value: unknown,
    message = 'Value is not a boolean'
): asserts value is boolean {
    if (typeof value !== 'boolean') {
        throw new Error(`[Assertion] ${message}`);
    }
}

/**
 * Assert value is an array
 */
export function assertArray<T = unknown>(
    value: unknown,
    message = 'Value is not an array'
): asserts value is T[] {
    if (!Array.isArray(value)) {
        throw new Error(`[Assertion] ${message}`);
    }
}

/**
 * Assert value is a non-empty array
 */
export function assertNonEmptyArray<T = unknown>(
    value: unknown,
    message = 'Value is not a non-empty array'
): asserts value is [T, ...T[]] {
    assertArray(value, message);
    if (value.length === 0) {
        throw new Error(`[Assertion] ${message}`);
    }
}

/**
 * Assert value is an object (not null, not array)
 */
export function assertObject(
    value: unknown,
    message = 'Value is not an object'
): asserts value is Record<string, unknown> {
    if (typeof value !== 'object' || value === null || Array.isArray(value)) {
        throw new Error(`[Assertion] ${message}`);
    }
}

// ============================================
// Domain-Specific Assertions
// ============================================

/**
 * Assert value is a valid Ethereum address
 */
export function assertEthereumAddress(
    value: unknown,
    message = 'Value is not a valid Ethereum address'
): asserts value is `0x${string}` {
    assertString(value, message);
    if (!/^0x[a-fA-F0-9]{40}$/.test(value)) {
        throw new Error(`[Assertion] ${message}: ${value}`);
    }
}

/**
 * Assert value is a valid hex string
 */
export function assertHexString(
    value: unknown,
    message = 'Value is not a valid hex string'
): asserts value is `0x${string}` {
    assertString(value, message);
    if (!/^0x[a-fA-F0-9]*$/.test(value)) {
        throw new Error(`[Assertion] ${message}: ${value}`);
    }
}

/**
 * Assert value is within a range
 */
export function assertInRange(
    value: unknown,
    min: number,
    max: number,
    message?: string
): asserts value is number {
    assertNumber(value, message ?? `Value ${value} is not in range [${min}, ${max}]`);
    if (value < min || value > max) {
        throw new Error(`[Assertion] Value ${value} is out of range [${min}, ${max}]`);
    }
}

/**
 * Assert condition is true
 */
export function assert(
    condition: unknown,
    message = 'Assertion failed'
): asserts condition {
    if (!condition) {
        throw new Error(`[Assertion] ${message}`);
    }
}

/**
 * Assert code path is unreachable (exhaustive switch check)
 */
export function assertNever(value: never, message?: string): never {
    throw new Error(message ?? `[Assertion] Unexpected value: ${JSON.stringify(value)}`);
}

// ============================================
// Type Guards (for non-throwing checks)
// ============================================

/**
 * Check if value is defined
 */
export function isDefined<T>(value: T | null | undefined): value is T {
    return value !== null && value !== undefined;
}

/**
 * Check if value is a string
 */
export function isString(value: unknown): value is string {
    return typeof value === 'string';
}

/**
 * Check if value is a number
 */
export function isNumber(value: unknown): value is number {
    return typeof value === 'number' && Number.isFinite(value);
}

/**
 * Check if value is an object
 */
export function isObject(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 * Check if value is an Ethereum address
 */
export function isEthereumAddress(value: unknown): value is `0x${string}` {
    return typeof value === 'string' && /^0x[a-fA-F0-9]{40}$/.test(value);
}

// ============================================
// Factory Functions
// ============================================

/**
 * Create a type guard for a specific value
 */
export function isLiteral<T extends string | number | boolean>(
    expected: T
): (value: unknown) => value is T {
    return (value): value is T => value === expected;
}

/**
 * Create a type guard for an enum
 */
export function isOneOf<T extends readonly unknown[]>(
    values: T
): (value: unknown) => value is T[number] {
    const set = new Set(values);
    return (value): value is T[number] => set.has(value);
}

/**
 * Create an assertion function from a type guard
 */
export function assertFromGuard<T>(
    guard: (value: unknown) => value is T,
    message: string
): (value: unknown) => asserts value is T {
    return (value): asserts value is T => {
        if (!guard(value)) {
            throw new Error(`[Assertion] ${message}`);
        }
    };
}
