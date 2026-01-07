# Sistema de Diseño: Dark Tech Elegance

Este documento define el ADN visual de **CryptoDuels**. Evolucionado a partir de principios de minimalismo escandinavo, el estilo actual se define como **"Dark Tech Elegance"**: una estética de alta fidelidad que combina la sobriedad técnica con el lujo digital.

---

## 🏛️ Principios Core

1.  **Ritmo Vertical Inquebrantable**: El espaciado no es arbitrario; se basa en la unidad `lh` (line-height). Cada elemento "respira" en múltiplos de su propia tipografía.
2.  **Confianza en la Oscuridad**: El uso de negros absolutos y grises profundos no es solo estético; reduce la fatiga visual y hace que los activos cripto (tokens, NFTs) resalten como joyas.
3.  **Precisión Técnica**: Bordes finos (1px), tipografías geométricas y una jerarquía clara transmiten el mensaje de "Trust in Code".
4.  **Profundidad Táctil**: Uso de *Glassmorphism* y resplandores (*glows*) sutiles para crear capas de información legibles.

---

## 🎨 Paleta de Colores

### Bases y Superficies
| Color | Hex | Uso |
| :--- | :--- | :--- |
| **Deep Background** | `#020408` | Fondo principal de la aplicación. |
| **Surface** | `#0B0F17` | Fondo de tarjetas y componentes elevados. |
| **Surface Hover** | `#0F141E` | Interacciones y estados activos. |

### Acentos
| Color | Hex | Uso |
| :--- | :--- | :--- |
| **Neon Blue** | `#2E5CFF` | Acento principal, resplandores de marca. |
| **Pure White** | `#F5F5F7` | Texto primario y highlights de alta intensidad. |
| **Soft Gray** | `#86868B` | Texto secundario y metadatos. |
| **Gold** | `#D4AF37` | Tiers altos y estados de victoria. |

---

## Typography (Tipografía)

-   **Headings (Titulares)**: `Manrope`
    -   *Weight*: 500 (Medium)
    -   *Letter Spacing*: `-0.02em` (Apretado para una sensación más técnica).
    -   *Line Height*: `1.2`
-   **Body (Cuerpo)**: `Inter`
    -   *Weight*: 400 (Regular)
    -   *Line Height*: `1.5`

> [!TIP]
> **Modular Spacing**: Siempre usa `margin-block: 1lh` para separar bloques de texto. Esto garantiza una armonía visual matemática.

---

## 🧊 Componentes Base

### 1. Glass Cards
Efecto de cristal oscuro con borde ultra-fino.
- **Borde**: `1px solid rgba(255, 255, 255, 0.05)`
- **Sombra**: `var(--shadow-glow-blue)` (sutil) o `0 10px 30px rgba(0,0,0,0.5)`

### 2. Neon Buttons
Efecto de luz sólida sin degradados complejos.
- **Border Radius**: `var(--radius-md)` (1rem).
- **Transición**: `0.3s cubic-bezier(0.4, 0, 0.2, 1)`

### 3. Glow States
Los estados de éxito o importancia usan sombras difusas (`box-shadow`) en lugar de colores de fondo sólidos para mantener la elegancia.

---

## 🛠️ Utilidades CSS
Para mantener el sistema, usa las clases definidas en `utilities.css`:
- `.flex-center`: Alineación perfecta.
- `.mb-4`: Margen inferior de `1lh`.
- `.text-gradient`: Titular con sutil resplandor blanco.

---
*Este sistema de diseño es la ley visual de CryptoDuels. Cualquier nuevo componente debe respetar estas proporciones para mantener la sensación de "Premium Arena".*
