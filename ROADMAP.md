# CryptoDuels - Roadmap de Desarrollo

> **Última actualización**: 8 de diciembre de 2024  
> **Estado**: Planificación completada ✅

---

## 📋 Decisiones de Arquitectura (Confirmadas)

### Tecnología Base
- [x] **Blockchain**: Polygon (barato, rápido)
- [x] **Moneda**: USDT (stablecoin)
- [x] **Identidad**: Wallet = Usuario (sin registro)
- [x] **Base de datos**: NO necesaria
- [x] **Arquitectura**: D1 - Múltiples pools por tier

### Juegos del MVP
- [x] **Cara o Cruz** (Coin Flip) - *UI Base Lista*
- [x] **Duelo de Dados** (Dice Duel) - *UI Base Lista*
- [x] **Piedra, Papel o Tijera** (Rock-Paper-Scissors) - *UI Base Lista*
- [x] **Memoria Cripto** (Memory) - *Habilidad - ¡Completo!*
- [x] **Duelo de Reflejos** (Quick Draw) - *Habilidad - ¡Completo!*
- [x] **Validación de Bloques** (Schulte Table) - *Habilidad - ¡Completo!*

### Tiers de Apuesta (9 niveles)
```
🥉 $1      🥈 $5       🥇 $10
💵 $50     💵 $100     💰 $1,000
💎 $2,500  💎 $5,000   👑 $10,000
```

### Mecánicas
- [x] **Partidas simultáneas**: NO (1 pool a la vez)
- [x] **Cancelación**: SÍ (usuario puede salir de cola) y tener sus fondos de vuelta
- [x] **Visualización**: Mostrar número exacto de jugadores
- [x] **Comisión**: 5% del bote total
- [x] **Pago VRF**: Contrato (deducido de comisión)
- [x] **Animación**: 2-3 segundos de suspenso

---

## � Fase 1: Diseño y UI Completa (2-3 semanas. Casi completa. Pendiente de validación)

**Objetivo**: Perfeccionar todo el aspecto visual y UX antes de tocar contratos o lógica Web3.

**Filosofía**: Tener un diseño terminado y satisfactorio visualmente facilita la implementación posterior. Trabajar con mockups/datos falsos primero.

> **Referencia de Estilo**: Ver [DESIGN_SYSTEM.md](./docs/DESIGN_SYSTEM.md) para colores, tipografía y componentes.
> [!NOTE]
> **Optimización Tipográfica**: Se ha implementado un sistema de ritmo vertical estable usando la unidad `lh` y propiedades lógicas `margin-block`.

### Estructura y Navegación
- [x] **Sistema de navegación entre páginas** (React Router)
- [x] **Componente `GamePage.jsx`** (Modular)
- [x] **Selección de Tier (UI)** (`TierSelector.jsx`)
- [x] **Sala de Espera (UI)** (`WaitingRoom.jsx`)
- [x] **Pantalla de Juego (UI)** (`GameArena.jsx`)
- [x] **Animaciones de Resultado (UI)** (Varios componentes)
- [x] **Pantalla de Resultado (UI)** (`ResultScreen.jsx`)
- [x] **Navbar Mejorado** (Wallet, Balance, Tiers)
- [x] **Sistema de Notificaciones (UI)** (`react-hot-toast`)
- [x] **Componentes de UI Reutilizables** (Glow boxes, Buttons, Icons)
- [x] **Estados de la Aplicación (Mockup)** (`useGameEngine.js`)
- [x] **Responsive Design** (Adaptado con `lh` y media queries)
- [x] **Pulido Visual Final** (Transiciones, sombras, efectos neon)
- [x] **Testing Visual** (Verificado en navegador)

---

## �🏗️ Fase 2: Smart Contracts (2-3 semanas)

**Objetivo**: Crear la lógica on-chain que gestiona pools, matchmaking automático, y pagos.

