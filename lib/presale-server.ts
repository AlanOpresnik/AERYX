import "server-only";

import { getProducts } from "@/lib/api/server-api";
import type { Product } from "@/lib/interface/ProductInterface";
import { tiendanube } from "@/lib/tiendanube/client";
import { giftsFor, isPresaleOpen, PRESALE_GIFT, type GiftInfo } from "@/lib/presale";
import { getPresaleConfig } from "@/lib/presale-config";

/** Variantes de productos publicados → su producto. El regalo oculto nunca está acá. */
async function variantIndex(): Promise<Map<number, Product>> {
  const products = await getProducts();
  const index = new Map<number, Product>();
  for (const p of products) for (const v of p.variants ?? []) index.set(v.id, p);
  return index;
}

/** Stock del producto de regalo: es el tope de regalos. null = sin tope. */
async function giftStock(): Promise<number | null> {
  const gift = await tiendanube.getProductById(Number(PRESALE_GIFT.productId));
  const variant = gift.variants.find((v) => v.id === PRESALE_GIFT.variantId);
  if (!variant) throw new Error("No se encontró la variante del regalo en Tiendanube.");
  return variant.stock;
}

/**
 * Qué regalo le toca a un carrito. Lo decide siempre el servidor,
 * con la hora del servidor y los productos reales de Tiendanube.
 */
export async function giftForCart(items: { variantId: number; quantity: number }[]): Promise<GiftInfo | null> {
  const config = await getPresaleConfig();
  if (!isPresaleOpen(config)) return null;

  const index = await variantIndex();
  const wanted = giftsFor(
    config,
    items.map((i) => ({ category: index.get(i.variantId)?.category, quantity: i.quantity })),
  );
  if (wanted === 0) return null;

  const [stock, products] = await Promise.all([giftStock().catch(() => 0), getProducts()]);
  const quantity = stock === null ? wanted : Math.min(wanted, Math.max(0, stock));
  const source = products.find((p) => p._id === PRESALE_GIFT.sourceProductId);

  return {
    quantity,
    name: PRESALE_GIFT.name,
    image: source?.images[0] ?? "",
    value: source?.originalPrice || source?.price || 0,
    endsOn: config.endsOn,
    shipsFrom: config.shipsFrom,
    remaining: stock === null ? null : Math.max(0, stock),
  };
}

/**
 * Arma los productos del pedido para Tiendanube: solo variantes publicadas
 * (nadie puede pedir el regalo suelto) y suma el regalo si corresponde.
 */
export async function buildOrderProducts(items: { variantId: number; quantity: number }[]) {
  const index = await variantIndex();
  const products = items
    .filter((i) => index.has(Number(i.variantId)) && Number.isInteger(i.quantity) && i.quantity > 0 && i.quantity <= 50)
    .map((i) => ({ variant_id: Number(i.variantId), quantity: i.quantity }));

  const gift = await giftForCart(products.map((p) => ({ variantId: p.variant_id, quantity: p.quantity })));
  if (gift && gift.quantity > 0) {
    products.push({ variant_id: PRESALE_GIFT.variantId, quantity: gift.quantity });
  }
  const dropped = items.length - (gift && gift.quantity > 0 ? products.length - 1 : products.length);
  return { products, gift, dropped };
}
