"use client";

import { useState, useMemo } from "react";
import type { DashboardPosicion } from "@/lib/iol-types";

interface Props {
  posiciones: DashboardPosicion[];
  totalValuacion: number;
}

type Density = "compact" | "normal" | "spacious";
type SortBy = "value" | "pnl" | "weight" | "today" | "name";

const TIPO_BADGE: Record<string, { bg: string; text: string }> = {
  cedear:    { bg: "#EEF2FF", text: "#4338CA" },
  accion:    { bg: "#FFF7ED", text: "#C2410C" },
  bono:      { bg: "#F0FDFA", text: "#0D9488" },
  fci:       { bg: "#FFFBEB", text: "#92400E" },
  obligacion:{ bg: "#F5F3FF", text: "#6D28D9" },
  caucion:   { bg: "#ECFEFF", text: "#0E7490" },
  opcion:    { bg: "#FDF2F8", text: "#9D174D" },
};

function getBadge(tipo: string) {
  const key = tipo.toLowerCase();
  for (const [match, style] of Object.entries(TIPO_BADGE)) {
    if (key.includes(match)) return style;
  }
  return { bg: "#F0F2F8", text: "#6E7191" };
}

function tipoLabel(tipo: string): string {
  const key = tipo.toLowerCase();
  if (key.includes("cedear")) return "CEDEAR";
  if (key.includes("accion")) return "Acción";
  if (key.includes("bono")) return "Bono";
  if (key.includes("fci")) return "FCI";
  if (key.includes("obligacion")) return "O.N.";
  if (key.includes("caucion")) return "Cauciones";
  if (key.includes("opcion")) return "Opción";
  return tipo;
}

function fmtMoney(n: number): string {
  return "$" + Math.round(n).toLocaleString("es-AR");
}

function fmtPct(n: number): string {
  return (n >= 0 ? "+" : "") + Math.abs(n).toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + "%";
}

const DENSITY_PY: Record<Density, number> = { compact: 6, normal: 12, spacious: 18 };

const SORT_OPTIONS: { value: SortBy; label: string }[] = [
  { value: "value",  label: "Valuación" },
  { value: "pnl",    label: "P&L %" },
  { value: "weight", label: "Peso" },
  { value: "today",  label: "Hoy" },
  { value: "name",   label: "Nombre" },
];

const TH_STYLE: React.CSSProperties = {
  fontSize: 10, fontWeight: 600, color: "var(--text-3)",
  textTransform: "uppercase", letterSpacing: 0.6,
  padding: "10px 10px", borderBottom: "1px solid var(--border)",
  textAlign: "right", whiteSpace: "nowrap",
};

