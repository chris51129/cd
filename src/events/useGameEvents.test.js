/**
 * Tests for useGameEvents hook
 */
import { renderHook, act } from '@testing-library/react';
import { useGameEvents, useEmitGameEvent } from './useGameEvents';
import { gameEvents } from './gameEvents';

describe('useGameEvents', () => {
    beforeEach(() => {
        gameEvents.clear();
    });

    test('subscribes to single event', () => {
        const callback = jest.fn();
        renderHook(() => useGameEvents('test:event', callback));

        act(() => {
            gameEvents.emit('test:event', { data: 'test' });
        });

        expect(callback).toHaveBeenCalled();
    });

    test('subscribes to multiple events', () => {
        const callback = jest.fn();
        renderHook(() => useGameEvents(['event1', 'event2'], callback));

        act(() => {
            gameEvents.emit('event1');
            gameEvents.emit('event2');
        });

        expect(callback).toHaveBeenCalledTimes(2);
    });

    test('unsubscribes on unmount', () => {
        const callback = jest.fn();
        const { unmount } = renderHook(() => useGameEvents('test:event', callback));

        unmount();

        act(() => {
            gameEvents.emit('test:event');
        });

        expect(callback).not.toHaveBeenCalled();
    });

    test('updates callback reference', () => {
        const callback1 = jest.fn();
        const callback2 = jest.fn();

        const { rerender } = renderHook(
            ({ cb }) => useGameEvents('test:event', cb),
            { initialProps: { cb: callback1 } }
        );

        rerender({ cb: callback2 });

        act(() => {
            gameEvents.emit('test:event');
        });

        expect(callback2).toHaveBeenCalled();
    });

    test('once option works', () => {
        const callback = jest.fn();
        renderHook(() => useGameEvents('test:event', callback, { once: true }));

        act(() => {
            gameEvents.emit('test:event');
            gameEvents.emit('test:event');
        });

        expect(callback).toHaveBeenCalledTimes(1);
    });
});

describe('useEmitGameEvent', () => {
    beforeEach(() => {
        gameEvents.clear();
    });

    test('returns emit function', () => {
        const { result } = renderHook(() => useEmitGameEvent());
        expect(typeof result.current).toBe('function');
    });

    test('emit function works', () => {
        const callback = jest.fn();
        gameEvents.on('test:event', callback);

        const { result } = renderHook(() => useEmitGameEvent());

        act(() => {
            result.current('test:event', { value: 123 });
        });

        expect(callback).toHaveBeenCalledWith(
            expect.objectContaining({ value: 123 })
        );
    });

    test('emit function is memoized', () => {
        const { result, rerender } = renderHook(() => useEmitGameEvent());
        const firstEmit = result.current;

        rerender();

        expect(result.current).toBe(firstEmit);
    });
});
