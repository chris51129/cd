---
name: cryptoduels-ui
description: Crear componentes UI siguiendo Minimalismo Escandinavo con toques Dark Elegance Tech. Trigger: crear componente, diseño, animación, estilos, CSS variables, Framer Motion, tema claro/oscuro, glassmorphism.
---

# CryptoDuels UI - Skill

Guía para crear componentes UI siguiendo el design system "Minimalismo Escandinavo con toques Dark Elegance Tech".

## Design System: Minimalismo Escandinavo con toques Dark Elegance Tech

Estética premium con énfasis en:
- Fondos oscuros con profundidad
- Acentos de color vibrantes (azul, verde, rojo)
- Glassmorphism sutil
- Tipografía moderna (Manrope/Inter)
- Animaciones fluidas

## CSS Variables Principales

```css
/* Fondos */
--bg-deep: #020408;           /* Fondo más profundo */
--bg-surface: #0A0D12;        /* Superficies/cards */
--bg-surface-hover: #12161D;  /* Hover states */
--bg-overlay-dark: rgba(2, 4, 8, 0.8);

/* Texto */
--text-primary: #F5F5F7;      /* Texto principal */
--text-secondary: #A1A1A6;    /* Texto secundario */
--text-muted: #5C5C5F;        /* Texto deshabilitado */

/* Acentos */
--accent-blue: #2E5CFF;       /* Acciones primarias */
--accent-green: #22C55E;      /* Éxito/Victoria */
--accent-red: #EF4444;        /* Error/Derrota */
--accent-yellow: #FACC15;     /* Advertencia */

/* Radios */
--radius-sm: 6px;
--radius-md: 12px;
--radius-lg: 16px;

/* Fuentes */
--font-heading: 'Manrope', sans-serif;
--font-sans: 'Inter', sans-serif;
```

## Light Mode

Las variables se sobrescriben en `light-mode-overrides.css`:
```css
[data-theme="light"] {
    --bg-surface: #FFFFFF;
    --text-primary: #1A1D21;
    --text-secondary: #5C6370;
}
```

**IMPORTANTE:** Siempre usar variables CSS, NUNCA hardcodear colores.

## Patrones de Componentes

### Panel/Card Base
```tsx
<div style={{
    background: 'var(--bg-surface)',
    border: '1px solid var(--text-muted)',
    borderRadius: 'var(--radius-lg)',
    padding: '1.5rem',
    boxShadow: '0 0 20px rgba(46, 92, 255, 0.1)'
}}>
    {children}
</div>
```

### Glassmorphism
```tsx
<div style={{
    background: 'var(--bg-overlay-dark)',
    backdropFilter: 'blur(8px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: 'var(--radius-md)'
}}>
```

### Botón Primario
```tsx
<button style={{
    background: 'var(--accent-blue)',
    color: 'white',
    padding: '0.75rem 1.5rem',
    borderRadius: 'var(--radius-md)',
    border: 'none',
    fontFamily: 'var(--font-sans)',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s ease'
}}>
```

## Animaciones con Framer Motion

### Entrada con Spring
```tsx
<motion.div
    initial={{ scale: 0.9, opacity: 0, y: 20 }}
    animate={{ scale: 1, opacity: 1, y: 0 }}
    transition={{ type: 'spring', damping: 20, stiffness: 300 }}
>
```

### Pulso de Atención
```tsx
<motion.div
    animate={{ scale: [1, 1.05, 1] }}
    transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 1 }}
>
```

### Exit Animation
```tsx
<AnimatePresence>
    {isVisible && (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
        >
```

## Panel de Resultado (Patrón Estándar)

```tsx
<motion.div
    initial={{ scale: 0.9, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--text-muted)',
        borderRadius: 'var(--radius-lg)',
        padding: '2rem',
        boxShadow: isWin 
            ? '0 0 40px rgba(34, 197, 94, 0.2)' 
            : '0 0 40px rgba(239, 68, 68, 0.2)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1rem'
    }}
>
    <h2 style={{
        fontSize: 'var(--text-2xl)',
        fontWeight: 'bold',
        color: isWin ? '#22c55e' : '#ef4444',
        fontFamily: 'var(--font-heading)'
    }}>
        {isWin ? '¡VICTORIA!' : 'DERROTA'}
    </h2>
    
    {/* Score breakdown */}
    <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        padding: '1rem',
        background: 'var(--bg-surface-hover)',
        borderRadius: 'var(--radius-md)',
        width: '100%'
    }}>
        <span style={{ color: 'var(--text-secondary)' }}>Tu tiempo</span>
        <span style={{ color: 'var(--text-primary)', fontWeight: 700 }}>{time}ms</span>
    </div>
</motion.div>
```

## Iconos Animados

Usar los iconos de `src/components/ui/AnimatedLucideIcons.tsx`:

```tsx
import { AnimatedShieldCheck, AnimatedZap } from '@/components/ui/AnimatedLucideIcons';

<AnimatedShieldCheck size={48} color="var(--accent-green)" />
```

## Responsive Design

```tsx
// Mobile-first approach
style={{
    width: '100%',
    maxWidth: '400px',
    padding: 'clamp(1rem, 3vw, 2rem)'
}}
```

## Archivos de Referencia

- `src/styles/base/variables.css` - Variables CSS
- `src/styles/base/light-mode-overrides.css` - Overrides modo claro
- `src/components/ui/` - Componentes base
- `src/components/game/animations/` - Ejemplos de animaciones
