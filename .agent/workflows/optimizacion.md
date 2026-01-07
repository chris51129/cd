---
description: Inspiración relevante sobre optimización del proyecto
---

Protocolo de Optimización Radical: Arquitectura Web3 & High-Perf JS

1. Filosofía: La Eficiencia es Dinero y Velocidad

En Web3 P2P, la ineficiencia cuesta dinero real (Gas) y la latencia destruye la jugabilidad. La IA debe priorizar la ejecución O(1) y la gestión de memoria manual sobre la legibilidad sintáctica.

2. Optimización de Smart Contracts (EVM Gas Golfing)

El código Solidity debe ser tratado como ensamblador de alto nivel.

Storage Packing (CRÍTICO): La EVM lee/escribe en slots de 32 bytes. Ordenar variables para llenarlos. Ejemplo: uint128 a; uint128 b; cuesta 1 escritura (SSTORE). uint128 a; uint256 c; uint128 b; cuesta 3.

Tipos de Datos: Usar uint256 para cálculos (la EVM opera en 256 bits nativos) pero uintX menores solo para packing en structs.

Calldata vs Memory: Usar siempre calldata para argumentos de funciones externas (read-only) para evitar copias costosas en memoria.

Custom Errors: PROHIBIDO usar require(cond, "String largo"). Usar error Code(); revert Code();. Ahorra ~50 gas por llamada + despliegue.

Unchecked Blocks: Envolver operaciones aritméticas seguras (ej. incrementar un contador en un loop) en unchecked { i++; } para saltar la verificación de desbordamiento (ahorra ~30-40% gas).

3. Optimización Frontend (Vanilla JS & Game Loop)

Sin frameworks (React/Vue), el control del "Critical Rendering Path" es total.

Game Loop: NUNCA usar setInterval. Usar requestAnimationFrame(loop) con cálculo de Delta Time para desacoplar la física de los FPS.

Object Pooling: El Garbage Collector (GC) es el enemigo. No crear objetos (new Bullet()) en el loop. Crear un pool al inicio y reutilizar instancias.

DOM Batching: Tocar el DOM es lento. Modificar clases CSS en lugar de estilos inline. Usar DocumentFragment para insertar múltiples elementos de una vez.

Estructuras de Datos: Usar TypedArrays (ej. Float32Array) para posiciones y estados del juego en lugar de Arrays genéricos de JS. Acceso más rápido y menor huella de memoria.

4. Optimización de Red y Web3 (Latencia Cero)

WebRTC Data Channels: Configurar ordered: false y maxRetransmits: 0 para datos de movimiento (UDP-like). Es preferible perder un paquete de posición antigua que esperar por él (Head-of-Line Blocking).

Serialización Binaria: No enviar JSON por P2P ({"x": 10, "y": 20}). Usar buffers binarios o esquemas tipo Protobuf para reducir el payload en un 80%.

RPC Multicall: Nunca hacer await contract.balanceOf(...) en bucle. Usar Multicall3 para agrupar 50 lecturas en una sola petición HTTP al nodo RPC.

Optimistic UI: Actualizar la UI inmediatamente al firmar (feedback <100ms), revertir si la transacción falla. No hacer esperar al usuario por el bloque (~12s).

5. Instrucciones de Sistema para la IA (Prompt Injection)

Copia y pega esto al inicio de tu sesión de "vibe coding":

Rol: Arquitecto de Software Senior especializado en optimización de bajo nivel.
Directivas de Rendimiento:

JS: Rechaza soluciones que generen basura (Garbage) en el bucle principal. Usa reutilización de objetos.

Solidity: Aplica "Variable Packing" agresivo en structs. Usa unchecked donde sea seguro. Prefiere mapping sobre arrays para búsquedas O(1).

Patrón: Si ves una lectura de estado repetitiva, implementa memoización o caché local.

Red: Minimiza el tamaño del payload. Prefiere operaciones a nivel de bit (Bitwise) para flags de estado.