# Sistema de Agentes y Skills - Guía Completa

> Documentación permanente del sistema de AGENTS.md y Skills implementado en CryptoDuels.
> Esta guía permite mantener, modificar y extender el sistema sin necesidad de re-aprender los conceptos.

---

## Tabla de Contenidos

1. [Filosofía y Conceptos](#1-filosofía-y-conceptos)
2. [Arquitectura Actual](#2-arquitectura-actual)
3. [Procedimientos Comunes](#3-procedimientos-comunes)
4. [Referencia Rápida](#4-referencia-rápida)
5. [Extensión a Web3](#5-extensión-a-web3)
6. [Troubleshooting](#6-troubleshooting)

---

## 1. Filosofía y Conceptos

### ¿Qué es AGENTS.md?

`AGENTS.md` es un archivo Markdown diseñado para que los **agentes de IA** (no humanos) entiendan el contexto de un proyecto. Es el equivalente a `README.md`, pero optimizado para LLMs.

**Diferencias clave:**

| Aspecto | README.md | AGENTS.md |
|---------|-----------|-----------|
| Audiencia | Desarrolladores humanos | Agentes de IA |
| Contenido | Quick start, descripción | Arquitectura, patrones, convenciones |
| Tamaño | Libre | 250-500 líneas máximo |
| Objetivo | Onboarding humano | Contexto mínimo para IA |

### ¿Por qué limitar el tamaño?

> **Principio fundamental**: Cuanto más contexto tiene un agente, más puede "alucinar".

Un AGENTS.md de 2000 líneas satura el contexto del LLM. La solución:
1. **AGENTS.md jerárquicos**: Un root que apunta a sub-AGENTS.md por módulo
2. **Skills**: Conocimiento específico cargado solo cuando se necesita

### ¿Qué son las Skills?

Las Skills son "habilidades" modulares que el agente invoca según la tarea:

```
Usuario: "Crea un nuevo juego de habilidad"
         ↓
Agente consulta AGENTS.md
         ↓
Tabla dice: "Para juegos → usar skill cryptoduels-games"
         ↓
Agente lee .agent/skills/cryptoduels-games/SKILL.md
         ↓
Ahora tiene el contexto específico para crear juegos
```

### El Problema de la Auto-Invocación

Los agentes de IA **no invocan skills automáticamente** aunque la documentación diga que sí. Lo tratan como "sugerencia".

**Solución implementada**: Tablas explícitas de "Auto-invoke Skills" en cada AGENTS.md que **obligan** al agente a leer la skill correspondiente.

---

## 2. Arquitectura Actual

### Estructura de Archivos

```
cryptoduels/
├── AGENTS.md                              # ROOT: Overview + navegación
├── src/
│   ├── AGENTS.md                          # Convenciones de desarrollo
│   ├── components/
│   │   └── AGENTS.md                      # Design System
│   └── games/
│       └── AGENTS.md                      # Arquitectura Shell/Reducer
└── .agent/
    ├── skills/
    │   ├── cryptoduels-games/             # Crear/modificar juegos
    │   │   └── SKILL.md
    │   ├── cryptoduels-ui/                # Componentes UI
    │   │   └── SKILL.md
    │   ├── cryptoduels-reducer/           # gameReducer patterns
    │   │   └── SKILL.md
    │   ├── smart-contract-generator/      # Contratos Solidity
    │   ├── web3-testing/                  # Tests blockchain
    │   ├── solidity-security/             # Seguridad contratos
    │   └── ... (otras skills genéricas)
    └── workflows/
        ├── calidad-global.md
        ├── desarrollo-web3.md
        ├── seguridad.md
        └── ...
```

### Flujo de Contexto

```
┌─────────────────────────────────────────────────────────────┐
│                    Usuario hace petición                    │
└─────────────────────────┬───────────────────────────────────┘
                          ▼
┌─────────────────────────────────────────────────────────────┐
│              Agente lee AGENTS.md (root)                    │
│   - Overview del proyecto                                   │
│   - Tech stack                                              │
│   - Tabla de navegación a sub-módulos                       │
│   - Tabla de auto-invoke skills                             │
└─────────────────────────┬───────────────────────────────────┘
                          ▼
┌─────────────────────────────────────────────────────────────┐
│         Si necesita módulo específico (ej: games)           │
│              Lee src/games/AGENTS.md                        │
└─────────────────────────┬───────────────────────────────────┘
                          ▼
┌─────────────────────────────────────────────────────────────┐
│    Si la tarea matchea un trigger de skill                  │
│         Lee .agent/skills/X/SKILL.md                        │
└─────────────────────────┬───────────────────────────────────┘
                          ▼
┌─────────────────────────────────────────────────────────────┐
│              Ejecuta la tarea con contexto completo         │
└─────────────────────────────────────────────────────────────┘
```

### Formato de una Skill (Antigravity)

```markdown
---
name: nombre-de-la-skill
description: Descripción + Trigger. Cuándo debe usarse esta skill.
---

# Título de la Skill

Contenido en Markdown con:
- Instrucciones
- Patrones
- Ejemplos de código
- Referencias a archivos del proyecto
```

**Nota para Antigravity**: Solo se necesitan `name` y `description` en el frontmatter YAML. Otros campos como `metadata.scope`, `allowed-tools`, etc. son para otros agentes (Claude, Codex).

---

## 3. Procedimientos Comunes

### 3.1 Crear una Nueva Skill

**Paso 1**: Crear el directorio y archivo
```
.agent/skills/mi-nueva-skill/SKILL.md
```

**Paso 2**: Escribir el contenido
```markdown
---
name: mi-nueva-skill
description: Descripción de qué hace y cuándo usarla. Trigger: palabras clave que activan esta skill.
---

# Mi Nueva Skill

## Cuándo Usar
[Explicar casos de uso]

## Instrucciones
[Paso a paso o patrones]

## Ejemplos
[Código de ejemplo]

## Archivos Relacionados
[Links a archivos del proyecto]
```

**Paso 3**: Agregar a la tabla de auto-invoke en AGENTS.md correspondiente
```markdown
## Auto-invoke Skills

| Cuando trabajes con... | Skill a invocar |
|------------------------|-----------------|
| [nueva tarea]          | `mi-nueva-skill` |
```

**Paso 4**: Si la skill aplica a un módulo específico, agregar también en el sub-AGENTS.md de ese módulo.

### 3.2 Modificar una Skill Existente

1. Abrir `.agent/skills/nombre-skill/SKILL.md`
2. Modificar contenido manteniendo la estructura
3. Actualizar `description` si cambian los triggers

### 3.3 Agregar un Nuevo Sub-AGENTS.md

**Cuándo hacerlo**: Cuando un módulo/carpeta crece lo suficiente para necesitar su propio contexto.

**Paso 1**: Crear el archivo
```
src/nueva-carpeta/AGENTS.md
```

**Paso 2**: Escribir contenido siguiendo el patrón:
```markdown
# AGENTS.md - src/nueva-carpeta/

> Descripción breve del módulo.

## Estructura
[Contenido de la carpeta]

## Patrones
[Patrones específicos del módulo]

## Auto-invoke Skills
| Cuando trabajes con... | Skill |
|------------------------|-------|
| [tarea] | `skill-name` |
```

**Paso 3**: Agregar link en AGENTS.md root
```markdown
| Nueva Carpeta | [src/nueva-carpeta/AGENTS.md](src/nueva-carpeta/AGENTS.md) | Descripción |
```

### 3.4 Actualizar el Design System

Si cambia el diseño (colores, tipografía, patrones):

1. Actualizar `src/styles/base/variables.css`
2. Actualizar `.agent/skills/cryptoduels-ui/SKILL.md`
3. Actualizar `src/components/AGENTS.md`

### 3.5 Agregar Nuevo Tipo de Juego

1. Leer skill `cryptoduels-games` (contiene el procedimiento)
2. Modificar `gameReducer.ts` siguiendo skill `cryptoduels-reducer`
3. Crear componente de animación siguiendo skill `cryptoduels-ui`
4. Actualizar `src/games/AGENTS.md` con el nuevo juego

---

## 4. Referencia Rápida

### Skills Actuales de CryptoDuels

| Skill | Propósito | Path |
|-------|-----------|------|
| `cryptoduels-games` | Crear/modificar juegos | `.agent/skills/cryptoduels-games/SKILL.md` |
| `cryptoduels-ui` | Componentes UI | `.agent/skills/cryptoduels-ui/SKILL.md` |
| `cryptoduels-reducer` | gameReducer patterns | `.agent/skills/cryptoduels-reducer/SKILL.md` |

### Skills Genéricas Disponibles

| Skill | Propósito |
|-------|-----------|
| `smart-contract-generator` | Crear contratos Solidity |
| `web3-testing` | Tests de contratos |
| `solidity-security` | Seguridad blockchain |
| `react-state-management` | Estado React/Zustand |
| `webapp-testing` | Tests de frontend |
| `frontend-design` | Diseño de interfaces |

### Workflows Disponibles

Usar con `/nombre-workflow`:
- `/calidad-global` - Estándares de calidad
- `/desarrollo-web3` - Estándar Solidity/EVM
- `/seguridad` - Seguridad Web3
- `/optimizacion` - Optimización del proyecto

---

## 5. Extensión a Web3

Cuando CryptoDuels integre Web3, seguir este plan:

### 5.1 Nueva Estructura Propuesta

```
cryptoduels/
├── contracts/                    # Smart contracts Solidity
│   └── AGENTS.md                 # Contexto para contratos
├── src/
│   └── web3/                     # Integración frontend-blockchain
│       └── AGENTS.md             # Contexto para web3 frontend
└── .agent/skills/
    ├── cryptoduels-contracts/    # [CREAR] Patrones de contratos CD
    └── cryptoduels-web3/         # [CREAR] Integración ethers.js
```

### 5.2 Skills a Crear

**cryptoduels-contracts**
```yaml
---
name: cryptoduels-contracts
description: Smart contracts para CryptoDuels. Trigger: contrato, Solidity, apuestas, escrow, pagos.
---
```
Contenido: Patrones de apuestas, escrow, anti-cheat on-chain, etc.

**cryptoduels-web3**
```yaml
---
name: cryptoduels-web3
description: Integración Web3 en frontend. Trigger: conectar wallet, ethers.js, transacciones, firmas.
---
```
Contenido: Patrones de conexión, hooks de Web3, etc.

### 5.3 Actualizar AGENTS.md Root

Agregar en la tabla de navegación:
```markdown
| Contracts | [contracts/AGENTS.md](contracts/AGENTS.md) | Smart contracts |
| Web3 | [src/web3/AGENTS.md](src/web3/AGENTS.md) | Integración blockchain |
```

Agregar en auto-invoke:
```markdown
| Smart contracts | `cryptoduels-contracts` |
| Conectar wallet, transacciones | `cryptoduels-web3` |
```

---

## 6. Troubleshooting

### El agente no usa la skill correcta

**Causa**: La tabla de auto-invoke no está siendo leída o el trigger no matchea.

**Solución**:
1. Verificar que la skill está en la tabla de auto-invoke del AGENTS.md correcto
2. Mejorar la `description` de la skill con más triggers/keywords
3. Ser más explícito en el prompt: "Usa la skill X para hacer Y"

### El agente ignora el AGENTS.md

**Causa**: Algunos agentes no leen AGENTS.md automáticamente.

**Solución**:
1. Mencionarlo explícitamente: "Lee AGENTS.md primero"
2. Para Antigravity, el sistema debería leerlo automáticamente

### La skill es muy larga

**Causa**: Demasiado contenido en SKILL.md satura el contexto.

**Solución**:
1. Máximo 500 líneas por SKILL.md
2. Mover contenido detallado a `references/` dentro de la skill
3. Dividir en múltiples skills más específicas

### Necesito actualizar múltiples lugares

**Patrón de actualización**:
1. Cambio en código → Actualizar skill correspondiente
2. Cambio en arquitectura → Actualizar AGENTS.md del módulo
3. Nuevo módulo → Crear sub-AGENTS.md + agregar al root
4. Nueva capacidad → Crear skill + agregar a tablas

---

## Recursos Externos

- [AGENTS.md Standard](https://agents.md/) - Especificación del formato
- [Prowler Skills Example](https://github.com/prowler-cloud/prowler) - Implementación de referencia
- [Agent Skills IO](https://agentskills.io) - Estándar de skills

---

## Historial de Cambios

| Fecha | Cambio |
|-------|--------|
| 2026-01-17 | Creación inicial del sistema |
| - | - |

---

> **Nota**: Este documento debe mantenerse actualizado cuando se modifique el sistema de agentes/skills.
