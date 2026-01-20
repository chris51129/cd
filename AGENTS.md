# AGENTS.md - CryptoDuels

> Contexto para agentes de IA. Para humanos, ver [README.md](README.md).

## Project Overview

**CryptoDuels** es una plataforma de duelos P2P basada en juegos de habilidad. Los jugadores compiten en minijuegos determinísticos donde la habilidad determina el resultado.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18, TypeScript, Vite |
| State | Zustand, useReducer |
| Animations | Framer Motion, CSS Variables |
| Styling | CSS Modules, Minimalismo Escandinavo |
| Testing | Jest, React Testing Library |
| Web3 | Ethers.js (futuro) |

## Arquitectura de Carpetas

```
src/
├── components/     # UI Components (ver src/components/AGENTS.md)
│   ├── game/       # Componentes de juego (animaciones, overlays)
│   ├── ui/         # Componentes base (Button, Card, Modal)
│   └── layout/     # Layout components
├── games/          # Lógica de juegos (ver src/games/AGENTS.md)
│   └── core/       # gameReducer.ts, estrategias
├── hooks/          # Custom hooks (useGameEngine, useGameLoop)
├── pages/          # Páginas de la app
├── styles/         # CSS Variables, base styles
├── store/          # Zustand stores
└── utils/          # Utilidades
```

## Comandos Esenciales

```bash
npm run dev        # Servidor desarrollo (localhost:5173)
npm run build      # Build producción
npm test           # Ejecutar tests
npm run lint       # Linting
```

## Navegación a Sub-Contextos

| Módulo | AGENTS.md | Descripción |
|--------|-----------|-------------|
| Source | [src/AGENTS.md](src/AGENTS.md) | Convenciones generales |
| Components | [src/components/AGENTS.md](src/components/AGENTS.md) | UI y Design System |
| Games | [src/games/AGENTS.md](src/games/AGENTS.md) | Lógica de juegos |

## Auto-invoke Skills

> **IMPORTANTE:** Cuando trabajes en las siguientes áreas, DEBES leer la skill correspondiente ANTES de implementar.

| Cuando trabajes con... | Skill a invocar | Path |
|------------------------|-----------------|------|
| Crear/modificar juegos de habilidad | `cryptoduels-games` | `.agent/skills/cryptoduels-games/SKILL.md` |
| Componentes UI, animaciones, estilos | `cryptoduels-ui` | `.agent/skills/cryptoduels-ui/SKILL.md` |
| gameReducer.ts, acciones, handlers | `cryptoduels-reducer` | `.agent/skills/cryptoduels-reducer/SKILL.md` |
| Smart contracts Solidity | `smart-contract-generator` | `.agent/skills/smart-contract-generator/SKILL.md` |
| Tests de componentes/hooks | `webapp-testing` | `.agent/skills/webapp-testing/SKILL.md` |
| Tests de contratos | `web3-testing` | `.agent/skills/web3-testing/SKILL.md` |
| Seguridad Web3 | `solidity-security` | `.agent/skills/solidity-security/SKILL.md` |
| Estado React/Zustand | `react-state-management` | `.agent/skills/react-state-management/SKILL.md` |

## Código de Estilo

- **TypeScript strict mode** habilitado
- Imports organizados: React → libs → components → utils → types
- Componentes funcionales con `React.FC<Props>`
- Hooks personalizados prefijo `use`
- CSS Variables para theming (ver `src/styles/base/variables.css`)

## Juegos Disponibles

| Juego | Tipo | Descripción |
|-------|------|-------------|
| Memory | Habilidad | Encuentra 8 pares de cartas |
| QuickDraw | Habilidad | Reacción rápida al círculo verde |
| BlockValidation | Habilidad | Clicks secuenciales 1-25 |
| RPS | Probabilidad | Piedra, Papel, Tijeras |
| Coinflip | Probabilidad | Cara o Cruz |
| Dice | Probabilidad | Dado más alto gana |
| Higher/Lower | Probabilidad | Predice si la carta es mayor o menor |

## Workflows Disponibles

Usa `/nombre-workflow` para ejecutar:
- `/calidad-global` - Estándares de calidad
- `/desarrollo-web3` - Estándar Solidity/EVM
- `/seguridad` - Seguridad Web3
- `/optimizacion` - Optimización del proyecto

## Documentación del Sistema

> Para entender, mantener o extender este sistema de AGENTS.md y Skills, consultar:

📖 **[docs/AGENTS_AND_SKILLS_GUIDE.md](docs/AGENTS_AND_SKILLS_GUIDE.md)** - Guía completa con:
- Filosofía y conceptos
- Procedimientos paso a paso
- Plan de extensión a Web3 (ejemplo concreto del proyecto)
- Troubleshooting
