/**
 * Type declarations for SoundContext.jsx
 * 
 * WHY: Provides type safety for hooks re-exported from JSX files
 * without requiring full migration of the context to TypeScript.
 */

/** Sound keys available in the system */
export type SoundKey = 'CLICK' | 'WIN' | 'LOSE' | 'HOVER';

/** Sound assets map */
export type SoundAssets = Record<SoundKey, string>;

/** Sound context value */
export interface SoundContextValue {
    readonly isMuted: boolean;
    readonly toggleMute: () => void;
    readonly volume: number;
    readonly setVolume: (volume: number) => void;
    readonly play: (soundKey: SoundKey) => void;
    readonly SOUNDS: SoundAssets;
}

/** Sound provider props */
export interface SoundProviderProps {
    readonly children: React.ReactNode;
}

/** useSound hook */
export declare function useSound(): SoundContextValue;

/** SoundProvider component */
export declare function SoundProvider(props: SoundProviderProps): JSX.Element;

/** SOUNDS constant */
export declare const SOUNDS: SoundAssets;
