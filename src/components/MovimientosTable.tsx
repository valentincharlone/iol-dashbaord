"use client";

import { useState, useMemo } from "react";
import type { IOLOperacion } from "@/lib/iol-types";

interface Props {
  operaciones: IOLOperacion[];
}

function fmtMoney(n: number, moneda?: string | null) {
  const prefix = moneda?.toLowerCase().includes("dolar") ? "US$" : "$";
  return prefix + Math.abs(n).toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function fmtPrecio(n: number) {
  return "$" + n.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function isDividendo(tipo: string) {
  return tipo.toLowerCase().includes("dividendo");
}

function fmtFecha(iso: string) {
  try {
    const d = new Date(iso);
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
  } catch {
    return iso;
  }
}

function getTipoStyle(tipo: string): { bg: string; text: string; label: string } {
  const key = tipo.toLowerCase();
  if (key === "compra")                return { bg: "#F0FDF4", text: "#16A34A", label: "Compra" };
  if (key === "venta")                 return { bg: "#FFF1F2", text: "#DC2626", label: "Venta" };
  if (key.includes("dividendo"))       return { bg: "#FFFBEB", text: "#92400E", label: "Dividendo" };
  if (key.includes("acreditacion"))    return { bg: "#EEF2FF", text: "#4338CA", label: "Acreditación" };
  if (key.includes("transferencia"))   return { bg: "#F5F3FF", text: "#6D28D9", label: "Transferencia" };
  return { bg: "#F0F2F8", text: "#6E7191", label: tipo };
}

const ESTADO_STYLE: Record<string, { color: string }> = {
  terminada: { color: "#059669" },
  pendiente: { color: "#D97706" },
  cancelada: { color: "#EF4444" },
};

function getEstadoStyle(estado: string) {
  return ESTADO_STYLE[estado.toLowerCase()] ?? { color: "var(--text-3)" };
}

const TH: React.CSSProperties = {
  fontSize: 10, fontWeight: 600, color: "var(--text-3)",
  textTransform: "uppercase", letterSpacing: 0.6,
  padding: "10px 12px", borderBottom: "1px solid var(--border)",
  textAlign: "right", whiteSpace: "nowrap",
};

const PERIODOS = [
  { label: "1 mes",   days: 30 },
  { label: "3 meses", days: 90 },
  { label: "6 meses", days: 180 },
  { label: "Todo",    days: 0 },
];


export function MovimientosTable({ operaciones }: Props) {
  const [tipoFiltro, setTipoFiltro] = useState<"todos" | "compra" | "venta">("todos");
  const [periodo, setPeriodo] = useState(0); // índice de PERIODOS
  const [search, setSearch] = useState("");
  const [hovRow, setHovRow] = useState<number | null>(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const days = PERIODOS[periodo].days;
    const cutoff = days > 0 ? Date.now() - days * 86_400_000 : 0;

    return operaciones.filter((op) => {
      if (tipoFiltro !== "todos" && op.tipo.toLowerCase() !== tipoFiltro) return false;
      if (cutoff > 0 && new Date(op.fechaOrden).getTime() < cutoff) return false;
      if (q && !op.simbolo.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [operaciones, tipoFiltro, periodo, search]);

  const tdBase: React.CSSProperties = {
    padding: "12px 12px", borderBottom: "1px solid #F5F7FB",
    fontSize: 13, fontVariantNumeric: "tabular-nums",
    textAlign: "right", whiteSpace: "nowrap",
  };

  const filterBtn = (active: boolean): React.CSSProperties => ({
    padding: "5px 14px", borderRadius: 6, fontSize: 12, fontWeight: 500,
    cursor: "pointer", border: "1px solid var(--border)", fontFamily: "inherit",
    background: active ? "#EEF2FF" : "white",
    color: active ? "#4338CA" : "var(--text-2)",
    borderColor: active ? "#C7D2FE" : "var(--border)",
  });

  return (
    <div style={{ background: "white", borderRadius: 14, border: "1px solid var(--border-light)",
        boxShadow: "0 1px 3px rgba(0,0,0,0.04)", overflow: "clip" }}>

      <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border-light)",
          display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 15, fontWeight: 600, color: "var(--text-1)" }}>Movimientos</span>
          <span style={{ fontSize: 12, color: "var(--text-3)" }}>{filtered.length} operaciones</span>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
          <div style={{ display: "flex", gap: 4 }}>
            {(["todos", "compra", "venta"] as const).map((t) => (
              <button key={t} onClick={() => setTipoFiltro(t)} style={filterBtn(tipoFiltro === t)}>
                {t === "todos" ? "Todos" : t === "compra" ? "Compras" : "Ventas"}
              </button>
            ))}
          </div>
          <div style={{ display: "flex", gap: 4 }}>
            {PERIODOS.map((p, idx) => (
              <button key={p.label} onClick={() => setPeriodo(idx)} style={filterBtn(periodo === idx)}>
                {p.label}
              </button>
            ))}
          </div>
          <input
            type="text"
            placeholder="Buscar ticker…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              fontSize: 13, padding: "5px 12px", borderRadius: 8,
              border: "1px solid var(--border)", outline: "none",
              fontFamily: "inherit", color: "var(--text-1)", width: 160,
            }}
          />
        </div>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 760 }}>
          <thead style={{ position: "sticky", top: 0, zIndex: 10, background: "white" }}>
            <tr>
              <th style={{ ...TH, textAlign: "left", paddingLeft: 20 }}>Fecha</th>
              <th style={{ ...TH, textAlign: "left" }}>Tipo</th>
              <th style={{ ...TH, textAlign: "left" }}>Activo</th>
              <th style={TH}>Cantidad</th>
              <th style={TH}>Precio</th>
              <th style={TH}>Total</th>
              <th style={{ ...TH, paddingRight: 20 }}>Estado</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((op, i) => {
              const tipoStyle = getTipoStyle(op.tipo);
              const estadoStyle = getEstadoStyle(op.estado);
              return (
                <tr
                  key={op.numero}
                  onMouseEnter={() => setHovRow(i)}
                  onMouseLeave={() => setHovRow(null)}
                  style={{ background: hovRow === i ? "#FAFBFE" : "transparent" }}
                >
                  <td style={{ ...tdBase, textAlign: "left", paddingLeft: 20, color: "var(--text-2)" }}>
                    {fmtFecha(op.fechaOrden)}
                  </td>
                  <td style={{ ...tdBase, textAlign: "left" }}>
                    <span style={{
                      fontSize: 11, fontWeight: 600, padding: "2px 8px",
                      borderRadius: 4, background: tipoStyle.bg, color: tipoStyle.text,
                    }}>
                      {tipoStyle.label}
                    </span>
                  </td>
                  <td style={{ ...tdBase, textAlign: "left" }}>
                    <span style={{ fontWeight: 700, fontSize: 13, color: "var(--text-1)" }}>
                      {op.simbolo}
                    </span>
                    <div style={{ fontSize: 11, color: "var(--text-3)", marginTop: 1 }}>
                      {op.mercado}
                    </div>
                  </td>
                  <td style={{ ...tdBase, color: isDividendo(op.tipo) ? "var(--text-3)" : undefined }}>
                    {isDividendo(op.tipo) ? "—" : ((op.cantidadOperada || op.cantidad) ?? 0).toLocaleString("es-AR")}
                  </td>
                  <td style={{ ...tdBase, color: isDividendo(op.tipo) ? "var(--text-3)" : undefined }}>
                    {isDividendo(op.tipo) ? "—" : fmtPrecio(op.precioOperado || op.precio || 0)}
                  </td>
                  <td style={{ ...tdBase, fontWeight: 700, color: isDividendo(op.tipo) ? "#059669" : undefined }}>
                    {(op.montoOperado || op.monto)
                      ? fmtMoney(op.montoOperado || op.monto || 0, op.moneda)
                      : "—"}
                  </td>
                  <td style={{ ...tdBase, paddingRight: 20, fontWeight: 500, color: estadoStyle.color }}>
                    {op.estado}
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} style={{ padding: "32px", textAlign: "center", fontSize: 13, color: "var(--text-3)" }}>
                  No hay operaciones para los filtros seleccionados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
