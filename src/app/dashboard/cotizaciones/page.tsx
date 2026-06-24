export const dynamic = "force-dynamic";

import { getCotizacionesPortafolio } from "@/lib/iol-actions";
import { CotizacionesTable } from "@/components/CotizacionesTable";

export default async function CotizacionesPage() {
  const items = await getCotizacionesPortafolio();

  return (
    <div className="p-4 pb-12 md:p-6 md:pb-16 flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[22px] font-bold text-text1 m-0">Cotizaciones</h1>
          <p className="text-[13px] text-text3 mt-0.5">
            Mercado en tiempo real · tus posiciones
          </p>
          <p className="text-[12px] text-text3 mt-1.5">
            Precios de mercado de tus instrumentos en tiempo real.
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 text-profit text-[13px] font-semibold">
          <span className="w-2 h-2 rounded-full bg-profit-subtle inline-block shadow-[0_0_0_3px_rgba(16,185,129,0.2)] animate-[livePulse_2s_ease-in-out_infinite]" />
          En vivo
        </span>
      </div>

      <CotizacionesTable items={items} />
    </div>
  );
}
