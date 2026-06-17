import { getPerfil, getPortafolio } from "@/lib/iol-actions";

function fmtMoney(n: number) {
  return "$" + Math.round(n).toLocaleString("es-AR");
}
function fmtUSD(n: number) {
  return "US$" + n.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

const cardBase: React.CSSProperties = {
  background: "white",
  borderRadius: 14,
  border: "1px solid var(--border-light)",
  boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
};

const PERFIL_BADGE: Record<string, { bg: string; text: string; label: string }> = {
  conservador:         { bg: "#F0FDF4", text: "#15803D", label: "Conservador" },
  moderado:            { bg: "#FFF7ED", text: "#C2410C", label: "Moderado" },
  agresivo:            { bg: "#FEF2F2", text: "#B91C1C", label: "Agresivo" },
  agresivo_moderado:   { bg: "#FEF3C7", text: "#92400E", label: "Agresivo moderado" },
  moderado_agresivo:   { bg: "#FEF3C7", text: "#92400E", label: "Moderado agresivo" },
};

function perfilBadge(perfil: string) {
  const key = perfil?.toLowerCase().replace(/\s+/g, "_") ?? "";
  return PERFIL_BADGE[key] ?? { bg: "#EEF2FF", text: "#4338CA", label: perfil ?? "—" };
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 0", borderBottom: "1px solid #F5F7FB" }}>
      <span style={{ fontSize: 13, color: "var(--text-3)", fontWeight: 500 }}>{label}</span>
      <span style={{ fontSize: 13, color: "var(--text-1)", fontWeight: 600 }}>{value}</span>
    </div>
  );
}

export default async function PerfilPage() {
  const [perfil, portafolio] = await Promise.all([getPerfil(), getPortafolio()]);
  const { estadoCuenta, totalValuacion, cantidadPosiciones } = portafolio;
  const badge = perfilBadge(perfil.perfilInversor);
  const initials = `${perfil.nombre?.[0] ?? ""}${perfil.apellido?.[0] ?? ""}`.toUpperCase();

  return (
    <div style={{ padding: "24px", paddingBottom: 48, display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "var(--text-1)", margin: 0 }}>Mi perfil</h1>
        <p style={{ fontSize: 13, color: "var(--text-3)", margin: "2px 0 0" }}>Datos de tu cuenta en InvertirOnLine</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, alignItems: "start" }}>
        {/* Datos personales */}
        <div style={{ ...cardBase, padding: "28px 28px" }}>
          {/* Avatar + nombre */}
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
            <div style={{
              width: 56, height: 56, borderRadius: "50%", flexShrink: 0,
              background: "linear-gradient(135deg, #4338CA, #818CF8)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "white", fontWeight: 700, fontSize: 20, letterSpacing: -0.5,
            }}>
              {initials || "?"}
            </div>
            <div>
              <div style={{ fontSize: 17, fontWeight: 700, color: "var(--text-1)" }}>
                {perfil.nombre} {perfil.apellido}
              </div>
              <div style={{ fontSize: 12, color: "var(--text-3)", marginTop: 2 }}>{perfil.email}</div>
              <span style={{
                display: "inline-block", marginTop: 6,
                fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 4,
                background: badge.bg, color: badge.text, letterSpacing: 0.4,
              }}>
                {badge.label}
              </span>
            </div>
          </div>

          {/* Datos */}
          <div>
            <Row label="N° de cuenta"  value={perfil.numeroCuenta} />
            <Row label="DNI"           value={perfil.dni} />
            <Row label="CUIT / CUIL"   value={perfil.cuitCuil} />
            <Row label="Email"         value={perfil.email} />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 14 }}>
              <span style={{ fontSize: 13, color: "var(--text-3)", fontWeight: 500 }}>Estado de cuenta</span>
              <span style={{
                fontSize: 11, fontWeight: 700, padding: "3px 8px", borderRadius: 4,
                background: perfil.cuentaAbierta ? "#F0FDF4" : "#FEF2F2",
                color: perfil.cuentaAbierta ? "#15803D" : "#B91C1C",
              }}>
                {perfil.cuentaAbierta ? "Activa" : "Cerrada"}
              </span>
            </div>
          </div>
        </div>

        {/* Resumen de cuenta */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {/* Valuación */}
          <div style={{
            background: "linear-gradient(135deg, #4338CA 0%, #6366F1 100%)",
            borderRadius: 14, padding: "24px 28px", color: "white", position: "relative", overflow: "hidden",
          }}>
            <div style={{ position: "absolute", top: -40, right: -40, width: 140, height: 140, borderRadius: "50%", background: "rgba(255,255,255,0.08)" }} />
            <div style={{ fontSize: 12, fontWeight: 500, opacity: 0.8, marginBottom: 6 }}>Valuación de títulos</div>
            <div style={{ fontSize: 28, fontWeight: 700, fontVariantNumeric: "tabular-nums", letterSpacing: -0.5 }}>
              {fmtMoney(totalValuacion)}
            </div>
            <div style={{ fontSize: 12, opacity: 0.65, marginTop: 6 }}>
              {cantidadPosiciones} posiciones activas
            </div>
          </div>

          {/* Efectivo */}
          {estadoCuenta && (
            <div style={{ ...cardBase, padding: "20px 24px" }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 16 }}>
                Efectivo disponible
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {[
                  { moneda: "ARS", valor: fmtMoney(estadoCuenta.disponibleARS) },
                  { moneda: "USD", valor: fmtUSD(estadoCuenta.disponibleUSD) },
                ].map((r) => (
                  <div key={r.moneda} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 13, color: "var(--text-3)", fontWeight: 500 }}>{r.moneda}</span>
                    <span style={{ fontSize: 16, fontWeight: 700, fontVariantNumeric: "tabular-nums", color: "var(--text-1)" }}>{r.valor}</span>
                  </div>
                ))}
                <div style={{ borderTop: "1px solid #F5F7FB", paddingTop: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 13, color: "var(--text-3)", fontWeight: 500 }}>Total con efectivo</span>
                  <span style={{ fontSize: 16, fontWeight: 700, fontVariantNumeric: "tabular-nums", color: "#4338CA" }}>
                    {fmtMoney(estadoCuenta.totalConEfectivo)}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
