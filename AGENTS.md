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
├── games/          # Lógica de juegos (ver src/games/AGENTS.md)
├── hooks/          # Custom hooks (useGameEngine, useGameLoop)
├── pages/          # Páginas de la app
├── styles/         # CSS Variables, base styles
├── store/          # Zustand stores
└── utils/          # Utilidades
```

## Navegación a Sub-Contextos

| Módulo | AGENTS.md | Descripción |
|--------|-----------|-------------|
| Source | [src/AGENTS.md](src/AGENTS.md) | Convenciones generales |
| Components | [src/components/AGENTS.md](src/components/AGENTS.md) | UI y Design System |
| Games | [src/games/AGENTS.md](src/games/AGENTS.md) | Arquitectura Shell/Reducer |

---

## Auto-invoke Skills

> **IMPORTANTE:** Cuando trabajes en las siguientes áreas, DEBES leer la skill correspondiente ANTES de implementar.

### Skills Específicas de CryptoDuels (Scope: root)

| Cuando trabajes con... | Skill | Path |
|------------------------|-------|------|
| Crear/modificar juegos de habilidad | `cryptoduels-games` | `.agent/skills/cryptoduels-games/SKILL.md` |
| Componentes UI, animaciones, estilos | `cryptoduels-ui` | `.agent/skills/cryptoduels-ui/SKILL.md` |
| gameReducer.ts, acciones, handlers | `cryptoduels-reducer` | `.agent/skills/cryptoduels-reducer/SKILL.md` |

### Skills Web3/Blockchain (Scope: root)

| Cuando trabajes con... | Skill | Path |
|------------------------|-------|------|
| Smart contracts Solidity | `smart-contract-generator` | `.agent/skills/smart-contract-generator/` |
| Seguridad de contratos | `solidity-security` | `.agent/skills/solidity-security/` |
| Tests de contratos | `web3-testing` | `.agent/skills/web3-testing/` |
| Seguridad blockchain | `web3-security` | `.agent/skills/web3-security/` |
| Protocolos DeFi | `defi-protocol-templates` | `.agent/skills/defi-protocol-templates/` |

### Skills de Desarrollo Frontend (Scope: UI/components)

| Cuando trabajes con... | Skill | Path |
|------------------------|-------|------|
| Diseño UI/UX profesional | `ui-ux-pro-max` | `.agent/skills/ui-ux-pro-max/` |
| Diseño frontend general | `frontend-design` | `.agent/skills/frontend-design/` |
| Patrones React | `react-patterns` | `.agent/skills/react-patterns/` |
| Estado React/Zustand | `react-state-management` | `.agent/skills/react-state-management/` |
| Tailwind CSS v4 | `tailwind-patterns` | `.agent/skills/tailwind-patterns/` |
| Tipos avanzados TS | `typescript-advanced-types` | `.agent/skills/typescript-advanced-types/` |

### Skills de Testing (Scope: tests)

| Cuando trabajes con... | Skill | Path |
|------------------------|-------|------|
| Tests de componentes/hooks | `webapp-testing` | `.agent/skills/webapp-testing/` |
| Patrones de testing | `testing-patterns` | `.agent/skills/testing-patterns/` |
| Tests JavaScript | `javascript-testing-patterns` | `.agent/skills/javascript-testing-patterns/` |
| TDD workflow | `tdd-workflow` | `.agent/skills/tdd-workflow/` |

### Skills de Arquitectura (Scope: root)

| Cuando trabajes con... | Skill | Path |
|------------------------|-------|------|
| Decisiones arquitectónicas | `architecture` | `.agent/skills/architecture/` |
| Patrones de API | `api-patterns` | `.agent/skills/api-patterns/` |
| Diseño de base de datos | `database-design` | `.agent/skills/database-design/` |
| Código limpio | `clean-code` | `.agent/skills/clean-code/` |

---

## Workflows Disponibles

Usa `/nombre-workflow` para ejecutar:

### Del Proyecto (Español)
- `/calidad-global` - Estándares de calidad
- `/desarrollo-web3` - Estándar Solidity/EVM
- `/seguridad` - Seguridad Web3
- `/seguridad-general-ts-html` - Seguridad frontend
- `/optimizacion` - Optimización del proyecto
- `/patrones-de-diseno` - Patrones de diseño

### Del Kit (Inglés)
- `/brainstorm` - Brainstorming estructurado
- `/create` - Crear aplicación nueva
- `/debug` - Debugging sistemático
- `/deploy` - Despliegue producción
- `/enhance` - Mejorar features
- `/orchestrate` - Coordinar agentes
- `/plan` - Plan de proyecto
- `/preview` - Servidor desarrollo
- `/status` - Estado del proyecto
- `/test` - Tests
- `/ui-ux-pro-max` - Diseño UI/UX con Design System Generator

---

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

---

## Documentación del Sistema

📖 **[docs/AGENTS_AND_SKILLS_GUIDE.md](docs/AGENTS_AND_SKILLS_GUIDE.md)** - Guía completa del sistema de AGENTS.md y Skills.

## Comandos Esenciales

```bash
npm run dev        # Servidor desarrollo (localhost:5173)
npm run build      # Build producción
npm test           # Ejecutar tests
npm run lint       # Linting
```
