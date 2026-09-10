import 'server-only';
import { revalidateTag } from 'next/cache';

export const CACHE_TAGS = {
  PRODUCTS: 'tiendanube-products',
  CATEGORIES: 'tiendanube-categories', 
  ORDERS: 'tiendanube-orders',
} as const;

export const REVALIDATE_INTERVALS = {
  PRODUCTS: 60,      // 60 seconds
  CATEGORIES: 300,   // 5 minutes
  ORDERS: 0,         // no cache
} as const;

export function revalidateProducts() {
  revalidateTag(CACHE_TAGS.PRODUCTS, {});
}

export function revalidateCategories() {
  revalidateTag(CACHE_TAGS.CATEGORIES, {});
}

export function revalidateOrders() {
  revalidateTag(CACHE_TAGS.ORDERS, {});
}

export function revalidateAll() {
  revalidateProducts();
  revalidateCategories();
  revalidateOrders();
}
