export type TiendanubeI18nField = string | { es?: string; pt?: string; en?: string };

export interface TiendanubeVariant {
  id: number;
  product_id: number;
  sku: string | null;
  price: string;
  promotional_price: string | null;
  stock: number | null;
  stock_management: boolean;
  weight: string | null;
  width: string | null;
  height: string | null;
  depth: string | null;
  values: { es?: string; pt?: string; en?: string }[];
  created_at: string;
  updated_at: string;
  barcode: string | null;
}

export interface TiendanubeImage {
  id: number;
  product_id: number;
  src: string;
  position: number;
  created_at: string;
  updated_at: string;
}

export interface TiendanubeCategory {
  id: number;
  name: TiendanubeI18nField;
  description: TiendanubeI18nField;
  handle: TiendanubeI18nField;
  parent: number | null;
  subcategories: number[];
  created_at: string;
  updated_at: string;
}

export interface TiendanubeProduct {
  id: number;
  name: TiendanubeI18nField;
  description: TiendanubeI18nField;
  handle: TiendanubeI18nField;
  published: boolean;
  free_shipping: boolean;
  tags: string;
  created_at: string;
  updated_at: string;
  variants: TiendanubeVariant[];
  images: TiendanubeImage[];
  categories: TiendanubeCategory[] | number[];
  brand: string;
}

export interface TiendanubeDraftOrderProduct {
  variant_id: number;
  quantity: number;
}

export interface TiendanubeDraftOrder {
  id: number;
  token: string;
  status: string;
  payment_status: string;
  checkout_url: string;
  contact_email: string | null;
  contact_name: string | null;
  contact_lastname: string | null;
  total: string;
  products: any[];
  shipping_address: any | null;
}

export interface TiendanubeCustomer {
  id: number;
  name: string;
  email: string;
  phone: string;
}

export interface TiendanubeShippingAddress {
  address: string;
  number: string;
  floor: string;
  locality: string;
  city: string;
  state: string;
  zipcode: string;
  country: string;
}

export interface TiendanubeOrderProduct {
  product_id: number;
  variant_id: number;
  name: string;
  price: string;
  quantity: number;
  sku: string | null;
  image: { src: string };
}

export interface TiendanubeOrder {
  id: number;
  number: string;
  status: 'open' | 'closed' | 'cancelled';
  payment_status: string;
  shipping_status: string;
  token: string;
  customer: TiendanubeCustomer;
  shipping_address: TiendanubeShippingAddress;
  products: TiendanubeOrderProduct[];
  total: string;
  subtotal: string;
  shipping_cost_customer: string;
  currency: string;
  created_at: string;
  updated_at: string;
}

export interface TiendanubeWebhookEvent {
  store_id: number;
  event: string;
  id: number;
}

export interface TiendanubeApiError {
  code: number;
  message: string;
  description: string;
}
