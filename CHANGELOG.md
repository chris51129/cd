# Changelog

Todos los cambios notables de este proyecto serán documentados en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/),
y este proyecto adhiere a [Semantic Versioning](https://semver.org/lang/es/).

## [Unreleased]

### Añadido
- Documento de onboarding (`docs/04_ONBOARDING.md`)
- Tests para hooks de seguridad:
  - `useBehaviorAnalysis.test.js` (12 tests)
  - `useRateLimiter.test.js` (12 tests)
  - `useDeviceFingerprint.test.js` (12 tests)
- Tests para `gameFactory.js` (14 tests)
- Estilos `:focus-visible` globales para accesibilidad
- Skip-to-content link para navegación por teclado
- `aria-live` region en resultados para screen readers

### Cambiado
- `TierSelector.jsx`: Muestra comisión del 5% y premio del ganador
- `SelectionScreen.jsx`: Accesibilidad completa con keyboard navigation
- `MemoryCard.jsx`: Accesibilidad con aria-labels dinámicos
- `ArenaResults.jsx`: Añadido `role="alert"` y `aria-live="assertive"`
- `security.js`: TODOs convertidos a NOTEs con referencia a Fase 6

### Eliminado
- `useGameEngineV2.js`: Hook duplicado sin uso

### Corregido
- Tests de `Navbar.test.jsx`: Actualizados textos "Juegos" → "Módulos"
- Tests de `SelectionScreen.test.jsx`: Actualizados textos y removidos tests de timeout obsoletos

---

## [0.1.0] - 2025-12-26

### Añadido
- MVP Frontend completo con 6 juegos:
  - Coin Flip
  - Dice Duel
  - Rock-Paper-Scissors
  - Memory
  - Quick Draw
  - Block Validation
- Sistema de diseño "Dark Tech Elegance"
- Arquitectura Strategy/Factory para juegos
- 27 suites de tests con ~99.5% cobertura
- Documentación completa (13 documentos)
- Seguridad OWASP compliant:
  - CSP headers
  - Secure randomness
  - Input validation
  - Rate limiting (client-side)
  - Behavior analysis anti-bot
- Wallet-First authentication con wagmi/viem
- Animaciones con Framer Motion
- Error Boundaries para estabilidad

### Seguridad
- Implementado `secureRandomInt` con `crypto.getRandomValues`
- Añadido `secureLog` para logging seguro en producción
- Rate limiting configurable por tipo de acción
- Fingerprinting de dispositivo para detección multi-cuenta

---

## Próximas Versiones

### [0.2.0] - Fase 2: Smart Contracts (Planificado)
- Contratos Solidity para todos los juegos
- Integración con Chainlink VRF
- Deploy en Polygon Mumbai (testnet)

### [0.3.0] - Fase 3: Integración (Planificado)
- Conexión frontend-blockchain
- Transacciones reales con USDT
- Historial de partidas on-chain

### [1.0.0] - Producción (Planificado)
- Auditoría de seguridad externa
- Deploy en Polygon Mainnet
- Monitoring con Sentry/Tenderly
