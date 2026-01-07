import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

// Define Sound Assets Map
export const SOUNDS = {
    CLICK: '/assets/sounds/click.mp3',
    WIN: '/assets/sounds/win.mp3',
    LOSE: '/assets/sounds/lose.mp3',
    HOVER: '/assets/sounds/hover.mp3',
    // Add more here easily
};

const SoundContext = createContext();

export const SoundProvider = ({ children }) => {
    const [isMuted, setIsMuted] = useState(false);
    const [volume, setVolume] = useState(0.5); // 0.0 to 1.0
    const [audioCache, setAudioCache] = useState({});

    // 1. Preload Functionality
    useEffect(() => {
        // Preload sounds for instant playback
        const cache = {};
        Object.entries(SOUNDS).forEach(([key, path]) => {
            const audio = new Audio(path);
            cache[key] = audio;
        });
        setAudioCache(cache);
    }, []);

    // 2. Play Function
    const play = useCallback((soundKey) => {
        if (isMuted) return;

        const url = SOUNDS[soundKey];
        if (!url) {
            // console.warn(`Sound not found: ${soundKey}`); 
            // Silent fail is better for production than spamming console if asset missing
            return;
        }

        // We create a clone (or new instance) to allow overlapping sounds 
        // (same sound playing twice quickly)
        const audio = new Audio(url);
        audio.volume = volume;
        audio.play().catch(() => {
            // Browser policy (interaction required) often blocks auto-play on load
        });

    }, [isMuted, volume]);

    // 3. Toggle Mute
    const toggleMute = () => setIsMuted(prev => !prev);

    const value = {
        isMuted,
        toggleMute,
        volume,
        setVolume,
        play,
        SOUNDS // Export constants for easy usage
    };

    return (
        <SoundContext.Provider value={value}>
            {children}
        </SoundContext.Provider>
    );
};

export const useSound = () => {
    const context = useContext(SoundContext);
    if (!context) {
        throw new Error('useSound must be used within a SoundProvider');
    }
    return context;
};
