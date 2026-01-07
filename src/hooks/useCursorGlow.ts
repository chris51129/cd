/**
 * useCursorGlow - Hook para efecto de iluminación que sigue al cursor
 * 
 * WHY: Proporciona un efecto visual premium de glow que sigue el cursor,
 * mejorando la experiencia de usuario con feedback visual interactivo.
 * 
 * Usage:
 * const { ref, handlers } = useCursorGlow();
 * <div ref={ref} {...handlers} className="glow-card">...</div>
 * 
 * CSS requerido:
 * .glow-card {
 *   position: relative;
 *   overflow: hidden;
 * }
 * .glow-card::before {
 *   content: '';
 *   position: absolute;
 *   inset: 0;
 *   background: radial-gradient(
 *     600px circle at var(--mouse-x) var(--mouse-y),
 *     rgba(46, 92, 255, 0.15),
 *     transparent 40%
 *   );
 *   opacity: 0;
 *   transition: opacity 0.3s ease;
 *   pointer-events: none;
 *   z-index: 1;
 * }
 * .glow-card:hover::before {
 *   opacity: 1;
 * }
 */
import { useRef, useCallback, type RefObject, type MouseEvent } from 'react';

// ============================================
// Types
// ============================================

/** Mouse event handlers for the glow effect */
export interface CursorGlowHandlers {
    readonly onMouseMove: (e: MouseEvent<HTMLElement>) => void;
    readonly onMouseEnter: () => void;
    readonly onMouseLeave: () => void;
}

/** Hook return type */
export interface UseCursorGlowResult {
    /** Ref to attach to the target element */
    readonly ref: RefObject<HTMLElement>;
    /** Event handlers to spread onto the element */
    readonly handlers: CursorGlowHandlers;
}

// ============================================
// Hook Implementation
// ============================================

/**
 * Custom hook for cursor-following glow effect
 * 
 * @returns Ref and handlers to attach to target element
 * 
 * @example
 * const { ref, handlers } = useCursorGlow();
 * return <div ref={ref} {...handlers} className="glow-card">Content</div>;
 */
const useCursorGlow = (): UseCursorGlowResult => {
    const ref = useRef<HTMLElement>(null);

    /**
     * Update CSS custom properties with cursor position
     */
    const handleMouseMove = useCallback((e: MouseEvent<HTMLElement>): void => {
        if (!ref.current) return;

        const rect = ref.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        ref.current.style.setProperty('--mouse-x', `${x}px`);
        ref.current.style.setProperty('--mouse-y', `${y}px`);
    }, []);

    /**
     * Add active class on mouse enter
     */
    const handleMouseEnter = useCallback((): void => {
        if (ref.current) {
            ref.current.classList.add('cursor-glow-active');
        }
    }, []);

    /**
     * Remove active class on mouse leave
     */
    const handleMouseLeave = useCallback((): void => {
        if (ref.current) {
            ref.current.classList.remove('cursor-glow-active');
        }
    }, []);

    return {
        ref,
        handlers: {
            onMouseMove: handleMouseMove,
            onMouseEnter: handleMouseEnter,
            onMouseLeave: handleMouseLeave
        }
    };
};

export default useCursorGlow;
