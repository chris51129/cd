/**
 * Store Module - Public API
 * 
 * WHY: Barrel export for clean imports
 * Usage: import { useStore, useTheme } from '@/store'
 */

// Store instance
export { useStore } from './store';

// All selectors
export * from './selectors';

// Types
export * from './types';

// Slice types (for testing)
export type { UISlice } from './slices/uiSlice';
export type { UserSlice } from './slices/userSlice';
export type { SettingsSlice } from './slices/settingsSlice';
