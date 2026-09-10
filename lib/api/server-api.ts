import "server-only";

import { auth } from "@clerk/nextjs/server";
import { request } from "./api";
import { tiendanube } from "@/lib/tiendanube/client";
import { mapProduct, mapProducts } from "@/lib/tiendanube/product-mapper";
import type { Product } from "@/lib/interface/ProductInterface";

// Legacy server request with Clerk auth token
export async function serverRequest<T>(
  endpoint: string,
  options?: RequestInit,
) {
  const { getToken } = await auth();
  const token = await getToken();
  return request<T>(endpoint, options, token);
}

// =====================================================
// TIENDANUBE SERVER FUNCTIONS
// For use in Server Components (no API route needed)
// =====================================================

export async function getProducts(params?: {
  categoryId?: number;
  search?: string;
  page?: number;
  perPage?: number;
}): Promise<Product[]> {
  try {
    const tnProducts = await tiendanube.getProducts({
      category_id: params?.categoryId,
      q: params?.search,
      page: params?.page,
      per_page: params?.perPage ?? 200,
      published: true,
    });
    return mapProducts(tnProducts);
  } catch (error) {
    console.error('[Tiendanube] Error fetching products:', error);
    return [];
  }
}

export async function getProductById(id: string): Promise<Product | null> {
  try {
    const tnProduct = await tiendanube.getProductById(Number(id));
    return mapProduct(tnProduct);
  } catch (error) {
    console.error(`[Tiendanube] Error fetching product ${id}:`, error);
    return null;
  }
}

export async function getProductByHandle(handle: string): Promise<Product | null> {
  try {
    const tnProduct = await tiendanube.getProductByHandle(handle);
    if (!tnProduct) return null;
    return mapProduct(tnProduct);
  } catch (error) {
    console.error(`[Tiendanube] Error fetching product by handle ${handle}:`, error);
    return null;
  }
}

export async function getCategories() {
  try {
    return await tiendanube.getCategories({ per_page: 200 });
  } catch (error) {
    console.error('[Tiendanube] Error fetching categories:', error);
    return [];
  }
}