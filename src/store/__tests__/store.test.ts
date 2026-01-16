/**
 * Store Tests - Tests unitarios para el store de Zustand
 * 
 * WHY (Skill javascript-testing-patterns): Tests de slices aislados
 * sin necesidad de React, usando getState/setState directamente.
 */

import { useStore } from '../store';
import { initialUIState } from '../slices/uiSlice';
import { initialUserState } from '../slices/userSlice';
import { initialSettingsState } from '../slices/settingsSlice';
import { toWalletAddress, tryWalletAddress } from '../types';

// Reset store before each test
beforeEach(() => {
    useStore.setState({
        ...initialUIState,
        ...initialUserState,
        ...initialSettingsState,
    });
});

describe('Store - UI Slice', () => {
    it('should have correct initial state', () => {
        const state = useStore.getState();

        expect(state.sidebarOpen).toBe(true);
        expect(state.activeModal).toBeNull();
        expect(state.isLoading).toBe(false);
        expect(state.notifications).toEqual([]);
    });

    it('should toggle sidebar', () => {
        const { toggleSidebar } = useStore.getState();

        toggleSidebar();
        expect(useStore.getState().sidebarOpen).toBe(false);

        toggleSidebar();
        expect(useStore.getState().sidebarOpen).toBe(true);
    });

    it('should open and close modals', () => {
        const { openModal, closeModal } = useStore.getState();

        openModal('settings');
        expect(useStore.getState().activeModal).toBe('settings');

        closeModal();
        expect(useStore.getState().activeModal).toBeNull();
    });

    it('should set loading state with message', () => {
        const { setLoading } = useStore.getState();

        setLoading(true, 'Loading...');
        expect(useStore.getState().isLoading).toBe(true);
        expect(useStore.getState().loadingMessage).toBe('Loading...');

        setLoading(false);
        expect(useStore.getState().isLoading).toBe(false);
        expect(useStore.getState().loadingMessage).toBeNull();
    });

    it('should add and remove notifications', () => {
        const { addNotification, removeNotification } = useStore.getState();

        addNotification({ type: 'success', message: 'Test notification' });

        const notifications = useStore.getState().notifications;
        expect(notifications).toHaveLength(1);
        expect(notifications[0].type).toBe('success');
        expect(notifications[0].message).toBe('Test notification');
        expect(notifications[0].id).toMatch(/^notif-/);

        removeNotification(notifications[0].id);
        expect(useStore.getState().notifications).toHaveLength(0);
    });
});

describe('Store - User Slice', () => {
    it('should have correct initial state', () => {
        const state = useStore.getState();

        expect(state.address).toBeNull();
        expect(state.username).toBeNull();
        expect(state.tier).toBe('bronze');
        expect(state.balance).toBe(BigInt(0));
        expect(state.isConnected).toBe(false);
    });

    it('should set user data', () => {
        const { setUser } = useStore.getState();
        const address = toWalletAddress('0x1234567890123456789012345678901234567890');

        setUser({
            address,
            username: 'TestUser',
            tier: 'gold',
        });

        const state = useStore.getState();
        expect(state.address).toBe(address);
        expect(state.username).toBe('TestUser');
        expect(state.tier).toBe('gold');
        expect(state.isConnected).toBe(true);
    });

    it('should clear user data', () => {
        const { setUser, clearUser } = useStore.getState();
        const address = toWalletAddress('0x1234567890123456789012345678901234567890');

        setUser({ address, username: 'Test' });
        clearUser();

        const state = useStore.getState();
        expect(state.address).toBeNull();
        expect(state.isConnected).toBe(false);
    });

    it('should update stats with win rate calculation', () => {
        const { updateStats } = useStore.getState();

        updateStats({ wins: 7, losses: 3 });

        const state = useStore.getState();
        expect(state.stats.wins).toBe(7);
        expect(state.stats.losses).toBe(3);
        expect(state.stats.winRate).toBe(70);
    });
});

describe('Store - Settings Slice', () => {
    it('should have correct initial state', () => {
        const state = useStore.getState();

        expect(state.theme).toBe('dark');
        expect(state.soundEnabled).toBe(true);
        expect(state.volume).toBe(70);
    });

    it('should toggle theme', () => {
        const { toggleTheme } = useStore.getState();

        toggleTheme();
        expect(useStore.getState().theme).toBe('light');

        toggleTheme();
        expect(useStore.getState().theme).toBe('dark');
    });

    it('should set theme directly', () => {
        const { setTheme } = useStore.getState();

        setTheme('light');
        expect(useStore.getState().theme).toBe('light');
    });

    it('should toggle sound', () => {
        const { toggleSound } = useStore.getState();

        toggleSound();
        expect(useStore.getState().soundEnabled).toBe(false);
    });

    it('should clamp volume between 0 and 100', () => {
        const { setVolume } = useStore.getState();

        setVolume(150);
        expect(useStore.getState().volume).toBe(100);

        setVolume(-50);
        expect(useStore.getState().volume).toBe(0);

        setVolume(50);
        expect(useStore.getState().volume).toBe(50);
    });

    it('should update safety settings', () => {
        const { updateSafetySettings } = useStore.getState();

        updateSafetySettings({ cooldownMinutes: 30 });

        expect(useStore.getState().safetySettings.cooldownMinutes).toBe(30);
    });
});

describe('Store - Types', () => {
    describe('toWalletAddress', () => {
        it('should validate correct addresses', () => {
            const address = toWalletAddress('0x1234567890123456789012345678901234567890');
            expect(address).toBe('0x1234567890123456789012345678901234567890');
        });

        it('should throw on invalid addresses', () => {
            expect(() => toWalletAddress('invalid')).toThrow();
            expect(() => toWalletAddress('0x123')).toThrow();
            expect(() => toWalletAddress('')).toThrow();
        });

        it('should lowercase addresses', () => {
            const address = toWalletAddress('0xABCDEF1234567890123456789012345678901234');
            expect(address).toBe('0xabcdef1234567890123456789012345678901234');
        });
    });

    describe('tryWalletAddress', () => {
        it('should return null on invalid addresses', () => {
            expect(tryWalletAddress('invalid')).toBeNull();
            expect(tryWalletAddress('')).toBeNull();
        });

        it('should return address on valid input', () => {
            const address = tryWalletAddress('0x1234567890123456789012345678901234567890');
            expect(address).not.toBeNull();
        });
    });
});
