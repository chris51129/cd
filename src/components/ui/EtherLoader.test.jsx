/**
 * Tests for EtherLoader component
 * Verified against actual component API
 */
import React from 'react';
import { render, screen } from '@testing-library/react';

// Mock framer-motion
jest.mock('framer-motion', () => ({
    motion: {
        div: ({ children, className, ...props }) => <div className={className} {...props}>{children}</div>,
    },
}));

import EtherLoader from './EtherLoader';

describe('EtherLoader', () => {
    test('renders without crashing', () => {
        const { container } = render(<EtherLoader />);
        expect(container).toBeInTheDocument();
    });

    test('renders default message', () => {
        render(<EtherLoader />);
        expect(screen.getByText('VALIDANDO PROTOCOLO...')).toBeInTheDocument();
    });

    test('renders custom message', () => {
        render(<EtherLoader message="Loading data..." />);
        expect(screen.getByText('Loading data...')).toBeInTheDocument();
    });

    test('renders ether-loader-container class', () => {
        const { container } = render(<EtherLoader />);
        expect(container.querySelector('.ether-loader-container')).toBeInTheDocument();
    });

    test('renders ether-core element', () => {
        const { container } = render(<EtherLoader />);
        expect(container.querySelector('.ether-core')).toBeInTheDocument();
    });

    test('renders 8 particle elements', () => {
        const { container } = render(<EtherLoader />);
        const particles = container.querySelectorAll('.ether-particle');
        expect(particles.length).toBe(8);
    });

    test('renders center glow element', () => {
        const { container } = render(<EtherLoader />);
        expect(container.querySelector('.ether-center-glow')).toBeInTheDocument();
    });

    test('renders message container when message provided', () => {
        const { container } = render(<EtherLoader message="Test" />);
        expect(container.querySelector('.ether-message')).toBeInTheDocument();
    });
});