### Contratos Base
- [ ] **`GamePoolBase.sol`** - Contrato abstracto con lógica común
  
  **Por qué**: Evita duplicar código entre los 3 juegos. Cada juego hereda de esta base.
  
  - [ ] **Sistema de pools por tier**
    - Implementar mapping `pools[betAmount] => address[]` para cada tier
    - Validar que `betAmount` esté en la lista de tiers permitidos ($1, $5, $10, etc.)
    - **Razón**: Organizar jugadores por monto de apuesta para matchmaking justo
    
  - [ ] **Integración Chainlink VRF**
    - Heredar de `VRFConsumerBaseV2`
    - Configurar subscription ID y key hash para Polygon
    - Implementar `requestRandomWords()` al crear match
    - Implementar `fulfillRandomWords()` para recibir resultado
    - **Razón**: Generar números aleatorios verificables e imposibles de manipular
    
  - [ ] **Gestión de comisiones (5%)**
    - Variable `feeWallet` configurable por owner
    - Calcular `fee = totalPot * 5 / 100` en cada payout
    - Transferir fee a `feeWallet` automáticamente
    - **Razón**: Monetización de la plataforma sin intervenir en el juego
    
  - [ ] **Función `joinPool(betAmount)`**
    - Validar que usuario no esté ya en otro pool (`playerInPool[msg.sender] == 0`)
    - Transferir USDT del usuario al contrato
    - Añadir usuario a `pools[betAmount]`
    - Si hay 2+ jugadores, crear match automáticamente
    - Emitir evento `PlayerJoinedPool`
    - **Razón**: Punto de entrada único para todos los juegos
    
  - [ ] **Función `leavePool()`**
    - Validar que usuario esté en cola (`playerInPool[msg.sender] > 0`)
    - Remover usuario del pool correspondiente
    - Devolver USDT al usuario
    - Resetear `playerInPool[msg.sender] = 0`
    - Emitir evento `PlayerLeftPool`
    - **Razón**: Permitir cancelación sin penalización (solo paga gas)
    
  - [ ] **Función `getPoolSize(betAmount)`**
    - Retornar `pools[betAmount].length`
    - **Razón**: Frontend necesita mostrar cuántos jugadores esperan en cada tier
    
  - [ ] **Eventos críticos**
    - `PlayerJoinedPool(address player, uint256 betAmount)` - Para actualizar UI
    - `PlayerLeftPool(address player, uint256 betAmount)` - Para actualizar UI
    - `MatchCreated(uint256 gameId, address p1, address p2, uint256 bet)` - Notificar match
    - `GameFinished(uint256 gameId, address winner, uint256 amount)` - Mostrar resultado
    - **Razón**: Frontend escucha estos eventos para actualizar en tiempo real

### Contratos de Juegos Específicos

- [ ] **`CoinFlipPools.sol`** - Cara o Cruz
  
  **Mecánica**: El más simple, 50/50 puro.
  
  - [ ] **Lógica de ganador**
    - `result = randomness % 2` (0 o 1)
    - Si `result == 0` → player1 gana (Cara)
    - Si `result == 1` → player2 gana (Cruz)
    - **Razón**: Probabilidad perfectamente equitativa
    
  - [ ] **Tests unitarios**
    - Test: Usuario se une a pool
    - Test: Dos usuarios se matchean automáticamente
    - Test: VRF devuelve resultado y paga al ganador
    - Test: Comisión del 5% se transfiere correctamente
    - Test: Usuario puede cancelar antes de match
    - **Razón**: Asegurar que cada función trabaja correctamente
  
- [ ] **`DiceDuelPools.sol`** - Duelo de Dados
  
  **Mecánica**: Cada jugador tira un dado (1-6), el mayor gana. Empate = replay.
  
  - [ ] **Lógica de ganador**
    - `dice1 = (randomness % 6) + 1` (jugador 1)
    - `dice2 = ((randomness / 10) % 6) + 1` (jugador 2)
    - Comparar: si `dice1 > dice2` → player1 gana
    - Si empate → solicitar nuevo VRF (o dividir bote 50/50)
    - **Razón**: Usar diferentes partes del número aleatorio para cada dado
    
  - [ ] **Tests unitarios**
    - Test: Ambos dados generan valores 1-6
    - Test: Ganador correcto según dados
    - Test: Manejo de empate
    - **Razón**: Validar lógica de comparación
  
- [ ] **`RPSPools.sol`** - Piedra, Papel o Tijera
  
  **Mecánica**: Cada jugador elige (0=Piedra, 1=Papel, 2=Tijera) vía VRF.
  
  - [ ] **Lógica de ganador**
    - `choice1 = randomness % 3` (jugador 1)
    - `choice2 = (randomness / 10) % 3` (jugador 2)
    - Matriz de ganadores:
      - Piedra (0) vence Tijera (2)
      - Papel (1) vence Piedra (0)
      - Tijera (2) vence Papel (1)
    - Si empate → solicitar nuevo VRF
    - **Razón**: Simular elección "simultánea" con VRF
    
  - [ ] **Tests unitarios**
    - Test: Todas las combinaciones de ganador
    - Test: Empates se manejan correctamente
    - **Razón**: Validar matriz de 9 combinaciones posibles

