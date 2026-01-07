/**
 * Tests for SelectionScreen component
 * 100% Coverage: Chooser interactions & Assigned automation
 */
import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import SelectionScreen from './SelectionScreen';
import * as helpers from '../../utils/helpers';

// Mock framer-motion
jest.mock('framer-motion', () => ({
    motion: {
        div: ({ children, onClick, className, ...props }) => (
            <div onClick={onClick} className={className} {...props}>{children}</div>
        ),
    },
}));

// Mock security utilities
jest.mock('../../utils/security', () => ({
    secureRandomInt: jest.fn(),
    secureLog: {
        info: jest.fn(),
        warn: jest.fn(),
        error: jest.fn(),
    }
}));

// Mock helpers
jest.mock('../../utils/helpers', () => ({
    getRandomInt: jest.fn(),
}));

import * as security from '../../utils/security';

describe('SelectionScreen Component', () => {
    beforeEach(() => {
        jest.useFakeTimers();
        jest.clearAllMocks();
        helpers.getRandomInt.mockReturnValue(2000); // Fixed delay
        // Default behavior for secureRandomInt
        security.secureRandomInt.mockReturnValue(1);
    });

    afterEach(() => {
        jest.useRealTimers();
        jest.restoreAllMocks();
    });

    describe('Chooser Mode (User Picks)', () => {
        const setupChooser = () => {
            const onSelectMock = jest.fn();
            render(
                <SelectionScreen
                    gameType="coinflip"
                    isChooser={true}
                    onSelect={onSelectMock}
                    onAssignedReady={jest.fn()}
                />
            );
            return { onSelectMock };
        };

        test('renders chooser UI', () => {
            setupChooser();
            expect(screen.getByText("ESTABLECER POSICIÓN")).toBeInTheDocument();
            expect(screen.getByText("CARA")).toBeInTheDocument();
            expect(screen.getByText("CRUZ")).toBeInTheDocument();
        });

        test('calls onSelect with "heads" when clicking Cara', () => {
            const { onSelectMock } = setupChooser();
            const headsCard = screen.getByText("CARA").closest('.choice-card');
            fireEvent.click(headsCard);
            expect(onSelectMock).toHaveBeenCalledWith('heads');
        });

        test('calls onSelect with "tails" when clicking Cruz', () => {
            const { onSelectMock } = setupChooser();
            const tailsCard = screen.getByText("CRUZ").closest('.choice-card');
            fireEvent.click(tailsCard);
            expect(onSelectMock).toHaveBeenCalledWith('tails');
        });
        // NOTE: Auto-selection timeout logic tests are in useGameEngine.test.js
        // SelectionScreen only handles UI rendering and click events
        // The game engine is responsible for countdown and auto-selection
    });

    describe('Assigned Mode (Automated)', () => {
        const setupAssigned = () => {
            const onAssignedReadyMock = jest.fn();
            render(
                <SelectionScreen
                    gameType="coinflip"
                    isChooser={false}
                    onSelect={jest.fn()}
                    onAssignedReady={onAssignedReadyMock}
                />
            );
            return { onAssignedReadyMock };
        };

        test('renders waiting UI initially', () => {
            setupAssigned();
            expect(screen.getByText("OPONENTE VALIDANDO...")).toBeInTheDocument();
            // Should NOT see selection options
            expect(screen.queryByText("CARA")).not.toBeInTheDocument();
        });

        test('automatically calls onAssignedReady after delay (Opponent picks Heads -> User gets Tails)', () => {
            security.secureRandomInt
                .mockReturnValueOnce(2000) // delay
                .mockReturnValueOnce(1);    // opponent choice (heads)

            const { onAssignedReadyMock } = setupAssigned();

            act(() => {
                jest.advanceTimersByTime(2000); // Wait for delay
            });

            // If opponent picks heads, user is assigned tails
            expect(onAssignedReadyMock).toHaveBeenCalledWith('tails');
        });

        test('automatically calls onAssignedReady after delay (Opponent picks Tails -> User gets Heads)', () => {
            // secureRandomInt(0, 1) === 1 ? 'heads' : 'tails'
            // To get opponent picking 'tails', we need secureRandomInt to return 0
            security.secureRandomInt
                .mockReturnValueOnce(2000) // delay
                .mockReturnValueOnce(0);    // opponent choice (tails)

            const { onAssignedReadyMock } = setupAssigned();

            act(() => {
                jest.advanceTimersByTime(2000);
            });

            // If opponent picks tails, user is assigned heads
            expect(onAssignedReadyMock).toHaveBeenCalledWith('heads');
        });

        test('cleans up timer on unmount', () => {
            const onAssignedReadyMock = jest.fn();
            const { unmount } = render(
                <SelectionScreen
                    gameType="coinflip"
                    isChooser={false}
                    onSelect={jest.fn()}
                    onAssignedReady={onAssignedReadyMock}
                />
            );

            unmount();
            act(() => {
                jest.advanceTimersByTime(2000);
            });

            expect(onAssignedReadyMock).not.toHaveBeenCalled();
        });
    });
});
