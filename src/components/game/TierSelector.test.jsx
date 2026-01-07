/**
 * Tests for TierSelector Carousel
 * 
 * Comprehensive tests for the swipeable tier selector carousel component.
 */
import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import TierSelector from './TierSelector';
import { TIERS } from '../../constants/tiers';

// Create a proper mock for framer-motion with all required exports
jest.mock('framer-motion', () => {
    const React = require('react');

    // Mock MotionValue with proper interface
    const createMotionValue = (initial = 0) => {
        let value = initial;
        const listeners = new Set();
        return {
            get: () => value,
            set: (newValue) => {
                value = newValue;
                listeners.forEach(fn => fn(value));
            },
            onChange: (fn) => {
                listeners.add(fn);
                return () => listeners.delete(fn);
            },
            destroy: () => { },
            isDestroyed: false,
        };
    };

    return {
        motion: {
            div: React.forwardRef(({ children, style, drag, dragConstraints, dragElastic, onDragEnd, ...props }, ref) => (
                <div ref={ref} style={style} {...props} data-testid="motion-div">
                    {children}
                </div>
            )),
            p: React.forwardRef(({ children, ...props }, ref) => (
                <p ref={ref} {...props}>{children}</p>
            )),
            button: React.forwardRef(({ children, ...props }, ref) => (
                <button ref={ref} {...props}>{children}</button>
            )),
        },
        AnimatePresence: ({ children, mode }) => <>{children}</>,
        useMotionValue: jest.fn((initial) => createMotionValue(initial)),
        useTransform: jest.fn((value, inputRange, outputRange) => createMotionValue(0)),
        animate: jest.fn(() => Promise.resolve()),
    };
});

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
    ChevronLeft: ({ size }) => <svg data-testid="icon-chevron-left" width={size} height={size}><path /></svg>,
    ChevronRight: ({ size }) => <svg data-testid="icon-chevron-right" width={size} height={size}><path /></svg>,
}));

// Mock UI components
jest.mock('../ui', () => ({
    Card: ({ children, onClick, style, className, role, tabIndex, 'aria-label': ariaLabel, 'aria-pressed': ariaPressed, onKeyDown }) => (
        <div
            onClick={onClick}
            style={style}
            className={className}
            role={role}
            tabIndex={tabIndex}
            aria-label={ariaLabel}
            aria-pressed={ariaPressed}
            onKeyDown={onKeyDown}
            data-testid="tier-card"
        >
            {children}
        </div>
    ),
}));

// Mock AnimatedLucideIcons
jest.mock('../ui/AnimatedLucideIcons', () => ({
    __esModule: true,
    default: () => <span data-testid="tier-icon">Icon</span>,
}));

// Mock security utils
jest.mock('../../utils/security', () => ({
    secureLog: {
        info: jest.fn(),
        warn: jest.fn(),
        error: jest.fn(),
    },
}));

// Mock CSS import
jest.mock('./TierSelector.css', () => ({}));

