import { getCotizacionesPortafolio } from "@/lib/iol-actions";
import { CotizacionesTable } from "@/components/CotizacionesTable";
import { Suspense } from "react";

async function CotizacionesContent() {
  const items = await getCotizacionesPortafolio();

  return (
    <div style={{ padding: "24px", paddingBottom: 48, display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "var(--text-1)", margin: 0 }}>
            Cotizaciones
          </h1>
          <p style={{ fontSize: 13, color: "var(--text-3)", margin: "2px 0 0" }}>
            Mercado en tiempo real · tus posiciones
          </p>
        </div>
        <span style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          color: "#059669", fontSize: 13, fontWeight: 600,
        }}>
          <span style={{
            width: 8, height: 8, borderRadius: "50%", background: "#10B981",
            boxShadow: "0 0 0 3px rgba(16,185,129,0.2)",
            animation: "livePulse 2s ease-in-out infinite", display: "inline-block",
          }} />
          En vivo
        </span>
      </div>

      <CotizacionesTable items={items} />
    </div>
  );
}

export default function CotizacionesPage() {
  return (
    <Suspense
      fallback={
        <div style={{ display: "flex", height: "100%", alignItems: "center",
            justifyContent: "center", minHeight: "50vh" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{
              width: 28, height: 28, borderRadius: "50%",
              border: "2px solid #6366F1", borderTopColor: "transparent",
              animation: "spin 0.8s linear infinite", margin: "0 auto 10px",
            }} />
            <p style={{ fontSize: 14, color: "var(--text-3)" }}>Cargando cotizaciones…</p>
          </div>
        </div>
      }
    >
      <CotizacionesContent />
    </Suspense>
  );
}
