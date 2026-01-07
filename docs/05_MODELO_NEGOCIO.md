# 05. Modelo de Negocio y Monetización

> **Última actualización:** 8 de diciembre de 2024  
> **Modelo confirmado:** Comisión fija del 5%

---

## 1. Visión de Libertad Financiera

### Objetivo Principal
Construir un negocio **justo, transparente y sostenible** que genere ingresos recurrentes sin comprometer la integridad del modelo P2P.

### Meta de Libertad Financiera
- **Corto Plazo (3 meses):** $750/mes
- **Medio Plazo (6 meses):** $3,000/mes
- **Largo Plazo (12 meses):** $7,500+/mes

---

## 2. Fuente de Ingresos

### Comisión de Casa (Única fuente en MVP)

**Estructura confirmada:**
- **5% fijo** del bote total en TODAS las apuestas
- Sin comisiones variables ni fees de retiro

**Ejemplo:**
- Partida de $10 USDT → Bote total: $20
- Comisión (5%): $1 USDT
- Ganador recibe: $19 USDT
- Casa recibe: $1 USDT

**Ventajas de comisión fija:**
- ✅ Transparencia total (usuario siempre sabe cuánto paga)
- ✅ Simplicidad (no hay cálculos complejos)
- ✅ Justo para todos los tiers
- ✅ Fácil de implementar en smart contracts

---

## 3. Proyecciones Financieras

### Escenarios por Volumen Diario

| Periodo | Partidas/día | Apuesta Promedio | Volumen/día | Comisión/día | Comisión/mes | Estado |
|---------|--------------|------------------|-------------|--------------|--------------|--------|
| **Mes 1** | 10 | $10 | $100 | $5 | $150 | Validación |
| **Mes 3** | 50 | $10 | $500 | $25 | $750 | Tracción inicial |
| **Mes 6** | 200 | $10 | $2,000 | $100 | $3,000 | Sostenible |
| **Mes 12** | 500 | $10 | $5,000 | $250 | $7,500 | Escalando |

### Análisis de Rentabilidad

**Mes 6 (Objetivo de libertad financiera):**
- Ingresos: $3,000/mes
- Costos operativos: ~$50/mes (Vercel Pro + Alchemy)
- **Beneficio neto: $2,950/mes** ✅

**Mes 12 (Escala):**
- Ingresos: $7,500/mes
- Costos operativos: ~$200/mes
- **Beneficio neto: $7,300/mes** ✅

---

## 4. Estructura de Costos

### Costos de Desarrollo (Una sola vez)
| Concepto | Costo |
|----------|-------|
| Deploy de contratos (Polygon Mainnet) | $0.50 |
| Auditoría externa (OpenZeppelin) | $5,000 - $10,000 |
| Dominio (.com) | $10/año |
| **Total inicial** | **$5,010 - $10,010** |

### Costos Operativos Mensuales

| Fase | MVP (Mes 1-3) | Crecimiento (Mes 4-6) | Escala (Mes 7-12) |
|------|---------------|----------------------|-------------------|
| Hosting (Vercel) | $0 | $20 (Pro) | $20 |
| RPC (Alchemy) | $0 | $0 | $49 (Growth) |
| Dominio | $1 | $1 | $1 |
| VRF (Chainlink) | $0* | $0* | $0* |
| **TOTAL** | **$1/mes** | **$21/mes** | **$70/mes** |

*Cubierto por comisión del 5%

**Conclusión:** Costos operativos son mínimos gracias a arquitectura sin base de datos.

---

## 5. Estrategia de Crecimiento

### Fase 1: Validación (Mes 1-2)
- **Objetivo:** 50 usuarios activos, 300 partidas totales
- **Estrategia:** Lanzamiento en comunidades crypto (Reddit, Discord)
- **Inversión:** $0 (orgánico)
- **Comisión:** 5% desde día 1 (transparencia total)

### Fase 2: Tracción (Mes 3-6)
- **Objetivo:** 500 usuarios activos, 6,000 partidas/mes
- **Estrategia:** 
  - Programa de referidos (10% de comisión del referido por 1 mes)
  - Content marketing (Twitter, YouTube)
  - Partnerships con influencers crypto
- **Inversión:** $500-1,000/mes
- **ROI esperado:** 3x-5x

