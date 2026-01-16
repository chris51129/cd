# 🎮 Ideas de Juegos Futuros - CryptoDuels

> **Fecha**: Enero 2026  
> **Criterios**: Duelos rápidos (30s-2min), anti-cheat viable, encaje Web3

---

## 🟢 TIER S: Implementación Directa

Estos juegos encajan perfectamente con la arquitectura actual (mismo patrón que coinflip/dice).

---

### 1. Higher/Lower

| Aspecto | Detalle |
|---------|---------|
| **Duración** | 20-45 segundos |
| **Mecánica** | Adivinar si la siguiente carta es mayor o menor que la actual |
| **Anti-Cheat** | RNG on-chain, el jugador solo hace predicciones |
| **Encaje Web3** | Seed de cartas verificable post-game |

**Flujo de juego**:
```
1. Se muestra carta inicial (ej: 7♠)
2. Jugador elige: ¿Mayor o Menor?
3. Se revela siguiente carta
4. Correcto = sigue, Incorrecto = pierde
5. Competir por racha más larga o tiempo límite
```

**Implementación**:
- Nuevo reducer action: `HIGHER_LOWER_PREDICT`
- Deck generado con seed hasheado
- UI: Animación de cartas tipo casino

---

### 2. Blackjack Duel ⭐ (Recomendado)

| Aspecto | Detalle |
|---------|---------|
| **Duración** | 30-60 segundos |
| **Mecánica** | Ambos jugadores vs dealer virtual, quien más cerca de 21 gana |
| **Anti-Cheat** | Cartas generadas con seed verificable, decisiones independientes |
| **Encaje Web3** | Hash del mazo publicado antes, seed revelado después |

**Flujo de juego**:
```
1. Ambos jugadores reciben 2 cartas del mismo mazo virtual
2. Turno simultáneo: Hit / Stand
3. Dealer juega automáticamente (reglas estándar)
4. Gana quien más cerca de 21 sin pasarse
5. Empate = push (devuelve stakes)
```

**Implementación**:
- Actions: `BLACKJACK_HIT`, `BLACKJACK_STAND`, `BLACKJACK_REVEAL`
- Estado: `playerHand[]`, `dealerHand[]`, `handValue`
- UI: Mesa de blackjack con cartas animadas

**Por qué es el mejor candidato**:
- Muy familiar para audiencia de gambling
- Decisiones rápidas con componente de estrategia
- RNG 100% verificable

---

### 3. Crash Race

| Aspecto | Detalle |
|---------|---------|
| **Duración** | 15-30 segundos |
| **Mecánica** | Multiplicador sube, quien hace cash-out más cerca del crash gana |
| **Anti-Cheat** | Crash point pre-committed via hash antes de empezar |
| **Encaje Web3** | Modelo commit-reveal nativo de crypto casinos |

**Flujo de juego**:
```
1. Ambos jugadores ven multiplicador subiendo (1.00x → ∞)
2. Pueden hacer "Cash Out" en cualquier momento
3. Si crashea antes de tu cash-out = pierdes
4. Gana quien hizo cash-out con multiplicador más alto (sin crashear)
```

**Implementación**:
- Crash point determinado por: `hash(serverSeed + clientSeed + nonce)`
- Animación: Cohete subiendo o gráfico de línea
- Actions: `CRASH_CASHOUT`, `CRASH_RESULT`

**Modelo de seguridad**:
```typescript
// Pre-game: Server publica hash
const crashHash = SHA256(crashPoint + nonce);

// Post-game: Server revela
// Jugadores verifican: SHA256(revealedPoint + nonce) === crashHash
```

---

### 4. Color Prediction

| Aspecto | Detalle |
|---------|---------|
| **Duración** | 10-20 segundos |
| **Mecánica** | Elegir color antes del spin (3-8 colores según dificultad) |
| **Anti-Cheat** | Resultado determinado en smart contract antes de selección |
| **Encaje Web3** | Ideal para on-chain puro con VRF (Chainlink) |

**Flujo de juego**:
```
1. Ruleta con 3-8 colores aparece
2. Ambos jugadores eligen un color (10s)
3. Spin de la ruleta
4. Quien acertó gana (si ambos o ninguno = empate/nueva ronda)
```

**Variantes**:
- **Simple (3 colores)**: Rojo/Verde/Azul, ~33% cada uno
- **Difícil (8 colores)**: Más riesgo, más reward
- **Weighted**: Algunos colores más probables (como ruleta real)

**Implementación**:
- Similar a coinflip pero con más opciones
- UI: Ruleta animada estilo casino
- Actions: `COLOR_SELECT`, `COLOR_SPIN_RESULT`

---

## 🔐 Arquitectura Anti-Cheat Universal

Todos los juegos TIER S pueden usar este modelo:

```typescript
interface SecureGameFlow {
  // 1. Pre-game: Server genera y publica hash
  commitment: {
    hash: SHA256(seed + nonce),  // Público antes del juego
  };
  
  // 2. Durante juego: Acciones del jugador
  playerAction: {
    action: string,
    timestamp: number,
  };
  
  // 3. Post-game: Verificación
  reveal: {
    seed: string,      // Revelado
    nonce: string,     // Revelado
    // Cualquiera puede verificar: SHA256(seed + nonce) === hash
  };
}
```

---

## 📋 Prioridad de Implementación

| Prioridad | Juego | Razón |
|-----------|-------|-------|
| 1️⃣ | Blackjack Duel | Más engagement, skill + azar equilibrado |
| 2️⃣ | Crash Race | Muy popular en crypto gambling |
| 3️⃣ | Higher/Lower | Más simple de implementar |
| 4️⃣ | Color Prediction | Variante de lo que ya existe |

---

## 📁 Archivos a Crear por Juego

```
src/games/
├── blackjack.strategy.ts
├── crash.strategy.ts
├── higherlower.strategy.ts
└── colorprediction.strategy.ts

src/components/game/animations/
├── BlackjackTable.tsx
├── CrashGraph.tsx
├── CardFlip.tsx
└── ColorWheel.tsx

src/games/core/
└── gameReducer.ts  // Añadir nuevas acciones
```
