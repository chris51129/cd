# 08. Seguridad y Gestión de Secretos

## 1. Principios de Seguridad (Manifiesto RSA/SHA)

### Compromiso
- **Confidencialidad:** API keys nunca en código
- **Integridad:** Randomness verificable on-chain
- **No Custodia:** Usuarios controlan sus wallets
- **Principio de Menor Privilegio:** Permisos mínimos necesarios

---

## 2. Gestión de Secretos (Coste Cero)

### Variables de Entorno

**Desarrollo Local (.env.local):**
```bash
# RPC Provider
VITE_ALCHEMY_API_KEY=your_alchemy_key_here
VITE_POLYGON_RPC_URL=https://polygon-mainnet.g.alchemy.com/v2/YOUR_KEY

# Smart Contracts (direcciones públicas, OK exponerlas)
VITE_ESCROW_CONTRACT=0x...
VITE_COINFLIP_CONTRACT=0x...
```

**Producción (Vercel):**
- Configurar variables en Vercel Dashboard → Settings → Environment Variables
- Nunca commitear `.env.local` a Git (añadir a `.gitignore`)

### Rotación de Keys (Coste Cero)
- **Alchemy:** Regenerar API key cada 3 meses desde dashboard
- **Supabase:** Usar Row Level Security (RLS) para limitar acceso
- **Vercel:** Rotar environment variables manualmente si hay sospecha de leak

### Detección de Leaks
- **GitHub Secret Scanning:** Gratis, detecta keys expuestas automáticamente
- **git-secrets:** Herramienta local para prevenir commits con secretos

---

## 3. Validaciones de Smart Contracts

### Patrón de Seguridad Estándar

Todos los contratos deben seguir:

```solidity
// SECURITY CHECKLIST:
// ✅ nonReentrant modifier (OpenZeppelin)
// ✅ require() para validar estado
// ✅ require() para validar inputs
// ✅ require() para validar timeouts
// ✅ Checks-Effects-Interactions pattern
// ✅ Events para auditabilidad
```

### Ejemplo: Función de Pago Segura

```solidity
function payWinner(address winner) internal nonReentrant {
    // CHECKS
    require(winner != address(0), "Invalid winner");
    require(gameState == State.RESOLVED, "Game not resolved");
    require(!paid, "Already paid");
    
    // EFFECTS (cambiar estado ANTES de transferir)
    paid = true;
    gameState = State.COMPLETED;
    
    // INTERACTIONS (transferencia al final)
    uint256 payout = pot - commission;
    (bool success, ) = winner.call{value: payout}("");
    require(success, "Transfer failed");
    
    emit WinnerPaid(winner, payout);
}
```

---

## 4. Randomness Verificable

### Estrategia Híbrida (Coste-Eficiencia)

**Para apuestas < $50:**
```solidity
// Usar blockhash (gratis, suficientemente seguro para micro-apuestas)
function getRandomness() internal view returns (uint256) {
    return uint256(keccak256(abi.encodePacked(
        blockhash(block.number - 1),
        block.timestamp,
        msg.sender
    )));
}
```

**Para apuestas ≥ $50:**
```solidity
// Usar Chainlink VRF (~$0.10-0.50 por solicitud)
function requestRandomness() external onlyOwner {
    require(betAmount >= 50 * 10**18, "Use blockhash for small bets");
    requestId = COORDINATOR.requestRandomWords(
        keyHash,
        subscriptionId,
        requestConfirmations,
        callbackGasLimit,
        numWords
    );
}
```

**Justificación:**
- Blockhash es manipulable por mineros pero el coste de manipulación (>$10K) excede la ganancia en apuestas pequeñas
- VRF es costoso (~$0.50) pero necesario para apuestas grandes donde el incentivo de manipulación es alto
- Transparencia: documentar públicamente esta política

---

## 5. Validación de Red (Chain ID)

### Implementación en Frontend

```javascript
// Validar que el usuario está en Polygon Mainnet
const POLYGON_CHAIN_ID = 137; // Mainnet
const POLYGON_TESTNET_CHAIN_ID = 80001; // Mumbai

async function validateNetwork() {
    const chainId = await window.ethereum.request({ 
        method: 'eth_chainId' 
    });
    
    const chainIdDecimal = parseInt(chainId, 16);
    
    // SECURITY: Validar Chain ID exacto
    if (chainIdDecimal !== POLYGON_CHAIN_ID) {
        // Mostrar modal: "Red incorrecta. Cambia a Polygon"
        await switchToPolygon();
    }
}

async function switchToPolygon() {
    try {
        await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0x89' }], // 137 en hex
        });
    } catch (error) {
        // Si Polygon no está agregado, añadirlo
        if (error.code === 4902) {
            await addPolygonNetwork();
        }
    }
}
```

---

## 6. Timeouts y Abandonos

### Justificación Basada en Datos

**Análisis de Polygon:**
- Tiempo promedio de confirmación: **2 segundos**
- P99 (99% de transacciones): **8 segundos**
- Congestión extrema: **30 segundos**

**Timeout Propuesto: 90 segundos**

**Razón:**
- 30 seg (congestión) + 60 seg (margen para decisión humana) = 90 seg
- Suficiente para evitar falsos positivos
- Suficiente para frustrar a jugadores que abandonan intencionalmente

