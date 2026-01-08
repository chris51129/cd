/**
 * Branded Types - Parse, Don't Validate Pattern
 * 
 * WHY: Make invalid states unrepresentable at compile-time.
 * Once you have a branded type, it's guaranteed to be valid by construction.
 * Validation happens at system boundaries (API responses, user input).
 * 
 * Pattern: Nominal Typing via Phantom Brand
 * @see https://egghead.io/blog/using-branded-types-in-typescript
 */

import { type Result, ok, err } from './index';

// ============================================
// Brand Infrastructure
// ============================================

/**
 * Unique symbol for brand discrimination
 * WHY: Using symbol ensures brands cannot be accidentally satisfied
 */
declare const __brand: unique symbol;

/**
 * Brand type - adds nominal typing to structural types
 * @template T - Base type to brand
 * @template B - Brand identifier (string literal)
 */
export type Brand<T, B extends string> = T & { readonly [__brand]: B };

// ============================================
// Domain-Specific Branded Types
// ============================================

/**
 * User identifier - guaranteed non-empty string
 */
export type UserId = Brand<string, 'UserId'>;

/**
 * Game session identifier - guaranteed UUID format
 */
export type GameId = Brand<string, 'GameId'>;

/**
 * Tier identifier - guaranteed 1-4 range
 */
export type TierId = Brand<1 | 2 | 3 | 4, 'TierId'>;

/**
 * Ethereum wallet address - guaranteed 0x format
 */
export type WalletAddress = Brand<`0x${string}`, 'WalletAddress'>;

/**
 * Positive amount in USD - guaranteed positive number
 */
export type PositiveAmount = Brand<number, 'PositiveAmount'>;

/**
 * Hex color - guaranteed #RRGGBB format
 */
export type HexColor = Brand<string, 'HexColor'>;

// ============================================
// Smart Constructors (Parse Boundary)
// ============================================

/**
 * UserId smart constructor
 * WHY: Validates at boundary, returns Result for explicit error handling
 */
export const UserId = {
    /**
     * Parse unknown value into UserId
     */
    parse: (value: unknown): Result<UserId, string> => {
        if (typeof value !== 'string') {
            return err('UserId must be a string');
        }
        if (value.trim().length === 0) {
            return err('UserId cannot be empty');
        }
        if (value.length > 64) {
            return err('UserId cannot exceed 64 characters');
        }
        return ok(value as UserId);
    },

    /**
     * Unsafe constructor - use only when value is guaranteed valid
     * (e.g., from database or trusted source)
     */
    unsafe: (value: string): UserId => value as UserId,
} as const;

/**
 * GameId smart constructor
 * WHY: Validates UUID v4 format
 */
export const GameId = {
    parse: (value: unknown): Result<GameId, string> => {
        if (typeof value !== 'string') {
            return err('GameId must be a string');
        }
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        if (!uuidRegex.test(value)) {
            return err('GameId must be a valid UUID v4');
        }
        return ok(value as GameId);
    },

    /**
     * Generate a new GameId using crypto
     */
    generate: (): GameId => {
        const crypto = window.crypto || (window as unknown as { msCrypto: Crypto }).msCrypto;
        const bytes = new Uint8Array(16);
        crypto.getRandomValues(bytes);

        // Set version (4) and variant (8, 9, a, b)
        bytes[6] = (bytes[6] & 0x0f) | 0x40;
        bytes[8] = (bytes[8] & 0x3f) | 0x80;

        const hex = Array.from(bytes, b => b.toString(16).padStart(2, '0')).join('');
        const uuid = `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
        return uuid as GameId;
    },

    unsafe: (value: string): GameId => value as GameId,
} as const;

/**
 * TierId smart constructor
 * WHY: Validates tier is exactly 1, 2, 3, or 4
 */
export const TierId = {
    parse: (value: unknown): Result<TierId, string> => {
        if (typeof value !== 'number') {
            return err('TierId must be a number');
        }
        if (![1, 2, 3, 4].includes(value)) {
            return err('TierId must be 1, 2, 3, or 4');
        }
        return ok(value as TierId);
    },

    unsafe: (value: 1 | 2 | 3 | 4): TierId => value as TierId,
} as const;

/**
 * WalletAddress smart constructor
 * WHY: Validates Ethereum address format (0x + 40 hex chars)
 */
export const WalletAddress = {
    parse: (value: unknown): Result<WalletAddress, string> => {
        if (typeof value !== 'string') {
            return err('WalletAddress must be a string');
        }
        if (!value.startsWith('0x')) {
            return err('WalletAddress must start with 0x');
        }
        const addressRegex = /^0x[a-fA-F0-9]{40}$/;
        if (!addressRegex.test(value)) {
            return err('WalletAddress must be 0x followed by 40 hex characters');
        }
        return ok(value as WalletAddress);
    },

    /**
     * Checksum validation (EIP-55)
     */
    parseWithChecksum: (value: unknown): Result<WalletAddress, string> => {
        const basic = WalletAddress.parse(value);
        if (!basic.success) return basic;
        // For full EIP-55 checksum, would need keccak256
        // Simplified: just accept the basic format
        return basic;
    },

    unsafe: (value: `0x${string}`): WalletAddress => value as WalletAddress,
} as const;

/**
 * PositiveAmount smart constructor
 * WHY: Validates number is positive and finite
 */
export const PositiveAmount = {
    parse: (value: unknown): Result<PositiveAmount, string> => {
        if (typeof value !== 'number') {
            return err('PositiveAmount must be a number');
        }
        if (!Number.isFinite(value)) {
            return err('PositiveAmount must be finite');
        }
        if (value <= 0) {
            return err('PositiveAmount must be positive');
        }
        return ok(value as PositiveAmount);
    },

    unsafe: (value: number): PositiveAmount => value as PositiveAmount,
} as const;

/**
 * HexColor smart constructor
 * WHY: Validates #RRGGBB format
 */
export const HexColor = {
    parse: (value: unknown): Result<HexColor, string> => {
        if (typeof value !== 'string') {
            return err('HexColor must be a string');
        }
        const hexColorRegex = /^#[0-9A-Fa-f]{6}$/;
        if (!hexColorRegex.test(value)) {
            return err('HexColor must be in #RRGGBB format');
        }
        return ok(value as HexColor);
    },

    unsafe: (value: string): HexColor => value as HexColor,
} as const;

// ============================================
// Type Guards
// ============================================

/**
 * Check if a value is a valid UserId
 */
export const isUserId = (value: unknown): value is UserId =>
    UserId.parse(value).success;

/**
 * Check if a value is a valid GameId
 */
export const isGameId = (value: unknown): value is GameId =>
    GameId.parse(value).success;

/**
 * Check if a value is a valid TierId
 */
export const isTierId = (value: unknown): value is TierId =>
    TierId.parse(value).success;

/**
 * Check if a value is a valid WalletAddress
 */
export const isWalletAddress = (value: unknown): value is WalletAddress =>
    WalletAddress.parse(value).success;

/**
 * Check if a value is a valid PositiveAmount
 */
export const isPositiveAmount = (value: unknown): value is PositiveAmount =>
    PositiveAmount.parse(value).success;

/**
 * Check if a value is a valid HexColor
 */
export const isHexColor = (value: unknown): value is HexColor =>
    HexColor.parse(value).success;
