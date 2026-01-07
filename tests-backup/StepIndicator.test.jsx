/**
 * Tests for StepIndicator component
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

// Mock AnimatedLucideIcons
jest.mock('./AnimatedLucideIcons', () => ({
    AnimatedDollar: (props) => <span data-testid="dollar-icon">$</span>,
    AnimatedHourglass: (props) => <span data-testid="hourglass-icon">⏳</span>,
    AnimatedGamepad: (props) => <span data-testid="gamepad-icon">🎮</span>,
    AnimatedShieldCheck: (props) => <span data-testid="check-icon">✓</span>,
}));

import StepIndicator from './StepIndicator';

describe('StepIndicator', () => {
    test('renders step 1 when currentStep is 1', () => {
        render(<StepIndicator currentStep={1} />);
        expect(screen.getByText('Elige Tier')).toBeInTheDocument();
    });

    test('renders step 2 label', () => {
        render(<StepIndicator currentStep={1} />);
        expect(screen.getByText('Espera Oponente')).toBeInTheDocument();
    });

    test('renders step 3 label', () => {
        render(<StepIndicator currentStep={1} />);
        expect(screen.getByText('¡Juega!')).toBeInTheDocument();
    });

    test('marks step 1 as current when currentStep is 1', () => {
        const { container } = render(<StepIndicator currentStep={1} />);
        const currentSteps = container.querySelectorAll('.current');
        expect(currentSteps.length).toBe(1);
    });

    test('marks step 1 as completed when currentStep is 2', () => {
        const { container } = render(<StepIndicator currentStep={2} />);
        const completedSteps = container.querySelectorAll('.completed');
        expect(completedSteps.length).toBe(1);
    });

    test('marks steps 1 and 2 as completed when currentStep is 3', () => {
        const { container } = render(<StepIndicator currentStep={3} />);
        const completedSteps = container.querySelectorAll('.completed');
        expect(completedSteps.length).toBe(2);
    });

    test('renders step-indicator class', () => {
        const { container } = render(<StepIndicator currentStep={1} />);
        expect(container.querySelector('.step-indicator')).toBeInTheDocument();
    });

    test('applies custom className', () => {
        const { container } = render(<StepIndicator currentStep={1} className="custom" />);
        expect(container.querySelector('.custom')).toBeInTheDocument();
    });

    test('renders connectors between steps', () => {
        const { container } = render(<StepIndicator currentStep={1} />);
        const connectors = container.querySelectorAll('.step-connector');
        expect(connectors.length).toBe(2); // 2 connectors for 3 steps
    });
});
