/**
 * Security Module - Public API
 * 
 * Protocolo Sigma v2026: Secure by Design
 * 
 * This module provides security primitives for:
 * - Prototype Pollution defense
 * - Trusted Types enforcement
 * - JSON sanitization
 * - CSP helpers
 */

// Prototype Pollution Defense
export {
    FORBIDDEN_KEYS,
    freezePrototypes,
    createSafeDict,
    sanitizeJSON,
    safeJSONParse,
    isJSONSafe,
} from './hardening';

// Trusted Types
export {
    sanitizeHTML,
    getTrustedTypesPolicy,
    safeSetInnerHTML,
    isTrustedTypesSupported,
} from './trustedTypes';
