"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import type { DashboardPosicion } from "@/lib/iol-types";

interface Props {
  posiciones: DashboardPosicion[];
  totalValuacion: number;
}

type Density = "compact" | "normal" | "spacious";
type SortBy = "name" | "cantidad" | "precio" | "costo" | "valuacion" | "pnl" | "hoy" | "peso";
type SortDir = "asc" | "desc";
type ColKey = "cantidad" | "precio" | "costo" | "valuacion" | "pnl" | "hoy" | "peso";

const ALL_COLS: { key: ColKey; label: string }[] = [
  { key: "cantidad",  label: "Cant." },
  { key: "precio",    label: "Precio" },
  { key: "costo",     label: "Costo" },
  { key: "valuacion", label: "Valuación" },
  { key: "pnl",       label: "P&L" },
  { key: "hoy",       label: "Hoy" },
  { key: "peso",      label: "Peso" },
];

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


const TH_STYLE: React.CSSProperties = {
  fontSize: 10, fontWeight: 600, color: "var(--text-3)",
  textTransform: "uppercase", letterSpacing: 0.6,
  padding: "10px 10px", borderBottom: "1px solid var(--border)",
  textAlign: "right", whiteSpace: "nowrap",
};

export function HoldingsTable({ posiciones, totalValuacion }: Props) {
  const [density, setDensity] = useState<Density>("normal");
  const [sortBy, setSortBy] = useState<SortBy>("valuacion");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [hovRow, setHovRow] = useState<number | null>(null);

  function toggleSort(col: SortBy) {
    if (sortBy === col) {
      setSortDir((d) => (d === "desc" ? "asc" : "desc"));
    } else {
      setSortBy(col);
      setSortDir("desc");
    }
  }
  const [visibleCols, setVisibleCols] = useState<Set<ColKey>>(
    new Set<ColKey>(["cantidad", "precio", "costo", "valuacion", "pnl", "hoy", "peso"])
  );
  const [colsOpen, setColsOpen] = useState(false);
  const colsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!colsOpen) return;
    function handleClick(e: MouseEvent) {
      if (colsRef.current && !colsRef.current.contains(e.target as Node)) setColsOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [colsOpen]);

  function toggleCol(key: ColKey) {
    setVisibleCols((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  const col = (key: ColKey) => visibleCols.has(key);

  const sorted = useMemo(() => {
    const arr = [...posiciones];
    const mul = sortDir === "asc" ? 1 : -1;
    arr.sort((a, b) => {
      switch (sortBy) {
        case "name":      return mul * a.ticker.localeCompare(b.ticker);
        case "cantidad":  return mul * (a.cantidad - b.cantidad);
        case "precio":    return mul * (a.precioActual - b.precioActual);
        case "costo":     return mul * (a.ppc - b.ppc);
        case "valuacion": return mul * (a.valuacion - b.valuacion);
        case "pnl":       return mul * (a.pnlPorcentaje - b.pnlPorcentaje);
        case "hoy":       return mul * (a.variacionDiaria - b.variacionDiaria);
        case "peso":      return mul * (a.valuacion - b.valuacion);
        default:          return 0;
      }
    });
    return arr;
  }, [posiciones, sortBy, sortDir]);

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
          {/* Columnas toggle */}
          <div ref={colsRef} style={{ position: "relative" }}>
            <button
              onClick={() => setColsOpen((o) => !o)}
              style={{ ...densityBtnBase, padding: "3px 10px", fontSize: 12, fontWeight: 500,
                background: colsOpen ? "#EEF2FF" : "white",
                color: colsOpen ? "#4338CA" : "var(--text-2)",
                borderColor: colsOpen ? "#C7D2FE" : "var(--border)" }}
            >
              Columnas ▾
            </button>
            {colsOpen && (
              <div style={{
                position: "absolute", right: 0, top: "calc(100% + 6px)", zIndex: 50,
                background: "white", border: "1px solid var(--border)",
                borderRadius: 10, boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
                padding: "8px 4px", minWidth: 140,
              }}>
                {ALL_COLS.map(({ key, label }) => (
                  <label key={key} style={{
                    display: "flex", alignItems: "center", gap: 8,
                    padding: "6px 12px", cursor: "pointer", borderRadius: 6,
                    fontSize: 13, color: "var(--text-1)",
                  }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "#F5F7FB")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  >
                    <input
                      type="checkbox"
                      checked={visibleCols.has(key)}
                      onChange={() => toggleCol(key)}
                      style={{ accentColor: "#6366F1", width: 14, height: 14, cursor: "pointer" }}
                    />
                    {label}
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 760 }}>
          <thead style={{ position: "sticky", top: 0, zIndex: 10, background: "white" }}>
            <tr>
              {(() => {
                const thSort = (key: SortBy, label: string, extra?: React.CSSProperties) => (
                  <th
                    onClick={() => toggleSort(key)}
                    style={{ ...TH_STYLE, cursor: "pointer", userSelect: "none", ...extra }}
                  >
                    {label}
                    <span style={{ marginLeft: 3, opacity: sortBy === key ? 1 : 0.3 }}>
                      {sortBy === key ? (sortDir === "desc" ? "↓" : "↑") : "↕"}
                    </span>
                  </th>
                );
                return (
                  <>
                    {thSort("name", "Activo", { textAlign: "left", paddingLeft: 20, width: "22%" })}
                    {col("cantidad")  && thSort("cantidad",  "Cant.")}
                    {col("precio")    && thSort("precio",    "Precio")}
                    {col("costo")     && thSort("costo",     "Costo")}
                    {col("valuacion") && thSort("valuacion", "Valuación")}
                    {col("pnl")       && thSort("pnl",       "P&L")}
                    {col("hoy")       && thSort("hoy",       "Hoy")}
                    {col("peso")      && thSort("peso",      "Peso", { paddingRight: 20 })}
                  </>
                );
              })()}
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
                  {col("cantidad")  && <td style={tdBase}>{p.cantidad.toLocaleString("es-AR")}</td>}
                  {col("precio")    && <td style={tdBase}>{fmtMoney(p.precioActual)}</td>}
                  {col("costo")     && <td style={{ ...tdBase, color: "var(--text-3)" }}>{fmtMoney(p.ppc)}</td>}
                  {col("valuacion") && <td style={{ ...tdBase, fontWeight: 700 }}>{fmtMoney(p.valuacion)}</td>}
                  {col("pnl") && (
                    <td style={tdBase}>
                      <div style={{ fontWeight: 600, color: isPos ? "#059669" : "#EF4444" }}>{fmtPct(p.pnlPorcentaje)}</div>
                      <div style={{ fontSize: 10, color: isPos ? "#059669" : "#EF4444", opacity: 0.65 }}>
                        {p.pnlPesos >= 0 ? "+" : ""}{fmtMoney(p.pnlPesos)}
                      </div>
                    </td>
                  )}
                  {col("hoy") && (
                    <td style={tdBase}>
                      <span style={{ fontWeight: 600, fontSize: 12, color: hoyPos ? "#059669" : "#EF4444" }}>
                        {fmtPct(p.variacionDiaria)}
                      </span>
                    </td>
                  )}
                  {col("peso") && (
                    <td style={{ ...tdBase, paddingRight: 20 }}>
                      <div style={{ fontWeight: 500, fontSize: 12 }}>{peso.toFixed(1)}%</div>
                      <div style={{ height: 3, borderRadius: 2, background: "#EEF2FF", marginTop: 3, width: 56 }}>
                        <div style={{ height: "100%", borderRadius: 2, background: "#6366F1",
                          width: (maxWeight > 0 ? (peso / maxWeight) * 100 : 0) + "%",
                          transition: "width 0.3s ease" }} />
                      </div>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
