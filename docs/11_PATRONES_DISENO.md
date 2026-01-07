# Guía Maestra de Patrones de Diseño - CryptoDuels (Edición Definitiva 2025/26)

Este documento es la referencia **absoluta y final** de los patrones de diseño, renderizado, rendimiento e IA necesarios para construir CryptoDuels, basada en la auditoría completa de [Patterns.dev](https://www.patterns.dev/).

---

## 1. Patrones de Diseño Clásicos (Vanilla JS)

| Patrón | Lógica y Propósito | Aplicación en CryptoDuels |
| :--- | :--- | :--- |
| **Proxy** | Intercepta y controla interacciones con objetos. | Validación de apuestas y logging de transacciones. |
| **Observer** | Modelo de suscripción para eventos en tiempo real. | Actualizaciones de la arena de juego y estados p2p. |
| **Singleton** | Instancia única global. | Servicios de configuración global (usar via Context). |
| **Factory** | Centraliza la creación de objetos complejos. | Generación de diferentes tipos de juegos. |
| **Module** | Encapsulamiento en unidades independientes. | Utilitarios de seguridad y helpers. |
| **Mixin** | Agrega funcionalidades sin herencia. | Inyectar capacidades de "analytics" a componentes. |
| **Mediator / Middleware** | Centraliza comunicación entre partes. | Orquestación en `useGameEngine`. |
| **Static / Dynamic Import** | Carga de módulos estática vs bajo demanda. | Optimización del bundle inicial. |
| **Flyweight / Prototype** | Reutilización para ahorro de memoria. | Optimización en renderizado masivo. |
| **Command** | Encapsula acciones como objetos. | Historial de jugadas y sistemas de Undo. |
| **Strategy** | Define una familia de algoritmos intercambiables. | Manejo de diferentes mecánicas de victoria por juego. |
| **Adapter** | Permite que interfaces incompatibles trabajen juntas. | Integración con diferentes proveedores de wallets o RPCs. |
| **Decorator** | Añade responsabilidades a objetos dinámicamente. | Extender funcionalidades de UI sin herencia compleja. |

---

## 2. Patrones de React y Arquitectura Moderna (Roadmap 2025/26)

### Advanced Patterns
*   **Compound Components**: Componentes que trabajan juntos compartiendo estado interno (ej: `Arena.Header`, `Arena.Board`).
*   **Provider Pattern**: Elimina el "prop drilling" para estados globales como la Wallet.
*   **HOC (Higher Order Components)**: Reutilización de lógica compositiva (útil para auth wrappers).
*   **Controlled vs Uncontrolled**: Estrategia de manejo de formularios e inputs de apuesta.

### React Stack Moderno
La recomendación actual de la industria para infraestructuras de alto nivel:
- **Build Tool**: Vite o Rsbuild (velocidad instantánea).
- **State Management**: Zustand para estado local, TanStack Query para datos asíncronos.
- **Framework base**: Next.js o Remix para handling de rutas y renderizado híbrido.

---

## 3. Estrategias de Renderizado e Hidratación

### Modelos de Renderizado
1.  **SSR / SSG / ISR**: Generación en servidor, estática o regeneración incremental (ver matriz abajo).
2.  **CSR (Client-Side Rendering)**: Renderizado puro en navegador para máxima interactividad.
3.  **Islands Architecture**: HTML estático con "islas" de JS hidratadas independientemente.
4.  **RSC (React Server Components)**: Componentes que se quedan en el servidor para reducir el bundle.

### Patrones de Hidratación (Optimización de TTI)
*   **Progressive Hydration**: Hidrata componentes solo cuando entran en el viewport.
*   **Selective Hydration**: React 18+ prioriza la hidratación de la sección con la que el usuario está interactuando.
*   **Streaming SSR**: Envío de HTML en chunks para que el usuario vea contenido antes de que todo el servidor termine.

---

## 4. Patrones de Rendimiento y Experiencia

*   **PRPL Pattern**: Push (recursos críticos), Render (ruta inicial), Pre-cache, Lazy-load.
*   **Tree Shaking**: Eliminación de código muerto en producción.
*   **Preload / Prefetch**: Carga anticipada de recursos que el usuario usará "después" (ej: el código del siguiente juego).
*   **List Virtualization**: Renderizado eficiente de miles de transacciones.
*   **Animating View Transitions**: Navegación fluida entre páginas sin saltos visuales.
*   **Optimize Third-parties**: Carga no bloqueante de analíticas y scripts externos.

---

## 5. Exploración Futura: IA y UI Generativa (OPCIONAL) 🧪

> [!NOTE]
> **Estado Actual**: No se implementará IA en la fase inicial de CryptoDuels. Estos patrones se documentan únicamente como referencia para posibles expansiones futuras.

*   **Streaming Responses**: Manejo de respuestas de LLM en tiempo real.
*   **Prompt Management**: Estructuración de entradas al modelo desde el frontend.
*   **Generative UI**: Componentes que adaptan su forma según la salida de la IA.
*   **AI Input Debouncing**: Control de frecuencia de llamadas a APIs de IA.

---

## Matriz de Decisión Definitiva:

| Sección | Patrón de Renderizado | Patrón de UI | Optimización Pro |
| :--- | :--- | :--- | :--- |
| **Landing / Home** | SSG + Islands | Proxy | Preload |
| **Arena de Juego** | CSR + Streaming | Compound / Hooks | Dynamic Import |
| **Historial / Stats**| ISR | Virtualization | Prefetch |
| **Asistente (Futuro)**| Streaming SSR | Generative UI | Debouncing |

---
> **Estado**: 100% Sincronizado con Patterns.dev y Estándares de Ingeniería (Dic 2024).
