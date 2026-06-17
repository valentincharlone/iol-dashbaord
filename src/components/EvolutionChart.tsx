"use client";

import { useState } from "react";

/* ─── Tipos ─── */
type Period = "1M" | "3M" | "6M" | "1A";

const MONTHS = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];

/* ─── Configuración por período ─── */
const PERIOD_CONFIG: Record<Period, { startRatio: number; curve: number[] }> = {
  "1M": {
    startRatio: 0.964,
    curve: [0, 0.18, 0.42, 0.71, 1.0],
  },
  "3M": {
    startRatio: 0.895,
    curve: [0, 0.09, 0.22, 0.38, 0.60, 0.80, 1.0],
  },
  "6M": {
    startRatio: 0.78,
    curve: [0, 0.08, 0.17, 0.31, 0.53, 0.79, 1.0],
  },
  "1A": {
    startRatio: 0.65,
    curve: [0, 0.074, 0.040, 0.116, 0.159, 0.210, 0.233, 0.181, 0.304, 0.353, 0.424, 1.0],
  },
};

/* ─── Generadores de etiquetas ─── */
function monthLabels(count: number): string[] {
  const today = new Date();
  return Array.from({ length: count }, (_, i) => {
    const d = new Date(today.getFullYear(), today.getMonth() - (count - 1 - i), 1);
    return MONTHS[d.getMonth()];
  });
}

function weekLabels(count: number): string[] {
  const today = new Date();
  return Array.from({ length: count }, (_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() - (count - 1 - i) * 7);
    return `${d.getDate()}/${d.getMonth() + 1}`;
  });
}

function generateHistory(current: number, period: Period) {
  const { startRatio, curve } = PERIOD_CONFIG[period];
  const labels = period === "1M" ? weekLabels(curve.length) : monthLabels(curve.length);
  const start = current * startRatio;
  const range = current - start;
  return labels.map((label, i) => ({
    label,
    value: Math.round(start + curve[i] * range),
  }));
}