### Testing y Deploy

- [ ] **Tests de integración (Hardhat)**
  - Simular flujo completo: join → match → VRF → payout
  - Probar con múltiples tiers ($1, $5, $10, etc.)
  - Probar cancelaciones en diferentes estados
  - **Razón**: Asegurar que todo el sistema funciona junto
  
- [ ] **Optimización de gas**
  - Revisar cada función para reducir operaciones costosas
  - Usar `calldata` en vez de `memory` donde sea posible
  - Minimizar escrituras a storage
  - **Razón**: Mantener costos bajo 5-6 centavos por partida
  
- [ ] **Deploy a Polygon Mumbai (testnet)**
  - Configurar Hardhat para Mumbai
  - Deploy de los 3 contratos
  - Fondear con MATIC de prueba para VRF
  - **Razón**: Probar en ambiente real antes de mainnet
  
- [ ] **Verificar contratos en PolygonScan**
  - Usar plugin de Hardhat para verificación
  - Publicar código fuente
  - **Razón**: Transparencia total, usuarios pueden ver el código

---

## 🔗 Fase 3: Integración Web3 (2-3 semanas)

**Objetivo**: Conectar los componentes UI de Fase 1 con los contratos de Fase 2.

**Nota**: Esta fase asume que Fase 1 (UI con datos mockup) y Fase 2 (Contratos) están completas.

### Setup Web3

- [ ] **Instalar dependencias**
  
  ```bash
  npm install wagmi viem @rainbow-me/rainbowkit
  ```
  
  - **wagmi**: Hooks de React para interactuar con Ethereum/Polygon
  - **viem**: Librería moderna de Web3 (reemplazo de ethers.js)
  - **RainbowKit**: UI premium para conexión de wallets
  - **Razón**: Stack moderno y mantenido, mejor DX que ethers.js
  
- [ ] **Configurar providers (Polygon)**
  
  - Crear archivo `src/wagmi.config.js`
  - Configurar Polygon Mainnet y Mumbai (testnet)
  - Añadir RPC endpoints (Alchemy o Infura)
  - Configurar chains y transports
  - **Razón**: wagmi necesita saber a qué red conectarse
  
- [ ] **Envolver app con providers**
  
  ```jsx
  <WagmiConfig config={wagmiConfig}>
    <RainbowKitProvider>
      <App />
    </RainbowKitProvider>
  </WagmiConfig>
  ```
  
  - Editar `src/main.jsx` para añadir providers
  - **Razón**: Proveer contexto de Web3 a toda la aplicación

### Conexión de Wallet

- [ ] **Reemplazar botón estático por RainbowKit**
  
  - En `src/App.jsx`, línea 88 y 107
  - Cambiar placeholder "Conectar Wallet" por `<ConnectButton />`
  - Importar estilos de RainbowKit
  - **Razón**: Activar funcionalidad real de conexión
  
- [ ] **Mostrar dirección y balance reales**
  
  - Usar hook `useAccount()` para obtener dirección
  - Usar hook `useBalance()` para USDT
  - Reemplazar placeholders en navbar
  - **Razón**: Usuario ve información real de su wallet

### Integración con Contratos

- [ ] **Configurar ABIs y direcciones**
  
  - Copiar ABIs de Hardhat a `src/contracts/`
  - Crear `src/config.js` con direcciones de contratos:
    ```js
    export const CONTRACTS = {
      coinFlip: '0x...',  // De Fase 2
      dice: '0x...',
      rps: '0x...',
      usdt: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174' // USDT en Polygon
    }
    ```
  - **Razón**: Frontend necesita saber dónde están los contratos

- [ ] **Aprobar USDT (allowance)**
  
  - En componente `TierSelector` (ya creado en Fase 1)
  - Antes de `joinPool()`, verificar allowance
  - Si insuficiente, llamar `USDT.approve(contractAddress, MAX_UINT256)`
  - Usar hook `useContractWrite()` de wagmi
  - Mostrar modal de confirmación
  - **Razón**: Contrato necesita permiso para mover USDT

