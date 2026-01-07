/**
 * Barrel export for game animations
 * 
 * OPTIMIZACIÓN: Dynamic Import (Lazy Loading)
 * Las animaciones se cargan bajo demanda, reduciendo el bundle inicial.
 * Cada animación solo se carga cuando el usuario entra en ese juego específico.
 */
import { lazy } from 'react';

// Lazy-loaded animations for optimal bundle splitting
export const CoinFlipAnimation = lazy(() => import('./CoinFlipAnimation'));
export const DiceAnimation = lazy(() => import('./DiceAnimation'));
export const RPSAnimation = lazy(() => import('./RPSAnimation'));
export const MemoryAnimation = lazy(() => import('./MemoryAnimation'));
export const QuickDrawAnimation = lazy(() => import('./QuickDrawAnimation'));
export const BlockValidationAnimation = lazy(() => import('./BlockValidationAnimation'));

// Re-export for backwards compatibility if needed
// Note: Consumers MUST wrap these in <Suspense> with a fallback
