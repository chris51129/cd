# Architecture Decision Records (ADR)

Registro de decisiones arquitectónicas clave del proyecto CryptoDuels.

---

## ADR-001: Arquitectura Wallet-First

**Estado**: ✅ Aprobada  
**Fecha**: 2024-12

### Contexto
Necesitamos autenticar usuarios sin base de datos tradicional.

### Decisión
Usar la wallet de Polygon como único método de autenticación e identificación.

### Consecuencias
- ✅ No hay que gestionar passwords
- ✅ No hay que almacenar datos sensibles
- ⚠️ Usuarios deben tener wallet para jugar

---

## ADR-002: CSS Modular sin Tailwind

**Estado**: ✅ Aprobada  
**Fecha**: 2024-12

### Contexto
Necesitamos un sistema de estilos mantenible y sin dependencias externas pesadas.

### Decisión
Usar CSS puro organizado en módulos temáticos en lugar de TailwindCSS.

### Estructura
```
styles/
├── base/       # Variables, reset, typography
├── layout/     # Navbar, footer, containers
├── components/ # Buttons, cards, animations
└── pages/      # Home, game
```

### Consecuencias
- ✅ Bundle más pequeño
- ✅ Control total sobre estilos
- ⚠️ Requiere más código manual

---

## ADR-003: Constantes Centralizadas

**Estado**: ✅ Aprobada  
**Fecha**: 2024-12

### Contexto
Magic numbers dispersos por el código dificultan mantenimiento.

### Decisión
Centralizar todas las configuraciones en `constants/`:
- `config.js` - Tiempos, multiplicadores, colores
- `tiers.js` - Niveles de apuesta
- `games.js` - Configuración de juegos

### Consecuencias
- ✅ Un solo lugar para cambiar valores
- ✅ Facilita testing
- ✅ Documentación implícita

---

## ADR-004: Testing con Jest + RTL

**Estado**: ✅ Aprobada  
**Fecha**: 2024-12

### Contexto
Necesitamos tests que den confianza sin ser frágiles.

### Decisión
- Jest para unit tests
- React Testing Library para componentes
- Coverage threshold: 80%

### Convenciones
- Tests junto a los archivos: `Component.test.jsx`
- Mock dependencies externas (framer-motion)
- Testear comportamiento, no implementación

---

## ADR-005: Componentes por Dominio

**Estado**: ✅ Aprobada  
**Fecha**: 2024-12

### Contexto
Componentes dispersos dificultan navegación del código.

### Decisión
Organizar componentes en subdirectorios por dominio:
```
components/
├── game/      # Todo lo relacionado con juegos
├── home/      # Componentes de landing
├── layout/    # Navegación y footer
└── ui/        # Componentes reutilizables
```

### Consecuencias
- ✅ Fácil encontrar archivos
- ✅ Imports limpios con barrel exports
- ✅ Contexto reducido para IA

---

## ADR-006: Error Boundaries

**Estado**: ✅ Aprobada  
**Fecha**: 2024-12

### Contexto
Errores JS pueden crashear toda la aplicación.

### Decisión
Implementar ErrorBoundary en `ui/` que:
- Captura errores en child components
- Muestra fallback UI amigable
- Logea errores para debugging

### Consecuencias
- ✅ App nunca crashea completamente
- ✅ Mejor UX en errores
- ✅ Facilita debugging en desarrollo

---

## ADR-007: PropTypes en Runtime

**Estado**: ✅ Aprobada  
**Fecha**: 2024-12

### Contexto
Necesitamos validación de props sin migrar a TypeScript.

### Decisión
Usar PropTypes en componentes críticos con early returns para props inválidas.

### Componentes con PropTypes
- `GameArena`
- `WaitingRoom`
- `TierSelector`

### Consecuencias
- ✅ Errores detectados temprano
- ✅ Documentación de interfaces
- ⚠️ Solo validación en desarrollo