- [ ] **Conectar botón de tier con `joinPool()`**
  
  - En componente `TierSelector` (ya creado en Fase 1)
  - Al hacer clic en tier, llamar `joinPool(betAmount)`
  - Convertir monto a unidades correctas: `betAmount * 10^6`
  - Usar `useContractWrite()` con ABI del contrato
  - Mostrar loading state en botón
  - **Razón**: Activar funcionalidad real de unirse a pool

- [ ] **Leer número de jugadores en tiempo real**
  
  - En componente `TierSelector` (ya creado en Fase 1)
  - Usar `useContractRead()` para llamar `getPoolSize(betAmount)`
  - Llamar para cada uno de los 9 tiers
  - Actualizar cada 5 segundos (polling)
  - Reemplazar datos mockup con datos reales
  - **Razón**: Mostrar información actualizada de disponibilidad

- [ ] **Escuchar evento `MatchCreated`**
  
  - En componente `WaitingRoom` (ya creado en Fase 1)
  - Usar hook `useContractEvent()` de wagmi
  - Filtrar por `player1 == userAddress || player2 == userAddress`
  - Cuando se detecta, cambiar estado a `PLAYING`
  - Guardar `gameId` en estado
  - **Razón**: Detectar cuando se encontró oponente

- [ ] **Escuchar evento `GameFinished`**
  
  - En componente `GameArena` (ya creado en Fase 1)
  - Usar `useContractEvent()` filtrado por `gameId`
  - Extraer `winner` y `winnerAmount` del evento
  - Cambiar estado a `RESULT`
  - Pasar datos a `ResultScreen`
  - **Razón**: Recibir resultado del juego

- [ ] **Conectar botón "Salir de Cola" con `leavePool()`**
  
  - En componente `WaitingRoom` (ya creado en Fase 1)
  - Al hacer clic, llamar `leavePool()`
  - Usar `useContractWrite()`
  - Mostrar modal de confirmación: "¿Seguro? Pagarás gas"
  - Volver a `SELECTING_TIER` después de confirmación
  - **Razón**: Activar funcionalidad de cancelación

### Reemplazar Datos Mockup con Datos Reales

- [ ] **Actualizar máquina de estados**
  
  - Eliminar `Math.random()` para resultado
  - Eliminar `setTimeout()` de 3 segundos simulado
  - Usar eventos reales de blockchain
  - Mantener misma estructura de estados (ya definida en Fase 1)
  - **Razón**: Pasar de mockup a funcionalidad real

- [ ] **Actualizar animaciones con datos reales**
  
  - `CoinFlipAnimation`: Recibir resultado de evento `GameFinished`
  - `DiceAnimation`: Extraer dados del `randomness` del evento
  - `RPSAnimation`: Extraer elecciones del `randomness` del evento
  - Componentes ya existen (Fase 1), solo conectar datos
  - **Razón**: Mostrar resultado real en vez de aleatorio

### Manejo de Errores

- [ ] **Errores de transacción**
  
  - Usuario rechaza tx → toast "Transacción cancelada"
  - Saldo insuficiente → toast "Necesitas más USDT"
  - Sin MATIC para gas → toast "Necesitas MATIC para gas"
  - Usar sistema de toasts ya configurado en Fase 1
  - **Razón**: Feedback claro de errores

- [ ] **Errores de red**
  
  - RPC falla → mostrar "Error de conexión, reintenta"
  - VRF tarda mucho → "Generando resultado... puede tardar"
  - Timeout → "La transacción está tardando, verifica en PolygonScan"
  - **Razón**: Manejar problemas de blockchain

### Testing de Integración

- [ ] **Probar flujo completo en testnet**
  
  1. [ ] Conectar wallet (Mumbai)
  2. [ ] Aprobar USDT
  3. [ ] Unirse a pool (datos reales de contrato)
  4. [ ] Ver número de jugadores actualizado
  5. [ ] Esperar match (evento real)
  6. [ ] Ver animación con resultado real
  7. [ ] Verificar fondos recibidos
  
  - **Razón**: Validar que integración funciona end-to-end

---

## 🧪 Fase 4: Testing Completo (1-2 semanas)

**Objetivo**: Probar todos los flujos en testnet antes de lanzar a producción.

### Testing en Testnet (Polygon Mumbai)

- [ ] **Conseguir MATIC de prueba**
  
  - Usar faucet de Polygon: https://faucet.polygon.technology/
  - Necesitas ~5 MATIC para pruebas
  - **Razón**: Pagar gas de transacciones en testnet
  
