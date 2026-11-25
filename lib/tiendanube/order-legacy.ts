import type { TiendanubeOrderFull } from "./types";

/** Forma de pedido que usan las páginas de perfil (antes la armaba cada ruta). */
export function toLegacyOrder(o: TiendanubeOrderFull) {
  return {
    _id: String(o.id),
    customer: {
      firstName: o.customer?.name?.split(" ")[0] || "",
      lastName: o.customer?.name?.split(" ").slice(1).join(" ") || "",
      email: o.customer?.email || "",
      phone: o.customer?.phone || "",
    },
    shippingAddress: {
      address: o.shipping_address?.address || "",
      addressNumber: o.shipping_address?.number || "",
      city: o.shipping_address?.city || "",
      postalCode: o.shipping_address?.zipcode || "",
      province: o.shipping_address?.province || "",
    },
    items: (o.products || []).map((p) => ({
      productId: String(p.product_id),
      name: p.name,
      image: p.image?.src || "",
      price: parseFloat(p.price) || 0,
      quantity: p.quantity,
      subtotal: (parseFloat(p.price) || 0) * p.quantity,
    })),
    shipping: {
      method: o.shipping_option || null,
      cost: parseFloat(o.shipping_cost_owner) || 0,
    },
    totals: {
      subtotal: parseFloat(o.subtotal) || 0,
      shipping: parseFloat(o.shipping_cost_owner) || 0,
      total: parseFloat(o.total) || 0,
    },
    payment: {
      method: o.gateway_name || "unknown",
      status: o.payment_status || "unknown",
    },
    status: o.status || "unknown",
    createdAt: o.created_at,
    updatedAt: o.updated_at,
  };
}
