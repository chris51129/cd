/**
 * Utility functions for CryptoDuels
 */

// Re-export security utilities for convenience
export {
    secureRandomInt,
    secureShuffleArray,
    secureLog,
    validateInteger,
    validateEnum,
    validateObject
} from './security';

// Import for internal use
import { secureRandomInt } from './security';

/**
 * Returns a cryptographically secure random integer between min and max (inclusive)
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} Secure random integer
 * @deprecated Use secureRandomInt directly from security.js
 */
export const getRandomInt = (min, max) => {
    return secureRandomInt(min, max);
};
