import "server-only";

import { requireSuperadmin } from "@/lib/auth/superadmin";
import { tiendanube } from "@/lib/tiendanube/client";
import { getI18nValue, mapProduct } from "@/lib/tiendanube/product-mapper";
import type { TiendanubeOrderFull } from "@/lib/tiendanube/types";

// =====================================================
// Pedidos
// =====================================================

export {
  STAGE_LABEL,
  PAYMENT_LABEL,
  SHIPPING_LABEL,
  orderStage,
  toAdminOrder,
  type OrderStage,
  type AdminOrder,
} from "@/lib/tiendanube/orders";
import { num, orderStage, toAdminOrder, withPresale, STAGE_LABEL, type AdminOrder, type OrderStage } from "@/lib/tiendanube/orders";
import { getPresaleConfig } from "@/lib/presale-config";

/** Trae todas las órdenes (hasta 1000). Alcanza de sobra para el volumen actual de la tienda. */
async function fetchAllOrders(params: { created_at_min?: string } = {}) {
  const orders: TiendanubeOrderFull[] = [];
  for (let page = 1; page <= 5; page++) {
    const { items, total } = await tiendanube.getOrdersPage({ ...params, page, per_page: 200 });
    orders.push(...items);
    if (orders.length >= total || items.length < 200) break;
  }
  return orders;
}

