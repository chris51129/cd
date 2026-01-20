---
name: cryptoduels-reducer
description: Modificar gameReducer.ts para juegos de habilidad. Trigger: agregar acción, modificar estado, nuevo handler, GameAction, GameState, handleFinishGame, CARD_CLICK, dispatch.
---

# CryptoDuels Reducer - Skill

Guía para modificar `gameReducer.ts` correctamente.

## Ubicación

`src/games/core/gameReducer.ts`

## Estructura del Archivo

```typescript
// 1. TIPOS
type GameType = 'rps' | 'coinflip' | 'dice' | 'memory' | 'quickdraw' | 'blockvalidation';

interface GameState {
    // Estado base común
    gameType: GameType;
    phase: string;
    status: string;
    elapsedMs: number;
    result: unknown;
    
    // Estado específico por juego
    memoryPhase?: 'memorize' | 'playing' | 'result';
    quickDrawState?: 'countdown' | 'waiting' | 'signal' | 'result';
    blockState?: 'countdown' | 'playing' | 'result';
    // ...
}

// 2. ACCIONES (Union Type)
type GameAction =
    | { type: 'TICK'; deltaTime: number }
    | { type: 'INIT'; gameType: GameType }
    | { type: 'CARD_CLICK'; index: number }
    | { type: 'FLIP_BACK' }
    | { type: 'FINISH_GAME'; isWin: boolean; result: unknown }
    // ... más acciones

// 3. HANDLER FUNCTIONS
const handleCardClick = (state: GameState, index: number): GameState => { ... }
const handleFlipBack = (state: GameState): GameState => { ... }

// 4. REDUCER PRINCIPAL
export const gameReducer = (state: GameState, action: GameAction): GameState => {
    switch (action.type) {
        case 'CARD_CLICK':
            return handleCardClick(state, action.index);
        // ...
        default:
            return state;
    }
};
```

## Agregar Nueva Acción - Pasos

### Paso 1: Definir en GameAction
```typescript
type GameAction =
    // ... existentes
    | { type: 'TU_NUEVA_ACCION'; tuPayload: TuTipo }
```

### Paso 2: Crear Handler Function
```typescript
/**
 * Handle TU_NUEVA_ACCION
 * WHY: [explicar el propósito]
 */
const handleTuNuevaAccion = (state: GameState, payload: TuTipo): GameState => {
    // Validar que es el juego correcto
    if (state.gameType !== 'tu_juego') return state;
    
    // Validar precondiciones
    if (state.fase !== 'esperada') return state;
    
    // Retornar nuevo estado (INMUTABLE)
    return {
        ...state,
        tuPropiedad: nuevoValor,
        otraPropiedad: calcularNuevo(state.otraPropiedad, payload)
    };
};
```

### Paso 3: Agregar Case al Switch
```typescript
// En gameReducer switch
case 'TU_NUEVA_ACCION':
    return handleTuNuevaAccion(state, action.tuPayload);
```

## Reglas de Oro

### 1. INMUTABILIDAD
```typescript
// ❌ NUNCA mutar estado
state.array.push(item);
state.value = newValue;

// ✅ SIEMPRE retornar nuevo objeto
return {
    ...state,
    array: [...state.array, item],
    value: newValue
};
```

### 2. FUNCIONES PURAS
```typescript
// ❌ NUNCA efectos secundarios
const handleAction = (state) => {
    console.log(state);        // NO
    localStorage.setItem();     // NO
    dispatch(otherAction);      // NO
    return state;
};

// ✅ Solo transformar estado
const handleAction = (state) => {
    return { ...state, value: newValue };
};
```

### 3. VALIDACIONES PRIMERO
```typescript
const handleAction = (state, payload) => {
    // Validar tipo de juego
    if (state.gameType !== 'expected') return state;
    
    // Validar fase
    if (state.phase !== PHASES.EXPECTED) return state;
    
    // Validar payload
    if (payload < 0 || payload >= 16) return state;
    
    // Ahora sí, transformar
    return { ...state, ... };
};
```

### 4. COMENTARIOS WHY
```typescript
/**
 * Handle FLIP_BACK after non-match
 * WHY: Clears flippedIndices after player sees non-matching cards
 */
const handleFlipBack = (state: GameState): GameState => {
    if (state.gameType !== 'memory') return state;
    return { ...state, flippedIndices: [] };
};
```

## Acciones Comunes

| Acción | Propósito |
|--------|-----------|
| `TICK` | Update per-frame (deltaTime) |
| `INIT` | Crear estado inicial |
| `START_PLAYING` | Transición a fase activa |
| `FINISH_GAME` | Terminar con resultado |
| `CARD_CLICK` | Click en carta (Memory) |
| `FLIP_BACK` | Voltear cartas (Memory) |
| `QUICK_DRAW_SIGNAL` | Mostrar señal verde |
| `BLOCK_CELL_CLICK` | Click en celda (BlockValidation) |

## Testing Reducers

```typescript
import { gameReducer, createInitialState } from './gameReducer';

describe('handleTuAccion', () => {
    it('should not change state for wrong gameType', () => {
        const state = createInitialState('rps'); // Otro tipo
        const result = gameReducer(state, { type: 'TU_ACCION', payload: {} });
        expect(result).toBe(state); // Mismo objeto (no cambió)
    });
    
    it('should transform state correctly', () => {
        const state = createInitialState('tu_juego');
        const result = gameReducer(state, { type: 'TU_ACCION', payload: {} });
        expect(result.tuPropiedad).toBe('expected');
    });
});
```

## Debugging

Si el reducer no responde a una acción:
1. Verificar que la acción está en `GameAction` union
2. Verificar que el case existe en el switch
3. Verificar que las validaciones no rechazan (return state temprano)
4. Verificar que `dispatch` lleva el `type` correcto
