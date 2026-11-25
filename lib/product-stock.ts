import type { Product } from "@/lib/interface/ProductInterface";

/**
 * En Tiendanube una variante con stock `null` tiene stock ilimitado.
 * Un producto está agotado solo si todas sus variantes tienen stock 0.
 */
export function isOutOfStock(product: Product): boolean {
  if (product.variants?.length) {
    return product.variants.every((v) => v.stock !== null && v.stock <= 0);
  }
  return product.stock !== null && product.stock !== undefined && product.stock <= 0;
}
