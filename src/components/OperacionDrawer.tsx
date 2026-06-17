"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { getOperacionDetalle } from "@/lib/iol-actions";
import type { IOLOperacionDetalle } from "@/lib/iol-types";
import { getTipoCls, getEstadoCls } from "@/lib/operacion";

function fmtFecha(iso?: string | null) {
  if (!iso) return "—";
  try {
    const d = new Date(iso);
    const p = (n: number) => String(n).padStart(2, "0");
    return `${p(d.getDate())}/${p(d.getMonth() + 1)}/${d.getFullYear()} ${p(d.getHours())}:${p(d.getMinutes())}`;
  } catch {
    return iso;
  }
}

function fmtNum(n: number | null | undefined, prefix = "$") {
  if (n == null) return "—";
  return prefix + Math.abs(n).toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function fmtCant(n: number | null | undefined) {
  if (n == null) return "—";
  return n.toLocaleString("es-AR");
}

const ENUM_LABELS: Record<string, string> = {
  precio_limite:          "Precio límite",
  precio_mercado:         "Precio mercado",
  a24horas:               "24 horas",
  a48horas:               "48 horas",
  a72horas:               "72 horas",
  inmediata:              "Inmediata",
  sinvalor:               "—",
  peso_argentino:         "Peso argentino",
  dolar_estadounidense:   "Dólar estadounidense",
  dolar_bna:              "Dólar BNA",
  dolar_bolsa:            "Dólar bolsa",
};

function fmtEnum(s: string | null | undefined) {
  if (!s) return "—";
  return ENUM_LABELS[s.toLowerCase()] ?? s.replace(/_/g, " ");
}

const ESTADO_LABELS: Record<string, string> = {
  iniciada:                                              "Iniciada",
  en_proceso:                                            "En proceso",
  parcialmente_terminada:                                "Parcialmente terminada",
  terminada:                                             "Terminada",
  cancelada:                                             "Cancelada",
  pendiente_cancelacion:                                 "Pendiente de cancelación",
  cancelada_por_vencimiento_validez:                     "Cancelada por vencimiento",
  parcialmente_terminada_con_pedido_cancelacion:         "Parcial con cancelación",
  en_modificacion:                                       "En modificación",
};

function fmtEstado(s: string | null | undefined) {
  if (!s) return "—";
  return ESTADO_LABELS[s.toLowerCase()] ?? s.replace(/_/g, " ");
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-4">
      <div className="text-[10px] font-semibold text-text3 uppercase tracking-wide mb-2">{title}</div>
      {children}
    </div>
  );
}

function Row({ label, value, mono = false }: { label: string; value: React.ReactNode; mono?: boolean }) {
  return (
    <div className="flex justify-between items-start py-3 border-b border-[#F5F7FB] last:border-0 gap-4">
      <span className="text-[12px] text-text3 font-medium shrink-0">{label}</span>
      <span className={`text-[13px] text-text1 font-semibold text-right ${mono ? "tabular-nums" : ""}`}>
        {value}
      </span>
    </div>
  );
}

interface Props {
  numero: number | null;
  onClose: () => void;
}

