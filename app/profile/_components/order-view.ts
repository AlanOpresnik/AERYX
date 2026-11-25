import type { AdminOrder, OrderStage } from "@/lib/tiendanube/orders";

/** Cómo le contamos al cliente en qué está su pedido. */
export const CUSTOMER_STAGE: Record<OrderStage, { label: string; hint: string; tone: "wait" | "active" | "done" | "off" }> = {
  "por-cobrar": { label: "Esperando el pago", hint: "Apenas se acredite el pago lo empezamos a preparar.", tone: "wait" },
  "por-enviar": { label: "Preparando tu pedido", hint: "Ya está pago. Lo estamos empaquetando para despacharlo.", tone: "active" },
  enviado: { label: "En camino", hint: "Tu pedido salió. Seguilo con el número de envío.", tone: "active" },
  entregado: { label: "Entregado", hint: "¡Que lo disfrutes! Cualquier problema, escribinos.", tone: "done" },
  cancelado: { label: "Cancelado", hint: "Este pedido se canceló y no se va a enviar.", tone: "off" },
  reembolsado: { label: "Reembolsado", hint: "Te devolvimos el dinero de este pedido.", tone: "off" },
};

const STEPS = ["Confirmado", "Pago aprobado", "En camino", "Entregado"] as const;

/** Cuántos pasos del recorrido ya se cumplieron (0 a 4). Cancelados y reembolsados no tienen recorrido. */
export function progress(order: AdminOrder): { steps: readonly string[]; done: number } | null {
  const done =
    order.stage === "por-cobrar" ? 1 : order.stage === "por-enviar" ? 2 : order.stage === "enviado" ? 3 : order.stage === "entregado" ? 4 : 0;
  return done === 0 ? null : { steps: STEPS, done };
}

export const isOngoing = (o: AdminOrder) => ["por-cobrar", "por-enviar", "enviado"].includes(o.stage);

export const money = (value: number, currency = "ARS") =>
  new Intl.NumberFormat("es-AR", { style: "currency", currency, maximumFractionDigits: 0 }).format(value);

export const dateLabel = (iso: string, withYear = true) =>
  new Intl.DateTimeFormat("es-AR", {
    day: "numeric",
    month: "long",
    ...(withYear ? { year: "numeric" } : {}),
    timeZone: "America/Argentina/Buenos_Aires",
  }).format(new Date(iso));
