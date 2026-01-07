/**
 * Tests for ScrollToTop component
 */
import { renderHook } from '@testing-library/react';
import { MemoryRouter, useLocation } from 'react-router-dom';
import React from 'react';
import { render } from '@testing-library/react';

// Mock window.scrollTo
const scrollToMock = jest.fn();
Object.defineProperty(window, 'scrollTo', { value: scrollToMock, writable: true });

import ScrollToTop from './ScrollToTop';

describe('ScrollToTop', () => {
    beforeEach(() => {
        scrollToMock.mockClear();
    });

    const renderComponent = (initialPath = '/') => {
        return render(
            <MemoryRouter initialEntries={[initialPath]}>
                <ScrollToTop />
            </MemoryRouter>
        );
    };

    test('renders without crashing', () => {
        const { container } = renderComponent();
        // ScrollToTop returns null, so container should not have content
        expect(container.firstChild).toBeNull();
    });

    test('calls scrollTo on mount', () => {
        renderComponent();
        expect(scrollToMock).toHaveBeenCalled();
    });

    test('scrolls to top with correct parameters', () => {
        renderComponent();
        expect(scrollToMock).toHaveBeenCalledWith({
            top: 0,
            left: 0,
            behavior: 'instant'
        });
    });
});
