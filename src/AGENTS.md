# AGENTS.md - src/

> Convenciones de desarrollo para el código fuente de CryptoDuels.

## Estructura de Carpetas

| Carpeta | Propósito |
|---------|-----------|
| `components/` | UI Components ([ver AGENTS.md](components/AGENTS.md)) |
| `games/` | Lógica de juegos ([ver AGENTS.md](games/AGENTS.md)) |
| `hooks/` | Custom React hooks |
| `pages/` | Páginas/rutas de la app |
| `styles/` | CSS base y variables |
| `store/` | Zustand stores |
| `utils/` | Funciones utilitarias |
| `types/` | TypeScript types/interfaces |

## Convenciones de Código

### Imports
```typescript
// 1. React
import React, { useState, useCallback } from 'react';

// 2. Librerías externas
import { motion } from 'framer-motion';

// 3. Componentes internos
import Button from '@/components/ui/Button';

// 4. Hooks
import { useGameEngine } from '@/hooks/useGameEngine';

// 5. Utils/Types
import { formatTime } from '@/utils/format';
import type { GameState } from '@/types/game';
```

### Componentes
```typescript
interface Props {
    readonly title: string;
    readonly onAction?: () => void;
}

const MiComponente: React.FC<Props> = ({ title, onAction }) => {
    return <div>{title}</div>;
};

export default MiComponente;
```

### Hooks Personalizados
```typescript
// Prefijo "use" obligatorio
export const useMyHook = (initialValue: number) => {
    const [value, setValue] = useState(initialValue);
    
    const increment = useCallback(() => {
        setValue(v => v + 1);
    }, []);
    
    return { value, increment };
};
```

### Refs vs State
```typescript
// useRef para valores que NO deben causar re-render
const timerRef = useRef<number>(0);
const isProcessingRef = useRef(false);

// useState para valores que SÍ deben causar re-render
const [score, setScore] = useState(0);
const [isVisible, setIsVisible] = useState(false);
```

## Patrones de Hooks Importantes

### useGameEngine
Hook principal para juegos. Orquesta:
- Estado del juego (via useReducer + gameReducer)
- Timers y loops (via useGameLoop)
- Callbacks para acciones del usuario

### useGameLoop
Loop de juego con deltaTime:
```typescript
useGameLoop((deltaTime) => {
    dispatch({ type: 'TICK', deltaTime });
}, isRunning);
```

## Testing

```typescript
// Archivo: MiComponente.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import MiComponente from './MiComponente';

describe('MiComponente', () => {
    it('renders title', () => {
        render(<MiComponente title="Test" />);
        expect(screen.getByText('Test')).toBeInTheDocument();
    });
});
```

## Auto-invoke Skills

| Cuando trabajes con... | Skill |
|------------------------|-------|
| Custom hooks de juego | `cryptoduels-games` |
| Estado React/Zustand | `react-state-management` |
| Testing | `webapp-testing` |
| TypeScript avanzado | `typescript-advanced-types` |