export async function listOrders(opts: { stage?: string; q?: string; page?: number; perPage?: number; presale?: boolean }) {
  await requireSuperadmin();
  const perPage = opts.perPage ?? 20;
  const all = withPresale((await fetchAllOrders()).map(toAdminOrder), await getPresaleConfig());

  const counts = Object.fromEntries(
    (Object.keys(STAGE_LABEL) as OrderStage[]).map((s) => [s, all.filter((o) => o.stage === s).length]),
  ) as Record<OrderStage, number>;

  const q = opts.q?.trim().toLowerCase().replace(/^#/, "");
  const filtered = all.filter(
    (o) =>
      (!opts.stage || o.stage === opts.stage) &&
      (!opts.presale || o.isPresale) &&
      (!q ||
        o.number.includes(q) ||
        o.customer.name.toLowerCase().includes(q) ||
        o.customer.email.toLowerCase().includes(q)),
  );

  const pages = Math.max(1, Math.ceil(filtered.length / perPage));
  const page = Math.min(Math.max(1, opts.page ?? 1), pages);
  return {
    presaleCount: all.filter((o) => o.isPresale).length,
    orders: filtered.slice((page - 1) * perPage, page * perPage),
    total: filtered.length,
    page,
    pages,
    counts,
    all: all.length,
  };
}

export async function getOrder(id: number) {
  await requireSuperadmin();
  try {
    const order = (await tiendanube.getOrderById(id)) as TiendanubeOrderFull;
    return withPresale([toAdminOrder(order)], await getPresaleConfig())[0];
  } catch (error) {
    if (error instanceof Error && /Error 404/.test(error.message)) return null;
    throw error;
  }
}

// =====================================================
// Resumen
// =====================================================

const DAY = 24 * 60 * 60 * 1000;
const isPaid = (o: AdminOrder) =>
  o.paymentStatus === "paid" || o.paymentStatus === "partially_refunded";

export async function getDashboard() {
  await requireSuperadmin();
  const [orders, products] = await Promise.all([
    fetchAllOrders().then((list) => list.map(toAdminOrder)),
    listProducts(),
  ]);

  const now = Date.now();
  const inRange = (o: AdminOrder, from: number, to: number) => {
    const t = new Date(o.paidAt || o.createdAt).getTime();
    return t >= from && t < to;
  };
  const current = orders.filter((o) => isPaid(o) && inRange(o, now - 30 * DAY, now));
  const previous = orders.filter((o) => isPaid(o) && inRange(o, now - 60 * DAY, now - 30 * DAY));
  const sum = (list: AdminOrder[]) => list.reduce((acc, o) => acc + o.total, 0);

  // Ventas cobradas por día, últimos 30 días
  const days = Array.from({ length: 30 }, (_, i) => {
    const start = new Date(now - (29 - i) * DAY);
    start.setHours(0, 0, 0, 0);
    return { date: start.toISOString(), total: 0, orders: 0 };
  });
  for (const o of current) {
    const d = new Date(o.paidAt || o.createdAt);
    d.setHours(0, 0, 0, 0);
    const day = days.find((x) => x.date === d.toISOString());
    if (day) {
      day.total += o.total;
      day.orders += 1;
    }
  }

  const lowStock = products
    .flatMap((p) =>
      p.variants
        .filter((v) => v.stock !== null && v.stock <= 5)
        .map((v) => ({ product: p, variant: v })),
    )
    .sort((a, b) => (a.variant.stock ?? 0) - (b.variant.stock ?? 0));

  return {
    sales: { current: sum(current), previous: sum(previous) },
    paidOrders: { current: current.length, previous: previous.length },
    averageTicket: current.length ? sum(current) / current.length : 0,
    toShip: orders.filter((o) => o.stage === "por-enviar"),
    toCollect: orders.filter((o) => o.stage === "por-cobrar").length,
    days,
    recent: orders
      .slice()
      .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
      .slice(0, 6),
    lowStock,
    productCount: products.length,
    totalOrders: orders.length,
  };
}

// =====================================================
// Productos
// =====================================================

export type AdminProduct = Awaited<ReturnType<typeof listProducts>>[number];

export async function listProducts() {
  await requireSuperadmin();
  const raw = await tiendanube.getAllProductsForAdmin();
  return raw.map((p) => {
    const mapped = mapProduct(p);
    const unlimited = mapped.variants.some((v) => v.stock === null);
    return {
      id: p.id,
      name: mapped.name,
      slug: mapped.slug,
      image: mapped.images[0] || "",
      category: mapped.category,
      price: mapped.price,
      originalPrice: mapped.originalPrice,
      published: p.published,
      stock: unlimited ? null : mapped.variants.reduce((acc, v) => acc + (v.stock ?? 0), 0),
      variants: mapped.variants.map((v) => ({
        id: v.id,
        label: v.values.map((x) => x.value).join(" / ") || "Única",
        stock: v.stock,
        price: v.promotionalPrice ?? v.price,
      })),
      updatedAt: p.updated_at,
    };
  });
}

// =====================================================
// Clientes
// =====================================================

export async function listCustomers(opts: { q?: string; page?: number }) {
  await requireSuperadmin();
  const perPage = 25;
  const page = Math.max(1, opts.page ?? 1);
  const { items, total } = await tiendanube.getCustomersPage({
    q: opts.q?.trim() || undefined,
    page,
    per_page: perPage,
  });
  return {
    customers: items.map((c) => ({
      id: c.id,
      name: c.name || "Sin nombre",
      email: c.email,
      phone: c.phone || "",
      totalSpent: num(c.total_spent),
      lastOrderId: c.last_order_id,
      createdAt: c.created_at,
      city: [c.default_address?.city, c.default_address?.province].filter(Boolean).join(", "),
      acceptsMarketing: c.accepts_marketing,
    })),
    total,
    page,
    pages: Math.max(1, Math.ceil(total / perPage)),
  };
}

// =====================================================
// Tienda
// =====================================================

export async function getStoreLinks() {
  try {
    const store = await tiendanube.getStore();
    const base = store.url_with_protocol.replace(/\/$/, "");
    return { name: getI18nValue(store.name), admin: `${base}/admin` };
  } catch {
    return { name: "Aeryx", admin: null };
  }
}

/** Para el contador del menú. Si Tiendanube falla, el panel igual carga. */
export async function countOrdersToShip(): Promise<number> {
  await requireSuperadmin();
  try {
    const orders = await fetchAllOrders();
    return orders.filter((o) => orderStage(o) === "por-enviar").length;
  } catch {
    return 0;
  }
}
