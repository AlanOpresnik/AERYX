import "server-only";

import { getProducts } from "@/lib/api/server-api";
import type { Product } from "@/lib/interface/ProductInterface";
import { isOutOfStock } from "@/lib/product-stock";
import { tiendanube } from "@/lib/tiendanube/client";

/**
 * Sugerencias para el carrito. Cada producto candidato suma puntos por señales,
 * de la más confiable a la más débil:
 *
 *  1. Elegido a mano   → tag `combina:<slug>` en cualquiera de los dos productos.
 *  2. Comprados juntos → aparecen en el mismo pedido pago (historial de Tiendanube).
 *  3. Complementa      → es de otra categoría que lo que ya hay en el carrito.
 *  4. Precio de impulso → cuesta poco al lado del total del carrito.
 *  5. Novedad u oferta → pequeño empujón.
 *
 * Se excluye lo que ya está en el carrito y lo que no tiene stock.
 */

export type Suggestion = {
  productId: string;
  slug: string;
  name: string;
  image: string;
  price: number;
  originalPrice: number;
  reason: string;
  /** Variante a agregar directo; null si hay que elegir talle/variante en la ficha */
  variant: { id: number; name: string } | null;
};

const HOUR = 60 * 60 * 1000;
let coPurchaseCache: { at: number; pairs: Map<string, Map<string, number>> } | null = null;

/** Cuántas veces se compró cada par de productos en el mismo pedido (últimos 180 días). */
async function coPurchases(): Promise<Map<string, Map<string, number>>> {
  if (coPurchaseCache && Date.now() - coPurchaseCache.at < HOUR) return coPurchaseCache.pairs;

  const pairs = new Map<string, Map<string, number>>();
  try {
    const since = new Date(Date.now() - 180 * 24 * HOUR).toISOString();
    for (let page = 1; page <= 3; page++) {
      const { items } = await tiendanube.getOrdersPage({ created_at_min: since, page, per_page: 200 });
      for (const order of items) {
        if (order.payment_status !== "paid") continue;
        // Solo los ids de producto: no se guarda nada del cliente
        const ids = [...new Set((order.products ?? []).map((p) => String(p.product_id)))];
        for (const a of ids) {
          for (const b of ids) {
            if (a === b) continue;
            const row = pairs.get(a) ?? new Map<string, number>();
            row.set(b, (row.get(b) ?? 0) + 1);
            pairs.set(a, row);
          }
        }
      }
      if (items.length < 200) break;
    }
  } catch (error) {
    // Sin historial igual hay sugerencias (por categoría y precio)
    console.error("[Sugerencias] No se pudo leer el historial:", error);
  }
  coPurchaseCache = { at: Date.now(), pairs };
  return pairs;
}

function pickVariant(product: Product): Suggestion["variant"] {
  const variants = product.variants ?? [];
  const inStock = variants.filter((v) => v.stock === null || v.stock > 0);
  // Con más de una opción (talles, colores) que elija el cliente
  if (variants.length !== 1 || inStock.length !== 1) return null;
  const v = inStock[0];
  return { id: v.id, name: v.values.map((x) => x.value).join(" / ") || "Único" };
}

export async function suggestForCart(
  cart: { productId: string; subtotal: number }[],
  limit = 2,
): Promise<Suggestion[]> {
  if (cart.length === 0) return [];

  const [products, pairs] = await Promise.all([getProducts(), coPurchases()]);
  const byId = new Map(products.map((p) => [p._id, p]));
  const inCart = cart.map((c) => byId.get(c.productId)).filter((p): p is Product => Boolean(p));
  const cartIds = new Set(cart.map((c) => c.productId));
  const cartCategories = new Set(inCart.map((p) => p.category.toLowerCase()).filter(Boolean));
  const cartTotal = cart.reduce((acc, c) => acc + c.subtotal, 0);

  const scored = products
    .filter((p) => !cartIds.has(p._id) && !isOutOfStock(p))
    .map((p) => {
      let score = 0;
      let reason = "Completá tu setup";
      let strongest = 0;
      const because = (points: number, text: string) => {
        score += points;
        if (points > strongest) {
          strongest = points;
          reason = text;
        }
      };

      for (const item of inCart) {
        if (item.pairsWith?.includes(p.slug) || p.pairsWith?.includes(item.slug)) {
          because(100, `Combina con ${item.name}`);
        }
        const together = pairs.get(item._id)?.get(p._id) ?? 0;
        if (together > 0) because(Math.min(60, 20 * together), `Se suele llevar junto con ${item.name}`);
      }

      const category = p.category.toLowerCase();
      if (category && !cartCategories.has(category)) because(10, "Completá tu setup");
      if (category && cartCategories.has(category)) score -= 5;

      if (cartTotal > 0) {
        if (p.price <= cartTotal * 0.4) score += 8;
        else if (p.price <= cartTotal) score += 3;
        else score -= 10;
      }

      if (p.originalPrice > p.price) because(6, "Está en oferta");
      if (p.isNew) score += 3;

      return { product: p, score, reason };
    })
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score || a.product.price - b.product.price);

  return scored.slice(0, limit).map(({ product: p, reason }) => ({
    productId: p._id,
    slug: p.slug,
    name: p.name,
    image: p.images[0] || "",
    price: p.price,
    originalPrice: p.originalPrice,
    reason,
    variant: pickVariant(p),
  }));
}
