export type CartStorageItem = {
  productId: string;
  variantId: number;
  quantity: number;
  // Cached display data (set when adding to cart)
  name?: string;
  price?: number;
  image?: string;
  variantName?: string;
};

export type CheckoutItem = {
  productId: string;
  variantId: number;
  name: string;
  price: number;
  image: string | null;
  quantity: number;
  stock: number;
  variantName?: string;
};