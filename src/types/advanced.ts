/**
 * Advanced Types - Utility types for deep transformations
 * 
 * WHY (Skill typescript-advanced-types): Estos tipos permiten
 * transformaciones profundas de objetos, manteniendo type safety
 * en estructuras anidadas.
 * 
 * USAGE:
 * - DeepReadonly<T>: Hace todas las propiedades readonly recursivamente
 * - DeepPartial<T>: Hace todas las propiedades opcionales recursivamente
 * - Paths<T>: Genera union de todas las rutas de un objeto
 */

// ============================================
// Deep Transformations
// ============================================

/**
 * Makes all properties of T readonly, recursively
 * WHY: Previene mutaciones accidentales en estructuras anidadas
 */
export type DeepReadonly<T> = T extends (infer U)[]
    ? DeepReadonlyArray<U>
    : T extends object
    ? T extends Function
    ? T
    : DeepReadonlyObject<T>
    : T;

type DeepReadonlyArray<T> = ReadonlyArray<DeepReadonly<T>>;
type DeepReadonlyObject<T> = {
    readonly [K in keyof T]: DeepReadonly<T[K]>;
};

/**
 * Makes all properties of T optional, recursively
 * WHY: Útil para updates parciales de estado anidado
 */
export type DeepPartial<T> = T extends (infer U)[]
    ? DeepPartialArray<U>
    : T extends object
    ? T extends Function
    ? T
    : DeepPartialObject<T>
    : T;

type DeepPartialArray<T> = Array<DeepPartial<T>>;
type DeepPartialObject<T> = {
    [K in keyof T]?: DeepPartial<T[K]>;
};

/**
 * Makes all properties of T required, recursively
 * WHY: Asegura que no hay campos undefined en estructuras anidadas
 */
export type DeepRequired<T> = T extends (infer U)[]
    ? DeepRequiredArray<U>
    : T extends object
    ? T extends Function
    ? T
    : DeepRequiredObject<T>
    : T;

type DeepRequiredArray<T> = Array<DeepRequired<T>>;
type DeepRequiredObject<T> = {
    [K in keyof T]-?: DeepRequired<T[K]>;
};

// ============================================
// Path Types (Template Literal Types)
// ============================================

/**
 * Generates all possible paths through an object as a union
 * Example: { a: { b: string } } → "a" | "a.b"
 */
export type Paths<T, Depth extends number = 5> = Depth extends 0
    ? never
    : T extends object
    ? {
        [K in keyof T & string]: K | `${K}.${Paths<T[K], Prev[Depth]>}`
    }[keyof T & string]
    : never;

// Helper for recursion depth limit
type Prev = [never, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

/**
 * Gets the type at a path
 * Example: PathValue<{ a: { b: string } }, "a.b"> → string
 */
export type PathValue<T, P extends string> = P extends `${infer K}.${infer Rest}`
    ? K extends keyof T
    ? PathValue<T[K], Rest>
    : never
    : P extends keyof T
    ? T[P]
    : never;

// ============================================
// Template Literal Types for Events
// ============================================

/**
 * Event name patterns for type-safe event handling
 */
export type GameEventName =
    | `game:${GamePhaseEvent}`
    | `player:${PlayerEvent}`
    | `ui:${UIEvent}`;

type GamePhaseEvent = 'start' | 'end' | 'pause' | 'resume' | 'tick';
type PlayerEvent = 'join' | 'leave' | 'ready' | 'action' | 'timeout';
type UIEvent = 'modal:open' | 'modal:close' | 'theme:change' | 'sound:toggle';

/**
 * Handler type pattern for events
 */
export type OnHandler = `on${Capitalize<string>}`;
export type GetHandler = `get${Capitalize<string>}`;
export type SetHandler = `set${Capitalize<string>}`;

// ============================================
// Utility Types
// ============================================

/**
 * Exclude null and undefined from all properties
 */
export type DeepNonNullable<T> = T extends object
    ? { [K in keyof T]: DeepNonNullable<NonNullable<T[K]>> }
    : NonNullable<T>;

/**
 * Extract keys where value extends a type
 */
export type KeysWhere<T, V> = {
    [K in keyof T]: T[K] extends V ? K : never;
}[keyof T];

/**
 * Omit keys where value extends a type
 */
export type OmitWhere<T, V> = Omit<T, KeysWhere<T, V>>;

/**
 * Pick keys where value extends a type
 */
export type PickWhere<T, V> = Pick<T, KeysWhere<T, V>>;

/**
 * Make specific keys required
 */
export type RequireKeys<T, K extends keyof T> = T & Required<Pick<T, K>>;

/**
 * Make specific keys optional
 */
export type OptionalKeys<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

/**
 * Merge two types, with second type's properties taking precedence
 */
export type Merge<A, B> = Omit<A, keyof B> & B;

// ============================================
// Branded Types Utilities
// ============================================

declare const __brand: unique symbol;

/**
 * Create a branded type
 */
export type Brand<K, T> = K & { readonly [__brand]: T };

/**
 * Extract the base type from a branded type
 */
export type Unbrand<T> = T extends Brand<infer B, unknown> ? B : T;

// ============================================
// Type Assertions
// ============================================

/**
 * Assert two types are equal (compile-time check)
 */
export type AssertEqual<T, U> =
    (<V>() => V extends T ? 1 : 2) extends (<V>() => V extends U ? 1 : 2)
    ? true
    : false;

/**
 * Assert a type extends another
 */
export type AssertExtends<T, U> = T extends U ? true : false;

/**
 * Ensure a value is never (exhaustive check)
 */
export type AssertNever<T extends never> = T;

// ============================================
// Type Guards Factory
// ============================================

/**
 * Create a type guard function type
 */
export type TypeGuard<T> = (value: unknown) => value is T;

/**
 * Create an assertion function type
 */
export type AssertFunction<T> = (value: unknown, msg?: string) => asserts value is T;
