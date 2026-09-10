// lib/actions/product.actions.ts
// DEPRECATED: Product creation is now managed through the Tiendanube admin panel.
// This file is kept for backward compatibility but the action is disabled.

"use server";

import { Product } from "@/lib/interface/ProductInterface";

export async function createProductAction(_product: Product) {
  return {
    success: false,
    error:
      "La creación de productos se gestiona ahora desde el panel de administración de Tiendanube. " +
      "Ingresá a tu tienda en tiendanube.com para agregar, editar o eliminar productos.",
  };
}