```solidity
uint256 constant TIMEOUT_DURATION = 90; // segundos

function claimTimeout() external {
    require(block.timestamp > gameStartTime + TIMEOUT_DURATION, "Too early");
    require(!bothPlayersCommitted(), "Both players active");
    
    // Devolver fondos al jugador activo
    address activePlayer = getActivePlayer();
    refund(activePlayer);
}
```

---

## 7. Política KYC/AML (Coste Cero Inicial)

### Estrategia Progresiva

**Fase MVP (Sin KYC):**
- Límite por duelo: **$100 máximo**
- Límite diario por wallet: **$500**
- Sin retiros, solo juego directo (fondos van a wallet automáticamente)

**Fase Crecimiento (KYC Opcional):**
- **Sin KYC:** Límite $100/duelo, $500/día
- **Con KYC:** Límite $1,000/duelo, $10,000/día

**Implementación KYC (cuando sea necesario):**
- **Proveedor:** Sumsub (plan gratuito: 100 verificaciones/mes)
- **Trigger:** Cuando el volumen mensual supere $50,000
- **Threshold:** KYC requerido para retiros >$1,000

### Geo-Blocking (Coste Cero)

```javascript
// Usar Cloudflare (gratis) para bloquear jurisdicciones prohibidas
// Lista de países prohibidos (ejemplo)
const BLOCKED_COUNTRIES = ['US', 'CN', 'KP']; // USA, China, North Korea

// Cloudflare Workers (gratis hasta 100k requests/día)
addEventListener('fetch', event => {
    const country = event.request.cf.country;
    if (BLOCKED_COUNTRIES.includes(country)) {
        event.respondWith(new Response('Service not available in your region', { 
            status: 403 
        }));
    } else {
        event.respondWith(fetch(event.request));
    }
});
```

---

## 8. Auditoría de Smart Contracts

### Plan de Auditoría (Coste-Eficiente)

**Fase 1: Auto-Auditoría (Gratis)**
- **Slither:** Análisis estático automático
- **Mythril:** Detección de vulnerabilidades
- **Solhint:** Linter de Solidity

```bash
# Ejecutar antes de cada deploy
slither contracts/
mythril analyze contracts/CoinFlip.sol
solhint 'contracts/**/*.sol'
```

**Fase 2: Auditoría Comunitaria ($0-500)**
- Publicar contratos en GitHub
- Solicitar revisión en r/ethdev, OpenZeppelin forum
- Ofrecer bug bounty: $100-500 por vulnerabilidad crítica

**Fase 3: Auditoría Profesional ($3,000-10,000)**
- **Trigger:** Cuando TVL (Total Value Locked) > $50,000
- **Proveedores:** CertiK, OpenZeppelin, Consensys Diligence
- **Prioridad:** Contrato de Escrow primero (maneja fondos)

### Bug Bounty Program

**Recompensas:**
- **Crítico** (pérdida de fondos): $1,000
- **Alto** (DoS, manipulación): $500
- **Medio** (edge cases): $100
- **Bajo** (mejoras): $50

**Plataforma:** Immunefi (gratis para proyectos pequeños)

---

## 9. Monitoreo y Alertas (Coste Cero)

### Herramientas Gratuitas

**Sentry (Errores de Frontend):**
- Plan gratuito: 5,000 eventos/mes
- Alertas por email cuando hay errores críticos

**Tenderly (Monitoreo de Contratos):**
- Plan gratuito: monitoreo básico
- Alertas cuando hay transacciones fallidas

**Discord Webhooks (Alertas Custom):**
```javascript
// Enviar alerta cuando hay duelo grande
if (betAmount > 100) {
    await fetch(DISCORD_WEBHOOK_URL, {
        method: 'POST',
        body: JSON.stringify({
            content: `🚨 Duelo grande: $${betAmount} - ${gameId}`
        })
    });
}
```

---

## 10. Checklist de Seguridad Pre-Deploy

### Antes de Mainnet

- [ ] Todos los contratos tienen `nonReentrant`
- [ ] Todos los `require()` tienen mensajes descriptivos
- [ ] Timeouts implementados en todos los juegos
- [ ] Chain ID validado en frontend
- [ ] Variables de entorno configuradas en Vercel
- [ ] `.env.local` en `.gitignore`
- [ ] Slither + Mythril ejecutados sin errores críticos
- [ ] Auditoría comunitaria completada
- [ ] Bug bounty program publicado
- [ ] Geo-blocking configurado en Cloudflare
- [ ] Monitoreo de Sentry + Tenderly activo
- [ ] Plan de respuesta a incidentes documentado

---

## 11. Plan de Respuesta a Incidentes

### Si se detecta vulnerabilidad:

1. **Pausar contratos** (función `pause()` de OpenZeppelin)
2. **Notificar usuarios** (banner en frontend + Twitter)
3. **Evaluar impacto** (¿fondos en riesgo?)
4. **Deploy fix** en testnet primero
5. **Re-auditar** el fix
6. **Deploy en mainnet** con migración de fondos si es necesario
7. **Post-mortem público** (transparencia)

### Contacto de Emergencia
- Email: security@cryptoduels.com
- Discord: #security-reports (privado)
- PGP Key: [publicar en docs]

---

**Principio Final:** La seguridad no es un feature, es un requisito. Cada línea de código debe asumir que será atacada.
