# AGENTS.md - src/components/

> Design System "Minimalismo Escandinavo con toques Dark Elegance Tech" y patrones de componentes UI.

## Design System

CryptoDuels usa **Minimalismo Escandinavo con toques Dark Elegance Tech**: estética limpia, funcional, con fondos oscuros, acentos vibrantes y animaciones sutiles.

## Estructura

| Carpeta | Contenido |
|---------|-----------|
| `ui/` | Componentes base (Button, Card, Modal, AnimatedIcons) |
| `game/` | Componentes de juego (GameArena, CountdownOverlay, MemoryCard) |
| `game/animations/` | Animaciones específicas por juego |
| `layout/` | Layout components (Header, Footer, Container) |

## CSS Variables

**SIEMPRE** usar variables CSS, **NUNCA** hardcodear colores:

```css
/* Usar esto */
color: var(--text-primary);
background: var(--bg-surface);

/* NUNCA esto */
color: #ffffff;
background: #0A0D12;
```

Variables clave:
- `--bg-surface`, `--bg-deep`, `--bg-surface-hover`
- `--text-primary`, `--text-secondary`, `--text-muted`
- `--accent-blue`, `--accent-green`, `--accent-red`
- `--radius-sm`, `--radius-md`, `--radius-lg`
- `--font-heading`, `--font-sans`

## Patrones de Animación

### Framer Motion
```tsx
import { motion, AnimatePresence } from 'framer-motion';

<motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0 }}
    transition={{ type: 'spring', damping: 20 }}
>
```

### AnimatePresence para Exits
```tsx
<AnimatePresence mode="wait">
    {isVisible && (
        <motion.div key="unique" exit={{ opacity: 0 }}>
            {content}
        </motion.div>
    )}
</AnimatePresence>
```

## Componentes de Juego

### GameArena
Contenedor principal. Props: `gameType`, `status`, `result`

### CountdownOverlay
Overlay de cuenta regresiva. Variants: `default`, `memorize`, `danger`

### Patrón de Animaciones
```tsx
interface Props {
    readonly status: string;
    readonly result?: GameResult | null;
    readonly gameState?: GameState | null;
    readonly onAction?: (payload: unknown) => void;
}

const TuJuegoAnimation: React.FC<Props> = ({ status, result, gameState, onAction }) => {
    if (status === 'result' && result) {
        return <ResultPanel result={result} />;
    }
    return <GameplayUI gameState={gameState} onAction={onAction} />;
};
```

## Light/Dark Mode

Los componentes deben funcionar en ambos modos con CSS Variables.
Ver `src/styles/base/light-mode-overrides.css` para overrides.

---

## Auto-invoke Skills

| Cuando trabajes con... | Skill |
|------------------------|-------|
| Cualquier componente UI | `cryptoduels-ui` |
| Animaciones de juego | `cryptoduels-games` |
| Diseño UI/UX profesional | `ui-ux-pro-max` |
| Diseño frontend general | `frontend-design` |
| React patterns | `react-patterns` |
| Estado React/Zustand | `react-state-management` |
| Testing componentes | `webapp-testing` |
| Tailwind CSS | `tailwind-patterns` |
