/**
 * Static Styles - Performance Optimization
 * 
 * WHY (Protocolo Optimización):
 * Inline styles like style={{}} create new objects every render,
 * causing unnecessary garbage collection pressure.
 * 
 * SOLUTION:
 * Extract static styles to constant objects defined once at module load.
 * These are never recreated, eliminating GC overhead.
 * 
 * USAGE:
 * import { STYLES } from '@/styles/staticStyles';
 * <div style={STYLES.iconLarge}>
 */

import type { CSSProperties } from 'react';

// ============================================
// Type Definitions
// ============================================

type StyleRecord = Readonly<Record<string, CSSProperties>>;

// ============================================
// Icon & Text Sizes
// ============================================

export const ICON_STYLES: StyleRecord = Object.freeze({
    xlarge: { fontSize: '6rem' },
    large: { fontSize: '5rem' },
    medium: { fontSize: '4rem' },
    small: { fontSize: '3rem' },
    xs: { fontSize: '2rem' },
    xxs: { fontSize: '1.5rem' },
} as const);

export const TEXT_STYLES: StyleRecord = Object.freeze({
    heading1: { fontSize: '4rem', marginBottom: '1rem' },
    heading2: { fontSize: '3rem', marginBottom: '1rem' },
    heading3: { fontSize: '2rem', marginBottom: '0.5rem' },
    secondary: { color: '#94a3b8' },
    accent: { color: 'var(--accent-blue)' },
    success: { color: '#4ade80' },
    error: { color: '#ef4444' },
} as const);

// ============================================
// Layout & Spacing
// ============================================

export const LAYOUT_STYLES: StyleRecord = Object.freeze({
    // Gaps
    gap1: { gap: '1rem' },
    gap2: { gap: '2rem' },
    gap3: { gap: '3rem' },
    gap4: { gap: '4rem' },

    // Padding
    padded: { padding: '1rem 2rem' },
    paddedLarge: { padding: '2rem 4rem' },
    paddingTop100: { paddingTop: '100px' },
    paddingBottom5: { paddingBottom: '5rem' },

    // Margins
    mb1: { marginBottom: '1rem' },
    mb2: { marginBottom: '2rem' },
    mb4: { marginBottom: '4rem' },

    // Centering
    centered: { margin: '0 auto' },
    centeredPadded: { margin: '0 auto', padding: '0 2rem' },

    // Flex
    flexCenter: { display: 'flex', justifyContent: 'center', alignItems: 'center' },
    flexBetween: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    flexEnd: { display: 'flex', justifyContent: 'flex-end', gap: '1rem' },
    flexGap: { display: 'flex', gap: '1rem' },
} as const);

// ============================================
// Container Styles
// ============================================

export const CONTAINER_STYLES: StyleRecord = Object.freeze({
    page: {
        paddingTop: '100px',
        minHeight: '80vh',
    },
    card: {
        background: 'rgba(30, 30, 40, 0.9)',
        borderRadius: '1rem',
        padding: '2rem',
        border: '1px solid rgba(255, 255, 255, 0.1)',
    },
    modal: {
        position: 'fixed',
        inset: 0,
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalBackdrop: {
        position: 'absolute',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.8)',
        backdropFilter: 'blur(4px)',
    },
    modalContent: {
        position: 'relative',
        zIndex: 10,
        background: 'linear-gradient(135deg, rgba(30, 30, 40, 0.95) 0%, rgba(20, 20, 30, 0.98) 100%)',
        borderRadius: '1rem',
        padding: '2rem',
        maxWidth: '400px',
        width: '90%',
        border: '1px solid rgba(255, 255, 255, 0.1)',
    },
    maxWidth800: {
        maxWidth: '800px',
        margin: '0 auto',
    },
} as const);

// ============================================
// Interactive Elements
// ============================================

export const INTERACTIVE_STYLES: StyleRecord = Object.freeze({
    clickable: { cursor: 'pointer' },
    clickableFlex: { cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem' },
    button: { padding: '0.75rem 1.5rem' },
    buttonLarge: { padding: '1rem 2rem' },
} as const);

// ============================================
// Animation-related Styles
// ============================================

export const ANIMATION_STYLES: StyleRecord = Object.freeze({
    rpsIcon: { fontSize: '5rem' },
    vsText: { fontSize: '2rem', color: '#888' },
    spinnerSmall: { fontSize: '0.6rem', opacity: 0.5 },
} as const);

// ============================================
// Error & Debug Styles
// ============================================

export const ERROR_STYLES: StyleRecord = Object.freeze({
    container: {
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #1C1C1E 0%, #0a0a0b 100%)',
        padding: '2rem',
    },
    details: {
        marginTop: '1rem',
        padding: '1rem',
        background: 'rgba(0,0,0,0.5)',
        borderRadius: '0.5rem',
        maxHeight: '200px',
        overflow: 'auto',
    },
    stack: {
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-all',
        fontSize: '0.75rem',
        color: '#aaa',
    },
} as const);

// ============================================
// Convenience Exports
// ============================================

/**
 * Combined styles object for easy access
 * @example
 * import { STYLES } from '@/styles/staticStyles';
 * <div style={STYLES.icon.large}>
 */
export const STYLES = Object.freeze({
    icon: ICON_STYLES,
    text: TEXT_STYLES,
    layout: LAYOUT_STYLES,
    container: CONTAINER_STYLES,
    interactive: INTERACTIVE_STYLES,
    animation: ANIMATION_STYLES,
    error: ERROR_STYLES,
} as const);

export default STYLES;