- [ ] **Conseguir USDT de prueba**
  
  **Opción A**: Usar token USDT de testnet existente
  - Buscar dirección de USDT en Mumbai
  - Usar faucet si existe
  
  **Opción B**: Deployar tu propio token ERC20 de prueba
  - Crear `MockUSDT.sol` con función `mint()`
  - Mintear 10,000 USDT para pruebas
  - **Razón**: Necesitas USDT para apostar en testnet
  
- [ ] **Probar flujo completo de Cara o Cruz**
  
  1. [ ] Conectar wallet (MetaMask en Mumbai)
  2. [ ] Aprobar USDT
     - Verificar que allowance se actualiza
     - Verificar transacción en PolygonScan Mumbai
  3. [ ] Unirse a pool de $5
     - Abrir 2 navegadores (o 2 wallets)
     - Usuario A se une primero
     - Verificar que aparece en cola
  4. [ ] Usuario B se une
     - Verificar que match se crea automáticamente
     - Verificar evento `MatchCreated` en PolygonScan
  5. [ ] Esperar resultado de VRF
     - Verificar que Chainlink VRF responde (puede tardar 1-2 min)
     - Verificar evento `GameFinished`
  6. [ ] Verificar fondos recibidos
     - Ganador debe recibir $9.50 USDT (95% de $10)
     - Wallet de comisiones debe recibir $0.50 USDT (5%)
     - Verificar balances en PolygonScan
  - **Razón**: Validar que el flujo completo funciona
  
- [ ] **Probar flujo de cancelación**
  
  1. [ ] Usuario se une a pool de $10
  2. [ ] Esperar 30 segundos (sin oponente)
  3. [ ] Hacer clic en "Salir de Cola"
  4. [ ] Verificar que USDT se devuelve
  5. [ ] Verificar que usuario ya no está en pool
  - **Razón**: Asegurar que cancelación funciona correctamente
  
- [ ] **Probar Duelo de Dados**
  
  - Mismo flujo que Cara o Cruz
  - Verificar que dados muestran valores 1-6
  - Verificar que ganador es el de mayor número
  - Probar caso de empate (si aplica)
  - **Razón**: Validar lógica específica de dados
  
- [ ] **Probar Piedra, Papel o Tijera**
  
  - Mismo flujo que Cara o Cruz
  - Verificar que elecciones son válidas (0, 1, 2)
  - Verificar matriz de ganadores
  - Probar caso de empate
  - **Razón**: Validar lógica específica de RPS

### Casos Edge (Situaciones Inusuales)

- [ ] **Usuario cierra navegador mientras espera en cola**
  
  - Unirse a pool
  - Cerrar navegador
  - Abrir de nuevo
  - Verificar: ¿Sigue en cola? ¿Puede cancelar?
  - **Solución esperada**: Frontend detecta que está en cola y muestra opción de cancelar
  - **Razón**: Usuarios pueden cerrar accidentalmente
  
- [ ] **VRF falla o tarda mucho**
  
  - Simular delay de VRF (>5 minutos)
  - Verificar que UI no se rompe
  - Mostrar mensaje: "Generando resultado... esto puede tardar"
  - **Razón**: VRF puede fallar ocasionalmente
  
- [ ] **Usuario no tiene USDT suficiente**
  
  - Intentar unirse a pool de $100 con solo $50
  - Verificar que transacción falla con mensaje claro
  - Mostrar: "Saldo insuficiente. Tienes $50, necesitas $100"
  - **Razón**: Error común de usuarios
  
- [ ] **Usuario no tiene MATIC para gas**
  
  - Vaciar wallet de MATIC
  - Intentar hacer transacción
  - Verificar mensaje: "Necesitas MATIC para pagar gas"
  - Mostrar link a faucet o exchange
  - **Razón**: Usuarios nuevos en Polygon no saben que necesitan MATIC
  
- [ ] **3 usuarios intentan unirse al mismo pool**
  
  - Usuario A se une a pool de $5
  - Usuario B se une → match con A
  - Usuario C intenta unirse → debe crear nueva cola
  - Verificar que C espera correctamente
  - **Razón**: Asegurar que matchmaking maneja múltiples usuarios
  
- [ ] **Usuario intenta unirse a 2 pools simultáneamente**
  
  - Unirse a pool de $5
  - Intentar unirse a pool de $10 (sin salir del primero)
  - Verificar que transacción falla
  - Mostrar: "Ya estás en una cola. Sal primero"
  - **Razón**: Restricción de 1 pool a la vez

