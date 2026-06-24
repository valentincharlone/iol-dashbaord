export const dynamic = "force-dynamic";

import { getPortafolio } from "@/lib/iol-actions";
import { HoldingsTable } from "@/components/HoldingsTable";

export default async function HoldingsPage() {
  const { posiciones, totalValuacion } = await getPortafolio();

  return (
    <div className="p-4 pb-12 md:p-6 md:pb-16 flex flex-col gap-4 md:gap-5">
      <div>
        <h1 className="text-[22px] font-bold text-text1 m-0">Holdings</h1>
        <p className="text-[13px] text-text3 mt-0.5">
          {posiciones.length} posiciones · Argentina · BCBA
        </p>
        <p className="text-[12px] text-text3 mt-1.5">
          Posiciones actuales ordenadas por valuación. Hacé click en cualquier fila para ver el detalle.
        </p>
      </div>
      <HoldingsTable posiciones={posiciones} totalValuacion={totalValuacion} />
    </div>
  );
}
