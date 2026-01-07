/**
 * Tests for Icons component
 * Verified against actual component API
 */
import React from 'react';
import { render } from '@testing-library/react';

// Mock lucide-react
jest.mock('lucide-react', () => ({
    Flame: (props) => <svg {...props} data-testid="flame-icon" />,
    ShieldCheck: (props) => <svg {...props} data-testid="shieldcheck-icon" />,
    HandCoins: (props) => <svg {...props} data-testid="handcoins-icon" />,
    CircleDollarSign: (props) => <svg {...props} data-testid="dollar-icon" />,
    TrendingUp: (props) => <svg {...props} data-testid="trending-icon" />,
    Activity: (props) => <svg {...props} data-testid="activity-icon" />,
    Brain: (props) => <svg {...props} data-testid="brain-icon" />,
    LayoutGrid: (props) => <svg {...props} data-testid="layout-icon" />,
    Sparkles: (props) => <svg {...props} data-testid="sparkles-icon" />,
}));

// Mock AnimatedLucideIcons
jest.mock('./AnimatedLucideIcons', () => ({
    AnimatedActivity: (props) => <span {...props} data-testid="animated-activity">AnimatedActivity</span>,
    AnimatedFingerprint: (props) => <span {...props} data-testid="animated-fingerprint">AnimatedFingerprint</span>,
    AnimatedShieldCheck: (props) => <span {...props} data-testid="animated-shieldcheck">AnimatedShieldCheck</span>,
    AnimatedCPU: (props) => <span {...props} data-testid="animated-cpu">AnimatedCPU</span>,
    AnimatedZap: (props) => <span {...props} data-testid="animated-zap">AnimatedZap</span>,
    AnimatedCoin: (props) => <span {...props} data-testid="animated-coin">AnimatedCoin</span>,
    AnimatedDice: (props) => <span {...props} data-testid="animated-dice">AnimatedDice</span>,
    AnimatedRPS: (props) => <span {...props} data-testid="animated-rps">AnimatedRPS</span>,
    AnimatedBrain: (props) => <span {...props} data-testid="animated-brain">AnimatedBrain</span>,
    AnimatedGrid: (props) => <span {...props} data-testid="animated-grid">AnimatedGrid</span>,
}));

// Mock AnimatedIcon
jest.mock('./AnimatedIcon', () => ({ icon: Icon, ...props }) => <Icon {...props} />);

import { Icons, CoinIcon, DiceIcon, RPSIcon, BrainIcon, LightningIcon, GridIcon } from './Icons';

describe('Icons', () => {
    describe('Icons object', () => {
        test('has Coin property', () => {
            expect(Icons.Coin).toBeDefined();
        });

        test('has Dice property', () => {
            expect(Icons.Dice).toBeDefined();
        });

        test('has RPS property', () => {
            expect(Icons.RPS).toBeDefined();
        });

        test('has Brain property', () => {
            expect(Icons.Brain).toBeDefined();
        });

        test('has Shield property', () => {
            expect(Icons.Shield).toBeDefined();
        });

        test('has Activity property', () => {
            expect(Icons.Activity).toBeDefined();
        });

        test('has CPU property', () => {
            expect(Icons.CPU).toBeDefined();
        });

        test('has Zap property', () => {
            expect(Icons.Zap).toBeDefined();
        });
    });

    describe('SVG Icons', () => {
        test('CoinIcon renders svg', () => {
            const { container } = render(<CoinIcon />);
            expect(container.querySelector('svg')).toBeInTheDocument();
        });

        test('DiceIcon renders svg', () => {
            const { container } = render(<DiceIcon />);
            expect(container.querySelector('svg')).toBeInTheDocument();
        });

        test('RPSIcon renders svg', () => {
            const { container } = render(<RPSIcon />);
            expect(container.querySelector('svg')).toBeInTheDocument();
        });

        test('BrainIcon renders', () => {
            const { container } = render(<BrainIcon />);
            expect(container.firstChild).toBeInTheDocument();
        });

        test('LightningIcon renders svg', () => {
            const { container } = render(<LightningIcon />);
            expect(container.querySelector('svg')).toBeInTheDocument();
        });

        test('GridIcon renders svg', () => {
            const { container } = render(<GridIcon />);
            expect(container.querySelector('svg')).toBeInTheDocument();
        });
    });

    describe('BrainIcon', () => {
        test('accepts size prop', () => {
            const { container } = render(<BrainIcon size={48} />);
            expect(container.firstChild).toBeInTheDocument();
        });
    });
});