### Optimización y Performance

- [ ] **Reducir gas donde sea posible**
  
  - Revisar cada función en contratos
  - Usar `calldata` en vez de `memory` para arrays
  - Evitar loops innecesarios
  - Combinar operaciones donde sea posible
  - **Meta**: Mantener costo total bajo $0.02 USD
  
- [ ] **Mejorar UX de loading states**
  
  - Añadir spinners en todas las transacciones
  - Mostrar progreso: "1/2 confirmaciones..."
  - Añadir estimación de tiempo: "~30 segundos"
  - **Razón**: Usuarios no saben cuánto esperar
  
- [ ] **Añadir mensajes de error claros**
  
  - Traducir errores técnicos a español simple
  - Ejemplo: "execution reverted" → "La transacción falló. Verifica tu saldo"
  - Añadir links de ayuda
  - **Razón**: Errores técnicos confunden a usuarios

---

## 🔒 Fase 5: Auditoría y Seguridad (2-4 semanas)

**Objetivo**: Asegurar que los contratos son seguros antes de manejar dinero real.

### Auditoría de Contratos

- [ ] **Auditoría interna (revisar código)**
  
  **Checklist de seguridad**:
  - [ ] Reentrancy: ¿Usamos `nonReentrant` de OpenZeppelin?
  - [ ] Integer overflow: ¿Solidity 0.8+ maneja esto automáticamente?
  - [ ] Access control: ¿Solo owner puede cambiar `feeWallet`?
  - [ ] Randomness: ¿VRF es imposible de manipular?
  - [ ] Fund locking: ¿Usuarios siempre pueden recuperar fondos?
  - [ ] Gas griefing: ¿Loops tienen límites?
  - **Razón**: Detectar bugs obvios antes de auditoría externa
  
- [ ] **Auditoría externa (OpenZeppelin/CertiK) - CRÍTICO**
  
  **Por qué es crítico**: Un bug puede perder TODO el dinero de los usuarios
  
  **Opciones**:
  - **OpenZeppelin**: $5,000 - $10,000 USD (recomendado para MVP)
  - **CertiK**: $15,000 - $30,000 USD (más exhaustivo)
  - **Code4rena**: $3,000 - $8,000 USD (competencia pública)
  
  **Proceso**:
  1. Enviar código a auditores
  2. Esperar 2-3 semanas para reporte
  3. Recibir lista de issues (críticos, altos, medios, bajos)
  4. Corregir todos los críticos y altos
  5. Re-auditar si cambios son significativos
  
  - **Razón**: Profesionales encuentran bugs que tú no ves
  
- [ ] **Corregir issues encontrados**
  
  - Priorizar por severidad: Crítico > Alto > Medio > Bajo
  - Crítico: Arreglar INMEDIATAMENTE (pérdida de fondos)
  - Alto: Arreglar antes de deploy
  - Medio: Arreglar si es posible
  - Bajo: Opcional (mejoras de código)
  - **Razón**: No puedes lanzar con bugs críticos
  
- [ ] **Re-test después de correcciones**
  
  - Volver a ejecutar todos los tests de Fase 3
  - Verificar que correcciones no rompieron nada
  - Añadir tests específicos para bugs encontrados
  - **Razón**: Asegurar que fixes funcionan

### Seguridad Frontend

- [ ] **Validar inputs del usuario**
  
  - Verificar que `betAmount` es uno de los tiers permitidos
  - Verificar que usuario tiene saldo suficiente antes de tx
  - Sanitizar cualquier input de texto (si aplica)
  - **Razón**: Prevenir errores de usuario y ataques
  
- [ ] **Proteger contra ataques comunes**
  
  - XSS: No usar `dangerouslySetInnerHTML`
  - CSRF: No aplica (no hay backend tradicional)
  - Phishing: Verificar que estás en dominio correcto
  - **Razón**: Seguridad básica de frontend
  
- [ ] **Rate limiting (si aplica)**
  
  - Si usas backend para algo, limitar requests
  - Ejemplo: Máximo 10 requests por minuto por IP
  - **Razón**: Prevenir spam/DDoS

### Preparación Legal (Importante)

- [ ] **Términos y Condiciones**
  
  - Disclaimer: "Esto es un juego de azar"
  - Restricciones geográficas: "No disponible en [países]"
  - Edad mínima: "Debes ser mayor de 18 años"
  - **Razón**: Protección legal básica
  
