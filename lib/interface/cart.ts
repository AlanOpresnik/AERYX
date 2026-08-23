export type CartStorageItem = {
  productId: string;
  quantity: number;
};

export type CheckoutItem = {
  productId: string;
  name: string;
  price: number;
  image: string | null;
  quantity: number;
  stock: number;
};