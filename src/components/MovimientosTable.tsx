"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import type { IOLOperacion } from "@/lib/iol-types";
import { getTipoCls, getEstadoCls } from "@/lib/operacion";
import { OperacionDrawer } from "./OperacionDrawer";

interface Props {
  operaciones: IOLOperacion[];
  defaultDesde: string;
  defaultHasta: string;
}

function fmtMoney(n: number, moneda?: string | null) {
  const prefix = moneda?.toLowerCase().includes("dolar") ? "US$" : "$";
  return (
    prefix +
    Math.abs(n).toLocaleString("es-AR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  );
}

function fmtPrecio(n: number) {
  return (
    "$" +
    n.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  );
}

function isDividendo(tipo: string) {
  return tipo.toLowerCase().includes("dividendo");
}

function fmtFecha(iso: string) {
  try {
    const d = new Date(iso);
    const p = (n: number) => String(n).padStart(2, "0");
    return `${p(d.getDate())}/${p(d.getMonth() + 1)}/${d.getFullYear()} ${p(d.getHours())}:${p(d.getMinutes())}`;
  } catch {
    return iso;
  }
}


type SortCol = "fecha" | "activo" | "total";
type SortDir = "asc" | "desc";

const PERIODOS = [
  { label: "1 mes",   days: 30  },
  { label: "3 meses", days: 90  },
  { label: "6 meses", days: 180 },
  { label: "Todo",    days: 0   },
];

function toDateInput(d: Date) {
  return d.toISOString().split("T")[0];
}

const TH_BASE   = "text-[10px] font-semibold text-text3 uppercase tracking-[0.6px] py-2.5 px-3 border-b border-border whitespace-nowrap cursor-pointer select-none";
const TD_BASE   = "py-3 px-3 border-b border-[#F5F7FB] text-[13px] tabular-nums text-right whitespace-nowrap";
const TD_LEFT   = "py-3 px-3 border-b border-[#F5F7FB] text-[13px] tabular-nums text-left  whitespace-nowrap";

function filterBtnCls(active: boolean) {
  return `px-3.5 py-[5px] rounded-md text-[12px] font-medium cursor-pointer border font-[inherit] transition-colors ${
    active
      ? "bg-brand-muted text-brand border-[#C7D2FE]"
      : "bg-white text-text2 border-border hover:bg-[#F5F6FA]"
  }`;
}

export function MovimientosTable({ operaciones, defaultDesde, defaultHasta }: Props) {
  const router = useRouter();
  const [tipoFiltro, setTipoFiltro] = useState<"todos" | "compra" | "venta">("todos");
  const [activePeriod, setActivePeriod] = useState<number | null>(null);
  const [desde, setDesde] = useState(defaultDesde);
  const [hasta, setHasta] = useState(defaultHasta);
  const [search, setSearch] = useState("");
  const [sortCol, setSortCol] = useState<SortCol>("fecha");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [hovRow, setHovRow] = useState<number | null>(null);
  const [selectedNumero, setSelectedNumero] = useState<number | null>(null);

  function toggleSort(col: SortCol) {
    if (sortCol === col) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortCol(col); setSortDir(col === "fecha" ? "desc" : "asc"); }
  }

  function applyPeriod(idx: number) {
    setActivePeriod(idx);
    const { days } = PERIODOS[idx];
    const newDesde = days === 0 ? "" : toDateInput(new Date(Date.now() - days * 86_400_000));
    setDesde(newDesde);
    setHasta("");
    const params = new URLSearchParams();
    if (newDesde) params.set("desde", newDesde);
    router.push(`/dashboard/movimientos?${params.toString()}`);
  }

  function buscar() {
    setActivePeriod(null);
    const params = new URLSearchParams();
    if (desde) params.set("desde", desde);
    if (hasta) params.set("hasta", hasta);
    router.push(`/dashboard/movimientos?${params.toString()}`);
  }

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const rows = operaciones.filter((op) => {
      if (tipoFiltro !== "todos" && op.tipo.toLowerCase() !== tipoFiltro) return false;
      if (q && !op.simbolo.toLowerCase().includes(q)) return false;
      return true;
    });
    const mul = sortDir === "asc" ? 1 : -1;
    rows.sort((a, b) => {
      if (sortCol === "fecha")
        return mul * (new Date(a.fechaOrden).getTime() - new Date(b.fechaOrden).getTime());
      if (sortCol === "activo") return mul * a.simbolo.localeCompare(b.simbolo);
      if (sortCol === "total")
        return mul * ((a.montoOperado || a.monto || 0) - (b.montoOperado || b.monto || 0));
      return 0;
    });
    return rows;
  }, [operaciones, tipoFiltro, search, sortCol, sortDir]);

  function sortIcon(col: SortCol) {
    if (sortCol !== col) return <span className="ml-0.5 opacity-30 text-[10px]">↕</span>;
    return <span className="ml-0.5 text-[10px]">{sortDir === "asc" ? "↑" : "↓"}</span>;
  }

  const dateCls = "text-[12px] px-2 py-[5px] rounded-lg border border-border outline-none font-[inherit] text-text1 focus:border-brand transition-colors";

  return (
    <>
    <OperacionDrawer numero={selectedNumero} onClose={() => setSelectedNumero(null)} />
    <div className="bg-white rounded-card shadow-sm overflow-clip">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-border-light gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="text-[15px] font-semibold text-text1">Movimientos</span>
          <span className="text-[12px] text-text3">{filtered.length} operaciones</span>
        </div>

        <div className="flex gap-2 items-center flex-wrap">
          {/* Filtro tipo */}
          <div className="flex gap-1">
            {(["todos", "compra", "venta"] as const).map((t) => (
              <button key={t} onClick={() => setTipoFiltro(t)} className={filterBtnCls(tipoFiltro === t)}>
                {t === "todos" ? "Todos" : t === "compra" ? "Compras" : "Ventas"}
              </button>
            ))}
          </div>

          {/* Períodos */}
          <div className="flex gap-1">
            {PERIODOS.map((p, idx) => (
              <button key={p.label} onClick={() => applyPeriod(idx)} className={filterBtnCls(activePeriod === idx)}>
                {p.label}
              </button>
            ))}
          </div>

          {/* Rango de fechas */}
          <div className="flex items-center gap-1.5">
            <input
              type="date"
              value={desde}
              onChange={(e) => setDesde(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && buscar()}
              className={dateCls}
            />
            <span className="text-[12px] text-text3">—</span>
            <input
              type="date"
              value={hasta}
              onChange={(e) => setHasta(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && buscar()}
              className={dateCls}
            />
            <button
              onClick={buscar}
              className="px-3.5 py-[5px] rounded-md text-[12px] font-semibold cursor-pointer border border-[#C7D2FE] font-[inherit] bg-brand-muted text-brand"
            >
              Buscar
            </button>
          </div>

          {/* Buscar ticker */}
          <input
            type="text"
            placeholder="Buscar ticker…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="text-[13px] px-3 py-[5px] rounded-lg border border-border outline-none font-[inherit] text-text1 w-[140px] focus:border-brand transition-colors"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse" style={{ minWidth: 760 }}>
          <thead className="sticky top-0 z-10 bg-white">
            <tr>
              <th onClick={() => toggleSort("fecha")}  className={`${TH_BASE} text-left pl-5`}>
                Fecha{sortIcon("fecha")}
              </th>
              <th className={`${TH_BASE} text-left`}>Tipo</th>
              <th onClick={() => toggleSort("activo")} className={`${TH_BASE} text-left`}>
                Activo{sortIcon("activo")}
              </th>
              <th className={`${TH_BASE} text-right`}>Cantidad</th>
              <th className={`${TH_BASE} text-right`}>Precio</th>
              <th onClick={() => toggleSort("total")}  className={`${TH_BASE} text-right`}>
                Total{sortIcon("total")}
              </th>
              <th className={`${TH_BASE} text-right pr-5`}>Estado</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((op, i) => {
              const { cls: tipoCls, label: tipoLabel } = getTipoCls(op.tipo);
              const estadoCls = getEstadoCls(op.estado);
              return (
                <tr
                  key={op.numero}
                  onClick={() => setSelectedNumero(op.numero)}
                  onMouseEnter={() => setHovRow(i)}
                  onMouseLeave={() => setHovRow(null)}
                  className={`cursor-pointer ${hovRow === i ? "bg-[#FAFBFE]" : "bg-transparent"}`}
                >
                  <td className={`${TD_LEFT} pl-5 text-text2`}>{fmtFecha(op.fechaOrden)}</td>
                  <td className={TD_LEFT}>
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-[4px] ${tipoCls}`}>
                      {tipoLabel}
                    </span>
                  </td>
                  <td className={TD_LEFT}>
                    <span className="font-bold text-[13px] text-text1">{op.simbolo}</span>
                    <div className="text-[11px] text-text3 mt-px">{op.mercado}</div>
                  </td>
                  <td className={`${TD_BASE} ${isDividendo(op.tipo) ? "text-text3" : ""}`}>
                    {isDividendo(op.tipo)
                      ? "—"
                      : ((op.cantidadOperada || op.cantidad) ?? 0).toLocaleString("es-AR")}
                  </td>
                  <td className={`${TD_BASE} ${isDividendo(op.tipo) ? "text-text3" : ""}`}>
                    {isDividendo(op.tipo) ? "—" : fmtPrecio(op.precioOperado || op.precio || 0)}
                  </td>
                  <td className={`${TD_BASE} font-bold ${isDividendo(op.tipo) ? "text-profit" : ""}`}>
                    {op.montoOperado || op.monto
                      ? fmtMoney(op.montoOperado || op.monto || 0, op.moneda)
                      : "—"}
                  </td>
                  <td className={`${TD_BASE} pr-5 font-medium ${estadoCls}`}>{op.estado}</td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="py-8 text-center text-[13px] text-text3">
                  No hay operaciones para los filtros seleccionados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
    </>
  );
}