- [ ] **Política de Privacidad**
  
  - Qué datos recopilas (wallet address, transacciones)
  - Cómo los usas (solo para el juego)
  - **Razón**: Cumplimiento GDPR (si aplica)
  
- [ ] **Consultar con abogado (RECOMENDADO)**
  
  - Verificar legalidad en tu jurisdicción
  - Verificar si necesitas licencia de juego
  - Configurar entidad legal (LLC, etc.)
  - **Razón**: Apuestas son ilegales en muchos países

---

## 🚀 Fase 6: Producción (1 semana)

**Objetivo**: Lanzar CryptoDuels a Polygon Mainnet y hacerlo accesible al público.

### Deploy a Mainnet

- [ ] **Deploy de contratos a Polygon Mainnet**
  
  **Preparación**:
  1. [ ] Comprar MATIC real (~$100 USD para gas)
  2. [ ] Configurar Hardhat para Polygon Mainnet
  3. [ ] Usar wallet segura (hardware wallet recomendado)
  4. [ ] Hacer deploy de los 3 contratos:
     - `CoinFlipPools.sol`
     - `DiceDuelPools.sol`
     - `RPSPools.sol`
  5. [ ] Guardar direcciones de contratos
  
  - **Razón**: Contratos en mainnet son permanentes
  
- [ ] **Verificar contratos en PolygonScan**
  
  ```bash
  npx hardhat verify --network polygon <CONTRACT_ADDRESS>
  ```
  
  - Verificar los 3 contratos
  - Publicar código fuente
  - **Razón**: Transparencia, usuarios pueden ver el código
  
- [ ] **Configurar wallet de comisiones**
  
  - Llamar `setFeeWallet(tuWalletAddress)` en cada contrato
  - Usar multisig wallet (Gnosis Safe) para mayor seguridad
  - **Razón**: Aquí llegarán las comisiones del 5%
  
- [ ] **Fondear contrato con MATIC para VRF**
  
  - Crear subscription en Chainlink VRF
  - Fondear con ~10 MATIC (~$9 USD)
  - Añadir contratos como consumers
  - **Razón**: VRF necesita MATIC para funcionar

### Frontend en Producción

- [ ] **Actualizar ABIs y direcciones de contratos**
  
  - Copiar ABIs de Hardhat a `src/contracts/`
  - Actualizar direcciones en `src/config.js`:
    ```js
    export const CONTRACTS = {
      coinFlip: '0x...',
      dice: '0x...',
      rps: '0x...',
      usdt: '0x...' // USDT en Polygon Mainnet
    }
    ```
  - **Razón**: Frontend necesita saber dónde están los contratos
  
- [ ] **Deploy a Vercel (producción)**
  
  ```bash
  npm run build
  vercel --prod
  ```
  
  - Configurar variables de entorno
  - Configurar dominio personalizado (opcional)
  - **Razón**: Hosting gratis y rápido
  
- [ ] **Configurar dominio (opcional)**
  
  - Comprar dominio: `cryptoduels.com` (~$10/año)
  - Configurar DNS en Vercel
  - Configurar SSL (automático en Vercel)
  - **Razón**: Dominio profesional genera confianza
  
- [ ] **SSL/HTTPS**
  
  - Vercel lo hace automáticamente
  - Verificar que todo carga con `https://`
  - **Razón**: Seguridad y confianza

### Monitoreo Post-Lanzamiento

- [ ] **Dashboard de métricas**
  
  **Qué monitorear**:
  - [ ] Total apostado (leer eventos `MatchCreated`)
  - [ ] Número de partidas (contar eventos `GameFinished`)
  - [ ] Comisiones generadas (balance de `feeWallet`)
  - [ ] Jugadores únicos (contar addresses únicas)
  - [ ] Tier más popular ($1, $5, $10, etc.)
  
  **Herramientas**:
  - Dune Analytics (gratis, dashboards públicos)
  - The Graph (más complejo, más flexible)
  - Script custom que lee eventos
  
  - **Razón**: Saber si el negocio funciona
  
- [ ] **Alertas automáticas**
  
  **Configurar alertas para**:
  - [ ] Contrato se queda sin MATIC para VRF
    - Alerta cuando balance < 1 MATIC
    - Email o Telegram
  - [ ] Errores en VRF
    - Monitorear eventos de Chainlink
    - Alerta si VRF falla 3+ veces
  - [ ] Comportamiento sospechoso
    - Usuario gana 10+ veces seguidas (posible exploit)
    - Volumen anormal en tier específico
  
  **Herramientas**:
  - Tenderly (monitoreo de contratos)
  - OpenZeppelin Defender (alertas automáticas)
  
  - **Razón**: Detectar problemas antes de que sean graves
  
