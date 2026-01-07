# 03. Catálogo de Juegos

> **Última actualización:** 8 de diciembre de 2024

## Filosofía de Diseño de Juegos

Todos los juegos en CryptoDuels deben cumplir:
1. **Duración:** 1-3 minutos máximo
2. **Simplicidad:** Reglas comprensibles en < 10 segundos
3. **Verificabilidad:** Resultado demostrable on-chain
4. **Justicia:** Aleatoriedad criptográficamente segura (Chainlink VRF)
5. **Adrenalina:** Feedback visual impactante

## Sistema de Tiers

Todos los juegos comparten los mismos **9 tiers de apuesta**:
- 🥉 $1, 🥈 $5, 🥇 $10, 💵 $50, 💵 $100, 💰 $1,000, 💎 $2,500, 💎 $5,000, 👑 $10,000

**Comisión:** 5% fija en todos los tiers

---

## Fase 1 - MVP (Lanzamiento Inicial)

### 1. Coin Flip 🪙
**Concepto:** El clásico cara o cruz.

**Reglas:**
- Jugador A elige Cara o Cruz
- Jugador B automáticamente recibe el lado opuesto
- Se genera un número aleatorio verificable
- Ganador se lleva el bote (menos comisión)

**Duración:** 10-15 segundos  
**Complejidad Técnica:** Baja  
**Atractivo:** Universal, conocido por todos

**Smart Contract:**
```solidity
// Pseudocódigo con validaciones de seguridad
function resolveCoinFlip(uint256 randomness) nonReentrant {
    // SECURITY: Validar estado del juego
    require(gameState == State.WAITING_RESULT, "Invalid state");
    require(block.timestamp < deadline, "Game expired");
    require(randomness > 0, "Invalid randomness");
    
    bool result = (randomness % 2 == 0); // 0 = Cara, 1 = Cruz
    address winner = result ? playerA : playerB;
    
    // SECURITY: Checks-Effects-Interactions pattern
    gameState = State.RESOLVED;
    payWinner(winner); // Transfer al final para prevenir reentrancy
}
```

---

### 2. Dice Duel 🎲
**Concepto:** Cada jugador tira un dado de 6 caras, el mayor número gana.

**Reglas:**
- Ambos jugadores tiran simultáneamente
- Se generan 2 números aleatorios (1-6)
- Mayor número gana
- En caso de empate: se vuelve a tirar (o se divide el bote 50/50)

**Duración:** 15-20 segundos  
**Complejidad Técnica:** Baja  
**Atractivo:** Simple pero con más variabilidad que Coin Flip

**Variantes Futuras:**
- Dados de 10 caras
- Dados de 20 caras (D20, atractivo para gamers)
- Mejor de 3 tiradas

---

### 3. Rock-Paper-Scissors ✊✋✌️
**Concepto:** Piedra, Papel o Tijera simultáneo.

**Reglas:**
- Ambos jugadores eligen en secreto (commit-reveal pattern)
- Se revelan simultáneamente
- Piedra > Tijera > Papel > Piedra
- Empate: se juega de nuevo

**Duración:** 20-30 segundos  
**Complejidad Técnica:** Media (requiere commit-reveal)  
**Atractivo:** Estrategia psicológica, conocido globalmente

**Smart Contract (Commit-Reveal):**
```solidity
// Fase 1: Commit (hash de la elección)
function commitChoice(bytes32 hashedChoice) {
    // SECURITY: Validar jugador y estado
    require(msg.sender == playerA || msg.sender == playerB, "Not a player");
    require(commits[msg.sender] == bytes32(0), "Already committed");
    require(block.timestamp < commitDeadline, "Commit phase ended");
    
    commits[msg.sender] = hashedChoice;
    emit ChoiceCommitted(msg.sender);
}

// Fase 2: Reveal (revelar elección + salt)
function revealChoice(uint8 choice, bytes32 salt) {
    // SECURITY: Validar hash y elección
    require(keccak256(abi.encodePacked(choice, salt)) == commits[msg.sender], "Invalid reveal");
    require(choice >= 0 && choice <= 2, "Invalid choice"); // 0=Rock, 1=Paper, 2=Scissors
    require(block.timestamp < revealDeadline, "Reveal phase ended");
    
    choices[msg.sender] = choice;
    emit ChoiceRevealed(msg.sender, choice);
}

// Fase 3: Resolver
function resolve() nonReentrant {
    // SECURITY: Validar que ambos revelaron
    require(choices[playerA] != type(uint8).max && choices[playerB] != type(uint8).max, "Not all revealed");
    require(gameState == State.REVEAL_COMPLETE, "Invalid state");
    
    // Lógica de ganador (Rock > Scissors > Paper > Rock)
    address winner = determineWinner(choices[playerA], choices[playerB]);
    gameState = State.RESOLVED;
    payWinner(winner);
}
```

