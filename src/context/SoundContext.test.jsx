/**
 * Tests for SoundContext
 * Audio management and sound playback
 */
import React from 'react';
import { render, act, screen, fireEvent } from '@testing-library/react';
import { SoundProvider, useSound, SOUNDS } from './SoundContext';

// Mock Audio API
global.Audio = class MockAudio {
    constructor(src) {
        this.src = src;
        this.volume = 1;
    }
    play() {
        return Promise.resolve();
    }
};

// Test component that exposes the context
const TestConsumer = () => {
    const context = useSound();

    return (
        <div>
            <span data-testid="isMuted">{context.isMuted.toString()}</span>
            <span data-testid="volume">{context.volume}</span>
            <button onClick={context.toggleMute}>Toggle Mute</button>
            <button onClick={() => context.setVolume(0.8)}>Set Volume</button>
            <button onClick={() => context.play('CLICK')}>Play Click</button>
            <button onClick={() => context.play('INVALID_SOUND')}>Play Invalid</button>
        </div>
    );
};

describe('SoundProvider', () => {
    test('provides default context values', () => {
        render(
            <SoundProvider>
                <TestConsumer />
            </SoundProvider>
        );

        expect(screen.getByTestId('isMuted')).toHaveTextContent('false');
        expect(screen.getByTestId('volume')).toHaveTextContent('0.5');
    });

    test('toggleMute switches mute state', () => {
        render(
            <SoundProvider>
                <TestConsumer />
            </SoundProvider>
        );

        expect(screen.getByTestId('isMuted')).toHaveTextContent('false');

        fireEvent.click(screen.getByText('Toggle Mute'));
        expect(screen.getByTestId('isMuted')).toHaveTextContent('true');

        fireEvent.click(screen.getByText('Toggle Mute'));
        expect(screen.getByTestId('isMuted')).toHaveTextContent('false');
    });

    test('setVolume changes volume', () => {
        render(
            <SoundProvider>
                <TestConsumer />
            </SoundProvider>
        );

        fireEvent.click(screen.getByText('Set Volume'));
        expect(screen.getByTestId('volume')).toHaveTextContent('0.8');
    });

    test('play creates Audio and calls play()', () => {
        const playMock = jest.fn(() => Promise.resolve());
        global.Audio = class {
            constructor(src) {
                this.src = src;
                this.volume = 1;
            }
            play = playMock;
        };

        render(
            <SoundProvider>
                <TestConsumer />
            </SoundProvider>
        );

        fireEvent.click(screen.getByText('Play Click'));
        expect(playMock).toHaveBeenCalled();
    });

    test('play does nothing when muted', () => {
        const playMock = jest.fn(() => Promise.resolve());
        global.Audio = class {
            constructor(src) {
                this.src = src;
                this.volume = 1;
            }
            play = playMock;
        };

        render(
            <SoundProvider>
                <TestConsumer />
            </SoundProvider>
        );

        fireEvent.click(screen.getByText('Toggle Mute'));
        playMock.mockClear();

        fireEvent.click(screen.getByText('Play Click'));
        expect(playMock).not.toHaveBeenCalled();
    });

    test('play handles invalid sound key gracefully', () => {
        render(
            <SoundProvider>
                <TestConsumer />
            </SoundProvider>
        );

        // Should not throw
        expect(() => {
            fireEvent.click(screen.getByText('Play Invalid'));
        }).not.toThrow();
    });

    test('play handles Audio.play() rejection gracefully', () => {
        global.Audio = class {
            constructor(src) {
                this.src = src;
                this.volume = 1;
            }
            play() {
                return Promise.reject(new Error('Autoplay blocked'));
            }
        };

        render(
            <SoundProvider>
                <TestConsumer />
            </SoundProvider>
        );

        // Should not throw even when play is rejected
        expect(() => {
            fireEvent.click(screen.getByText('Play Click'));
        }).not.toThrow();
    });
});

describe('useSound hook', () => {
    test('throws error when used outside provider', () => {
        const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => { });

        const BrokenComponent = () => {
            useSound();
            return null;
        };

        expect(() => {
            render(<BrokenComponent />);
        }).toThrow('useSound must be used within a SoundProvider');

        consoleSpy.mockRestore();
    });
});

describe('SOUNDS constant', () => {
    test('exports sound paths', () => {
        expect(SOUNDS.CLICK).toBeDefined();
        expect(SOUNDS.WIN).toBeDefined();
        expect(SOUNDS.LOSE).toBeDefined();
        expect(SOUNDS.HOVER).toBeDefined();
    });

    test('sound paths are strings', () => {
        Object.values(SOUNDS).forEach(path => {
            expect(typeof path).toBe('string');
        });
    });
});
