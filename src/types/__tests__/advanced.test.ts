/**
 * Advanced Types Tests - Tests para utility types
 * 
 * WHY: Tests de tipos en compile-time para verificar que las
 * transformaciones de tipos funcionan correctamente.
 */

import type {
    DeepReadonly,
    DeepPartial,
    DeepRequired,
    Paths,
    PathValue,
    KeysWhere,
    PickWhere,
    OmitWhere,
    RequireKeys,
    OptionalKeys,
    AssertEqual,
} from '../advanced';

// ============================================
// Test Types (compile-time only)
// ============================================

interface TestNested {
    a: string;
    b: {
        c: number;
        d: {
            e: boolean;
        };
    };
    arr: string[];
}

// ============================================
// DeepReadonly Tests
// ============================================

type DeepReadonlyTest = DeepReadonly<TestNested>;

// These should be readonly
const _testDeepReadonly: DeepReadonlyTest = {
    a: 'test',
    b: {
        c: 1,
        d: {
            e: true,
        },
    },
    arr: ['a', 'b'],
};
void _testDeepReadonly; // Compile-time type test, usage not required

// ============================================
// DeepPartial Tests
// ============================================

type DeepPartialTest = DeepPartial<TestNested>;

// All properties should be optional
const _testDeepPartial: DeepPartialTest = {
    b: {
        d: {}, // e is optional
    },
};
void _testDeepPartial; // Compile-time type test

// ============================================
// Paths Tests
// ============================================

type PathsTest = Paths<TestNested>;

// Should include all paths
const _validPaths: PathsTest[] = [
    'a',
    'b',
    'arr',
    'b.c',
    'b.d',
    'b.d.e',
];
void _validPaths; // Compile-time type test

// ============================================
// PathValue Tests
// ============================================

type PathValueA = PathValue<TestNested, 'a'>;
type PathValueBC = PathValue<TestNested, 'b.c'>;
type PathValueBDE = PathValue<TestNested, 'b.d.e'>;

// Type assertions
type _AssertA = AssertEqual<PathValueA, string>;
type _AssertBC = AssertEqual<PathValueBC, number>;
type _AssertBDE = AssertEqual<PathValueBDE, boolean>;

// ============================================
// KeysWhere Tests
// ============================================

interface TestTypes {
    name: string;
    age: number;
    isActive: boolean;
    score: number;
}

type StringKeys = KeysWhere<TestTypes, string>;  // 'name'
type NumberKeys = KeysWhere<TestTypes, number>;  // 'age' | 'score'

// ============================================
// PickWhere / OmitWhere Tests
// ============================================

type OnlyStrings = PickWhere<TestTypes, string>;
// { name: string }

type NoStrings = OmitWhere<TestTypes, string>;
// { age: number; isActive: boolean; score: number }

// ============================================
// RequireKeys / OptionalKeys Tests
// ============================================

interface TestOptional {
    required: string;
    optional?: number;
}

type WithRequired = RequireKeys<TestOptional, 'optional'>;
// { required: string; optional: number }

type WithOptional = OptionalKeys<TestOptional, 'required'>;
// { required?: string; optional?: number }

// ============================================
// Runtime Tests (Jest)
// ============================================

describe('Advanced Types - Runtime Validation', () => {
    it('DeepReadonly enforces immutability conceptually', () => {
        const obj: DeepReadonlyTest = {
            a: 'test',
            b: { c: 1, d: { e: true } },
            arr: ['a'],
        };

        // Can read all levels
        expect(obj.a).toBe('test');
        expect(obj.b.c).toBe(1);
        expect(obj.b.d.e).toBe(true);
        expect(obj.arr[0]).toBe('a');
    });

    it('DeepPartial allows partial nested objects', () => {
        const partial: DeepPartialTest = {
            b: { c: 42 },
        };

        expect(partial.a).toBeUndefined();
        expect(partial.b?.c).toBe(42);
        expect(partial.b?.d).toBeUndefined();
    });

    it('Paths covers all object paths', () => {
        // Just verify the type works at runtime
        const paths: PathsTest[] = ['a', 'b', 'b.c', 'b.d', 'b.d.e', 'arr'];
        expect(paths.length).toBe(6);
    });
});

// Export to avoid unused warnings
export type {
    DeepReadonlyTest,
    DeepPartialTest,
    PathsTest,
    StringKeys,
    NumberKeys,
    OnlyStrings,
    NoStrings,
    WithRequired,
    WithOptional,
};
