# 06. Flujo de Usuario (User Journey)

> **Última actualización:** 8 de diciembre de 2024  
> **Arquitectura:** D1 - Pools por Tier

---

## 1. Primera Visita (Usuario Nuevo)

### Landing Page (Homepage actual)
1. **Hero Section:**
   - Título: "Trust in Code. Bet on Skill."
   - Subtítulo: "A decentralized arena where the house never plays."
   - CTA: "Enter the Arena" / "Connect Wallet"

2. **Stats Section:**
   - Total Volume, Active Players, Avg. Payout Time
   - Actualizado en tiempo real

3. **Juegos Destacados:**
   - Cards de Cara o Cruz, Duelo de Dados, Duelo Mental
   - Hover muestra descripción rápida

4. **Footer:**
   - Links a Términos, Privacidad, Auditoría
   - "Built on Polygon"

---

## 2. Conexión de Wallet

### Flujo:
1. Click en "Conectar Wallet" (RainbowKit)
2. Modal aparece con opciones:
   - MetaMask
   - WalletConnect (para mobile wallets)
   - Coinbase Wallet
   - Otros (Rainbow, Trust Wallet, etc.)
3. Usuario selecciona → popup de wallet
4. Usuario aprueba conexión
5. Navbar actualiza mostrando dirección y balance

### Validaciones:
- **Chain ID:** Validar que Chain ID = 137 (Polygon Mainnet)
- **Red incorrecta:** RainbowKit muestra botón "Switch to Polygon" automáticamente
- **Balance bajo:** Si balance USDT < $1 → warning "Deposita USDT para jugar"

---

## 3. Selección de Juego

**Desde Homepage:**
1. Usuario ve 3 game cards (Cara o Cruz, Dados, RPS)
2. Click en card → Navega a página del juego

**Componentes de página de juego:**
- Header con título y descripción del juego
- Botón "Volver" a homepage
- Grid de selección de tier (9 opciones)

---

## 4. Selección de Tier

### UI:
Grid de 9 cards mostrando:
- **Tier 1:** $1 USDT 🥉 - "0 esperando"
- **Tier 2:** $5 USDT 🥈 - "1 esperando"
- **Tier 3:** $10 USDT 🥇 - "0 esperando"
- **Tier 4:** $50 USDT 💵 - "0 esperando"
- **Tier 5:** $100 USDT 💵 - "0 esperando"
- **Tier 6:** $1,000 USDT 💰 - "0 esperando"
- **Tier 7:** $2,500 USDT 💎 - "0 esperando"
- **Tier 8:** $5,000 USDT 💎 - "0 esperando"
- **Tier 9:** $10,000 USDT 👑 - "0 esperando"

### Interacción:
1. Usuario hace clic en tier (ej: $5)
2. Si no ha aprobado USDT:
   - Modal: "Necesitas aprobar USDT primero"
   - Botón: "Aprobar USDT"
   - Transacción en wallet → Esperar confirmación
3. Llamar `joinPool(5e6)` (5 USDT en unidades de 6 decimales)
4. Transacción en wallet → Esperar confirmación
5. Fondos van a smart contract (escrow)
6. Usuario entra en sala de espera

---

## 5. Sala de Espera (Waiting Room)

### UI:
- **Mensaje:** "Buscando oponente..."
- **Tier:** "Pool de $5 USDT"
- **Jugadores en cola:** "1 jugador esperando" (actualizado en tiempo real)
- **Timer:** "Tiempo en cola: 0:45"
- **Botón:** "Salir de Cola" (rojo, outline)
- **Animación:** Spinner o dots animados

### Flujo:
1. Frontend escucha evento `PlayerJoinedPool` para actualizar contador
2. Cuando segundo jugador se une → Contrato emite `MatchCreated`
3. Frontend detecta evento → Cambia a pantalla de juego

**Cancelación:**
- Usuario hace clic en "Salir de Cola"
- Modal de confirmación: "¿Seguro? Pagarás gas (~$0.0014)"
- Llamar `leavePool()`
- Fondos devueltos automáticamente
- Volver a selección de tier

---

## 6. Juego en Progreso

