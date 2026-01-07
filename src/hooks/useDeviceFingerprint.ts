/**
 * useDeviceFingerprint - Fingerprinting de Dispositivo
 * 
 * Genera un hash único del dispositivo para:
 * - Detectar multi-cuentas desde el mismo dispositivo
 * - Identificar dispositivos sospechosos
 * - Tracking de sesiones para auditoría
 * 
 * Componentes del fingerprint:
 * - User Agent, Resolución de pantalla, Timezone, Idioma
 * - Canvas fingerprint, WebGL fingerprint
 * - Hardware concurrency, Device memory
 * 
 * OWASP Reference: A07:2021 – Identification and Authentication Failures
 * 
 * WHY: Device fingerprinting provides an additional layer of identity verification
 * beyond wallet addresses. Helps detect sybil attacks and multi-accounting.
 */
import { useEffect, useState, useCallback } from 'react';
import { secureLog } from '../utils/security';

// ============================================
// Types
// ============================================

/** Browser-related fingerprint components */
export interface BrowserComponents {
    readonly userAgent: string;
    readonly language: string;
    readonly languages: string;
    readonly platform: string;
    readonly hardwareConcurrency: number;
    readonly deviceMemory: number;
    readonly maxTouchPoints: number;
}

/** Screen-related fingerprint components */
export interface ScreenComponents {
    readonly width: number;
    readonly height: number;
    readonly colorDepth: number;
    readonly pixelRatio: number;
}

/** All fingerprint components */
export interface FingerprintComponents {
    readonly browser: BrowserComponents;
    readonly screen: ScreenComponents;
    readonly canvas: string;
    readonly webgl: string;
    readonly timezone: string;
}

/** Fingerprint generation result */
export interface FingerprintResult {
    readonly hash: string;
    readonly components: FingerprintComponents | null;
}

/** Hook return type */
export interface UseDeviceFingerprintResult {
    readonly fingerprint: string | null;
    readonly components: FingerprintComponents | null;
    readonly isLoading: boolean;
    readonly generateFingerprint: () => FingerprintResult;
    readonly verifyFingerprint: (storedFingerprint: string) => boolean;
    readonly getShortId: () => string;
}

// ============================================
// Pure Helper Functions
// ============================================

/**
 * Genera hash simple de un string (djb2 algorithm)
 */
const simpleHash = (str: string): string => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash).toString(16).padStart(8, '0');
};

/**
 * Obtiene fingerprint del canvas
 */
const getCanvasFingerprint = (): string => {
    try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return 'no-canvas';

        canvas.width = 200;
        canvas.height = 50;

        ctx.textBaseline = 'top';
        ctx.font = '14px Arial';
        ctx.fillStyle = '#f60';
        ctx.fillRect(125, 1, 62, 20);
        ctx.fillStyle = '#069';
        ctx.fillText('CryptoDuels 🎲', 2, 15);
        ctx.fillStyle = 'rgba(102, 204, 0, 0.7)';
        ctx.fillText('CryptoDuels 🎲', 4, 17);

        return simpleHash(canvas.toDataURL());
    } catch {
        return 'canvas-error';
    }
};

/**
 * Obtiene fingerprint de WebGL
 */
const getWebGLFingerprint = (): string => {
    try {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        if (!gl || !(gl instanceof WebGLRenderingContext)) return 'no-webgl';

        const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
        if (!debugInfo) return 'no-debug-info';

        const vendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) as string;
        const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) as string;

        return simpleHash(`${vendor}-${renderer}`);
    } catch {
        return 'webgl-error';
    }
};

/**
 * Obtiene componentes del navegador
 */
const getBrowserComponents = (): BrowserComponents => {
    return {
        userAgent: navigator.userAgent || 'unknown',
        language: navigator.language || 'unknown',
        languages: (navigator.languages || []).join(','),
        platform: navigator.platform || 'unknown',
        hardwareConcurrency: navigator.hardwareConcurrency || 0,
        deviceMemory: (navigator as Navigator & { deviceMemory?: number }).deviceMemory || 0,
        maxTouchPoints: navigator.maxTouchPoints || 0
    };
};

/**
 * Obtiene componentes de pantalla
 */
const getScreenComponents = (): ScreenComponents => {
    return {
        width: window.screen.width || 0,
        height: window.screen.height || 0,
        colorDepth: window.screen.colorDepth || 0,
        pixelRatio: window.devicePixelRatio || 1
    };
};

/**
 * Obtiene timezone
 */
const getTimezone = (): string => {
    try {
        return Intl.DateTimeFormat().resolvedOptions().timeZone || 'unknown';
    } catch {
        return new Date().getTimezoneOffset().toString();
    }
};

// ============================================
// Hook Implementation
// ============================================

/**
 * Device fingerprinting hook for identity verification
 * 
 * @returns Fingerprint data and utility functions
 * 
 * @example
 * const { fingerprint, isLoading, getShortId } = useDeviceFingerprint();
 * 
 * if (!isLoading) {
 *     console.log('Device ID:', getShortId());
 * }
 */
export const useDeviceFingerprint = (): UseDeviceFingerprintResult => {
    const [fingerprint, setFingerprint] = useState<string | null>(null);
    const [components, setComponents] = useState<FingerprintComponents | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    /**
     * Genera el fingerprint completo
     */
    const generateFingerprint = useCallback((): FingerprintResult => {
        try {
            const browser = getBrowserComponents();
            const screen = getScreenComponents();
            const canvas = getCanvasFingerprint();
            const webgl = getWebGLFingerprint();
            const timezone = getTimezone();

            const allComponents: FingerprintComponents = {
                browser,
                screen,
                canvas,
                webgl,
                timezone
            };

            // Crear string para hash
            const fingerprintString = [
                browser.userAgent,
                browser.language,
                browser.platform,
                browser.hardwareConcurrency,
                browser.deviceMemory,
                screen.width,
                screen.height,
                screen.colorDepth,
                screen.pixelRatio,
                canvas,
                webgl,
                timezone
            ].join('|');

            const hash = simpleHash(fingerprintString);

            secureLog.info(`[DeviceFingerprint] Generated: ${hash.substring(0, 8)}...`);

            setComponents(allComponents);
            setFingerprint(hash);
            setIsLoading(false);

            return { hash, components: allComponents };
        } catch (error) {
            secureLog.error('[DeviceFingerprint] Error generating fingerprint:', error);
            setIsLoading(false);
            return { hash: 'error', components: null };
        }
    }, []);

    // Generar fingerprint al montar
    useEffect(() => {
        generateFingerprint();
    }, [generateFingerprint]);

    /**
     * Verifica si el fingerprint actual coincide con uno almacenado
     */
    const verifyFingerprint = useCallback((storedFingerprint: string): boolean => {
        if (!fingerprint) return false;
        return fingerprint === storedFingerprint;
    }, [fingerprint]);

    /**
     * Obtiene un identificador corto para logs
     */
    const getShortId = useCallback((): string => {
        if (!fingerprint) return 'loading';
        return fingerprint.substring(0, 8);
    }, [fingerprint]);

    return {
        fingerprint,
        components,
        isLoading,
        generateFingerprint,
        verifyFingerprint,
        getShortId
    };
};

export default useDeviceFingerprint;