---

## Fase 2 - Expansión (Post-MVP)

### 4. Number Guess 🔢
**Concepto:** Adivina el número secreto del oponente.

**Reglas:**
- Cada jugador elige un número secreto (1-100)
- Cada jugador hace una adivinanza del número del oponente
- Quien esté más cerca gana
- Empate: se divide el bote

**Duración:** 30-45 segundos  
**Complejidad Técnica:** Media  
**Atractivo:** Estrategia + suerte

---

### 5. Quick Draw ⚡
**Concepto:** Timing game - quien reaccione primero gana.

**Reglas:**
- Ambos jugadores esperan señal aleatoria (3-7 segundos)
- Aparece botón "DRAW!"
- Primer click gana
- Anti-cheat: clicks antes de la señal = descalificación

**Duración:** 5-10 segundos  
**Complejidad Técnica:** Media (requiere timestamp preciso)  
**Atractivo:** Pura adrenalina, reflejos

---

### 6. Card War 🃏
**Concepto:** Carta más alta gana (como War/Guerra).

**Reglas:**
- Cada jugador recibe 1 carta aleatoria (2-As)
- Mayor valor gana (As = 14, K = 13, Q = 12, J = 11)
- Empate: se reparte el bote 50/50

**Duración:** 15-20 segundos  
**Complejidad Técnica:** Baja  
**Atractivo:** Visual (cartas animadas), familiar

---

## Fase 3 - Avanzado (Escalabilidad)

### 7. Mini Poker 🎰
**Concepto:** Poker simplificado de 3 cartas.

**Reglas:**
- Cada jugador recibe 3 cartas
- Mejor mano gana (Trío > Escalera > Par > Carta Alta)
- Sin apuestas intermedias (all-in desde el inicio)

**Duración:** 45-60 segundos  
**Complejidad Técnica:** Alta  
**Atractivo:** Estrategia, skill-based

---

### 8. Roulette Duel 🎡
**Concepto:** Ambos apuestan en ruleta, mayor ganancia gana.

**Reglas:**
- Ruleta europea (0-36)
- Cada jugador elige: número, color, par/impar
- Se gira la ruleta
- Quien gane más (o pierda menos) se lleva el bote

**Duración:** 30-45 segundos  
**Complejidad Técnica:** Alta  
**Atractivo:** Emoción de casino, múltiples estrategias

---

### 9. Custom Challenges 🎯
**Concepto:** Los usuarios proponen sus propias reglas.

**Ejemplos:**
- "Mejor de 5 Coin Flips"
- "Dice Duel con dados de 20 caras"
- "RPS con Lagarto y Spock" (Big Bang Theory)

**Duración:** Variable  
**Complejidad Técnica:** Muy Alta (requiere sistema modular)  
**Atractivo:** Comunidad, viralidad, innovación

---

## Estrategia de Lanzamiento

### Semana 1-2: MVP
- Coin Flip (validar concepto)
- Dice Duel (añadir variedad)

### Semana 3-4: Expansión Rápida
- Rock-Paper-Scissors (estrategia)
- Quick Draw (adrenalina)

### Mes 2-3: Consolidación
- Number Guess
- Card War
- Analítica de qué juegos tienen más tracción

### Mes 4+: Innovación
- Mini Poker (skill-based)
- Roulette Duel (casino-like)
- Custom Challenges (comunidad)

---

## Métricas de Éxito por Juego

Para cada juego, trackear:
1. **Tasa de Adopción:** % de usuarios que lo juegan
2. **Retention:** % que juegan más de 5 veces
3. **Volumen de Apuestas:** Total apostado
4. **Tiempo Promedio:** Duración real vs esperada
5. **Abandono:** % de partidas no completadas

**Objetivo:** Identificar los juegos más rentables y duplicar esfuerzos ahí.
