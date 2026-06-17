import { NextRequest, NextResponse } from "next/server";
import { getValidToken, invalidateTokens } from "@/lib/iol-auth";
import type { IOLPortafolio } from "@/lib/iol-types";

type Period = "1M" | "3M" | "6M" | "1A";
export type HistoryPoint = { label: string; value: number };

interface SerieItem {
  ultimoPrecio: number;
  fechaHora: string;
}

const IOL_BASE = "https://api.invertironline.com";
const MERCADO_MAP: Record<string, string> = {
  bcba: "bCBA", nyse: "nYSE", nasdaq: "nASDAQ", amex: "aMEX", rofx: "rOFX", bcs: "bCS",
};

const PERIOD_DAYS: Record<Period, number> = {
  "1M": 30,
  "3M": 90,
  "6M": 180,
  "1A": 365,
};

const SAMPLE_COUNT: Record<Period, number> = {
  "1M": 8,
  "3M": 10,
  "6M": 12,
  "1A": 13,
};

const MONTHS = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];

// Cache en memoria: evita re-fetchar históricos (no cambian durante el día)
const cache = new Map<string, { data: HistoryPoint[]; cachedAt: number }>();
const CACHE_TTL = 60 * 60 * 1000; // 1 hora

async function iolGet<T>(path: string): Promise<T> {
  const token = await getValidToken();
  const res = await fetch(`${IOL_BASE}${path}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  if (res.status === 401) {
    invalidateTokens();
    throw new Error("401");
  }
  if (!res.ok) throw new Error(`${res.status} ${path}`);
  return res.json();
}

async function fetchSerieConFallback(mercado: string, ticker: string, desde: string, hasta: string): Promise<SerieItem[]> {
  const base = `/api/v2/${mercado}/Titulos/${encodeURIComponent(ticker)}/Cotizacion/seriehistorica/${desde}/${hasta}`;
  const ajustada = await iolGet<SerieItem[]>(`${base}/ajustada`);
  if (ajustada.length > 0) return ajustada;
  return iolGet<SerieItem[]>(`${base}/sinAjustar`);
}

function sampleEvenly<T>(arr: T[], n: number): T[] {
  if (arr.length <= n) return arr;
  return Array.from({ length: n }, (_, i) =>
    arr[Math.round(i * (arr.length - 1) / (n - 1))]
  );
}

function formatLabel(dateStr: string, period: Period): string {
  const d = new Date(dateStr + "T12:00:00");
  if (period === "1M") return `${d.getDate()}/${d.getMonth() + 1}`;
  return MONTHS[d.getMonth()];
}

export async function GET(req: NextRequest) {
  const period = (req.nextUrl.searchParams.get("period") ?? "1A") as Period;
  if (!["1M", "3M", "6M", "1A"].includes(period)) {
    return NextResponse.json({ error: "Período inválido" }, { status: 400 });
  }

  const today = new Date().toISOString().split("T")[0];
  const cacheKey = `${period}-${today}`;
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.cachedAt < CACHE_TTL) {
    return NextResponse.json(cached.data);
  }

  // Posiciones actuales con su valorizado real como ancla
  const portafolio = await iolGet<IOLPortafolio>("/api/v2/portafolio/argentina");
  const activos = (portafolio.activos ?? []).map((a) => ({
    ticker: a.titulo.simbolo,
    cantidad: a.cantidad,
    mercado: MERCADO_MAP[a.titulo.mercado?.toLowerCase()] ?? a.titulo.mercado ?? "bCBA",
    valorizado: a.valorizado ?? a.cantidad * a.ultimoPrecio,
  }));

  // Rango de fechas
  const hasta = new Date();
  const desde = new Date();
  desde.setDate(desde.getDate() - PERIOD_DAYS[period]);
  const desdeStr = desde.toISOString().split("T")[0];
  const hastaStr = hasta.toISOString().split("T")[0];

  // 27 llamadas en paralelo
  const results = await Promise.allSettled(
    activos.map(async ({ ticker, cantidad, mercado, valorizado }) => {
      const serie = await fetchSerieConFallback(mercado, ticker, desdeStr, hastaStr);
      const sorted = [...serie].sort((a, b) => a.fechaHora.localeCompare(b.fechaHora));
      // Factor de escala: corrige convenciones de precio diferentes (bonos, letras, etc.)
      // El precio más reciente de la serie × cantidad debería igualar el valorizado real.
      const lastPrice = sorted.at(-1)?.ultimoPrecio ?? 0;
      const rawToday = cantidad * lastPrice;
      const scale = rawToday > 0 ? valorizado / rawToday : 1;
      return { ticker, cantidad, serie: sorted, scale };
    })
  );

  const fulfilled = results
    .filter((r): r is PromiseFulfilledResult<{ ticker: string; cantidad: number; serie: SerieItem[]; scale: number }> =>
      r.status === "fulfilled"
    )
    .map((r) => r.value)
    .filter((r) => r.serie.length > 0);

  if (fulfilled.length === 0) {
    return NextResponse.json([]);
  }

  // Fechas únicas (días de operación) de todos los tickers
  const allDates = [
    ...new Set(
      fulfilled.flatMap(({ serie }) => serie.map((s) => s.fechaHora.split("T")[0]))
    ),
  ].sort();

  // Para cada fecha: Σ(valorizado_escalado)
  // Usa forward-fill para tickers que no operaron ese día
  const history = allDates.map((date) => {
    let value = 0;
    for (const { cantidad, serie, scale } of fulfilled) {
      let lastPrice = 0;
      for (const s of serie) {
        if (s.fechaHora.split("T")[0] <= date) lastPrice = s.ultimoPrecio;
        else break;
      }
      if (lastPrice > 0) value += cantidad * lastPrice * scale;
    }
    return { date, value };
  });

  const sampled = sampleEvenly(history, SAMPLE_COUNT[period]);
  const data: HistoryPoint[] = sampled.map(({ date, value }) => ({
    label: formatLabel(date, period),
    value,
  }));

  cache.set(cacheKey, { data, cachedAt: Date.now() });
  return NextResponse.json(data);
}
