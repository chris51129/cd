/**
 * Game Core Module - Public API
 */

export {
    gameReducer,
    createInitialState,
    flipBackAction,
} from './gameReducer';

export type {
    GameState,
    GameAction,
    GameType,
    MemoryPhase,
    QuickDrawPhase,
    BlockPhase,
    Scores,
} from './gameReducer';
