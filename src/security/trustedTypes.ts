/**
 * Trusted Types Policy - XSS Prevention
 * 
 * WHY (Protocolo Sigma §3.1):
 * Trusted Types block the DOM against raw strings.
 * innerHTML becomes illegal without explicit sanitization.
 * 
 * This module creates a singleton policy that all DOM
 * manipulation must use if Trusted Types are supported.
 * 
 * NOTE: React already escapes by default, but this provides
 * defense-in-depth for any accidental raw DOM access.
 */

// ============================================
// Types
// ============================================

/**
 * Trusted Types policy interface
 * WHY: Browser support varies, need fallback
 */
interface TrustedTypesPolicy {
    createHTML: (input: string) => TrustedHTML;
    createScript: (input: string) => TrustedScript;
    createScriptURL: (input: string) => TrustedScriptURL;
}

// Extend Window interface for TypeScript
declare global {
    interface Window {
        trustedTypes?: {
            createPolicy: (
                name: string,
                rules: {
                    createHTML?: (input: string) => string;
                    createScript?: (input: string) => string;
                    createScriptURL?: (input: string) => string;
                }
            ) => TrustedTypesPolicy;
        };
    }
}

// ============================================
// Environment Detection (Jest/Vite compatible)
// ============================================

const isDevelopment = (): boolean => {
    try {
        if (typeof process !== 'undefined' && process.env?.NODE_ENV) {
            return process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test';
        }
    } catch {
        // Ignore
    }
    return false;
};

// ============================================
// HTML Sanitizer (DOMPurify-like, simplified)
// ============================================

/**
 * Allowed HTML tags for sanitization
 * WHY: Whitelist approach - only known-safe tags allowed
 */
const ALLOWED_TAGS = Object.freeze([
    'b', 'i', 'u', 'strong', 'em', 'span', 'p', 'br',
    'ul', 'ol', 'li', 'a', 'code', 'pre',
] as const);

/**
 * Allowed attributes for sanitization
 */
const ALLOWED_ATTRS = Object.freeze([
    'href', 'target', 'rel', 'class', 'id', 'style',
] as const);

/**
 * Simple HTML sanitizer
 * WHY: Defense in depth - sanitize even with Trusted Types
 * 
 * NOTE: For production, consider DOMPurify. This is a minimal
 * implementation for demonstration.
 */
export const sanitizeHTML = (input: string): string => {
    // Create a temporary element to parse HTML
    const template = document.createElement('template');
    template.innerHTML = input;

    const sanitizeNode = (node: Node): void => {
        const childNodes = Array.from(node.childNodes);

        for (const child of childNodes) {
            if (child.nodeType === Node.ELEMENT_NODE) {
                const el = child as Element;
                const tagName = el.tagName.toLowerCase();

                // Remove disallowed tags
                if (!ALLOWED_TAGS.includes(tagName as typeof ALLOWED_TAGS[number])) {
                    // Keep text content, remove element
                    const textContent = el.textContent || '';
                    el.replaceWith(document.createTextNode(textContent));
                    continue;
                }

                // Remove disallowed attributes
                const attrs = Array.from(el.attributes);
                for (const attr of attrs) {
                    if (!ALLOWED_ATTRS.includes(attr.name as typeof ALLOWED_ATTRS[number])) {
                        el.removeAttribute(attr.name);
                    }
                    // Sanitize href to prevent javascript:
                    if (attr.name === 'href') {
                        const href = attr.value.toLowerCase().trim();
                        if (href.startsWith('javascript:') || href.startsWith('data:')) {
                            el.removeAttribute('href');
                        }
                    }
                }

                // Add rel="noopener noreferrer" to external links
                if (tagName === 'a') {
                    el.setAttribute('rel', 'noopener noreferrer');
                }

                // Recursively sanitize children
                sanitizeNode(el);
            }
        }
    };

    sanitizeNode(template.content);
    return template.innerHTML;
};

// ============================================
// Trusted Types Policy
// ============================================

let _policy: TrustedTypesPolicy | null = null;

/**
 * Get or create the default Trusted Types policy
 * WHY: Singleton ensures consistent sanitization across app
 */
export const getTrustedTypesPolicy = (): TrustedTypesPolicy | null => {
    // Return cached policy
    if (_policy) return _policy;

    // Check browser support
    if (typeof window === 'undefined' || !window.trustedTypes) {
        if (isDevelopment()) {
            console.warn('[Security] Trusted Types not supported in this browser');
        }
        return null;
    }

    try {
        _policy = window.trustedTypes.createPolicy('cryptoduels-default', {
            createHTML: (input: string): string => {
                // Sanitize all HTML
                return sanitizeHTML(input);
            },
            createScript: (_input: string): string => {
                // Block all dynamic script creation
                console.error('[Security] Dynamic script creation blocked');
                throw new Error('Dynamic scripts are not allowed');
            },
            createScriptURL: (input: string): string => {
                // Only allow same-origin scripts
                const url = new URL(input, window.location.origin);
                if (url.origin !== window.location.origin) {
                    console.error('[Security] Cross-origin script URL blocked:', input);
                    throw new Error('Cross-origin scripts are not allowed');
                }
                return input;
            },
        });

        if (isDevelopment()) {
            console.log('[Security] Trusted Types policy created');
        }

        return _policy;
    } catch (error) {
        console.error('[Security] Failed to create Trusted Types policy:', error);
        return null;
    }
};

// ============================================
// Safe DOM Helpers
// ============================================

/**
 * Safely set innerHTML with Trusted Types
 * WHY: Wrapper that enforces policy usage
 */
export const safeSetInnerHTML = (element: Element, html: string): void => {
    const policy = getTrustedTypesPolicy();

    if (policy) {
        // Use Trusted Types
        element.innerHTML = policy.createHTML(html) as unknown as string;
    } else {
        // Fallback: sanitize manually
        element.innerHTML = sanitizeHTML(html);
    }
};

/**
 * Check if Trusted Types are supported
 */
export const isTrustedTypesSupported = (): boolean => {
    return typeof window !== 'undefined' && !!window.trustedTypes;
};

// ============================================
// Initialize policy on module load
// ============================================

// Create policy immediately when module loads
if (typeof window !== 'undefined') {
    getTrustedTypesPolicy();
}
