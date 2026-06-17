export const dynamic = "force-dynamic";

import { getOperaciones } from "@/lib/iol-actions";
import { MovimientosTable } from "@/components/MovimientosTable";

type SearchParams = Promise<{ desde?: string; hasta?: string }>;

export default async function MovimientosPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { desde, hasta } = await searchParams;
  const operaciones = await getOperaciones(desde, hasta);

  return (
    <div className="p-4 pb-12 md:p-6 md:pb-16 flex flex-col gap-5">
      <div>
        <h1 className="text-[22px] font-bold text-text1 m-0">Movimientos</h1>
        <p className="text-[13px] text-text3 mt-0.5">
          Historial de operaciones · Argentina
        </p>
      </div>

      <MovimientosTable
        operaciones={operaciones}
        defaultDesde={desde ?? ""}
        defaultHasta={hasta ?? ""}
      />
    </div>
  );
}
