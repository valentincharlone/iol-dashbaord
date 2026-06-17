# IOL Dashboard — Notas de desarrollo

Dashboard personal de inversiones consumiendo la API de InvertirOnline (IOL) v2.
Stack: Next.js 15 App Router, TypeScript, Tailwind, inline styles.

---

## Estado de los datos: real vs mock

### ✅ Datos reales (vienen de la API de IOL)

| Dato | Endpoint |
|---|---|
| Valuación total del portafolio | `GET /api/v2/portafolio/argentina` |
| Posiciones (ticker, cantidad, precio, valuación, variación diaria) | `GET /api/v2/portafolio/argentina` |
| Rendimiento total (% y pesos) | `GET /api/v2/estadocuenta` |
| Variación hoy (promedio ponderado por valuación) | Calculado desde `portafolio` |
| Efectivo disponible ARS y USD | `GET /api/v2/estadocuenta` |
| Holdings table completa | `GET /api/v2/portafolio/argentina` |
| Distribución donut (CEDEARs / Acciones / Bonos / FCI) | Calculado desde `portafolio` |

### ⚠️ Datos mock (pendiente conectar con API real)

#### Gráfico de evolución del portafolio (`src/components/EvolutionChart.tsx`)

Actualmente genera una curva **falsa** hacia atrás usando ratios fijos definidos en `PERIOD_CONFIG`.
Solo recibe el `totalValuacion` actual y simula cómo pudo haber llegado hasta ese valor.

**Cómo conectarlo con datos reales:**
1. Llamar `GET /api/v2/operaciones` para saber desde cuándo está cada posición
2. Por cada ticker, llamar:
   ```
   GET /api/v2/{mercado}/Titulos/{simbolo}/Cotizacion/seriehistorica/{fechaDesde}/{fechaHasta}/{ajustada}
   ```
   - `mercado`: `bCBA`
   - `ajustada`: usar `ajustada` (especialmente importante para CEDEARs, incorpora splits)
   - Response key: `ultimoPrecio` + `fechaHora`
3. Para cada fecha: `Σ(cantidad × ultimoPrecio)` de todas las posiciones = valor del portafolio ese día
4. Con 27 posiciones → 27 llamadas, usar `Promise.all` para paralelizar
5. Cachear el resultado por período (los históricos no cambian durante el día)

#### Market strip (Merval, S&P 500, MEP, Blue)

Actualmente hardcodeado con valores inventados en `src/app/dashboard/page.tsx`.

**Cómo conectarlo:**
- S&P 500 (vía SPY CEDEAR): `GET /api/v2/bCBA/Titulos/SPY/Cotizacion`
- Dólar MEP: `POST /api/v2/Cotizaciones/MEP` o `GET /api/v2/Cotizaciones/MEP/{simbolo}`
- S&P Merval: probar si `MERVAL` es símbolo válido en `GET /api/v2/bCBA/Titulos/MERVAL/Cotizacion`
- Dólar Blue: **no disponible en la API de IOL** (es mercado informal), habría que usar otra fuente

---

## Autenticación IOL

- Bearer token (expira ~15 min) + refresh token
- Persistido en `.iol-token.json` (ignorado por git) para sobrevivir reinicios del servidor
- Lógica en `src/lib/iol-auth.ts`: memoria → disco → refresh → login fresco
- Credenciales en `.env.local`: `IOL_USERNAME` y `IOL_PASSWORD`

---

## Pendientes futuros

- [ ] Conectar gráfico de evolución con `seriehistorica` (ver arriba)
- [ ] Conectar market strip con cotizaciones reales
- [ ] Deploy en Vercel + login con NextAuth (usuario único)
- [ ] Página de Cotizaciones (sidebar muestra "PRONTO")
- [ ] Página de Movimientos / Operaciones (sidebar muestra "PRONTO")
- [ ] Actualizar `next` a `>=15.3.4` (CVE-2025-66478 en 15.3.3)
