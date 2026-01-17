---
name: cryptoduels-games
description: Crear y modificar juegos de habilidad en CryptoDuels. Trigger: crear juego, agregar minijuego, modificar lógica de juego, useGameEngine, gameReducer, nuevo tipo de juego, fases de juego, PHASES.
---

# CryptoDuels Games - Skill

Guía para crear y modificar juegos de habilidad en CryptoDuels.

## Arquitectura Shell/Reducer

CryptoDuels usa un patrón **Shell/Reducer** para los juegos:

```
┌─────────────────────────────────────────────────────────────┐
│                     useGameEngine.ts                        │
│                        (SHELL)                              │
│   - Orquesta el flujo del juego                            │
│   - Maneja timers, refs, efectos                           │
│   - Dispara acciones al reducer                            │
│   - Callbacks para eventos de usuario                       │
└─────────────────────┬───────────────────────────────────────┘
                      │ dispatch({ type: 'ACTION' })
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                    gameReducer.ts                           │
│                   (PURE STATE MACHINE)                      │
│   - Funciones puras (state, action) => newState            │
│   - NO efectos secundarios                                  │
│   - Toda la lógica de transición de estados                │
└─────────────────────────────────────────────────────────────┘
```

## Fases de Juego (PHASES)

```typescript
const PHASES = {
    SETUP: 'setup',         // Inicialización
    SELECTION: 'selection', // Usuario selecciona (RPS, Coinflip)
    SPIN: 'spin',           // Animación/Juego activo
    RESULT: 'result',       // Mostrar resultado
    DONE: 'done'            // Finalizado
};
```

## Crear Nuevo Juego - Checklist

### 1. Agregar GameType
```typescript
// src/games/core/gameReducer.ts
type GameType = 'rps' | 'coinflip' | 'dice' | 'memory' | 'quickdraw' | 'blockvalidation' | 'TU_NUEVO_JUEGO';
```

### 2. Estado Inicial
```typescript
// En createInitialState()
if (gameType === 'tu_nuevo_juego') {
    return {
        ...baseState,
        tuNuevoJuegoState: 'waiting',
        tuNuevoJuegoData: [],
        // ... estado específico
    };
}
```

### 3. Acciones
```typescript
// En GameAction union
| { type: 'TU_ACCION'; payload: TuPayload }
```

### 4. Handler
```typescript
// Función handler pura
const handleTuAccion = (state: GameState, payload: TuPayload): GameState => {
    if (state.gameType !== 'tu_nuevo_juego') return state;
    return {
        ...state,
        // ... cambios de estado
    };
};

// En el switch del reducer
case 'TU_ACCION':
    return handleTuAccion(state, action.payload);
```

### 5. Hook Integration
```typescript
// En useGameEngine.ts
const handleTuAccion = useCallback((payload) => {
    dispatch({ type: 'TU_ACCION', payload });
}, []);
```

### 6. Componente de Animación
```typescript
// src/components/game/animations/TuNuevoJuegoAnimation.tsx
const TuNuevoJuegoAnimation: React.FC<Props> = ({ status, result, gameState }) => {
    // Renderizar según status y gameState
};
```

## Patrones Importantes

### Timing con performance.now()
```typescript
// Para timing preciso, usar Refs
const startTimeRef = useRef<number>(0);

// Al iniciar
startTimeRef.current = performance.now();

// Al calcular tiempo
const elapsed = performance.now() - startTimeRef.current;
```

### Bloquear Input Durante Procesamiento
```typescript
const isProcessingRef = useRef(false);

const handleUserAction = useCallback(() => {
    if (isProcessingRef.current) return;
    isProcessingRef.current = true;
    
    // ... lógica
    
    setTimeout(() => {
        isProcessingRef.current = false;
    }, delay);
}, []);
```

### Transiciones de Estado en useEffect
```typescript
// Reaccionar a cambios de estado
useEffect(() => {
    if (gameType !== 'tu_juego') return;
    
    if (state.tuJuegoState === 'condicion') {
        // Disparar acción
        dispatch({ type: 'SIGUIENTE_FASE' });
    }
}, [gameType, state.tuJuegoState]);
```

## Archivos Clave

| Archivo | Propósito |
|---------|-----------|
| `src/games/core/gameReducer.ts` | Estado y transiciones |
| `src/hooks/useGameEngine.ts` | Orquestación y efectos |
| `src/hooks/useGameLoop.ts` | Loop de tick (deltaTime) |
| `src/components/game/GameArena.tsx` | Contenedor de juego |
| `src/components/game/animations/` | Componentes de animación |

## Testing

```typescript
// Test de reducer (puro, sin mocks)
describe('handleTuAccion', () => {
    it('should transition state correctly', () => {
        const state = createInitialState('tu_juego');
        const result = gameReducer(state, { type: 'TU_ACCION', payload: {} });
        expect(result.tuJuegoState).toBe('expected');
    });
});
```