export function HoldingsTable({ posiciones, totalValuacion }: Props) {
  const [density, setDensity] = useState<Density>("normal");
  const [sortBy, setSortBy] = useState<SortBy>("value");
  const [hovRow, setHovRow] = useState<number | null>(null);

  const sorted = useMemo(() => {
    const arr = [...posiciones];
    switch (sortBy) {
      case "value":  arr.sort((a, b) => b.valuacion - a.valuacion); break;
      case "pnl":    arr.sort((a, b) => b.pnlPorcentaje - a.pnlPorcentaje); break;
      case "weight": arr.sort((a, b) => b.valuacion - a.valuacion); break;
      case "today":  arr.sort((a, b) => b.variacionDiaria - a.variacionDiaria); break;
      case "name":   arr.sort((a, b) => a.ticker.localeCompare(b.ticker)); break;
    }
    return arr;
  }, [posiciones, sortBy]);

  const maxWeight = posiciones.length > 0
    ? Math.max(...posiciones.map((p) => totalValuacion > 0 ? (p.valuacion / totalValuacion) * 100 : 0))
    : 0;

  const py = DENSITY_PY[density];

  const tdBase: React.CSSProperties = {
    paddingTop: py, paddingBottom: py, paddingLeft: 10, paddingRight: 10,
    borderBottom: "1px solid #F5F7FB",
    fontSize: 13, fontVariantNumeric: "tabular-nums",
    textAlign: "right", whiteSpace: "nowrap",
    transition: "padding-top 0.2s ease, padding-bottom 0.2s ease",
  };

  const densityBtnBase: React.CSSProperties = {
    padding: "2px 7px", borderRadius: 4, fontSize: 11, fontWeight: 600,
    cursor: "pointer", border: "1px solid var(--border)", fontFamily: "inherit",
  };

  return (
    <div style={{ background: "white", borderRadius: 14, border: "1px solid var(--border-light)",
        boxShadow: "0 1px 3px rgba(0,0,0,0.04)", overflow: "clip" }}>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "16px 20px", borderBottom: "1px solid var(--border-light)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 15, fontWeight: 600, color: "var(--text-1)" }}>Holdings</span>
          <span style={{ fontSize: 12, color: "var(--text-3)" }}>{posiciones.length} posiciones</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ display: "flex", gap: 4 }}>
            {(["compact", "normal", "spacious"] as Density[]).map((d) => (
              <button key={d} onClick={() => setDensity(d)}
                style={{ ...densityBtnBase,
                  background: density === d ? "#EEF2FF" : "white",
                  color: density === d ? "#4338CA" : "var(--text-3)",
                  borderColor: density === d ? "#C7D2FE" : "var(--border)" }}>
                {d === "compact" ? "C" : d === "normal" ? "N" : "S"}
              </button>
            ))}
          </div>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value as SortBy)}
            style={{ fontSize: 12, color: "var(--text-2)", border: "1px solid var(--border)",
              borderRadius: 6, padding: "3px 8px", background: "white",
              cursor: "pointer", fontFamily: "inherit", outline: "none" }}>
            {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 760 }}>
          <thead style={{ position: "sticky", top: 0, zIndex: 10, background: "white" }}>
            <tr>
              <th style={{ ...TH_STYLE, textAlign: "left", paddingLeft: 20, width: "22%" }}>Activo</th>
              <th style={TH_STYLE}>Cant.</th>
              <th style={TH_STYLE}>Precio</th>
              <th style={TH_STYLE}>Costo</th>
              <th style={TH_STYLE}>Valuación</th>
              <th style={TH_STYLE}>P&L</th>
              <th style={TH_STYLE}>Hoy</th>
              <th style={{ ...TH_STYLE, paddingRight: 20 }}>Peso</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((p, i) => {
              const peso = totalValuacion > 0 ? (p.valuacion / totalValuacion) * 100 : 0;
              const isPos = p.pnlPorcentaje >= 0;
              const hoyPos = p.variacionDiaria >= 0;
              const badge = getBadge(p.tipo);
              return (
                <tr key={p.ticker}
                  onMouseEnter={() => setHovRow(i)}
                  onMouseLeave={() => setHovRow(null)}
                  style={{ background: hovRow === i ? "#FAFBFE" : "transparent" }}>
                  <td style={{ ...tdBase, textAlign: "left", paddingLeft: 20 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <span style={{ fontWeight: 700, fontSize: 13, color: "var(--text-1)" }}>{p.ticker}</span>
                          <span style={{ fontSize: 9, fontWeight: 600, padding: "1px 5px",
                            borderRadius: 3, background: badge.bg, color: badge.text, letterSpacing: 0.3 }}>
                            {tipoLabel(p.tipo)}
                          </span>
                        </div>
                        <div style={{ fontSize: 11, color: "var(--text-3)", marginTop: 1 }}>{p.nombre}</div>
                      </div>
                    </div>
                  </td>
                  <td style={tdBase}>{p.cantidad.toLocaleString("es-AR")}</td>
                  <td style={tdBase}>{fmtMoney(p.precioActual)}</td>
                  <td style={{ ...tdBase, color: "var(--text-3)" }}>{fmtMoney(p.ppc)}</td>
                  <td style={{ ...tdBase, fontWeight: 700 }}>{fmtMoney(p.valuacion)}</td>
                  <td style={tdBase}>
                    <div style={{ fontWeight: 600, color: isPos ? "#059669" : "#EF4444" }}>{fmtPct(p.pnlPorcentaje)}</div>
                    <div style={{ fontSize: 10, color: isPos ? "#059669" : "#EF4444", opacity: 0.65 }}>
                      {p.pnlPesos >= 0 ? "+" : ""}{fmtMoney(p.pnlPesos)}
                    </div>
                  </td>
                  <td style={tdBase}>
                    <span style={{ fontWeight: 600, fontSize: 12, color: hoyPos ? "#059669" : "#EF4444" }}>
                      {fmtPct(p.variacionDiaria)}
                    </span>
                  </td>
                  <td style={{ ...tdBase, paddingRight: 20 }}>
                    <div style={{ fontWeight: 500, fontSize: 12 }}>{peso.toFixed(1)}%</div>
                    <div style={{ height: 3, borderRadius: 2, background: "#EEF2FF", marginTop: 3, width: 56 }}>
                      <div style={{ height: "100%", borderRadius: 2, background: "#6366F1",
                        width: (maxWeight > 0 ? (peso / maxWeight) * 100 : 0) + "%",
                        transition: "width 0.3s ease" }} />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
