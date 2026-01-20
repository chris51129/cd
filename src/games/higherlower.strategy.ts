/**
 * Higher/Lower Strategy
 * 
 * Prediction game where players guess if the next card is higher or lower.
 * Features 1v1 duel mechanics with score and lives.
 */
import {
    GAME_PHASES,
    type GameStrategy,
    type GameContext,
    type GameRefs
} from './gameStrategy';

/**
 * Higher/Lower game strategy implementation
 */
export const higherlowerStrategy: GameStrategy<any> = {
    type: 'higherlower',

    /**
     * Initial state is handled by the reducer, but we can provide defaults here if needed
     */
    getInitialState: () => ({
        // Reducer handles the bulk of state
    }),

    /**
     * Setup is handled by useGameEngine directly for higherlower 
     * but we provide the strategy for factory compliance.
     */
    setup: (_context: GameContext, _refs: GameRefs): void => {
        // useGameEngine handles HL_INIT directly
    },

    /**
     * spin is called by evaluateSpin in the engine
     * For Higher/Lower, we use it to calculate the opponent's move
     * to keep the reducer pure.
     */
    spin: (context: GameContext): void => {
        const { secureRandomInt } = context as any;

        // Determine opponent prediction (55% accuracy)
        // In a real duel, this would come from the network/opponent action.
        // For simulation, we calculate it here.
        const opponentCorrect = secureRandomInt(1, 100) <= 55;

        // Note: The actual calculation of who won is done in the reducer
        // but we can pass the opponent's "luck" or prediction in the action.
    },

    handlers: {}
};

export default higherlowerStrategy;
