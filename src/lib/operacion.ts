export function getTipoCls(tipo: string): { cls: string; label: string } {
  const key = tipo != null ? String(tipo).toLowerCase() : "";
  if (key === "compra")              return { cls: "bg-profit-bg text-profit",     label: "Compra" };
  if (key === "venta")               return { cls: "bg-loss-bg text-loss",         label: "Venta" };
  if (key.includes("dividendo"))     return { cls: "bg-amber-50 text-amber-800",   label: "Dividendo" };
  if (key.includes("acreditacion"))  return { cls: "bg-brand-muted text-brand",    label: "Acreditación" };
  if (key.includes("transferencia")) return { cls: "bg-purple-50 text-purple-700", label: "Transferencia" };
  return { cls: "bg-[#F0F2F8] text-text3", label: tipo };
}

const ESTADO_CLS: Record<string, string> = {
  terminada:                                    "text-profit",
  parcialmente_terminada:                        "text-profit",
  pendiente:                                    "text-amber-600",
  en_proceso:                                   "text-amber-600",
  iniciada:                                     "text-amber-600",
  pendiente_cancelacion:                        "text-amber-600",
  en_modificacion:                              "text-amber-600",
  parcialmente_terminada_con_pedido_cancelacion:"text-amber-600",
  cancelada:                                    "text-loss",
  cancelada_por_vencimiento_validez:            "text-loss",
};

export function getEstadoCls(estado: string | null | undefined): string {
  return ESTADO_CLS[estado != null ? String(estado).toLowerCase() : ""] ?? "text-text3";
}
