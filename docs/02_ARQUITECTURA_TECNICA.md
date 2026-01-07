# 02. Arquitectura Técnica

> **Última actualización:** 8 de diciembre de 2024  
> **Arquitectura confirmada:** D1 - Múltiples Pools por Tier

---

## 1. Stack Tecnológico

### Frontend
- **Framework:** React + Vite ✅
- **Estilo:** CSS moderno (Dark Elegance, sin neón) ✅
- **Web3:** wagmi + viem + RainbowKit
- **Animaciones:** Framer Motion ✅
- **Hosting:** Vercel (gratis, CDN global, CI/CD automático)

### Smart Contracts
- **Lenguaje:** Solidity ^0.8.20
- **Framework:** Hardhat
- **Librerías:** OpenZeppelin (contratos base), Chainlink VRF (randomness)
- **Testing:** Hardhat + Chai
- **Deployment:** Hardhat scripts

### Blockchain
- **Red Principal:** Polygon Mainnet
- **Testnet:** Polygon Mumbai
- **Moneda:** USDT (stablecoin con 6 decimales)
- **Razones para Polygon:**
  - Fees ultra-bajos (~$0.01 por partida completa)
  - Compatible con Ethereum (fácil migración futura)
  - MetaMask nativo (máxima adopción)
  - Velocidad: 2-4 segundos de confirmación
  - Ecosistema maduro y bien documentado

### Infraestructura Web3
- **RPC Provider:** Alchemy (300M compute units/mes gratis) o Infura
- **Wallet UI:** RainbowKit (soporte para MetaMask, WalletConnect, Coinbase Wallet, etc.)
- **Randomness:** Chainlink VRF V2 (verificable y seguro)

### Backend
- **NO necesario** para MVP
- Toda la lógica de matchmaking y pagos está en smart contracts
- Frontend lee eventos de blockchain directamente

---

## 2. Arquitectura del Sistema (D1)

```
┌─────────────────────────────────────────────────────┐
│              Frontend (React + Vercel)              │
│  - Conexión de wallet (RainbowKit)                 │
│  - UI de selección de juego y tier                 │
│  - Animaciones de resultado                        │
│  - Lectura de eventos blockchain                   │
└─────────────────┬───────────────────────────────────┘
                  │
                  ↓
┌─────────────────────────────────────────────────────┐
│            Smart Contracts (Polygon)                │
│                                                     │
│  GamePoolBase.sol (abstracto)                      │
│  ├── CoinFlipPools.sol                             │
│  ├── DiceDuelPools.sol                             │
│  └── RPSPools.sol                                  │
│                                                     │
│  Funcionalidad:                                     │
│  - Pools por tier ($1, $5, $10, ..., $10k)        │
│  - Matchmaking automático (2 jugadores = match)    │
│  - Escrow de USDT                                  │
│  - Chainlink VRF para randomness                   │
│  - Distribución de fondos (95% ganador, 5% casa)   │
│  - Cancelación con devolución                      │
└─────────────────────────────────────────────────────┘
```

### Flujo de Datos

1. **Usuario A** se conecta con wallet → Aprueba USDT → Elige tier ($5) → `joinPool(5e6)`
2. **Contrato** recibe USDT → Añade a `pools[5e6]` → Espera segundo jugador
3. **Usuario B** hace lo mismo → Contrato detecta 2 jugadores → Crea match automáticamente
4. **Contrato** solicita randomness a Chainlink VRF
5. **VRF** responde con número aleatorio → Contrato determina ganador
6. **Contrato** transfiere $9.50 al ganador, $0.50 a wallet de comisiones
7. **Frontend** escucha evento `GameFinished` → Muestra resultado con animación

---

## 3. Decisiones de Arquitectura

### ¿Por qué NO usamos base de datos?

- ✅ **Simplicidad:** Menos infraestructura = menos complejidad
- ✅ **Costos:** $0 en hosting de DB
- ✅ **Descentralización:** Todo on-chain = máxima transparencia
- ✅ **Seguridad:** No hay servidor que hackear
- ✅ **Escalabilidad:** Blockchain escala mejor que DB tradicional para este caso

### ¿Qué datos están on-chain?

- Estado de pools (quién está esperando)
- Historial de partidas (eventos `GameFinished`)
- Balances de usuarios (USDT)
- Comisiones acumuladas

### ¿Qué datos están off-chain?

- Nada crítico
- Opcionalmente: Analytics (Dune Analytics, The Graph)