- [ ] **Plan de contingencia**
  
  **Si algo sale mal**:
  - [ ] Pausar contratos (implementar función `pause()`)
  - [ ] Comunicar en redes sociales
  - [ ] Permitir retiros de emergencia
  - [ ] Contactar auditores para ayuda
  
  - **Razón**: Estar preparado para lo peor

---

## 📈 Fase 7: Post-Lanzamiento

**Objetivo**: Iterar basado en feedback y crecer la base de usuarios.

### Marketing Inicial
- [ ] Anuncio en redes sociales
- [ ] Post en Reddit (r/CryptoCurrency, r/Polygon)
- [ ] Tweet/X
- [ ] Discord/Telegram community

### Iteración
- [ ] Recopilar feedback de usuarios
- [ ] Analizar métricas
- [ ] Identificar mejoras

### Nuevas Features (Futuro)
- [ ] Más juegos (Quick Draw, Card War, Mini Poker)
- [ ] Historial de partidas
- [ ] Leaderboards
- [ ] Sistema de referidos
- [ ] Modo torneo
- [ ] Gasless transactions (meta-transactions)

---

## 📊 Métricas de Éxito

### Mes 1
- [ ] 100+ partidas jugadas
- [ ] 50+ usuarios únicos
- [ ] $1,000+ en volumen total

### Mes 3
- [ ] 1,000+ partidas jugadas
- [ ] 200+ usuarios únicos
- [ ] $10,000+ en volumen total
- [ ] $500+ en comisiones generadas

### Mes 6 (Libertad Financiera)
- [ ] 10,000+ partidas jugadas
- [ ] 1,000+ usuarios únicos
- [ ] $100,000+ en volumen total
- [ ] $5,000+ en comisiones mensuales

---

## 🛠️ Stack Tecnológico

### Smart Contracts
- Solidity ^0.8.20
- Hardhat (desarrollo y testing)
- OpenZeppelin (contratos base)
- Chainlink VRF (randomness)

### Frontend
- React + Vite ✅
- wagmi + viem (Web3)
- RainbowKit (wallet UI)
- Framer Motion ✅ (animaciones)

### Blockchain
- Polygon Mainnet (producción)
- Polygon Mumbai (testnet)

### Hosting
- Vercel (frontend)
- Polygon (contratos descentralizados)

---

## 💰 Costos Estimados

### Desarrollo
- Auditoría externa: $5,000 - $15,000 USD
- Dominio: $10 - $50 USD/año
- Hosting: $0 (Vercel gratis)

### Operación
- Gas para VRF: ~$0.0001 por partida (cubierto por comisión)
- Fondeo inicial de MATIC: ~$100 USD

### ROI Esperado
- Comisión por partida: 5% del bote
- Ejemplo: Partida de $10 → $0.50 de comisión
- Break-even: ~10,000 - 30,000 partidas (dependiendo de auditoría)

---

## 📝 Notas Importantes

### Decisiones Pendientes (Menores)
- [ ] Nombres exactos en español para UI
- [ ] Iconos/emojis para cada tier
- [ ] Efectos de sonido (sí/no)
- [ ] Mostrar historial de partidas (sí/no)
- [ ] Stats globales en homepage (sí/no)

### Riesgos Identificados
- ⚠️ **Seguridad de contratos**: Auditoría es CRÍTICA
- ⚠️ **Regulación**: Verificar legalidad en jurisdicción
- ⚠️ **Liquidez inicial**: Necesitas usuarios para matches
- ⚠️ **Competencia**: Diferenciarte de otros casinos

### Ventajas Competitivas
- ✅ P2P real (casa no juega)
- ✅ Transparencia total (contratos verificables)
- ✅ Costos ultra-bajos (~1 centavo por partida)
- ✅ UX premium (diseño elegante)
- ✅ Sin registro (wallet = identidad)

---

**Tiempo total estimado**: 7-12 semanas  
**Presupuesto estimado**: $5,000 - $15,000 USD (principalmente auditoría)  
**Objetivo**: Libertad financiera en 6 meses ($5,000+/mes en comisiones)
