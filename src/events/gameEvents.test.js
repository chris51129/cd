/**
 * Tests for GameEventEmitter - Observer pattern implementation
 */
import { gameEvents, GAME_EVENTS } from './gameEvents';

describe('GameEventEmitter', () => {
    beforeEach(() => {
        // Clear all listeners before each test
        gameEvents.clear();
    });

    describe('GAME_EVENTS constants', () => {
        test('exports GAME_START', () => {
            expect(GAME_EVENTS.GAME_START).toBeDefined();
        });

        test('exports GAME_END', () => {
            expect(GAME_EVENTS.GAME_END).toBeDefined();
        });

        test('exports VICTORY', () => {
            expect(GAME_EVENTS.VICTORY).toBeDefined();
        });

        test('exports DEFEAT', () => {
            expect(GAME_EVENTS.DEFEAT).toBeDefined();
        });

        test('exports PLAYER_ACTION', () => {
            expect(GAME_EVENTS.PLAYER_ACTION).toBeDefined();
        });
    });

    describe('on()', () => {
        test('subscribes to an event', () => {
            const callback = jest.fn();
            gameEvents.on('test:event', callback);
            gameEvents.emit('test:event');
            expect(callback).toHaveBeenCalled();
        });

        test('returns unsubscribe function', () => {
            const callback = jest.fn();
            const unsubscribe = gameEvents.on('test:event', callback);
            expect(typeof unsubscribe).toBe('function');
        });

        test('unsubscribe function works', () => {
            const callback = jest.fn();
            const unsubscribe = gameEvents.on('test:event', callback);
            unsubscribe();
            gameEvents.emit('test:event');
            expect(callback).not.toHaveBeenCalled();
        });

        test('multiple subscribers receive event', () => {
            const callback1 = jest.fn();
            const callback2 = jest.fn();
            gameEvents.on('test:event', callback1);
            gameEvents.on('test:event', callback2);
            gameEvents.emit('test:event');
            expect(callback1).toHaveBeenCalled();
            expect(callback2).toHaveBeenCalled();
        });
    });

    describe('once()', () => {
        test('subscribes to event only once', () => {
            const callback = jest.fn();
            gameEvents.once('test:once', callback);
            gameEvents.emit('test:once');
            gameEvents.emit('test:once');
            expect(callback).toHaveBeenCalledTimes(1);
        });
    });

    describe('off()', () => {
        test('removes listener', () => {
            const callback = jest.fn();
            gameEvents.on('test:event', callback);
            gameEvents.off('test:event', callback);
            gameEvents.emit('test:event');
            expect(callback).not.toHaveBeenCalled();
        });
    });

    describe('emit()', () => {
        test('passes data to callback', () => {
            const callback = jest.fn();
            gameEvents.on('test:event', callback);
            gameEvents.emit('test:event', { value: 42 });
            expect(callback).toHaveBeenCalledWith(
                expect.objectContaining({ value: 42 })
            );
        });

        test('adds _event to data', () => {
            const callback = jest.fn();
            gameEvents.on('test:event', callback);
            gameEvents.emit('test:event');
            expect(callback).toHaveBeenCalledWith(
                expect.objectContaining({ _event: 'test:event' })
            );
        });

        test('adds _timestamp to data', () => {
            const callback = jest.fn();
            gameEvents.on('test:event', callback);
            gameEvents.emit('test:event');
            expect(callback).toHaveBeenCalledWith(
                expect.objectContaining({ _timestamp: expect.any(Number) })
            );
        });

        test('handles callback errors gracefully', () => {
            const errorCallback = jest.fn(() => { throw new Error('Test error'); });
            const normalCallback = jest.fn();
            const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

            gameEvents.on('test:event', errorCallback);
            gameEvents.on('test:event', normalCallback);
            gameEvents.emit('test:event');

            expect(consoleSpy).toHaveBeenCalled();
            expect(normalCallback).toHaveBeenCalled();
            consoleSpy.mockRestore();
        });
    });

    describe('clear()', () => {
        test('removes all listeners', () => {
            const callback = jest.fn();
            gameEvents.on('event1', callback);
            gameEvents.on('event2', callback);
            gameEvents.clear();
            gameEvents.emit('event1');
            gameEvents.emit('event2');
            expect(callback).not.toHaveBeenCalled();
        });
    });

    describe('listenerCount()', () => {
        test('returns 0 for no listeners', () => {
            expect(gameEvents.listenerCount('nonexistent')).toBe(0);
        });

        test('returns correct count', () => {
            gameEvents.on('test:event', () => { });
            gameEvents.on('test:event', () => { });
            expect(gameEvents.listenerCount('test:event')).toBe(2);
        });

        test('includes once listeners', () => {
            gameEvents.on('test:event', () => { });
            gameEvents.once('test:event', () => { });
            expect(gameEvents.listenerCount('test:event')).toBe(2);
        });
    });
});
