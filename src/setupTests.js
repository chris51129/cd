/**
 * Jest DOM extended matchers setup
 * Provides additional matchers like toBeInTheDocument(), toHaveStyle(), etc.
 */

// Polyfills for JSDOM (required by react-router-dom v6+)
const { TextEncoder, TextDecoder } = require('util');
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Polyfill for Web Crypto API (required by security.js)
// Node.js 15.0+ has webcrypto built-in
const { webcrypto } = require('crypto');
global.crypto = webcrypto;

// Mock window.matchMedia (required for ThemeContext)
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
    })),
});

require('@testing-library/jest-dom');