### Pantalla de Match Found:
- **Header:** "¡Match encontrado!"
- **Oponente:** "Jugando contra 0x1234...5678"
- **Bote:** "$10 USDT"
- **Tu ganancia potencial:** "$9.50 USDT (95%)"
- **Estado:** "Generando resultado..."

### Animación (2-3 segundos):
**Cara o Cruz:**
- Moneda 3D girando (Framer Motion)
- Slow-motion al final
- Revelar: "CARA" o "CRUZ"

**Duelo de Dados:**
- Dos dados rodando simultáneamente
- Mostrar números finales (1-6)
- Highlight del ganador (glow verde)

**Piedra, Papel o Tijera:**
- Dos manos moviéndose arriba/abajo (3 veces)
- Revelar elección final (✊✋✌️)
- Mostrar quién gana con línea/flecha

---

## 7. Resultado

### Victoria:
- **Título:** "🎉 ¡GANASTE!"
- **Ganancia:** "+$9.50 USDT" (verde, grande)
- **Botones:** "Jugar de Nuevo" | "Cambiar Juego"
- **Efectos:** Confetti animation
- **Acción:** Fondos transferidos automáticamente a wallet (ya están)
- **Toast:** "¡Ganaste $9.50!"

### Derrota:
- **Título:** "😔 Perdiste"
- **Pérdida:** "-$5 USDT" (rojo)
- **Botones:** "Intentar de Nuevo" | "Cambiar Tier"
- **Mensaje:** "¡La próxima es tuya!"
- **Toast:** "Perdiste $5"

---

## 8. Casos Especiales

### Usuario cierra navegador en cola
- **Problema:** Usuario está en pool pero cierra navegador
- **Solución:** 
  - Al volver y conectar wallet, frontend lee `playerInPool[userAddress]`
  - Si > 0, mostrar: "Estás en cola de $X. ¿Quieres salir?"
  - Botón "Salir de Cola" disponible

### VRF tarda mucho
- **Problema:** Chainlink VRF puede tardar 1-2 minutos ocasionalmente
- **Solución:**
  - Mostrar mensaje: "Generando resultado... esto puede tardar"
  - Spinner animado
  - No romper UI

### Sin USDT
- **Problema:** Usuario intenta jugar sin USDT
- **Solución:**
  - Transacción falla con error claro
  - Toast: "Saldo insuficiente. Tienes $0, necesitas $5"
  - Botón: "Cómo conseguir USDT" (link a guía)

### Sin MATIC para gas
- **Problema:** Usuario tiene USDT pero no MATIC
- **Solución:**
  - Transacción falla
  - Toast: "Necesitas MATIC para pagar gas (~$0.01)"
  - Link a faucet o exchange

### Intenta unirse a 2 pools
- **Problema:** Usuario ya está en pool de $5, intenta unirse a pool de $10
- **Solución:**
  - Contrato rechaza transacción (`require(playerInPool[msg.sender] == 0)`)
  - Toast: "Ya estás en una cola. Sal primero."

---

## 9. Transparencia en UX

### En cada partida:
- **Botón:** "Ver en PolygonScan" (link a transacción)
- **Info:** Hash de transacción visible
- **Randomness:** Link a Chainlink VRF request (para verificar)

### En landing page:
- **Sección:** "Transparencia"
  - "Smart Contracts Verificados"
  - "Aleatoriedad Auditable"
  - "Sin Custodia de Fondos"

### En footer:
- **Link:** "View Contracts" (PolygonScan)
- **Link:** "Audit" (cuando esté disponible)
- **Link:** "Docs" (documentación técnica)

**Objetivo:** Que cualquier usuario pueda verificar que el juego es justo, sin necesidad de confiar ciegamente.

---

## 10. Flujo Completo (Resumen)

```
1. Usuario visita homepage
2. Click "Conectar Wallet" → RainbowKit
3. Wallet conectada → Ve 3 juegos
4. Click "Cara o Cruz" → Ve 9 tiers
5. Click tier "$5" → Aprobar USDT (si es primera vez)
6. joinPool($5) → Entra en cola
7. Espera oponente (0-60 segundos típicamente)
8. Match encontrado → Animación de resultado (2-3 seg)
9. Resultado → Victoria o Derrota
10. Fondos en wallet → Puede jugar de nuevo
```

**Tiempo total:** 1-3 minutos por partida
