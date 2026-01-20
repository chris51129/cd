# Sistema de Agentes y Skills - Guía Completa

> Documentación permanente del sistema de AGENTS.md y Skills implementado en CryptoDuels.
> Última actualización: Enero 2026 (Post-instalación Antigravity Kit + UI UX Pro Max)

---

## Tabla de Contenidos

1. [Filosofía y Conceptos](#1-filosofía-y-conceptos)
2. [Arquitectura Actual](#2-arquitectura-actual)
3. [Skills Disponibles](#3-skills-disponibles)
4. [Workflows Disponibles](#4-workflows-disponibles)
5. [Procedimientos Comunes](#5-procedimientos-comunes)
6. [Extensión a Web3](#6-extensión-a-web3)
7. [Troubleshooting](#7-troubleshooting)

---

## 1. Filosofía y Conceptos

### ¿Qué es AGENTS.md?

`AGENTS.md` es un archivo Markdown para que **agentes de IA** entiendan el contexto de un proyecto. Es el equivalente a `README.md`, pero optimizado para LLMs.

| Aspecto | README.md | AGENTS.md |
|---------|-----------|-----------|
| Audiencia | Humanos | Agentes de IA |
| Contenido | Quick start | Arquitectura, patrones |
| Tamaño | Libre | 250-500 líneas máx |

### Principio Fundamental

> **Cuanto más contexto tiene un agente, más puede "alucinar".**

Solución:
1. **AGENTS.md jerárquicos**: Root → Sub-módulos
2. **Skills**: Conocimiento específico cargado bajo demanda

### Auto-Invocación de Skills

Los agentes NO invocan skills automáticamente. Solución: **tablas explícitas** de auto-invoke en cada AGENTS.md.

---

## 2. Arquitectura Actual

### Estructura de Archivos

```
cryptoduels/
├── AGENTS.md                              # ROOT (navegación + auto-invoke)
├── src/
│   ├── AGENTS.md                          # Convenciones desarrollo
│   ├── components/AGENTS.md               # Design System
│   └── games/AGENTS.md                    # Arquitectura Shell/Reducer
├── .agent/
│   ├── agents/                            # 16 agentes especialistas
│   ├── skills/                            # 54 skills
│   ├── workflows/                         # 17 workflows
│   ├── rules/                             # GEMINI.md config
│   └── ARCHITECTURE.md                    # Documentación del kit
├── .shared/
│   └── ui-ux-pro-max/                     # Design System Generator
└── docs/
    └── AGENTS_AND_SKILLS_GUIDE.md         # Este archivo
```

### Flujo de Contexto

```
Usuario → Agente lee AGENTS.md (root)
              ↓
        Si módulo específico → Lee sub-AGENTS.md
              ↓
        Si matchea trigger → Lee skill correspondiente
              ↓
        Ejecuta con contexto completo
```

---

## 3. Skills Disponibles (54 total)

### Skills Específicas de CryptoDuels

| Skill | Propósito | Scope |
|-------|-----------|-------|
| `cryptoduels-games` | Crear/modificar juegos | root |
| `cryptoduels-ui` | Componentes UI, Design System | components |
| `cryptoduels-reducer` | gameReducer patterns | games |

### Skills Web3/Blockchain

| Skill | Propósito |
|-------|-----------|
| `smart-contract-generator` | Templates Solidity |
| `solidity-security` | Seguridad contratos |
| `web3-testing` | Tests blockchain |
| `web3-security` | Seguridad blockchain gaming |
| `defi-protocol-templates` | Protocolos DeFi |

### Skills Frontend

| Skill | Propósito |
|-------|-----------|
| `ui-ux-pro-max` | Design System Generator v2.0 |
| `frontend-design` | Diseño interfaces |
| `react-patterns` | Patrones React |
| `react-state-management` | Estado React/Zustand |
| `tailwind-patterns` | Tailwind CSS v4 |
| `typescript-advanced-types` | Tipos avanzados TS |
| `award-winning-website` | Diseño premium |

### Skills Testing

| Skill | Propósito |
|-------|-----------|
| `webapp-testing` | Tests componentes |
| `testing-patterns` | Patrones testing |
| `javascript-testing-patterns` | Tests JS |
| `tdd-workflow` | TDD |

### Skills Arquitectura

| Skill | Propósito |
|-------|-----------|
| `architecture` | Decisiones arquitectónicas |
| `api-patterns` | Patrones API |
| `database-design` | Diseño BD |
| `clean-code` | Código limpio |
| `app-builder` | Full-stack apps |

### Skills Utilidades

| Skill | Propósito |
|-------|-----------|
| `skill-creator` | Crear nuevas skills |
| `systematic-debugging` | Debugging 4-fases |
| `creating-financial-models` | Modelos financieros |
| `game-development` | Game dev general |

---

## 4. Workflows Disponibles (17 total)

### Workflows del Proyecto (Español)

| Comando | Propósito |
|---------|-----------|
| `/calidad-global` | Estándares de calidad |
| `/desarrollo-web3` | Estándar Solidity/EVM |
| `/seguridad` | Seguridad Web3 |
| `/seguridad-general-ts-html` | Seguridad frontend |
| `/optimizacion` | Optimización |
| `/patrones-de-diseno` | Patrones de diseño |

### Workflows del Kit (Inglés)

| Comando | Propósito |
|---------|-----------|
| `/brainstorm` | Brainstorming estructurado |
| `/create` | Crear aplicación nueva |
| `/debug` | Debugging sistemático |
| `/deploy` | Despliegue producción |
| `/enhance` | Mejorar features |
| `/orchestrate` | Coordinar agentes |
| `/plan` | Plan de proyecto |
| `/preview` | Servidor desarrollo |
| `/status` | Estado del proyecto |
| `/test` | Tests |
| `/ui-ux-pro-max` | Diseño UI/UX con Design System Generator |

---

## 5. Procedimientos Comunes

### 5.1 Crear Nueva Skill

```bash
# 1. Crear directorio y archivo
mkdir .agent/skills/mi-skill
# 2. Crear SKILL.md con frontmatter
```

```markdown
---
name: mi-skill
description: Descripción + Trigger: palabras clave
---

# Mi Skill

## Cuándo Usar
## Instrucciones
## Ejemplos
```

```bash
# 3. Agregar a tabla auto-invoke en AGENTS.md correspondiente
```

### 5.2 Agregar Nuevo Juego

1. Leer skill `cryptoduels-games`
2. Modificar `gameReducer.ts` con skill `cryptoduels-reducer`
3. Crear animación con skill `cryptoduels-ui`
4. Actualizar `src/games/AGENTS.md`

---

## 6. Extensión a Web3

### Estructura Propuesta

```
contracts/
└── AGENTS.md           # Contexto contratos
src/web3/
└── AGENTS.md           # Integración frontend-blockchain
.agent/skills/
├── cryptoduels-contracts/   # Patrones contratos CD
└── cryptoduels-web3/        # Integración ethers.js
```

### Skills a Crear

- `cryptoduels-contracts`: Apuestas, escrow, anti-cheat on-chain
- `cryptoduels-web3`: Conexión wallet, hooks Web3

---

## 7. Troubleshooting

### El agente no usa la skill correcta

1. Verificar tabla auto-invoke
2. Mejorar `description` con más triggers
3. Ser explícito: "Usa la skill X"

### Skill muy larga

- Máximo 500 líneas
- Dividir en múltiples skills

---

## Historial de Cambios

| Fecha | Cambio |
|-------|--------|
| 2026-01-17 | Creación inicial del sistema |
| 2026-01-20 | Instalación Antigravity Kit + UI UX Pro Max |
| 2026-01-20 | Integración skills del backup (14 únicas) |
| 2026-01-20 | 54 skills, 17 workflows, 16 agentes |

---

> **Nota**: Este documento debe actualizarse cuando se modifique el sistema de agentes/skills.