---

## 4. Costos Reales

### Costos de Desarrollo
| Componente | Costo |
|------------|-------|
| Frontend Hosting (Vercel) | $0 (gratis) |
| RPC Provider (Alchemy) | $0 (tier gratis) |
| Deploy de contratos (Mumbai testnet) | $0 (MATIC gratis de faucet) |
| Deploy de contratos (Polygon Mainnet) | ~$0.50 (una sola vez) |
| **Total inicial** | **< $1 USD** |

### Costos Operativos (por partida)
| Acción | Gas Units | Costo USD | Quién Paga |
|--------|-----------|-----------|------------|
| Aprobar USDT (una vez) | 46,000 | $0.0012 | Usuario |
| Unirse a pool | 70,000 | $0.0019 | Usuario |
| Match automático + VRF | 180,000 | $0.0049 | Usuario B |
| VRF callback + payout | 117,000 | $0.0032 | Contrato (cubierto por comisión) |
| **Total por partida** | **367,000** | **~$0.01** | **Usuarios** |

**Conclusión:** Costos operativos son mínimos y asumidos por usuarios. La comisión del 5% cubre VRF y genera ganancia.

---

## 5. Seguridad

### Principios de Seguridad

1. **Smart Contracts Auditables**
   - Código abierto, verificado en PolygonScan
   - Auditoría externa obligatoria antes de mainnet (OpenZeppelin/CertiK)

2. **Escrow Automático**
   - Fondos bloqueados en contrato hasta resolución
   - Usuarios nunca pierden control de sus wallets

3. **Randomness Verificable**
   - Chainlink VRF imposible de manipular
   - Resultados verificables on-chain

4. **No Custodial**
   - Usuarios controlan sus wallets siempre
   - Plataforma nunca tiene acceso a fondos

5. **Protección contra Reentrancy**
   - Uso de `nonReentrant` de OpenZeppelin
   - Patrón checks-effects-interactions

6. **Cancelación Segura**
   - Usuario puede salir de cola antes de match
   - Fondos devueltos automáticamente

### Transparencia

- ✅ Todas las transacciones verificables on-chain
- ✅ Reglas de juego inmutables en smart contracts
- ✅ Comisión del 5% clara y pública
- ✅ Historial completo de duelos accesible vía eventos

---

## 6. Escalabilidad

### Fase MVP (Mes 1-6)
- **Infraestructura:** Vercel gratis + Alchemy gratis
- **Capacidad:** Hasta ~10,000 partidas/mes sin costo adicional
- **Limitaciones:** Ninguna significativa

### Fase Crecimiento (Mes 6-12)
- **Vercel Pro:** $20/mes (más funciones, mejor soporte)
- **Alchemy Growth:** $49/mes (más compute units)
- **Capacidad:** Hasta ~100,000 partidas/mes

### Fase Escalado (Año 2+)
- **Multi-chain:** Expandir a Base, Arbitrum, o Ethereum L1
- **The Graph:** Indexar eventos para queries complejas
- **CDN Premium:** Cloudflare Enterprise para mejor latencia global

---

## 7. Comparativa de Blockchains

| Blockchain | Fee/Partida | Velocidad | Adopción | Wallet Support | Veredicto |
|------------|-------------|-----------|----------|----------------|-----------|
| **Polygon** | $0.01 | 2-4s | Alta | MetaMask, WC | ⭐ **ELEGIDO** |
| Ethereum L1 | $5-50 | 15s | Máxima | Todas | ❌ Prohibitivo |
| Solana | $0.0003 | 0.4s | Media | Phantom | ⚠️ Ecosistema diferente |
| Base | $0.02 | 2s | Creciente | MetaMask | ✅ Opción futura |
| Arbitrum | $0.10 | 2s | Alta | MetaMask | ✅ Alternativa válida |

**Decisión:** Polygon ofrece el mejor balance entre costo, velocidad y adopción para micro-apuestas P2P.

---

## 8. Roadmap Técnico

Ver [ROADMAP.md](../ROADMAP.md) en la raíz del proyecto para el plan completo de 7 fases.

**Resumen:**
1. Diseño y UI (2-3 semanas)
2. Smart Contracts (2-3 semanas)
3. Integración Web3 (2-3 semanas)
4. Testing (1-2 semanas)
5. Auditoría (2-4 semanas)
6. Producción (1 semana)
7. Post-Lanzamiento

**Tiempo total:** 10-16 semanas
