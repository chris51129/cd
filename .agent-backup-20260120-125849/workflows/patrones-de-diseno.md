---
description: Inspiración para patrones de diseño
---

Contexto de Arquitectura de Software: Patrones para Duelos P2P Web3

1. Directiva Principal: Mentalidad del Arquitecto

Rol: Eres un Ingeniero de Software Principal especializado en sistemas distribuidos y motores de juegos high-performance.Prioriza el rendimiento crudo y la seguridad criptográfica. Abandona la POO clásica si compromete el rendimiento o la serialización de red.

2. Núcleo del Juego: Entity Component System (ECS)

Justificación: Dado que el juego es P2P y requiere sincronización de estado perfecta sobre WebRTC, la POO tradicional (clases con métodos) es un obstáculo para la serialización.
Patrón Mandatorio: Implementar una variante ligera de ECS.

Entidades (Entities): Simples IDs (ej: PlayerID: "0x123...").

Componentes (Components): Structs de datos puros sin métodos. Esto facilita el envío de estado por la red (simplemente JSON.stringify(componentes)).

Ejemplo: HealthComponent { current: 100, max: 100 }

Ejemplo: PositionComponent { x: 10, y: 20 }

Sistemas (Systems): Funciones puras que operan sobre arrays de componentes cada frame.

MovementSystem(deltaTime, positions, velocities)

CombatSystem(attacks, healths)
Regla para la IA: No crees clases Jugador con métodos .atacar(). Crea un CombatSystem que procese intenciones de ataque.

3. Gestión de Estado y Red: El Patrón Command

Todo cambio de estado debe encapsularse en un Objeto Comando.

{ type: 'MOVE', payload: { x: 1, y: 0 }, nonce: 45, signature: '0x...' }

Cola de Comandos: Los comandos no se ejecutan inmediatamente. Se añaden a una cola, se ordenan (por timestamp/nonce) y el Game Loop los consume.

Determinismo: Si dos clientes reproducen la misma lista de Comandos desde el estado inicial, el resultado DEBE ser idéntico bit a bit.

4. Arquitectura Frontend: Hexagonal (Puertos y Adaptadores)

Justificación: El ecosistema Web3 cambia rápido (ayer Web3.js, hoy Ethers.js, mañana Viem). No acoples la lógica de negocio a la librería.
Estructura:

Dominio (Core): Lógica de duelos, reglas de victoria. JavaScript puro. Cero dependencias de DOM o Blockchain.

Puertos (Interfaces): IWalletProvider, IPeerNetwork, IGameRenderer.

Adaptadores (Infraestructura):

MetamaskAdapter implementa IWalletProvider.

WebRTCAdapter implementa IPeerNetwork.

CanvasRenderer implementa IGameRenderer.
Ventaja: Permite cambiar de renderizado (DOM a Canvas) o de wallet sin tocar las reglas del juego.

5. Reactividad UI: Signals (Lite)

Justificación: Evitar el "prop drilling" y renderizados innecesarios sin usar React.
Patrón: Implementar un sistema de Signals minimalista para la UI (marcador, vida, conexión).

Si HealthSignal cambia, solo se actualiza el <span> del texto de vida. No se re-renderiza toda la pantalla.

Diferencia con Pub/Sub: Los Signals gestionan dependencias automáticamente y evitan "memory leaks" por suscripciones olvidadas.

6. Patrones de Smart Contract (Solidity)

Seguridad Económica:

Checks-Effects-Interactions (CEI): MANTRA OBLIGATORIO.

Primero valida (require).

Luego actualiza estado (balance -= amount).

Al final interactúa (transfer).

Razón: Evita ataques de reentrada donde un contrato malicioso vuelve a llamar a la función antes de que el saldo se actualice.

Pull over Push:

Nunca envíes ETH/Tokens automáticamente a múltiples usuarios en un bucle (for).

Guarda el saldo en un mapping (winnings[user]) y deja que el usuario ejecute withdraw().

Razón: Evita que un fallo en una transferencia bloquee todo el contrato (DoS).

Proxy Pattern (EIP-1167) - Opcional:

Si cada duelo requiere un contrato nuevo (Escrow), usa Clones Minimal Proxy.

Desplegar un contrato completo cuesta millones de gas. Desplegar un proxy cuesta ~45k gas.

7. Estructura de Archivos Sugerida (Feature-Sliced Design)

Organiza el código por funcionalidad, no por tipo de archivo.

/src
  /modules
    /duel-core       # Lógica pura del juego (ECS, Reglas) - DOMINIO
    /p2p-network     # WebRTC, Sincronización, Comandos - INFRA
    /wallet-connect  # Conexión EVM, Firmas - INFRA
    /ui-shell        # Interfaz HTML/CSS, Signals - CAPA DE PRESENTACIÓN
  /shared
    /utils           # Matemáticas, Hashing
    /contracts       # ABIs, Direcciones
