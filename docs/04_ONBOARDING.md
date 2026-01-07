# 04 - Onboarding de Usuario

> **Objetivo**: Guiar al nuevo usuario desde su primera visita hasta su primera partida exitosa
> **Principio**: Reducir fricción, educar progresivamente, celebrar logros

---

## 🎯 Funnel de Onboarding

```
Visita Landing → Conectar Wallet → Seleccionar Juego → Elegir Tier → Jugar → Resultado
     ↓              ↓                   ↓                  ↓           ↓        ↓
   Educar       Verificar           Explorar           Decidir     Ejecutar  Celebrar
```

---

## 1. 🏠 Landing Page (Primera Impresión)

### Objetivos
- Comunicar propuesta de valor en < 5 segundos
- Generar confianza y credibilidad
- Minimizar bounce rate

### Elementos Clave
| Elemento | Propósito |
|----------|-----------|
| Hero con animación | Captar atención |
| Estadísticas en vivo | Proof social |
| "Juega ahora" CTA | Conversión directa |
| Sección "Cómo funciona" | Educación rápida |

### Métricas
- Time to First Interaction: < 30s
- Bounce Rate Target: < 40%

---

## 2. 🔗 Conexión de Wallet

### Flujo
1. Usuario hace clic en "Conectar Wallet"
2. Modal de ConnectKit muestra opciones (MetaMask, WalletConnect, etc.)
3. Usuario autoriza conexión
4. UI actualiza mostrando dirección truncada

### Consideraciones UX
- **Sin cuenta requerida**: Wallet = identidad
- **Feedback visual**: Loading state durante conexión
- **Fallback**: Mostrar instrucciones si no hay wallet

### Primer Contacto
```
"¡Bienvenido! Tu wallet está conectada.
Dirección: 0x1234...abcd
Ahora puedes explorar los módulos disponibles."
```

---

## 3. 🎮 Selección de Juego

### Categorías
| Categoría | Juegos | Característica |
|-----------|--------|----------------|
| Destino | Coin Flip, Dice | Puro azar |
| Estrategia | RPS | Decisión táctica |
| Habilidad | Memory, Quick Draw | Destreza |
| Mixto | Block Validation | Combinación |

### Educación Progresiva
- **Tooltip en hover**: Breve descripción
- **Modal de reglas**: Al hacer clic en "?"
- **Tutorial opcional**: Primera vez por juego

---

## 4. 💰 Selección de Tier

### Tiers Disponibles
| Tier | Monto | Recomendación |
|------|-------|---------------|
| Rookie | $1 | Nuevos usuarios |
| Casual | $5 | Experimentación |
| Stake | $10 | **Popular** |
| Pro | $50 | Jugadores frecuentes |
| Premium | $100 | Apuestas serias |
| Elite | $500 | Alto riesgo |
| Whale | $1,000 | Grandes jugadores |
| Legend | $2,500 | VIP |
| Titan | $10,000 | Máximo nivel |

### Transparencia
Antes de confirmar, el usuario ve:
- Pot total: $X × 2
- Ganador recibe: 95% del pot
- Comisión protocolo: 5%

---

## 5. ⚔️ Experiencia de Juego

### Estados del Juego
```
SETUP → SELECTION → SPIN → RESULT
  ↓         ↓          ↓        ↓
Preparar  Elegir   Animar   Mostrar
```

### Feedback Visual
- Countdown con barra de progreso
- Animaciones de resultado
- Celebración de victoria

### Accesibilidad
- Navegación completa por teclado
- Aria-labels en elementos interactivos
- Anuncios de resultado para screen readers

---

## 6. 🏆 Post-Partida

### Victoria
1. Celebración visual (confeti, trofeo)
2. Mostrar monto ganado
3. Tarjeta de transparencia (hash, seed)
4. CTA: "Nueva interacción" o "Verificar en explorer"

### Derrota
1. Mensaje neutro ("Sin recompensa")
2. Información de transparencia
3. CTA: "Intentar de nuevo"

---

## 📊 Métricas de Onboarding

| KPI | Target | Descripción |
|-----|--------|-------------|
| Time to First Game | < 2 min | Desde landing hasta primera partida |
| Wallet Connection Rate | > 50% | % visitantes que conectan wallet |
| First Game Completion | > 80% | % que completan primera partida |
| Return Rate (24h) | > 30% | % que vuelven en 24 horas |

---

## 🚀 Mejoras Futuras

### Fase 2
- [ ] Tutorial interactivo paso a paso
- [ ] Tooltips contextuales en primera visita
- [ ] Modo demo sin wallet (juegos simulados)

### Fase 3
- [ ] Gamificación: Logros de onboarding
- [ ] Referral bonus para nuevos usuarios
- [ ] Onboarding personalizado por perfil

---

## 📚 Recursos Relacionados

- [Flujo de Usuario](./06_FLUJO_USUARIO.md)
- [Leyes UX](./12_LEYES_UX.md)
- [Catálogo de Juegos](./03_CATALOGO_JUEGOS.md)
