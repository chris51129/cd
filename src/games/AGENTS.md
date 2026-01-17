# AGENTS.md - src/games/

> Lógica de juegos y arquitectura Shell/Reducer.

## Arquitectura

CryptoDuels usa el patrón **Shell/Reducer**:

```
useGameEngine.ts (Shell)     gameReducer.ts (Reducer)
├── Orquestación             ├── Estado puro
├── Efectos (useEffect)      ├── Transiciones
├── Timers (setTimeout)      ├── Validaciones
├── Refs (performance.now)   ├── Lógica de juego
└── dispatch(action)    ──►  └── (state, action) => newState
```

## Fases de Juego (PHASES)

```
SETUP → SELECTION → SPIN → RESULT → DONE
         (RPS/CF)    (juego activo)
```

## Archivos Clave

| Archivo | Propósito |
|---------|-----------|
| `core/gameReducer.ts` | Estado y transiciones (PURO) |
| `core/constants.ts` | PHASES, GameType |

## Tipos de Juego

### Juegos de Habilidad (Skill Games)
- **Memory**: Encontrar 8 pares
- **QuickDraw**: Reacción rápida
- **BlockValidation**: Secuencia 1-25

### Juegos de Suerte (Chance Games)
- **RPS**: Piedra, Papel, Tijeras
- **Coinflip**: Cara o Cruz
- **Dice**: Dado mayor gana

## Crear Nuevo Juego

1. Agregar a `GameType` en reducer
2. Crear estado inicial en `createInitialState()`
3. Definir acciones en `GameAction`
4. Crear handler functions
5. Agregar cases al switch
6. Integrar en `useGameEngine.ts`
7. Crear componente de animación

**Skill detallada:** Lee `.agent/skills/cryptoduels-games/SKILL.md`

## Modificar Reducer

1. Agregar tipo a `GameAction` union
2. Crear handler function pura
3. Agregar case al switch

**Skill detallada:** Lee `.agent/skills/cryptoduels-reducer/SKILL.md`

## Patrones Anti-Cheat

- **Server-side validation** (futuro)
- **Timestamps con performance.now()** (no manipulable)
- **Estado inmutable** (no hay shortcuts)
- **Validaciones en reducer** (rechaza estados inválidos)

## Testing

Los reducers son funciones puras = fáciles de testear:

```typescript
describe('gameReducer', () => {
    it('transitions correctly', () => {
        const state = createInitialState('memory');
        const result = gameReducer(state, { type: 'CARD_CLICK', index: 0 });
        expect(result.flippedIndices).toContain(0);
    });
});
```

## Auto-invoke Skills

| Cuando trabajes con... | Skill |
|------------------------|-------|
| Cualquier lógica de juego | `cryptoduels-games` |
| gameReducer.ts | `cryptoduels-reducer` |
| Testing juegos | `webapp-testing` |
