import { getPortafolio } from "@/lib/iol-actions";
import { HoldingsTable } from "@/components/HoldingsTable";
import { AllocationChart } from "@/components/AllocationChart";
// import { EvolutionChart } from "@/components/EvolutionChart"; // TODO: mock — ver CLAUDE.md
import { Suspense } from "react";
import { Wallet } from "lucide-react";

/* ─── Helpers ─── */
function fmtMoney(n: number) {
  return "$" + Math.round(n).toLocaleString("es-AR");
}
function fmtUSD(n: number) {
  return (
    "US$" +
    n.toLocaleString("es-AR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  );
}
function fmtPct(n: number) {
  return (
    (n >= 0 ? "+" : "-") +
    Math.abs(n).toLocaleString("es-AR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }) +
    "%"
  );
}

/* ─── Card base ─── */
const cardBase: React.CSSProperties = {
  background: "white",
  borderRadius: 14,
  border: "1px solid var(--border-light)",
  boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
};

/* ─── Dashboard ─── */
async function DashboardContent() {
  const {
    posiciones,
    totalValuacion,
    costoTotal,
    estadoCuenta,
    totalPnlPesos,
    totalPnlPorcentaje,
    variacionHoy,
    variacionHoyPesos,
    cantidadPosiciones,
  } = await getPortafolio();

  const topGainers = [...posiciones].sort((a, b) => b.variacionDiaria - a.variacionDiaria).slice(0, 3);
  const topLosers  = [...posiciones].sort((a, b) => a.variacionDiaria - b.variacionDiaria).slice(0, 3);

  const pct = estadoCuenta?.gananciaTotalPorcentaje ?? totalPnlPorcentaje;
  const pesos = estadoCuenta?.gananciaTotalPesos ?? totalPnlPesos;

  return (
    <div
      style={{
        padding: "24px",
        paddingBottom: 48,
        display: "flex",
        flexDirection: "column",
        gap: 20,
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div>
          <h1
            style={{
              fontSize: 22,
              fontWeight: 700,
              color: "var(--text-1)",
              margin: 0,
            }}
          >
            Portafolio
          </h1>
          <p
            style={{ fontSize: 13, color: "var(--text-3)", margin: "2px 0 0" }}
          >
            Argentina · BCBA
          </p>
        </div>
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            color: "#059669",
            fontSize: 13,
            fontWeight: 600,
          }}
        >
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "#10B981",
              boxShadow: "0 0 0 3px rgba(16,185,129,0.2)",
              animation: "livePulse 2s ease-in-out infinite",
              display: "inline-block",
            }}
          />
          En vivo
        </span>
      </div>

      {/* KPI row — 2fr 1fr 1fr 0.7fr */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr 1fr 0.7fr",
          gap: 14,
        }}
      >
        {/* Hero */}
        <div
          style={{
            background: "linear-gradient(135deg, #4338CA 0%, #6366F1 100%)",
            borderRadius: 14,
            padding: "24px 28px",
            color: "white",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: -40,
              right: -40,
              width: 160,
              height: 160,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.08)",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: 60,
              right: -80,
              width: 200,
              height: 200,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.04)",
            }}
          />
          <div style={{ position: "relative" }}>
            <div
              style={{
                fontSize: 13,
                fontWeight: 500,
                opacity: 0.8,
                marginBottom: 6,
              }}
            >
              Valuación de títulos
            </div>
            <div
              style={{
                fontSize: 26,
                fontWeight: 700,
                fontVariantNumeric: "tabular-nums",
                letterSpacing: -0.3,
              }}
            >
              {fmtMoney(totalValuacion)}
            </div>
            <div style={{ display: "flex", gap: 16, marginTop: 8 }}>
              <div style={{ fontSize: 12, opacity: 0.65 }}>
                <span style={{ opacity: 0.8 }}>Invertido </span>
                {fmtMoney(costoTotal)}
              </div>
              {estadoCuenta && (
                <div style={{ fontSize: 12, opacity: 0.65 }}>
                  <span style={{ opacity: 0.8 }}>Con efectivo </span>
                  {fmtMoney(estadoCuenta.totalConEfectivo)}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Rendimiento */}
        <div style={{ ...cardBase, padding: "20px 22px" }}>
          <div
            style={{
              fontSize: 12,
              fontWeight: 500,
              color: "var(--text-3)",
              textTransform: "uppercase",
              letterSpacing: 0.5,
            }}
          >
            Rendimiento total
          </div>
          <div
            style={{
              fontSize: 26,
              fontWeight: 700,
              marginTop: 6,
              fontVariantNumeric: "tabular-nums",
              color: pct >= 0 ? "#059669" : "#EF4444",
            }}
          >
            {fmtPct(pct)}
          </div>
          <div
            style={{
              fontSize: 12,
              color: pct >= 0 ? "#059669" : "#EF4444",
              marginTop: 2,
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {pesos >= 0 ? "+" : ""}
            {fmtMoney(pesos)}
          </div>
        </div>

        {/* Variación hoy */}
        <div style={{ ...cardBase, padding: "20px 22px" }}>
          <div
            style={{
              fontSize: 12,
              fontWeight: 500,
              color: "var(--text-3)",
              textTransform: "uppercase",
              letterSpacing: 0.5,
            }}
          >
            Variación hoy
          </div>
          <div
            style={{
              fontSize: 26,
              fontWeight: 700,
              marginTop: 6,
              fontVariantNumeric: "tabular-nums",
              color: variacionHoy >= 0 ? "#059669" : "#EF4444",
            }}
          >
            {fmtPct(variacionHoy)}
          </div>
          <div
            style={{
              fontSize: 12,
              color: variacionHoy >= 0 ? "#059669" : "#EF4444",
              marginTop: 2,
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {variacionHoyPesos >= 0 ? "+" : ""}
            {fmtMoney(variacionHoyPesos)}
          </div>
        </div>

        {/* Posiciones */}
        <div style={{ ...cardBase, padding: "20px 22px" }}>
          <div
            style={{
              fontSize: 12,
              fontWeight: 500,
              color: "var(--text-3)",
              textTransform: "uppercase",
              letterSpacing: 0.5,
            }}
          >
            Posiciones
          </div>
          <div
            style={{
              fontSize: 26,
              fontWeight: 700,
              marginTop: 6,
              color: "var(--text-1)",
            }}
          >
            {cantidadPosiciones}
          </div>
          <div style={{ fontSize: 12, color: "var(--text-3)", marginTop: 2 }}>
            activos
          </div>
        </div>
      </div>

      {/* Cash + Market */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {/* Cash */}
        {estadoCuenta && (
          <div style={{ display: "flex", gap: 14 }}>
            {[
              {
                label: "ARS Disponible",
                value: fmtMoney(estadoCuenta.disponibleARS),
              },
              {
                label: "USD Disponible",
                value: fmtUSD(estadoCuenta.disponibleUSD),
              },
            ].map((c) => (
              <div
                key={c.label}
                style={{
                  ...cardBase,
                  borderRadius: 12,
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "14px 20px",
                  flex: 1,
                }}
              >
                <Wallet size={16} color="#6366F1" strokeWidth={2} />
                <div>
                  <div
                    style={{
                      fontSize: 11,
                      color: "var(--text-3)",
                      fontWeight: 500,
                      textTransform: "uppercase",
                      letterSpacing: 0.4,
                    }}
                  >
                    {c.label}
                  </div>
                  <div
                    style={{
                      fontSize: 18,
                      fontWeight: 700,
                      fontVariantNumeric: "tabular-nums",
                      marginTop: 1,
                    }}
                  >
                    {c.value}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Top movers hoy — datos reales de variacionDiaria */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        {[
          { title: "Subieron hoy", items: topGainers, positive: true },
          { title: "Bajaron hoy",  items: topLosers,  positive: false },
        ].map(({ title, items, positive }) => (
          <div key={title} style={{ ...cardBase, padding: "16px 20px" }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 12 }}>
              {title}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {items.map((p) => (
                <div key={p.ticker} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontWeight: 700, fontSize: 13, color: "var(--text-1)" }}>{p.ticker}</span>
                    <span style={{ fontSize: 11, color: "var(--text-3)" }}>{p.nombre.length > 22 ? p.nombre.slice(0, 22) + "…" : p.nombre}</span>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <span style={{
                      fontSize: 13, fontWeight: 700,
                      color: positive ? "#059669" : "#EF4444",
                      fontVariantNumeric: "tabular-nums",
                    }}>
                      {fmtPct(p.variacionDiaria)}
                    </span>
                    <div style={{ fontSize: 10, color: "var(--text-3)", fontVariantNumeric: "tabular-nums" }}>
                      {p.variacionDiaria >= 0 ? "+" : ""}{fmtMoney(p.valuacion * p.variacionDiaria / 100)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Charts row */}
      {/* TODO: EvolutionChart comentado — usa datos mock. Ver CLAUDE.md para conectar seriehistorica */}
      {/* <div style={{ ...cardBase, padding: "20px 24px" }}>
        <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text-2)", margin: "0 0 16px" }}>
          Evolución del portafolio
        </p>
        <EvolutionChart totalValuacion={totalValuacion} />
      </div> */}

      {/* Distribution + Holdings */}
      <div style={{ display: "grid", gridTemplateColumns: "360px 1fr", gap: 20, alignItems: "start" }}>
        <div style={{ ...cardBase, padding: "20px 24px" }}>
          <p
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: "var(--text-2)",
              margin: "0 0 4px",
            }}
          >
            Distribución
          </p>
          <AllocationChart posiciones={posiciones} />
        </div>

        <HoldingsTable posiciones={posiciones} totalValuacion={totalValuacion} />
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <div
          style={{
            display: "flex",
            height: "100%",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "50vh",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: "50%",
                border: "2px solid #6366F1",
                borderTopColor: "transparent",
                animation: "spin 0.8s linear infinite",
                margin: "0 auto 10px",
              }}
            />
            <p style={{ fontSize: 14, color: "var(--text-3)" }}>
              Cargando portafolio…
            </p>
          </div>
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}
