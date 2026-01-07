/**
 * Games Module - Barrel Export (TypeScript)
 * 
 * Exporta todas las estrategias de juego, factory y tipos.
 * 
 * Uso:
 *   import { getGameStrategy, coinflipStrategy, type GameStrategy } from './games';
 */

// Factory
export {
    getGameStrategy,
    isValidGameType,
    getAvailableGames,
    getInitialGameState,
    registerGameStrategy
} from './gameFactory';

// Base types and constants
export {
    GAME_PHASES,
    GAME_STATUS,
    OUTCOMES,
    type GamePhase,
    type GameStatus,
    type Outcome,
    type GameContext,
    type GameStrategy,
    type GameRefs,
    type SecureUtils
} from './gameStrategy';

// Individual Strategies (por si se necesitan directamente)
export { default as coinflipStrategy, type CoinFlipResult } from './coinflip.strategy';
export { default as diceStrategy, type DiceResult } from './dice.strategy';
export { default as rpsStrategy, type RPSChoice, type RPSResult, type RPSGameState } from './rps.strategy';
export { default as memoryStrategy, MEMORY_ICONS, type MemoryGameState, type MemoryScores } from './memory.strategy';
export { default as quickdrawStrategy, type QuickDrawGameState, type QuickDrawResult, type QuickDrawPhase } from './quickdraw.strategy';
export {
    default as blockvalidationStrategy,
    type BlockValidationGameState,
    type BlockValidationResult,
    type BlockValidationPhase
} from './blockvalidation.strategy';