### Fase 3: Escala (Mes 7-12)
- **Objetivo:** 2,000+ usuarios activos, 15,000 partidas/mes
- **Estrategia:**
  - Ads pagados (Google, Twitter, TikTok)
  - Torneos con premios
  - Multi-chain expansion (Base, Arbitrum)
- **Inversión:** $2,000-3,000/mes
- **ROI esperado:** 2x-3x

---

## 6. Métricas Clave (KPIs)

### Producto
- **DAU** (Daily Active Users): Meta 100 (Mes 6)
- **Retention D7**: Meta 30%
- **Retention D30**: Meta 15%
- **Avg. Bet Size**: $10-15 USDT
- **Partidas/Usuario/Día**: 2-3

### Negocio
- **MRR** (Monthly Recurring Revenue): Meta $3,000 (Mes 6)
- **CAC** (Customer Acquisition Cost): < $10
- **LTV** (Lifetime Value): > $50
- **LTV/CAC Ratio**: > 5x
- **Margen de beneficio**: > 95%

### Blockchain
- **Costo de gas promedio**: < $0.02 por partida
- **Tiempo de confirmación**: < 5 segundos
- **Uptime de VRF**: > 99.9%

---

## 7. Riesgos y Mitigaciones

### Riesgo 1: Regulación
**Impacto:** Alto  
**Probabilidad:** Media  
**Mitigación:**
- Consultar abogado especializado en crypto/gaming
- Implementar KYC/AML si necesario
- Geo-blocking de jurisdicciones prohibidas
- Términos y condiciones claros (18+, restricciones geográficas)

### Riesgo 2: Bugs en Smart Contracts
**Impacto:** Crítico  
**Probabilidad:** Baja (con auditoría)  
**Mitigación:**
- Auditoría externa obligatoria (OpenZeppelin/CertiK)
- Bug bounty program ($5,000 en recompensas)
- Función de pausa de emergencia en contratos
- Seguro de contratos (Nexus Mutual)

### Riesgo 3: Baja Adopción
**Impacto:** Alto  
**Probabilidad:** Media  
**Mitigación:**
- MVP rápido para validar demanda
- Pivote a otros juegos si necesario
- Escuchar feedback de usuarios
- Iterar rápidamente

### Riesgo 4: Competencia
**Impacto:** Medio  
**Probabilidad:** Alta  
**Mitigación:**
- First-mover advantage en Polygon
- Comunidad fuerte y leal
- Innovación constante (nuevos juegos cada mes)
- UX superior (diseño premium)

---

## 8. Transparencia y Ética

### Compromiso Público

1. **Comisiones visibles**
   - Mostrar "5% de comisión" antes de cada partida
   - Explicar claramente en FAQ

2. **Smart contracts verificados**
   - Código abierto en GitHub
   - Verificado en PolygonScan
   - Auditoría pública disponible

3. **Randomness auditable**
   - Chainlink VRF (imposible de manipular)
   - Resultados verificables on-chain

4. **Reportes mensuales**
   - Volumen total apostado
   - Número de partidas
   - Comisiones generadas
   - Usuarios activos

### Fondo de Reserva
- 10% de beneficios a fondo de emergencia
- Para compensación de bugs/disputas
- Transparencia total en uso (wallet pública)

---

## 9. Fuentes de Ingresos Futuras (Post-MVP)

### Fase 2 (Mes 6+)
- **Torneos Premium:** Entry fee de $5-10, premio acumulado
- **NFT Skins:** Personalización de UI ($2.99-9.99)
- **Estadísticas Avanzadas:** Dashboard pro ($4.99/mes)

### Fase 3 (Año 2+)
- **Sponsorships:** Marcas crypto patrocinan torneos
- **White Label:** Licenciar plataforma a otros proyectos
- **Token Propio:** Governance + rewards (si tiene sentido)

**Nota:** Estas son opcionales. El modelo base (5% de comisión) es suficiente para libertad financiera.

---

## 10. Conclusión

**El modelo es viable y sostenible:**
- ✅ Costos operativos mínimos (~$70/mes en escala)
- ✅ Margen de beneficio >95%
- ✅ Escalable sin inversión significativa
- ✅ Transparente y justo para usuarios
- ✅ Objetivo de $3,000/mes alcanzable en 6 meses

**Próximo paso:** Ejecutar Fase 1 del ROADMAP (Diseño y UI).