export function OperacionDrawer({ numero, onClose }: Props) {
  const [op, setOp] = useState<IOLOperacionDetalle | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (numero == null) { setOp(null); return; }
    setLoading(true);
    setError(false);
    getOperacionDetalle(numero)
      .then(setOp)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [numero]);

  useEffect(() => {
    if (numero == null) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [numero, onClose]);

  const open = numero != null;

  return (
    <>
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-black/30 backdrop-blur-sm z-40 transition-opacity duration-200 ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
      />

      <div
        className={`fixed top-0 right-0 h-screen w-full max-w-[400px] bg-white z-50 flex flex-col shadow-[-8px_0_32px_rgba(0,0,0,0.08)] transition-transform duration-200 ease-in-out ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div>
            <div className="text-[15px] font-bold text-text1">Operación #{numero}</div>
            <div className="text-[12px] text-text3 mt-0.5">Detalle completo</div>
          </div>
          <button onClick={onClose} className="text-text3 hover:text-text1 transition-colors p-1">
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {loading && (
            <div className="flex flex-col gap-3 pt-2">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="flex justify-between py-3 border-b border-[#F5F7FB]">
                  <div className="shimmer h-3.5 w-24" />
                  <div className="shimmer h-3.5 w-28" />
                </div>
              ))}
            </div>
          )}

          {error && (
            <p className="text-[13px] text-text3 text-center pt-8">
              No se pudo cargar el detalle de la operación.
            </p>
          )}

          {op && !loading && (() => {
            const { cls: tipoCls, label: tipoLabel } = getTipoCls(op.tipo);
            const estadoCls = getEstadoCls(op.estadoActual);
            const monedaPrefix = op.moneda?.toLowerCase().includes("dolar") ? "US$" : "$";
            const isDividendo = !op.tipo || op.tipo === "";
            const aranceles = op.aranceles?.filter(a => a.neto !== 0) ?? [];

            return (
              <div>
                <div className="flex items-center gap-2 mb-5 pt-1">
                  <span className={`text-[12px] font-semibold px-2.5 py-1 rounded-md ${tipoCls}`}>
                    {tipoLabel || "Acreditación"}
                  </span>
                  <span className={`text-[13px] font-semibold ${estadoCls}`}>
                    {fmtEstado(op.estadoActual)}
                  </span>
                </div>

                <div className="bg-[#F8F9FE] rounded-xl p-4 mb-1">
                  <div className="text-[20px] font-bold text-text1">{op.simbolo}</div>
                  <div className="text-[12px] text-text3 mt-0.5">{op.mercado}</div>
                </div>

                <Section title="Fechas">
                  <Row label="Fecha de alta"   value={fmtFecha(op.fechaAlta)}    />
                  <Row label="Fecha operada"   value={fmtFecha(op.fechaOperado)} />
                  {op.validez && <Row label="Validez hasta" value={fmtFecha(op.validez)} />}
                </Section>

                {!isDividendo && (
                  <Section title="Cantidades y precios">
                    <Row label="Cantidad" value={fmtCant(op.cantidad)} mono />
                    <Row label="Precio"   value={fmtNum(op.precio, monedaPrefix)} mono />
                  </Section>
                )}

                <Section title="Totales">
                  <Row label="Monto"            value={fmtNum(op.monto, monedaPrefix)}           mono />
                  <Row label="Monto operado"    value={fmtNum(op.montoOperacion, monedaPrefix)}  mono />
                  {op.fondosParaOperacion != null && (
                    <Row label="Fondos requeridos" value={fmtNum(op.fondosParaOperacion, monedaPrefix)} mono />
                  )}
                </Section>

                {aranceles.length > 0 && (
                  <Section title="Aranceles">
                    {aranceles.map((a, i) => (
                      <Row
                        key={i}
                        label={a.tipo || "Arancel"}
                        value={fmtNum(a.neto + a.iva, a.moneda?.toLowerCase().includes("dolar") ? "US$" : "$")}
                        mono
                      />
                    ))}
                    {op.arancelesARS != null && op.arancelesARS !== 0 && (
                      <Row label="Total ARS" value={fmtNum(op.arancelesARS)} mono />
                    )}
                    {op.arancelesUSD != null && op.arancelesUSD !== 0 && (
                      <Row label="Total USD" value={fmtNum(op.arancelesUSD, "US$")} mono />
                    )}
                  </Section>
                )}

                {!isDividendo && (
                  <Section title="Condiciones">
                    <Row label="Modalidad" value={fmtEnum(op.modalidad)} />
                    <Row label="Plazo"     value={fmtEnum(op.plazo)} />
                    <Row label="Moneda"    value={fmtEnum(op.moneda)} />
                  </Section>
                )}
              </div>
            );
          })()}
        </div>
      </div>
    </>
  );
}
