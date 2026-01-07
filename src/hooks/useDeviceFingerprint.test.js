/**
 * Tests for useDeviceFingerprint hook
 * Coverage: Device fingerprinting, verification, and component collection
 */
import { renderHook, act, waitFor } from '@testing-library/react';
import { useDeviceFingerprint } from './useDeviceFingerprint';

// Mock security utilities
jest.mock('../utils/security', () => ({
    secureLog: {
        info: jest.fn(),
        warn: jest.fn(),
        error: jest.fn(),
    }
}));

// Mock canvas and WebGL
const mockGetContext = jest.fn();
const mockToDataURL = jest.fn().mockReturnValue('data:image/png;base64,mockdata');

beforeAll(() => {
    // Mock document.createElement for canvas
    const originalCreateElement = document.createElement.bind(document);
    jest.spyOn(document, 'createElement').mockImplementation((tag) => {
        if (tag === 'canvas') {
            return {
                width: 0,
                height: 0,
                getContext: mockGetContext.mockReturnValue({
                    textBaseline: '',
                    font: '',
                    fillStyle: '',
                    fillRect: jest.fn(),
                    fillText: jest.fn(),
                    getExtension: jest.fn().mockReturnValue({
                        UNMASKED_VENDOR_WEBGL: 'vendor',
                        UNMASKED_RENDERER_WEBGL: 'renderer'
                    }),
                    getParameter: jest.fn().mockReturnValue('MockGPU')
                }),
                toDataURL: mockToDataURL
            };
        }
        return originalCreateElement(tag);
    });

    // Mock navigator properties
    Object.defineProperty(navigator, 'hardwareConcurrency', { value: 8, configurable: true });
    Object.defineProperty(navigator, 'deviceMemory', { value: 8, configurable: true });
    Object.defineProperty(navigator, 'maxTouchPoints', { value: 0, configurable: true });

    // Mock screen properties
    Object.defineProperty(window, 'screen', {
        value: {
            width: 1920,
            height: 1080,
            colorDepth: 24
        },
        configurable: true
    });

    // Mock devicePixelRatio
    Object.defineProperty(window, 'devicePixelRatio', { value: 2, configurable: true });
});

afterAll(() => {
    jest.restoreAllMocks();
});

describe('useDeviceFingerprint', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('initialization', () => {
        test('initializes and generates fingerprint', async () => {
            const { result } = renderHook(() => useDeviceFingerprint());

            // In test environment, generation happens synchronously on mount
            // So we should have a fingerprint immediately or after waitFor
            await waitFor(() => {
                expect(result.current.fingerprint).toBeDefined();
            });
            expect(result.current.isLoading).toBe(false);
        });

        test('generates fingerprint on mount', async () => {
            const { result } = renderHook(() => useDeviceFingerprint());

            await waitFor(() => {
                expect(result.current.isLoading).toBe(false);
            });

            expect(result.current.fingerprint).toBeDefined();
            expect(result.current.fingerprint).not.toBe('');
            expect(typeof result.current.fingerprint).toBe('string');
        });

        test('populates components on mount', async () => {
            const { result } = renderHook(() => useDeviceFingerprint());

            await waitFor(() => {
                expect(result.current.isLoading).toBe(false);
            });

            expect(result.current.components).toBeDefined();
            expect(result.current.components.browser).toBeDefined();
            expect(result.current.components.screen).toBeDefined();
        });
    });

    describe('generateFingerprint', () => {
        test('returns hash and components', async () => {
            const { result } = renderHook(() => useDeviceFingerprint());

            await waitFor(() => {
                expect(result.current.isLoading).toBe(false);
            });

            let generated;
            act(() => {
                generated = result.current.generateFingerprint();
            });

            expect(generated).toHaveProperty('hash');
            expect(generated).toHaveProperty('components');
            expect(typeof generated.hash).toBe('string');
        });

        test('generates consistent fingerprint', async () => {
            const { result } = renderHook(() => useDeviceFingerprint());

            await waitFor(() => {
                expect(result.current.isLoading).toBe(false);
            });

            let first, second;
            act(() => {
                first = result.current.generateFingerprint();
                second = result.current.generateFingerprint();
            });

            expect(first.hash).toBe(second.hash);
        });
    });

    describe('verifyFingerprint', () => {
        test('returns true for matching fingerprint', async () => {
            const { result } = renderHook(() => useDeviceFingerprint());

            await waitFor(() => {
                expect(result.current.isLoading).toBe(false);
            });

            const currentFingerprint = result.current.fingerprint;
            const isMatch = result.current.verifyFingerprint(currentFingerprint);

            expect(isMatch).toBe(true);
        });

        test('returns false for non-matching fingerprint', async () => {
            const { result } = renderHook(() => useDeviceFingerprint());

            await waitFor(() => {
                expect(result.current.isLoading).toBe(false);
            });

            const isMatch = result.current.verifyFingerprint('different-fingerprint');

            expect(isMatch).toBe(false);
        });

        test('returns false when fingerprint not yet generated', () => {
            const { result } = renderHook(() => useDeviceFingerprint());

            // Immediately check before generation completes
            const isMatch = result.current.verifyFingerprint('any-fingerprint');

            expect(isMatch).toBe(false);
        });
    });

    describe('getShortId', () => {
        test('returns short id or loading based on state', async () => {
            const { result } = renderHook(() => useDeviceFingerprint());

            // In test environment, fingerprint generates quickly
            // So we just verify the shortId works correctly after generation
            await waitFor(() => {
                expect(result.current.isLoading).toBe(false);
            });

            const shortId = result.current.getShortId();
            expect(shortId).not.toBe('loading');
            expect(shortId).toHaveLength(8);
        });

        test('returns first 8 characters of fingerprint', async () => {
            const { result } = renderHook(() => useDeviceFingerprint());

            await waitFor(() => {
                expect(result.current.isLoading).toBe(false);
            });

            const shortId = result.current.getShortId();
            expect(shortId).toHaveLength(8);
            expect(result.current.fingerprint.startsWith(shortId)).toBe(true);
        });
    });

    describe('components structure', () => {
        test('browser components have expected properties', async () => {
            const { result } = renderHook(() => useDeviceFingerprint());

            await waitFor(() => {
                expect(result.current.isLoading).toBe(false);
            });

            const browser = result.current.components.browser;
            expect(browser).toHaveProperty('userAgent');
            expect(browser).toHaveProperty('language');
            expect(browser).toHaveProperty('platform');
            expect(browser).toHaveProperty('hardwareConcurrency');
        });

        test('screen components have expected properties', async () => {
            const { result } = renderHook(() => useDeviceFingerprint());

            await waitFor(() => {
                expect(result.current.isLoading).toBe(false);
            });

            const screen = result.current.components.screen;
            expect(screen).toHaveProperty('width');
            expect(screen).toHaveProperty('height');
            expect(screen).toHaveProperty('colorDepth');
            expect(screen).toHaveProperty('pixelRatio');
        });
    });
});
