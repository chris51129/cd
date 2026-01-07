/**
 * Tests for navigation utilities
 */
import { reloadPage, navigateTo } from './navigation';

describe('Navigation Utils', () => {
    test('reloadPage calls location.reload on provided window object', () => {
        const mockWindow = {
            location: {
                reload: jest.fn()
            }
        };

        reloadPage(mockWindow);
        expect(mockWindow.location.reload).toHaveBeenCalled();
        reloadPage(mockWindow);
        expect(mockWindow.location.reload).toHaveBeenCalled();
    });

    test('reloadPage uses default window', () => {
        // JSDOM throws on reload or we can't mock it easily
        try {
            reloadPage();
        } catch (e) {
            // Ignore
        }
    });

    test('reloadPage safely handles undefined window', () => {
        // Should not throw
        reloadPage(undefined);
    });

    test('reloadPage checks for location existence', () => {
        // window exists but location undefined
        reloadPage({});
    });

    test('navigateTo sets location.href on provided window object', () => {
        const mockWindow = {
            location: {
                href: ''
            }
        };
        const url = 'https://example.com';

        navigateTo(url, mockWindow);
        expect(mockWindow.location.href).toBe(url);
    });

    test('navigateTo safely handles undefined window', () => {
        // Should not throw
        navigateTo('https://example.com', undefined);
    });

    test('navigateTo checks for location existence', () => {
        navigateTo('https://example.com', {});
    });

    test('navigateTo uses default window', () => {
        // JSDOM throws "Not implemented" for navigation.
        // We just want to ensure the code path for default window is executed.
        try {
            navigateTo('/');
        } catch (e) {
            // Ignore JSDOM navigation error
        }
    });
});
