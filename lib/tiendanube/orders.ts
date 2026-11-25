import type { TiendanubeOrderFull } from "./types";
import { isPresaleDate, PRESALE_GIFT, type PresaleConfig } from "@/lib/presale";

// Estados y forma de los pedidos, compartidos por el admin y "Mi cuenta".

export type OrderStage =
  | "por-cobrar"
  | "por-enviar"
  | "enviado"
  | "entregado"
  | "cancelado"
  | "reembolsado";

export const STAGE_LABEL: Record<OrderStage, string> = {
  "por-cobrar": "Por cobrar",
  "por-enviar": "Por enviar",
  enviado: "Enviado",
  entregado: "Entregado",
  cancelado: "Cancelado",
  reembolsado: "Reembolsado",
};

export const PAYMENT_LABEL: Record<string, string> = {
  pending: "Pendiente",
  authorized: "Autorizado",
  paid: "Pagado",
  partially_paid: "Pago parcial",
  abandoned: "Abandonado",
  refunded: "Reembolsado",
  partially_refunded: "Reembolso parcial",
  voided: "Anulado",
};

export const SHIPPING_LABEL: Record<string, string> = {
  unpacked: "Por preparar",
  unshipped: "Por enviar",
  unfulfilled: "Por enviar",
  packed: "Empaquetado",
  shipped: "Enviado",
  fulfilled: "Enviado",
  delivered: "Entregado",
};

const SHIPPED = new Set(["shipped", "fulfilled"]);

export function orderStage(o: Pick<TiendanubeOrderFull, "status" | "payment_status" | "shipping_status">): OrderStage {
  if (o.status === "cancelled") return "cancelado";
  if (o.payment_status === "refunded" || o.payment_status === "voided") return "reembolsado";
  if (o.payment_status !== "paid" && o.payment_status !== "partially_refunded") return "por-cobrar";
  if (o.shipping_status === "delivered") return "entregado";
  if (SHIPPED.has(o.shipping_status)) return "enviado";
  return "por-enviar";
}

export const num = (v: string | null | undefined) => parseFloat(v || "0") || 0;

export type AdminOrder = ReturnType<typeof toAdminOrder>;

export function toAdminOrder(o: TiendanubeOrderFull) {
  const address = o.shipping_address;
  return {
    id: o.id,
    number: String(o.number),
    createdAt: o.created_at,
    paidAt: o.paid_at,
    stage: orderStage(o),
    status: o.status,
    paymentStatus: o.payment_status,
    shippingStatus: o.shipping_status,
    customer: {
      name: o.customer?.name || o.contact_name || "Sin nombre",
      email: o.customer?.email || o.contact_email || "",
      phone: o.customer?.phone || o.contact_phone || "",
    },
    currency: o.currency || "ARS",
    subtotal: num(o.subtotal),
    discount: num(o.discount),
    shippingCost: num(o.shipping_cost_customer),
    total: num(o.total),
    gateway: o.gateway_name || "",
    shippingOption: o.shipping_option || "",
    tracking: o.shipping_tracking_number
      ? { number: o.shipping_tracking_number, url: o.shipping_tracking_url }
      : null,
    address: address?.address
      ? {
          line: [address.address, address.number, address.floor].filter(Boolean).join(" "),
          city: [address.locality, address.city, address.zipcode].filter(Boolean).join(", "),
          province: address.province || address.state || "",
        }
      : null,
    note: o.note || "",
    items: (o.products || []).map((p) => ({
      productId: p.product_id,
      name: p.name,
      quantity: Number(p.quantity) || 0,
      price: num(p.price),
      image: p.image?.src || "",
      sku: p.sku,
      /** La manga de regalo de la preventa */
      isGift: String(p.product_id) === PRESALE_GIFT.productId,
    })),
    /** Hecho durante la preventa (se completa con withPresale, que conoce las fechas) */
    isPresale: (o.products || []).some((p) => String(p.product_id) === PRESALE_GIFT.productId),
  };
}


/** Marca como preventa los pedidos hechos dentro de las fechas configuradas (o que llevan regalo). */
export function withPresale<T extends { createdAt: string; isPresale: boolean }>(orders: T[], config: PresaleConfig): T[] {
  return orders.map((o) => ({ ...o, isPresale: o.isPresale || isPresaleDate(config, o.createdAt) }));
}
