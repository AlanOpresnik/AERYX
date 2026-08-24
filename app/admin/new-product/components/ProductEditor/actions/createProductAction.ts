// lib/actions/product.actions.ts

"use server";

import { api } from "@/lib/api/api";
import { Product } from "@/lib/interface/ProductInterface";
import { revalidatePath } from "next/cache";

export async function createProductAction(product: Product) {
  const createdProduct = await api.products.create(product);

  if (!createdProduct) {
    return {
      success: false,
      error: "No se pudo crear el producto",
    };
  }

  revalidatePath("/admin");

  return {
    success: true,
    data: createdProduct,
  };
}
