# CryptoDuels Frontend 🎮

Arena de apuestas P2P descentralizada construida en Polygon con React.

## Stack Tecnológico

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| React | 18.2 | UI Framework |
| Vite | 7.3 | Build Tool |
| Framer Motion | 10.16 | Animaciones |
| React Router | 7.10 | Navegación |
| Jest | 30.2 | Testing |
| wagmi/viem | 2.x | Web3 Integration |

## Inicio Rápido

```bash
# Instalar dependencias
npm install

# Desarrollo
npm run dev

# Tests
npm test

# Build producción
npm run build
```

## Arquitectura

```
src/
├── components/          # Componentes React
│   ├── game/           # Arena, Tiers, Animaciones
│   ├── home/           # Hero, Cards, Features
│   ├── layout/         # Navbar, Footer
│   └── ui/             # ErrorBoundary, Icons, Loaders
│
├── constants/          # Configuración centralizada
│   ├── config.js       # Magic numbers
│   ├── tiers.js        # Niveles de apuesta
│   └── games.js        # Tipos de juego
│
├── hooks/              # Custom hooks
├── utils/              # Helpers (security, fairness)
├── context/            # React Context (Safety, Sound)
├── styles/             # CSS modular
│   ├── base/           # Reset, variables
│   ├── layout/         # Navbar, footer
│   ├── components/     # Buttons, cards
│   └── pages/          # Home, game
│
└── pages/              # Rutas principales
```

## Diseño

Sistema de diseño "Dark Tech Elegance":
- Background: `#020408`
- Accent Blue: `#2E5CFF`
- Accent Gold: `#D4AF37`
- Font: Inter, Manrope

## Juegos Disponibles

| Juego | Tipo | Categoría | Estado |
|-------|------|-----------|--------|
| 🪙 Cara o Cruz | Instantáneo | Suerte | ✅ MVP |
| 🎲 Duelo de Dados | Suerte | Suerte | ✅ MVP |
| ✂️ Piedra/Papel/Tijera | Commit-Reveal | Suerte | ✅ MVP |
| 🧠 Memoria Cripto | Time Challenge | Habilidad | ✅ MVP |
| ⚡ Duelo de Reflejos | Reacción | Habilidad | ✅ MVP |
| 🔢 Validación de Bloques | Velocidad Mental | Habilidad | ✅ MVP |

## Seguridad

Este proyecto implementa OWASP Top 10:2021:
- ✅ CSPRNG para lógica de juego (`crypto.getRandomValues()`)
- ✅ Validación y sanitización de inputs
- ✅ CSP Headers configurados
- ✅ Logging seguro (suprime datos en producción)
- ✅ Rate limiting client-side

## Tiers de Apuesta

```
$1 → $5 → $10 → $50 → $100 → $1000 → $2500 → $5000 → $10000
```

## Testing

```bash
npm test              # Ejecutar tests
npm run test:watch    # Modo desarrollo
npm run test:coverage # Con cobertura
```

**Cobertura objetivo**: 80%+

## Scripts

| Script | Descripción |
|--------|-------------|
| `dev` | Servidor desarrollo |
| `build` | Build producción |
| `test` | Ejecutar tests |
| `preview` | Preview build |

## Documentación

- [Arquitectura Técnica](docs/02_ARQUITECTURA_TECNICA.md)
- [Decisiones de Diseño](docs/ADR.md)
- [Sistema de Diseño](docs/DESIGN_SYSTEM.md)

## Licencia

Privado © 2025 CryptoDuels