/* ─── Helpers de formato ─── */
function fmtShort(n: number): string {
  if (n >= 1_000_000)
    return "$" + (n / 1_000_000).toLocaleString("es-AR", { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + "M";
  if (n >= 1_000)
    return "$" + Math.round(n / 1000).toLocaleString("es-AR") + "K";
  return "$" + Math.round(n).toLocaleString("es-AR");
}

function fmtMoney(n: number): string {
  return "$" + Math.round(n).toLocaleString("es-AR");
}

/* ─── Catmull-Rom spline ─── */
function smoothLine(pts: { x: number; y: number }[]): string {
  if (pts.length < 2) return "";
  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[Math.min(pts.length - 1, i + 2)];
    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${cp1x.toFixed(2)} ${cp1y.toFixed(2)}, ${cp2x.toFixed(2)} ${cp2y.toFixed(2)}, ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`;
  }
  return d;
}

/* ─── Componente ─── */
interface Props {
  totalValuacion: number;
}

const PERIODS: Period[] = ["1M", "3M", "6M", "1A"];

export function EvolutionChart({ totalValuacion }: Props) {
  const [period, setPeriod] = useState<Period>("1A");
  const [hovIdx, setHovIdx] = useState<number | null>(null);

  const data = generateHistory(totalValuacion, period);

  const W = 640, H = 220;
  const PX = 52, PR = 16, PT = 16, PB = 28;
  const cW = W - PX - PR;
  const cH = H - PT - PB;

  const values = data.map((d) => d.value);
  const minV = Math.min(...values) * 0.94;
  const maxV = Math.max(...values) * 1.03;

  const toX = (i: number) => PX + (i / (data.length - 1)) * cW;
  const toY = (v: number) => PT + (1 - (v - minV) / (maxV - minV)) * cH;

  const points = data.map((d, i) => ({ x: toX(i), y: toY(d.value) }));
  const linePath = smoothLine(points);
  const areaPath =
    linePath +
    ` L ${points[points.length - 1].x} ${PT + cH}` +
    ` L ${points[0].x} ${PT + cH} Z`;

  const gridLines = Array.from({ length: 5 }, (_, i) => ({
    y: PT + (i / 4) * cH,
    label: fmtShort(maxV - (i / 4) * (maxV - minV)),
  }));

  const last = points[points.length - 1];
  const zoneW = cW / data.length;
  const font = "var(--font-jakarta), system-ui, sans-serif";

  return (
    <div>
      {/* Filtros de período */}
      <div style={{ display: "flex", gap: 2, marginBottom: 16 }}>
        {PERIODS.map((p) => (
          <button
            key={p}
            onClick={() => { setPeriod(p); setHovIdx(null); }}
            style={{
              fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 6,
              border: "none", cursor: "pointer", transition: "all 0.15s",
              background: period === p ? "#EEF2FF" : "transparent",
              color: period === p ? "#4338CA" : "var(--text-3)",
              fontFamily: "inherit",
            }}
          >
            {p}
          </button>
        ))}
      </div>

      {/* SVG */}
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", overflow: "visible" }}>
        <defs>
          <linearGradient id="evoGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6366F1" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#6366F1" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Grid */}
        {gridLines.map((g, i) => (
          <g key={i}>
            <line x1={PX} y1={g.y} x2={W - PR} y2={g.y}
              stroke="#E8ECF4" strokeWidth="1"
              strokeDasharray={i === 4 ? undefined : "4 3"} />
            <text x={PX - 8} y={g.y + 4} textAnchor="end"
              fill="#A0A3BD" fontSize="10" fontFamily={font}>
              {g.label}
            </text>
          </g>
        ))}

        {/* Area + Line */}
        <path d={areaPath} fill="url(#evoGrad)" />
        <path d={linePath} fill="none" stroke="#6366F1"
          strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

        {/* Puntos, hover, etiquetas */}
        {points.map((p, i) => (
          <g key={i}>
            <rect
              x={p.x - zoneW / 2} y={PT} width={zoneW} height={cH}
              fill="transparent" style={{ cursor: "crosshair" }}
              onMouseEnter={() => setHovIdx(i)}
              onMouseLeave={() => setHovIdx(null)}
            />

            {(i === data.length - 1 || hovIdx === i) && (
              <circle cx={p.x} cy={p.y}
                r={hovIdx === i ? 5 : 4}
                fill="#6366F1" stroke="white"
                strokeWidth={hovIdx === i ? 3 : 2} />
            )}

            <text x={p.x} y={H - 4} textAnchor="middle"
              fill={i === data.length - 1 ? "#4338CA" : "#A0A3BD"}
              fontSize="11"
              fontWeight={i === data.length - 1 ? "600" : "400"}
              fontFamily={font}>
              {data[i].label}
            </text>

            {hovIdx === i && (
              <g>
                <line x1={p.x} y1={PT} x2={p.x} y2={PT + cH}
                  stroke="#6366F1" strokeWidth="1"
                  strokeDasharray="3 3" opacity="0.4" />
                <rect x={p.x - 44} y={p.y - 32} width={88} height={22} rx="6" fill="#1B1F3B" />
                <text x={p.x} y={p.y - 17} textAnchor="middle"
                  fill="white" fontSize="11" fontWeight="600" fontFamily={font}>
                  {fmtMoney(data[i].value)}
                </text>
              </g>
            )}
          </g>
        ))}

        {/* Pill del último valor */}
        <rect x={last.x - 38} y={last.y - 30} width={76} height={20} rx="5" fill="#EEF2FF" />
        <text x={last.x} y={last.y - 16} textAnchor="middle"
          fill="#4338CA" fontSize="11" fontWeight="600" fontFamily={font}>
          {fmtShort(data[data.length - 1].value)}
        </text>
      </svg>
    </div>
  );
}
