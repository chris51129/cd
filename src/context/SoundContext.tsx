import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { SoundContextValue, SoundId, PropsWithChildren } from '../types';

// Define Sound Assets Map with proper typing
const SOUNDS_MAP: Record<Uppercase<SoundId>, string> = {
    CLICK: '/assets/sounds/click.mp3',
    WIN: '/assets/sounds/win.mp3',
    LOSE: '/assets/sounds/lose.mp3',
    HOVER: '/assets/sounds/hover.mp3',
    DRAW: '/assets/sounds/draw.mp3',
    COUNTDOWN: '/assets/sounds/countdown.mp3',
    FLIP: '/assets/sounds/flip.mp3',
    SPIN: '/assets/sounds/spin.mp3',
    MATCH: '/assets/sounds/match.mp3',
    WRONG: '/assets/sounds/wrong.mp3',
};

const SoundContext = createContext<SoundContextValue | undefined>(undefined);

export const SoundProvider: React.FC<PropsWithChildren> = ({ children }) => {
    const [isMuted, setIsMuted] = useState(false);
    const [volume, setVolume] = useState(0.5); // 0.0 to 1.0

    // Preload Functionality
    useEffect(() => {
        // Preload sounds for instant playback
        const cache: Record<string, HTMLAudioElement> = {};
        Object.entries(SOUNDS_MAP).forEach(([key, path]) => {
            const audio = new Audio(path);
            cache[key] = audio;
        });
        // Cache populated but not stored in state (causes re-renders)
    }, []);

    /**
     * Play a sound by ID
     * WHY: Typed soundId prevents typos and invalid sound references
     */
    const playSound = useCallback((soundId: SoundId): void => {
        if (isMuted) return;

        const soundKey = soundId.toUpperCase() as Uppercase<SoundId>;
        const url = SOUNDS_MAP[soundKey];

        if (!url) {
            // Silent fail is better for production than spamming console if asset missing
            return;
        }

        // Create new instance to allow overlapping sounds
        const audio = new Audio(url);
        audio.volume = volume;
        audio.play().catch(() => {
            // Browser policy (interaction required) often blocks auto-play on load
        });

    }, [isMuted, volume]);

    const toggleMute = (): void => setIsMuted(prev => !prev);

    const value: SoundContextValue = {
        isMuted,
        toggleMute,
        volume,
        setVolume,
        playSound,
    };

    return (
        <SoundContext.Provider value={value}>
            {children}
        </SoundContext.Provider>
    );
};

export const useSound = (): SoundContextValue => {
    const context = useContext(SoundContext);
    if (!context) {
        throw new Error('useSound must be used within a SoundProvider');
    }
    return context;
};