describe('TierSelector Carousel', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('Rendering', () => {
        test('renders carousel container with correct class', () => {
            const { container } = render(<TierSelector />);
            expect(container.querySelector('.tier-selector-carousel')).toBeInTheDocument();
        });

        test('renders navigation arrows', () => {
            render(<TierSelector />);
            expect(screen.getByLabelText('Tier anterior')).toBeInTheDocument();
            expect(screen.getByLabelText('Tier siguiente')).toBeInTheDocument();
        });

        test('renders all tier cards from TIERS constant', () => {
            render(<TierSelector />);
            const cards = screen.getAllByTestId('tier-card');
            expect(cards).toHaveLength(TIERS.length);
        });

        test('renders dot indicators for each tier', () => {
            const { container } = render(<TierSelector />);
            const dots = container.querySelectorAll('.carousel-dot');
            expect(dots).toHaveLength(TIERS.length);
        });

        test('renders tier amounts with dollar sign', () => {
            render(<TierSelector />);
            TIERS.forEach(tier => {
                expect(screen.getByText(`$${tier.amount}`)).toBeInTheDocument();
            });
        });

        test('renders tier labels', () => {
            render(<TierSelector />);
            TIERS.forEach(tier => {
                expect(screen.getByText(tier.label)).toBeInTheDocument();
            });
        });

        test('shows hint text when no tier is selected', () => {
            render(<TierSelector />);
            expect(screen.getByText(/Desliza para explorar/)).toBeInTheDocument();
        });
    });

    describe('Selection', () => {
        test('calls onSelect callback when tier is clicked', () => {
            const onSelect = jest.fn();
            render(<TierSelector onSelect={onSelect} />);

            const cards = screen.getAllByTestId('tier-card');
            fireEvent.click(cards[0]);

            expect(onSelect).toHaveBeenCalledTimes(1);
            expect(onSelect).toHaveBeenCalledWith(expect.objectContaining({
                id: TIERS[0].id,
                amount: TIERS[0].amount
            }));
        });

        test('shows confirmation button after tier selection', () => {
            render(<TierSelector />);

            const cards = screen.getAllByTestId('tier-card');
            fireEvent.click(cards[0]);

            expect(screen.getByText(/Confirmar compromiso/)).toBeInTheDocument();
        });

        test('displays pot total and winner amount after selection', () => {
            render(<TierSelector />);

            const cards = screen.getAllByTestId('tier-card');
            fireEvent.click(cards[0]); // Select first tier

            const expectedPot = TIERS[0].amount * 2;
            const expectedWinner = (expectedPot * 0.95).toFixed(2);

            expect(screen.getByText(`$${expectedPot}`)).toBeInTheDocument();
            expect(screen.getByText(`$${expectedWinner}`)).toBeInTheDocument();
        });

        test('hides hint text after selection', () => {
            render(<TierSelector />);

            expect(screen.getByText(/Desliza para explorar/)).toBeInTheDocument();

            const cards = screen.getAllByTestId('tier-card');
            fireEvent.click(cards[0]);

            expect(screen.queryByText(/Desliza para explorar/)).not.toBeInTheDocument();
        });
    });

    describe('Navigation', () => {
        test('prev arrow is disabled at first index', () => {
            render(<TierSelector />);

            const prevArrow = screen.getByLabelText('Tier anterior');
            const nextArrow = screen.getByLabelText('Tier siguiente');

            // Navigate to first tier (index 0)
            // Default is index 2, so click prev twice
            fireEvent.click(prevArrow);
            fireEvent.click(prevArrow);

            expect(prevArrow).toBeDisabled();
            expect(nextArrow).not.toBeDisabled();
        });

        test('next arrow is disabled at last index', () => {
            render(<TierSelector />);

            const nextArrow = screen.getByLabelText('Tier siguiente');

            // Navigate to last tier
            const clicksNeeded = TIERS.length - 1 - 2; // From default index 2
            for (let i = 0; i < clicksNeeded; i++) {
                fireEvent.click(nextArrow);
            }

            expect(nextArrow).toBeDisabled();
        });

        test('clicking dot indicator navigates to that tier', () => {
            const { container } = render(<TierSelector />);

            const dots = container.querySelectorAll('.carousel-dot');

            // Click first dot
            fireEvent.click(dots[0]);
            expect(dots[0]).toHaveClass('active');
        });
    });

    describe('Keyboard Navigation', () => {
        test('responds to ArrowLeft key', () => {
            render(<TierSelector />);

            // Should not throw
            act(() => {
                fireEvent.keyDown(window, { key: 'ArrowLeft' });
            });

            expect(screen.getAllByTestId('tier-card')).toHaveLength(TIERS.length);
        });

        test('responds to ArrowRight key', () => {
            render(<TierSelector />);

            act(() => {
                fireEvent.keyDown(window, { key: 'ArrowRight' });
            });

            expect(screen.getAllByTestId('tier-card')).toHaveLength(TIERS.length);
        });

        test('tier card responds to Enter key for selection', () => {
            const onSelect = jest.fn();
            render(<TierSelector onSelect={onSelect} />);

            const cards = screen.getAllByTestId('tier-card');
            fireEvent.keyDown(cards[0], { key: 'Enter' });

            expect(onSelect).toHaveBeenCalled();
        });

        test('tier card responds to Space key for selection', () => {
            const onSelect = jest.fn();
            render(<TierSelector onSelect={onSelect} />);

            const cards = screen.getAllByTestId('tier-card');
            fireEvent.keyDown(cards[0], { key: ' ' });

            expect(onSelect).toHaveBeenCalled();
        });
    });

    describe('Accessibility', () => {
        test('tier cards have proper ARIA attributes', () => {
            render(<TierSelector />);

            const cards = screen.getAllByTestId('tier-card');
            cards.forEach((card, index) => {
                expect(card).toHaveAttribute('role', 'button');
                expect(card).toHaveAttribute('tabIndex', '0');
                expect(card).toHaveAttribute('aria-label');
                expect(card).toHaveAttribute('aria-pressed');
            });
        });

        test('navigation arrows have aria-labels', () => {
            render(<TierSelector />);

            expect(screen.getByLabelText('Tier anterior')).toBeInTheDocument();
            expect(screen.getByLabelText('Tier siguiente')).toBeInTheDocument();
        });
    });

    describe('Special Tiers', () => {
        test('popular tier has appropriate badge', () => {
            render(<TierSelector />);

            const popularTier = TIERS.find(t => t.popular);
            if (popularTier) {
                expect(screen.getByText(/POPULAR/)).toBeInTheDocument();
            }
        });

        test('premium tier has appropriate badge', () => {
            render(<TierSelector />);

            const premiumTier = TIERS.find(t => t.premium);
            if (premiumTier) {
                expect(screen.getByText(/LEGEND/)).toBeInTheDocument();
            }
        });
    });
});
